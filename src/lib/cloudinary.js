/**
 * Injects on-the-fly Cloudinary transformations into an existing image URL.
 *
 * Key transforms applied:
 *   f_auto  — serves WebP to Chrome/Edge/Firefox, AVIF where supported
 *             (typically 30-50% smaller than the original JPEG/PNG)
 *   q_auto  — Cloudinary smart quality: reduces file size by ~40% on
 *             average with no perceptible quality loss
 *   w_{n}   — resize to this pixel width server-side so the browser never
 *             downloads a 1200px image just to display a 400px card
 *
 * Non-Cloudinary URLs (local /images/*, external CDNs) are returned unchanged.
 */
export function imgUrl(src, { width, height } = {}) {
  if (!src?.includes("/upload/")) return src;

  const [base, rest] = src.split("/upload/");

  // Don't double-transform if the URL already has our params
  if (rest.startsWith("f_auto")) return src;

  const t = ["f_auto", "q_auto"];
  if (width)  t.push(`w_${width}`);
  if (height) t.push(`h_${height}`);

  return `${base}/upload/${t.join(",")}/${rest}`;
}
