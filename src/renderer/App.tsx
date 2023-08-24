import './App.scss';

import { ChakraProvider, Grid, GridItem } from '@chakra-ui/react';
import ProcessView from './pages/ProcessView';
import NavBar from './components/NavBar';

export default function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Grid h="100vh" templateColumns="60px 1fr" bg="gray.200">
          <GridItem h={100}>
            <NavBar />
          </GridItem>
          <GridItem>
            <ProcessView />
          </GridItem>
        </Grid>
      </div>
    </ChakraProvider>
  );
}
