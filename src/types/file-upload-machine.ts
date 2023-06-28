export type FileUploadMachineContext = {
  id: string;
  file: File | null;
};

export type FileUploadProgressEvent = { type: 'PROGRESS'; loaded: number; total: number };

export type FileUploadMachineEvent =
  | { type: 'SELECT_FILE'; file: File }
  | { type: 'UPLOAD_FILE' }
  | { type: 'CANCEL' }
  | { type: 'RETRY' }
  | FileUploadProgressEvent;

export type FileUploadMachineStateValue = 'idle' | 'uploading' | 'uploaded' | 'failed';

export type FileUploadMachineState = {
  value: FileUploadMachineStateValue;
  context: FileUploadMachineContext;
};
