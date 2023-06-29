import { v4 as uuid } from 'uuid';
import { fileUpload } from '../../utils';

// Mock API client
export const fileUploadApiClient = {
  getUploadUrl: async () => ({
    id: uuid(),

    // This endpoint really uploads files so we get real upload progress and
    // occasionally even gives CORS errors which is perfect fit for this test project
    destinationUrl: `https://httpbin.org/post`,
  }),

  // Not completely clear why we need to call additional API to let server know file upload has finished
  // Upload request successful completion already indicates to a server that it was finished
  // But was requested in the task requirements
  notifyFileUploadFinish: async (id: string) => {
    const body = JSON.stringify({ fileUpload: { status: 'completed', id } });

    return fetch('https://httpbin.org/post', { method: 'POST', body });
  },

  uploadFile: async (
    file: File,
    options: {
      signal: AbortSignal;
      onProgress: (loaded: number, total: number) => void;
    }
  ) => {
    const { id, destinationUrl } = await fileUploadApiClient.getUploadUrl();

    const url = `${destinationUrl}?id=${id}`;

    console.log('Initiating file upload');

    const result = await fileUpload('POST', { url, file, ...options });

    console.log('File upload finished');

    const xhr = result.target as XMLHttpRequest;
    const data = JSON.parse(xhr.response);

    await fileUploadApiClient.notifyFileUploadFinish(id);

    return data;
  },
};
