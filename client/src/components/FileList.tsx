import type { FileInfo } from "../types";
import FileListItem from "./FileListItem";

interface FileListProps {
  files: FileInfo[];
  currentPath: string;
  onNavigate: (path: string) => void;
  onSelect: (file: FileInfo) => void;
}

function FileList({ files, currentPath, onNavigate, onSelect }: FileListProps) {
  return (
    <div className="file-list">
      <div className="file-list-header">
        <span />
        <span>Name</span>
        <span>Type</span>
        <span>Size</span>
        <span>Modified</span>
      </div>
      {files.length === 0 ? (
        <div className="file-list-empty">This directory is empty</div>
      ) : (
        files.map((file) => (
          <FileListItem
            key={file.name}
            file={file}
            currentPath={currentPath}
            onNavigate={onNavigate}
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  );
}

export default FileList;
