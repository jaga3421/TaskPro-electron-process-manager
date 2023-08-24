import log from 'electron-log';
import { shell } from 'electron';
import rmdir from 'rmdir';

const { app } = require('electron');

// Remove the hardcode
const arr = ['PID', 'RUSER', 'RSS', '%CPU', '%MEM', 'TIME', 'COMMAND', 'COMM'];
const path = require('path');

const createLogFile = () => {
  log.transports.file.file = path.join(
    app.getPath('userData'),
    'logs',
    `${Date.now()}.log`
  );
};

const logger = {
  initLog: () => {
    createLogFile();
  },
  addLog: (info) => {
    log.info(`${info}`);
  },
  addSortLog: (column, sort) => {
    log.info(`Column #${arr[column - 1]} sorted by ${sort} order`);
  },
  openLogDir: () => {
    log.info('Logs Directory is opened');
    shell.openPath(path.join(app.getPath('userData'), 'logs'));
  },
  clearAllLogs: () => {
    const pathToClear = path.join(app.getPath('userData'), 'logs');
    rmdir(pathToClear);
    createLogFile();
  },
};

export default logger;
