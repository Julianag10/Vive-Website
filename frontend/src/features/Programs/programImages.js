const UPLOADS_ORIGIN = import.meta.env.VITE_UPLOADS_ORIGIN || "http://localhost:3000";

export function programImageSrc(imageUrl) {
  if (!imageUrl) return `${UPLOADS_ORIGIN}/uploads/programs/placeHolder.png`;

  if (imageUrl.startsWith("http") || imageUrl.startsWith("blob:")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads")) {
    return `${UPLOADS_ORIGIN}${imageUrl}`;
  }

  return imageUrl;
}
