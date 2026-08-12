const MAX_IMAGE_SIZE = 900;
const AVIF_QUALITY = 0.82;

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

function staffImageFilename(staffName) {
  const slug = String(staffName || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "staff-photo"}.avif`;
}

function slugifyFilenamePart(value, fallback = "image") {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

async function compressImage(file, { filename, mimeType, quality }) {
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
      canvas.toBlob(resolve, mimeType, quality);
    });

    if (!blob || blob.type !== mimeType) {
      return file;
    }

    return new File([blob], filename, { type: mimeType });
  } catch {
    return file;
  }
}

export async function compressStaffImage(file, staffName) {
  return compressImage(file, {
    filename: staffImageFilename(staffName),
    mimeType: "image/avif",
    quality: AVIF_QUALITY,
  });
}

export async function compressProgramImage(file, filename = "program-image.png") {
  return compressImage(file, {
    filename: `${slugifyFilenamePart(filename.replace(/\.[^.]+$/, ""), "program-image")}.png`,
    mimeType: "image/png",
  });
}
