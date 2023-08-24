/* eslint-disable promise/always-return */
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';

import { resolveHtmlPath } from './util';
import processScrapper from './utils/processScrapper';
import Channels from './variables/channels';
import logger from './utils/logger';
import store from './utils/store';

logger.initLog();
logger.addLog('App started');

let mainTimer: any | undefined;
let mainWindow: BrowserWindow | null = null;

/**
 * Method to get formatted Process List from processScrapper, and
 * Send Process List Json to the renderer
 */
const sendProcessJson = async () => {
  if (!mainWindow) return;
  const processJson = await processScrapper();
  mainWindow?.webContents.send(Channels.ProcessList, processJson);
};

/**
 * Handles the process loop and timer
 * After changing any setting ( sort, preference), simply the calling this method is enough
 * 1. Clear the timer
 * 2. Get preferences from store
 * 3. call sendProcessJson
 */
const InitiateProcessLoop = () => {
  const refreshRate = Number(store.get('refreshRate')) * 1000 || 3000;
  clearInterval(mainTimer);
  sendProcessJson();
  mainTimer = setInterval(sendProcessJson, refreshRate);
  mainWindow?.webContents.send(Channels.GetPreferences, {
    refreshRate: store.get('refreshRate'),
    showAllProcess: store.get('showAllProcess'),
  });
};

/**
 * IPC Listeners
 * On getting message from Rendered, update store and simply initiate the process loop
 */
ipcMain.on(Channels.SortColumn, (event, columnIndex) => {
  const currentSortedColumn = store.get('currentSortedColumn') || 1;
  const currentSortOrder = store.get('currentSortOrder') || 'asc';
  // #todo: refactor this
  const sortOrder =
    currentSortedColumn === columnIndex
      ? currentSortOrder === 'asc'
        ? 'desc'
        : 'asc'
      : 'asc';
  store.set('currentSortedColumn', columnIndex);
  store.set('currentSortOrder', sortOrder);
  logger.addSortLog(columnIndex, sortOrder);
  InitiateProcessLoop();
});

ipcMain.on(Channels.UpdateRefresh, (event, timeInseconds) => {
  store.set('refreshRate', timeInseconds);
  InitiateProcessLoop();
});

ipcMain.on(Channels.UpdateShowAll, (e, arg) => {
  store.set('showAllProcess', arg);
  logger.addLog(`Show all process: ${arg}`);
  InitiateProcessLoop();
});

ipcMain.on(Channels.OpenLogDir, () => logger.openLogDir());
ipcMain.on(Channels.ClearLogs, () => logger.clearAllLogs());
ipcMain.on(Channels.ExitApplication, () => setTimeout(app.quit, 5000));
ipcMain.on(Channels.OpenDevTools, () => mainWindow?.webContents.openDevTools());

/**
 * Just some Regular Electron stuffs
 * Start Process Loop after the window is ready
 */

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    width: 1024,
    minWidth: 700,
    minHeight: 400,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
    InitiateProcessLoop();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Electron Event listeners
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
