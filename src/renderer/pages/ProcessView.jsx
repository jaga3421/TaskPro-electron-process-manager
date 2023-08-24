import Channels from 'main/variables/channels';
import { useEffect, useState } from 'react';
import ProcessTable from 'renderer/components/ProcessTable';

const { electron } = window;

export default function ProcessView() {
  const [data, setData] = useState([]);
  const [showAll, setShowAll] = useState([]);
  useEffect(() => {
    electron.ipcRenderer.on(Channels.ProcessList, (arg) => setData(arg));
    electron.ipcRenderer.on(Channels.GetPreferences, (arg) =>
      setShowAll(arg.showAllProcess)
    );
  }, []);

  return <ProcessTable data={data} showAll={showAll} />;
}
