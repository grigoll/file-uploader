import { interpret } from 'xstate';
import { fileUploadsMachine } from '../file-uploads.machine';

describe('tests multiple file uploads', () => {
  const machine = fileUploadsMachine.withConfig({});

  it('should have empty context on `init` state', () => {
    const expectedState = 'init';

    expect(machine.initial).toBe(expectedState);
    expect(machine.context.fileUploads).toHaveLength(0);
  });

  it('should have one file upload after initialization', (done) => {
    const addUploadEvent = 'ADD_UPLOAD';

    const interpretedMachine = interpret(machine).onTransition(async (state, evt) => {
      expect(state.value).toBe('ready');

      if (evt.type.includes('init')) {
        expect(state.context.fileUploads).toHaveLength(1);
        done();
      }
    });

    interpretedMachine.start();
    interpretedMachine.send(addUploadEvent);
  });

  it('should have two file upload instance on `ADD_UPLOAD` event', (done) => {
    const addUploadEvent = 'ADD_UPLOAD';

    const interpretedMachine = interpret(machine).onTransition(async (state, evt) => {
      if (evt.type === addUploadEvent) {
        expect(state.context.fileUploads).toHaveLength(2);
        done();
      }
    });

    interpretedMachine.start();
    interpretedMachine.send(addUploadEvent);
  });
});
