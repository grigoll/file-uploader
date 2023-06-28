import { ChakraProvider } from '@chakra-ui/react';
import { Layout } from './components/layout/component';
import { FileUploadsContainer } from './features/file-uploads/container.component';

const App = () => (
  <Layout>
    <FileUploadsContainer />
  </Layout>
);

export default function Shell() {
  return (
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
}
