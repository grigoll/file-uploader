import { v4 as uuid } from 'uuid';
import { createFileUploadMachine } from '../file-upload.machine';

describe('test file upload state machine', () => {
  const machine = createFileUploadMachine(uuid());

  it('checks machine initial state', () => {
    expect(machine.initial).toBe('idle');
  });

  it('should transition to `uploading` from `idle` on `UPLOAD_FILE` event', () => {
    const currentState = 'idle';
    const newState = machine.transition(currentState, 'UPLOAD_FILE');
    const expectedState = 'uploading';

    expect(newState.value).toBe(expectedState);
  });

  test.each(['uploading', 'uploaded', 'failed'])(
    'state `%s` should not respond to `UPLOAD_FILE` event',
    (currentState) => {
      const newState = machine.transition(currentState, 'UPLOAD_FILE');
      expect(newState.value).toBe(currentState);
    }
  );

  it('should retry upload when `failed` state on `RETRY` event', () => {
    const newState = machine.transition('failed', 'RETRY');
    const expectedState = 'uploading';

    expect(newState.value).toBe(expectedState);
  });

  test.each(['idle', 'uploading', 'uploaded'])(
    'retry should only be allowed when in `failed` state',
    (currentState) => {
      const newState = machine.transition(currentState, 'RETRY');

      expect(newState.value).toBe(currentState);
    }
  );

  it('should select file', () => {
    const filename = 'dummy-file';
    const file = new File(['dummy-content'], filename, { type: 'text/html' });

    const newState = machine.transition('idle', { type: 'SELECT_FILE', file });

    expect(newState.context.file).toBe(file);
    expect(newState.context.file?.name).toBe(file.name);
  });
});
