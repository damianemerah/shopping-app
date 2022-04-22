import { TOKEN } from './config';

export const AJAX = async function (url, uploadData) {
  let headers = {
    'X-Authorization': `${TOKEN}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  let body = uploadData;

  const res = !uploadData
    ? await fetch(new URL(url), {
        method: 'GET',
        headers: headers,
      })
    : fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });
  const data = await res.json();
  if (!res.ok) throw new Error(`😌${data.message} (${res.status})`);
  return data;
};
