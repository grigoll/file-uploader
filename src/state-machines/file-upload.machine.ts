import { assign, createMachine } from 'xstate';
import { fileUploadApiClient } from '../libs/file-upload/api-client';
import {
  FileUploadMachineContext,
  FileUploadMachineEvent,
  FileUploadMachineState,
} from '../types/file-upload-machine';

let uploadController: AbortController | null = null;

export const createFileUploadMachine = (id: string) =>
  createMachine<FileUploadMachineContext, FileUploadMachineEvent, FileUploadMachineState>(
    {
      id: 'fileUpload',
      preserveActionOrder: true,
      predictableActionArguments: true,
      initial: 'idle',

      context: {
        id,
        file: null,
      },

      on: {
        SELECT_FILE: {
          actions: assign({ file: (_, evt) => evt.file }),
          target: 'idle',
        },
      },

      states: {
        idle: {
          on: {
            UPLOAD_FILE: 'uploading',
          },
        },
        uploading: {
          invoke: {
            src: (ctx) => (callback) => {
              if (!ctx.file) {
                return Promise.reject({
                  reason: '(createFileUploadMachine) tried file upload but no file selected.',
                });
              }

              uploadController = new AbortController();

              return fileUploadApiClient.uploadFile(ctx.file, {
                signal: uploadController.signal,
                onProgress: (loaded, total) => {
                  // Since onProgress is a regular callback we use xstate's callbacking mechanism
                  // https://xstate.js.org/docs/guides/communication.html#invoking-callbacks
                  callback({ type: 'PROGRESS', loaded, total });
                },
              });
            },
            onDone: 'uploaded',
            onError: 'failed',
          },
          on: {
            CANCEL: {
              actions: 'cancelUpload',
              target: 'idle',
            },
          },
        },
        uploaded: {
          // Clear previous file to let user upload another one
          entry: assign({ file: null }),

          // wait a bit and show successful upload message
          after: {
            1200: {
              target: 'idle',
            },
          },
        },
        failed: {
          on: {
            RETRY: 'uploading',
          },
        },
      },
    },
    {
      actions: {
        cancelUpload: () => {
          try {
            uploadController?.abort();
          } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
              console.log('File upload cancelled');
              return;
            }

            throw err;
          }
        },
      },
    }
  );
