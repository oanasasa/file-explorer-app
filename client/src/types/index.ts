export interface FileInfo {
  name: string;
  type: "file" | "directory";
  size: number | null;
  createdAt: string;
  modifiedAt: string;
}

export interface Segment {
  name: string;
  path: string;
}
