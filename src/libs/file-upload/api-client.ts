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

    return { fileId: data.args.id };
  },
};
