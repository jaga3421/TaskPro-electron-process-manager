/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */

import {
  Box,
  Td,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import Channels from 'main/variables/channels';

import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

// eslint-disable-next-line react/prop-types
export default function TableHelper({ data }) {
  const sortColumn = (columnIndex) =>
    window.electron.ipcRenderer.sendMessage(
      Channels.SortColumn,
      columnIndex + 1
    );

  return (
    <Box height="calc(100vh - 60px - 60px)" overflow="auto">
      <Table variant="striped">
        <Thead>
          <Tr
            bg={useColorModeValue('teal.400', 'gray.800')}
            position="sticky"
            top={0}
          >
            {Object.keys(data[0]).map((item, i) => (
              <Th
                key={i}
                onClick={() => sortColumn(i)}
                py={3}
                px={5}
                cursor="pointer"
                position="relative"
              >
                <Text
                  as="strong"
                  fontSize="sm"
                  color={useColorModeValue('white', 'gray.100')}
                >
                  {item}
                  <Box w={2} position="absolute" top={3} right={3}>
                    {data[1]?.col === i + 1 &&
                      (data[1]?.sort == 'asc' ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      ))}
                  </Box>
                </Text>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, i) => (
            <Tr key={i} _hover={{ opacity: 0.5 }}>
              {Object.keys(row).map((item, j) =>
                item === 'col' || item === 'sort' ? (
                  ''
                ) : (
                  <Td key={j} py={3} px={5}>
                    {item === 'COMM' ? (
                      <Tooltip label={row[item]} aria-label="A tooltip">
                        <Text fontSize="xs" isTruncated maxW={200}>
                          {row[item]}
                        </Text>
                      </Tooltip>
                    ) : (
                      <Text fontSize="xs">{row[item]}</Text>
                    )}
                  </Td>
                )
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
