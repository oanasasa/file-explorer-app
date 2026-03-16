import Breadcrumb from "./components/Breadcrumb";
import FileList from "./components/FileList";
import useFileExplorer from "./hooks/useFileExplorer";

function App() {
  const { dirContents, selectItem, navigateTo, pathSegments } =
    useFileExplorer();

  return (
    <>
      <Breadcrumb segments={pathSegments} onNavigate={navigateTo} />
      <FileList
        files={dirContents}
        onNavigate={navigateTo}
        onSelect={selectItem}
      />
    </>
  );
}

export default App;
