/**
 * Get the list of processes running on the system
 * based on the provided filter and OS
 */
import { exec } from 'child_process';
import commandBuilder from './commandBuilder';
import store from './store';

interface Process {
  [key: string]: string | number | undefined;
}

const processScrapper = async (): Promise<string> => {
  return new Promise<any>((resolve, reject) => {
    const defaultCommand = commandBuilder.getDefaultCommand();
    const currentSortedColumn = store.get('currentSortedColumn') || 1;
    const currentSortOrder = store.get('currentSortOrder') || 'asc';
    const command = store.get('currentCommand') || defaultCommand;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(new Error(stderr));
      } else {
        // Parse the output by cleaning line breaks and splitting rows
        const lines = stdout.trim().split('\n');
        const headers = lines[0].trim().split(/\s+/);
        const processes = lines.slice(1).map((line) => {
          const values = line.trim().split(/\s+/);
          const processObj: Process = {};
          headers.forEach((header, index) => {
            processObj[header] = values[index];
          });
          return processObj;
        });
        // #todo: refactor this
        processes[1].col = currentSortedColumn;
        processes[1].sort = currentSortOrder;

        resolve(processes);
      }
    });
  });
};

export default processScrapper;
