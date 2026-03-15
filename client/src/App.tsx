import FileListItem from "./components/FileListItem";
import useFileExplorer from "./hooks/useFileExplorer";

function App() {
  const {
    path,
    dirContents,
    selectedItem,
    loading,
    error,
    navigateTo,
    selectItem,
  } = useFileExplorer();

  console.log("selectedItem", selectedItem);
  return (
    <>{/* <FileListItem file={{ name: "example.txt", size: 2048 }} /> */}</>
  );
}

export default App;
