import React, { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Card,
  CardBody,
  Heading,
  Box,
  Text,
  Button,
  Stack,
  StackDivider,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Switch,
  useToast,
} from '@chakra-ui/react';
import Channels from 'main/variables/channels';

export default function Preferences({ isOpen, btnRef, onClose }) {
  const [sliderValue, setSliderValue] = useState(3);
  const toast = useToast();
  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  };

  const updateInterval = (val) => {
    window.electron.ipcRenderer.sendMessage(
      Channels.UpdateRefresh,
      Number(val)
    );
    toast({
      title: 'Preferences Updated',
      description: `Refresh interval set to ${val} seconds`,
      status: 'success',
      duration: 2000,
    });
  };
  const updateDevTools = (e) => {
    window.electron.ipcRenderer.sendMessage(Channels.OpenDevTools);
  };

  const clearLogs = () => {
    window.electron.ipcRenderer.sendMessage(Channels.ClearLogs);
    toast({
      title: 'Logs Cleared',
      description: `All the logs have been cleared. Please restart application to start logging again`,
      status: 'success',
      duration: 2000,
    });
  };
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent px={4} py={16}>
        <DrawerCloseButton />
        <DrawerHeader>Task Monitor Preferences</DrawerHeader>

        <DrawerBody>
          <Card>
            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box mb={4}>
                  <Heading size="xs" textTransform="uppercase">
                    Refresh Interval
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {sliderValue} Seconds
                  </Text>
                  <Box pt={6} pb={2}>
                    <Slider
                      w={200}
                      aria-label="slider-ex-6"
                      onChange={(val) => setSliderValue(val)}
                      defaultValue={3}
                      min={1}
                      max={10}
                      step={1}
                      onChangeEnd={(val) => updateInterval(val)}
                    >
                      <SliderMark value={1} {...labelStyles}>
                        1
                      </SliderMark>
                      <SliderMark value={10} {...labelStyles}>
                        10
                      </SliderMark>

                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Box>

                  <Text pt="2" fontSize="sm">
                    Time in seconds to refresh the process list.
                  </Text>
                </Box>

                <Box mt={4}>
                  <Heading size="xs" textTransform="uppercase">
                    Clear Logs
                  </Heading>

                  <Text pt="2" fontSize="sm">
                    Clear all the log files created by the application (Please
                    restart to start logging again)
                  </Text>
                  <Button
                    colorScheme="teal"
                    size="sm"
                    mt="2"
                    onClick={clearLogs}
                  >
                    Clear Logs
                  </Button>
                </Box>

                <Box mt={4}>
                  <Heading size="xs" textTransform="uppercase">
                    Enable Dev tools
                    <Switch
                      colorScheme="teal"
                      size="sm"
                      ml={3}
                      onChange={(val) => updateDevTools(val)}
                    />
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    Enable devtools for the application
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
