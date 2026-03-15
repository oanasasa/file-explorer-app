export interface FileInfo {
  name: string;
  path: string;
  type: "file" | "directory";
  size: number | null;
  createdAt: string;
  modifiedAt: string;
}
