import React from 'react';
import {
  Box,
  Flex,
  Button,
  Stack,
  useColorMode,
  useColorModeValue,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';

import {
  MoonIcon,
  SunIcon,
  SettingsIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';

import Channels from 'main/variables/channels';
import Preferences from './Preferences';

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnRef = React.useRef();
  const openLogDir = () =>
    window.electron.ipcRenderer.sendMessage(Channels.OpenLogDir);

  return (
    <Box padding={0} h="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Flex
        direction="column"
        w="100%"
        h="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          bg={useColorModeValue('teal.600', 'gray.900')}
          p={2}
          h="60px"
          w="60px"
        >
          <Text as="small" color={useColorModeValue('white', 'gray.100')}>
            {' '}
            TasKY{' '}
          </Text>
        </Flex>

        <Flex alignItems="center" p={4}>
          <Stack direction="column" spacing={2}>
            <Tooltip label="Toggle dark mode" placement="right">
              <Button onClick={toggleColorMode} bg="transparent">
                {colorMode === 'light' ? (
                  <MoonIcon color="teal.500" />
                ) : (
                  <SunIcon color="white" />
                )}
              </Button>
            </Tooltip>
            <Tooltip label="Open Log directory" placement="right">
              <Button onClick={openLogDir} bg="transparent">
                <ExternalLinkIcon
                  color={useColorModeValue('teal.500', 'white')}
                />
              </Button>
            </Tooltip>
            <Tooltip label="Open Preferences" placement="right">
              <Button bg="transparent" onClick={onOpen}>
                <SettingsIcon />
              </Button>
            </Tooltip>
          </Stack>
        </Flex>
      </Flex>
      <Preferences onClose={onClose} isOpen={isOpen} btnRef={btnRef} />
    </Box>
  );
}
