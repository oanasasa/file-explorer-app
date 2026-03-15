import { useEffect, useState } from "react";

function App() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("/api/files?path=/")
      .then((response) => response.json())
      .then((data) => setFiles(data))
      .catch((error) => console.error("Error fetching files:", error));
  }, []);

  return <div>App</div>;
}

export default App;
