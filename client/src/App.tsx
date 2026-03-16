import Breadcrumb from "./components/Breadcrumb";
import FileList from "./components/FileList";
import DetailPanel from "./components/DetailPanel";
import useFileExplorer from "./hooks/useFileExplorer";

function App() {
  const {
    path,
    dirContents,
    selectedItem,
    selectItem,
    navigateTo,
    pathSegments,
    loading,
    error,
  } = useFileExplorer();

  return (
    <>
      <Breadcrumb segments={pathSegments} onNavigate={navigateTo} />

      {error && (
        <div className="app-error">
          <span className="app-error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="app-layout">
        {loading ? (
          <div className="app-spinner">
            <div className="spinner" />
            <span>Loading...</span>
          </div>
        ) : (
          <FileList
            files={dirContents}
            currentPath={path}
            onNavigate={navigateTo}
            onSelect={selectItem}
          />
        )}
        <DetailPanel item={selectedItem} />
      </div>
    </>
  );
}

export default App;
