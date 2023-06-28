import { FC, useCallback } from 'react';
import { SmallAddIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Tooltip, VStack } from '@chakra-ui/react';
import { useMachine, useSelector } from '@xstate/react';
import { FileUpload } from './file-upload.component';
import { fileUploadsMachine } from '../../state-machines/file-uploads.machine';

export const FileUploadsContainer: FC = () => {
  const [_, send, service] = useMachine(fileUploadsMachine);
  const fileUploads = useSelector(service, (state) => state.context.fileUploads);

  const addNewUpload = useCallback(() => send('ADD_UPLOAD'), [send]);

  return (
    <Flex flexDirection="column">
      <VStack spacing="10" mb="5">
        {fileUploads.map(({ id, ref }) => (
          <FileUpload key={id} uploadActor={ref} />
        ))}
      </VStack>

      <Flex justifyContent="flex-end">
        <Tooltip closeOnClick={false} alignSelf={'flex-end'} label="New file upload">
          <IconButton aria-label="New file upload" icon={<SmallAddIcon />} onClick={addNewUpload} />
        </Tooltip>
      </Flex>
    </Flex>
  );
};
