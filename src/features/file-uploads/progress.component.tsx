import { FC, useCallback, useState } from 'react';
import { Progress } from '@chakra-ui/react';
import { FileUploadActor } from '../../types';
import { FileUploadProgressEvent } from '../../types/file-upload-machine';
import { useActorEventEffect } from './actor-event-effect.hook';

export const FileUploadProgress: FC<{ uploadActor: FileUploadActor }> = ({ uploadActor }) => {
  const [progress, setProgress] = useState({
    loaded: 0,
    total: 1e9, // just a big number
  });

  const onProgress = useCallback(({ loaded, total }: FileUploadProgressEvent) => {
    setProgress({ loaded, total });
  }, []);

  // Subscription to upload progress as of task requirements
  useActorEventEffect(uploadActor, 'PROGRESS', onProgress);

  return <Progress mt="3" value={(progress.loaded / progress.total) * 100} hasStripe />;
};
