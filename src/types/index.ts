import { ActorRefFrom } from 'xstate';
import { createFileUploadMachine } from '../state-machines/file-upload.machine';

export type FileUploadActor = ActorRefFrom<typeof createFileUploadMachine>;

export type FileUploads = {
  id: string;
  ref: FileUploadActor;
}[];
