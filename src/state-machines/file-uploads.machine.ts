import { v4 as uuid } from 'uuid';
import { assign, createMachine, spawn } from 'xstate';
import { FileUploads } from '../types';
import { createFileUploadMachine } from './file-upload.machine';

const createFileUpload = () => {
  const id = uuid();
  return { id, ref: spawn(createFileUploadMachine(id)) };
};

export const fileUploadsMachine = createMachine({
  id: 'fileUploads',
  preserveActionOrder: true,
  predictableActionArguments: true,
  context: {
    fileUploads: [],
  },
  initial: 'init',
  on: {
    ADD_UPLOAD: {
      actions: assign({
        fileUploads: (ctx) => [...ctx.fileUploads, createFileUpload()],
      }),
    },
  },
  states: {
    init: {
      entry: assign({
        fileUploads: () => [createFileUpload()],
      }),
      always: 'ready',
    },
    ready: {},
  },

  // https://xstate.js.org/docs/guides/typescript.html#using-typescript
  schema: {
    context: {
      fileUploads: [] as FileUploads,
    },
  },
});
