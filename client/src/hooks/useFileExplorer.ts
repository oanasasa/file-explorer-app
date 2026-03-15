import { useState, useEffect } from "react";
import { fetchDirectory, fetchFileInfo } from "../api/filesApi";
import type { FileInfo } from "../types";

const useFileExplorer = () => {
  const [path, setPath] = useState<string>("/");
  const [dirContents, setDirContents] = useState<FileInfo[]>([]);
  const [selectedItem, setSelectedItem] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // derived from path state, not from the URL
  const cleanPath = path === "/" ? "/" : path.replace(/^\//, "");

  useEffect(() => {
    const loadDirectory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDirectory(cleanPath);
        setDirContents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDirectory();
  }, [path]);

  const navigateTo = (newPath: string) => {
    const urlSegment = newPath.split("/").filter(Boolean).pop() || "";
    window.history.pushState(null, "", "/" + urlSegment);
    setPath(newPath);
    setSelectedItem(null);
  };

  const selectItem = async (item: FileInfo) => {
    try {
      const detailed = await fetchFileInfo(item.path);
      setSelectedItem(detailed);
    } catch (err: any) {
      setSelectedItem(item); // fallback to basic info if detail fetch fails
      setError(err.message);
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
