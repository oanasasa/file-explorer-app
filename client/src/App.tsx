import Breadcrumb from "./components/Breadcrumb";
import FileList from "./components/FileList";
import useFileExplorer from "./hooks/useFileExplorer";

function App() {
  const {
    path,
    dirContents,
    selectedItem,
    loading,
    error,
    selectItem,
    navigateTo,
    pathSegments,
  } = useFileExplorer();

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
