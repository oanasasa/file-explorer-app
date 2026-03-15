import type FileInfo from "../types";

const FileListItem = (file: FileInfo) => {
  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    const units = ["KB", "MB", "GB", "TB"];
    let unitIndex = -1;
    let formattedSize = size;
    while (formattedSize >= 1024 && unitIndex < units.length - 1) {
      formattedSize /= 1024;
      unitIndex++;
    }
    return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
  };

  return (
    <div className="file-list-item">
      <span className="file-name">{file.name}</span>
      <span className="file-type">{file.type}</span>
      <span className="file-size">{formatFileSize(file.size)}</span>
      <span className="file-createdAt">{file.createdAt}</span>
      <span className="file-modifiedAt">{file.modifiedAt}</span>
    </div>
  );
};

export default FileListItem;
