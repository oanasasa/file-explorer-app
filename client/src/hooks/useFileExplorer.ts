import { useState, useEffect } from "react";

const useFileExplorer = () => {
  const [path, setPath] = useState<string>("/");
  const [dirContents, setDirContents] = useState<File[]>([]);
  const [selectedItem, setSelectedItem] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDirContents = async () => {
      setLoading(true);
      setError(null);

      const urlPath = window.location.pathname;
      const cleanPath = urlPath === "/" ? "/" : urlPath.slice(1);

      try {
        const response = await fetch(
          `/api/files?path=${encodeURIComponent(cleanPath)}`
        );
        if (!response.ok) {
          throw new Error(
            `Error fetching directory contents: ${response.statusText}`
          );
        }
        const data = await response.json();
        setDirContents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDirContents();
  }, [path]); // still triggered by path changes

  const navigateTo = (newPath: string) => {
    window.history.pushState(null, "", "/" + newPath);
    setPath(newPath);
    setSelectedItem(null);
  };

  const selectItem = (item: File) => {
    setSelectedItem(item);
  };

  return {
    path,
    dirContents,
    selectedItem,
    loading,
    error,
    navigateTo,
    selectItem,
  };
};

export default useFileExplorer;
