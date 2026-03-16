import type { FileInfo } from "../types";

interface FileListItemProps {
  file: FileInfo;
  currentPath: string;
  isFocused: boolean;
  onNavigate: (path: string) => void;
  onSelect: (file: FileInfo) => void;
}

const formatFileSize = (size: number | null): string => {
  if (size === null) return "—";
  if (size < 1024) return `${size} B`;
  const units = ["KB", "MB", "GB"];
  let unitIndex = -1;
  let formattedSize = size;
  while (formattedSize >= 1024 && unitIndex < units.length - 1) {
    formattedSize /= 1024;
    unitIndex++;
  }
  return `${formattedSize.toFixed(1)} ${units[unitIndex]}`;
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const FileListItem = ({
  file,
  currentPath,
  onNavigate,
  isFocused,
  onSelect,
}: FileListItemProps) => {
  const isDirectory = file.type === "directory";

  const handleClick = () => {
    if (isDirectory) {
      const fullPath = `${currentPath === "/" ? "" : currentPath}/${file.name}`;
      onSelect(file); // show info in DetailPanel
      onNavigate(fullPath); // navigate into it
    } else {
      onSelect(file); // just show info
    }
  };

  return (
    <div className="file-list-item" onClick={handleClick}>
      <div className="file-link">
        <span>{isDirectory ? "📁" : "📄"}</span>
        <span className="file-name">{file.name}</span>
        <span className={`file-type ${isDirectory ? "is-directory" : ""}`}>
          {file.type}
        </span>
        <span className="file-size">{formatFileSize(file.size)}</span>
        <span className="file-modified">{formatDate(file.modifiedAt)}</span>
      </div>
    </div>
  );
};

export default FileListItem;
