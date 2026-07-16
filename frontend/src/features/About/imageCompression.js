const MAX_IMAGE_SIZE = 900;
const JPEG_QUALITY = 0.82;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image."));
    };

    image.src = url;
  });
}

function imageDimensions(width, height) {
  const largestSide = Math.max(width, height);

  if (largestSide <= MAX_IMAGE_SIZE) {
    return { width, height };
  }

  const scale = MAX_IMAGE_SIZE / largestSide;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

export async function compressStaffImage(file) {
  if (!file || !file.type.startsWith("image/")) {
    return file;
  }

  try {
    const image = await loadImage(file);
    const dimensions = imageDimensions(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    context.drawImage(image, 0, 0, dimensions.width, dimensions.height);

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
    });

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const filename = file.name.replace(/\.[^.]+$/, ".jpg");
    return new File([blob], filename, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
