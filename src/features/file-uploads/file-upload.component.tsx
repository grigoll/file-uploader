import { ChangeEvent, FC, useCallback, useEffect, useRef } from 'react';
import { RepeatIcon, SmallCloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  IconButton,
  Input,
  Tooltip,
} from '@chakra-ui/react';
import { useActor, useSelector } from '@xstate/react';
import { FileUploadProgress } from './progress.component';
import { FileUploadActor } from '../../types';
import { FileUploadMachineStateValue } from '../../types/file-upload-machine';

export const FileUpload: FC<{ uploadActor: FileUploadActor }> = ({ uploadActor }) => {
  const [_, send] = useActor(uploadActor);
  const file = useSelector(uploadActor, (state) => state.context.file);
  const uploadState = useSelector(
    uploadActor,
    (state) => state.value as FileUploadMachineStateValue
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const retry = useCallback(() => send('RETRY'), [send]);
  const upload = useCallback(() => send('UPLOAD_FILE'), [send]);
  const cancel = useCallback(() => send('CANCEL'), [send]);

  const handleFileChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      if (target.files?.length) {
        send({
          type: 'SELECT_FILE',
          file: target.files[0],
        });
      }
    },
    [send]
  );

  // Reset input when context is cleared (eg: after successful upload)
  useEffect(() => {
    if (!file && fileInputRef.current?.value) {
      fileInputRef.current.value = '';
    }
  }, [file]);

  return (
    <Flex width="100%">
      <FormControl isInvalid={uploadState === 'failed'} mr="5">
        <Input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          isDisabled={uploadState === 'uploading'}
        />

        {uploadState === 'uploading' && <FileUploadProgress uploadActor={uploadActor} />}

        <FormErrorMessage>Upload failed</FormErrorMessage>

        {uploadState === 'uploaded' && (
          <FormHelperText fontSize={'md'} color={'green'}>
            File has been successfully uploaded.
          </FormHelperText>
        )}
      </FormControl>

      {uploadState === 'failed' ? (
        <Tooltip label="Retry" closeOnClick={false}>
          <IconButton aria-label="Retry" icon={<RepeatIcon />} onClick={retry} />
        </Tooltip>
      ) : (
        <Button onClick={upload} isDisabled={!file} isLoading={uploadState === 'uploading'}>
          Upload
        </Button>
      )}

      {uploadState === 'uploading' && (
        <Tooltip label="Cancel" closeOnClick={false}>
          <IconButton ml="5" aria-label="Cancel" icon={<SmallCloseIcon />} onClick={cancel} />
        </Tooltip>
      )}
    </Flex>
  );
};
