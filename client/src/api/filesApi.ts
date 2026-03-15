import type { FileInfo } from "../types";

export const fetchDirectory = async (path: string): Promise<FileInfo[]> => {
  const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`);

  if (!response.ok) {
    throw new Error(`Error fetching directory: ${response.statusText}`);
  }

  return response.json();
};

export const fetchFileInfo = async (path: string): Promise<FileInfo> => {
  const response = await fetch(`/api/file?path=${encodeURIComponent(path)}`);

  if (!response.ok) {
    throw new Error(`Error fetching file info: ${response.statusText}`);
  }

  return response.json();
};
