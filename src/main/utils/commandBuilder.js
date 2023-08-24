import store from './store';
const OS = process.platform;
/**
 * Generate bash script to sort columns from the output
 */
const sortCommand = () => {
  const sortColumn = store.get('currentSortedColumn');
  const sortOrder = store.get('currentSortOrder') === 'asc' ? '-k' : '-rk';
  return `(read -r; printf "%s\n" "$REPLY"; sort ${sortOrder} ${sortColumn})`;
};

const commandBuilder = {
  getKillAllCommand: () => OS === 'win32' ? 'taskkill /PID' : 'kill -9',
  getDefaultCommand: () => OS === 'win32'
      ? 'tasklist'
      : `ps ${
        store.get('showAllProcess') ? 'aux -o' : '-o'
        } pid,ruser,rss,%cpu,%mem,cputime,command,comm | ${sortCommand()}`;
  ,
};

export default commandBuilder;
