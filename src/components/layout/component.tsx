import { FC, PropsWithChildren } from 'react';
import { Box, Container } from '@chakra-ui/react';

export const Layout: FC<PropsWithChildren> = ({ children }) => (
  <Box h="100vh" w="100vw" overflow="auto">
    <Container pt="10" pb="10" maxW="container.sm">
      {children}
    </Container>
  </Box>
);
