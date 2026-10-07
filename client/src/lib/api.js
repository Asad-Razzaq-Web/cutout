const TOKEN_KEY = 'token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = 'GET', body, formData } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: formData ?? (body ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError('Network error. Check your connection and try again.', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || 'Request failed.', res.status);
  return data;
}

function saveBlob(blob, filename) {
  const href = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

/** Fetches a file and triggers a real download (the `download` attribute is ignored cross-origin). */
export async function downloadFile(url, filename) {
  saveBlob(await (await fetch(url)).blob(), filename);
}

/** Same as downloadFile but sends the JWT, for protected endpoints like the CSV export. */
export async function downloadAuthed(apiPath, filename) {
  const res = await fetch(`/api${apiPath}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!res.ok) throw new ApiError('Download failed.', res.status);
  saveBlob(await res.blob(), filename);
}