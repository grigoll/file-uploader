export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch alternative/mimic that supports upload progress reporting
 */
export const fileUpload = (
  method: string,
  {
    url,
    file,
    signal,
    onProgress,
  }: {
    url: string;
    file: File;
    signal: AbortSignal;
    onProgress: (loaded: number, total: number) => void;
  }
) =>
  new Promise<ProgressEvent<EventTarget>>((res, rej) => {
    if (signal.aborted) {
      rej(signal.reason);
      return;
    }

    const xhr = new XMLHttpRequest();

    signal.addEventListener('abort', () => xhr.abort());

    xhr.open(method, url);

    const data = new FormData();
    data.append('file', file);

    xhr.onload = res;
    xhr.onerror = rej;
    xhr.onabort = rej;
    xhr.upload.addEventListener('progress', (evt) => onProgress(evt.loaded, evt.total));

    xhr.send(data);
  });
