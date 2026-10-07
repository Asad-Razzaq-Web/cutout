const loadBitmap = (blob) => createImageBitmap(blob);

const toBlob = (canvas, type, quality) =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality));

/**
 * Downscales + re-encodes large photos before upload so requests are faster and cheaper.
 * Small files are returned untouched. Background removal doesn't need alpha on input,
 * so big files are re-encoded as JPEG.
 */
export async function compressImage(file, { maxDimension = 3000, thresholdBytes = 1.5 * 1024 * 1024, quality = 0.9 } = {}) {
  if (file.size <= thresholdBytes) return file;
  try {
    const bitmap = await loadBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await toBlob(canvas, 'image/jpeg', quality);
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

/** Creates a small WebP object URL from an image URL, for dashboard thumbnails. */
export async function createThumbnail(url, size = 160) {
  const res = await fetch(url);
  const bitmap = await loadBitmap(await res.blob());
  const scale = size / Math.max(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  const blob = await toBlob(canvas, 'image/webp', 0.8);
  return URL.createObjectURL(blob);
}
