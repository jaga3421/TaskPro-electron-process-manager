/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import {
  Box,
  Flex,
  Input,
  Stack,
  Text,
  Checkbox,
  useColorModeValue,
  Button,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Channels from 'main/variables/channels';
import { SmallCloseIcon } from '@chakra-ui/icons';
import TableHelper from './TableHelper';

// eslint-disable-next-line react/prop-types
export default function ProcessTable({ data, showAll }) {
  const toast = useToast();
  const [displayData, setDisplayData] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setDisplayData(
      search ? data.filter((row) => row.PID.includes(search)) : data
    );
  }, [data]);

  const inputChanged = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    if (searchTerm.trim() !== '') {
      const filteredData = data.filter((row) => row.PID.includes(search));
      setDisplayData(filteredData);
    } else {
      setDisplayData(data);
    }
  };

  const toggleAllProcess = (e) => {
    window.electron.ipcRenderer.sendMessage(
      Channels.UpdateShowAll,
      e.target.checked
    );
  };

  const exitApplication = () => {
    toast({
      title: 'Exiting Task Monitor',
      description: 'Please wait while the application exits.',
      status: 'warning',
      duration: 5000,
    });
    window.electron.ipcRenderer.sendMessage(Channels.ExitApplication);
  };

  const startTour = () => {};

  return (
    <Box bg={useColorModeValue('white', 'gray.700')} h="100vh">
      <Flex
        h="60px"
        boxShadow={useColorModeValue('sm', 'dark-lg')}
        justifyContent="space-between"
        alignItems="center"
        className="draggable"
      >
        <Text p="4" fontSize="lg" fontWeight="bold">
          Process List
        </Text>
        <Box p="4" className="non-draggable">
          <Stack direction="row" spacing={4}>
            <Checkbox
              isChecked={showAll}
              borderColor={useColorModeValue('teal.400', 'gray.600')}
              colorScheme="teal"
              onChange={toggleAllProcess}
            >
              <Text fontSize="sm">Show All Processes</Text>
            </Checkbox>

            <Input
              borderColor={useColorModeValue('teal.400', 'gray.600')}
              value={search}
              onChange={inputChanged}
              placeholder="Search by PID"
              size="sm"
              w="200px"
              borderRadius="md"
              type="number"
            />

            {/* <Tooltip label="Product Tour" aria-label="A tooltip">
              <Button
                size="sm"
                background="teal.100"
                borderRadius="lg"
                h={8}
                w={8}
                onClick={startTour}
              >
                <QuestionIcon color="teal.800" />
              </Button>
            </Tooltip> */}

            <Tooltip label="Exit Task Monitor" aria-label="A tooltip">
              <Button
                size="sm"
                background="red.500"
                borderRadius="lg"
                h={8}
                w={8}
                onClick={exitApplication}
              >
                <SmallCloseIcon color="white" />
              </Button>
            </Tooltip>
          </Stack>
        </Box>
      </Flex>
      <Text p="4" textAlign="right" fontSize="x-small">
        Total Processes: {displayData.length} | Last Updated :{' '}
        {new Date().toLocaleTimeString()}
      </Text>
      <Box
        bg={useColorModeValue('gray.200', 'gray.600')}
        m={4}
        mt={0}
        borderRadius="lg"
        overflow="hidden"
        boxShadow={useColorModeValue('sm', 'dark-lg')}
        maxWidth="calc(100vw - 32px - 60px)"
      >
        <Box>
          {displayData.length > 0 ? (
            <TableHelper data={displayData} />
          ) : (
            <Box
              p="4"
              bg={useColorModeValue('gray.200', 'gray.800')}
              textAlign="center"
            >
              <Text fontSize="sm">No process found</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
