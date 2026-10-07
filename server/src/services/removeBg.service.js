/**
 * Thin wrapper around third-party background removal APIs.
 * Input: image Buffer. Output: PNG Buffer with a transparent background.
 */
const PROVIDERS = {
  removebg: {
    url: 'https://api.remove.bg/v1.0/removebg',
    keyHeader: 'X-Api-Key',
    key: () => process.env.REMOVEBG_API_KEY,
    fields: (form) => {
      form.append('size', process.env.REMOVEBG_SIZE || 'auto');
      form.append('format', 'png');
    },
  },
  clipdrop: {
    url: 'https://clipdrop-api.co/remove-background/v1',
    keyHeader: 'x-api-key',
    key: () => process.env.CLIPDROP_API_KEY,
    fields: () => {},
  },
};

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function removeBackground(buffer, mimetype, filename = 'image') {
  const provider = PROVIDERS[process.env.BG_PROVIDER || 'removebg'];
  if (!provider) throw httpError(500, 'Unknown BG_PROVIDER.');
  const apiKey = provider.key();
  if (!apiKey) throw httpError(500, 'Background removal API key is not configured.');

  const form = new FormData();
  form.append('image_file', new Blob([buffer], { type: mimetype }), filename);
  provider.fields(form);

  const res = await fetch(provider.url, {
    method: 'POST',
    headers: { [provider.keyHeader]: apiKey },
    body: form,
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    if (res.status === 402 || res.status === 403)
      throw httpError(503, 'Our processing quota is used up. Please try again later.');
    if (res.status === 429) throw httpError(429, 'Too many requests. Please wait a moment.');
    if (res.status === 400) throw httpError(422, 'We could not find a subject in that image.');
    throw httpError(502, 'The background removal service failed. Please try again.');
  }
  return Buffer.from(await res.arrayBuffer());
}
