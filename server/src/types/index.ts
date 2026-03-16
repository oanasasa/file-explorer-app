export interface FileInfo {
  name: string;
  type: "file" | "directory";
  size: number | null;
  createdAt: string;
  modifiedAt: string;
}
