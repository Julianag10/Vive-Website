export function programImageSrc(imageUrl) {
  if (!imageUrl) return "/img/placeHolder.png";

  if (imageUrl.startsWith("http") || imageUrl.startsWith("blob:")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads")) {
    return `http://localhost:3000${imageUrl}`;
  }

  return imageUrl;
}
