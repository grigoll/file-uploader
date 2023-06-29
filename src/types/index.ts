import { ActorRefFrom } from 'xstate';
import { createFileUploadMachine } from '../state-machines/file-upload.machine';

export type FileUploadActor = ActorRefFrom<ReturnType<typeof createFileUploadMachine>>;

export type FileUploads = {
  id: string;
  ref: FileUploadActor;
}[];
