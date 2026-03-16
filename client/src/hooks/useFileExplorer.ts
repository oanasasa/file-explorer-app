import { useState, useEffect } from "react";
import { fetchDirectory, fetchFileInfo } from "../api/filesApi";
import type { FileInfo } from "../types";

const useFileExplorer = () => {
  const [path, setPath] = useState<string>("/");
  const [dirContents, setDirContents] = useState<FileInfo[]>([]);
  const [selectedItem, setSelectedItem] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDirectory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDirectory(path);
        setDirContents(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unexpected error";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadDirectory();
  }, [path]);

  const navigateTo = (newPath: string) => {
    setPath(newPath);
    setSelectedItem(null);
  };

  const selectItem = async (item: FileInfo) => {
    const fullPath = `${path === "/" ? "" : path}/${item.name}`;
    try {
      const detailed = await fetchFileInfo(fullPath);
      setSelectedItem(detailed);
    } catch {
      setSelectedItem(item);
    }
  };

  const pathSegments = path
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => ({
      name: segment,
      path: "/" + arr.slice(0, index + 1).join("/"),
    }));

  return {
    path,
    dirContents,
    selectedItem,
    loading,
    error,
    pathSegments,
    navigateTo,
    selectItem,
  };
};

export default useFileExplorer;
