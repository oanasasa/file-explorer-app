import type { FileInfo } from "../types";

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
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface DetailPanelProps {
  item: FileInfo | null;
}

function DetailPanel({ item }: DetailPanelProps) {
  if (!item) {
    return (
      <div className="detail-panel detail-panel--empty">
        <span>Select a file or folder to see details</span>
      </div>
    );
  }

  const isDirectory = item.type === "directory";

  return (
    <div className="detail-panel">
      <div className="detail-icon">{isDirectory ? "📁" : "📄"}</div>
      <h2 className="detail-name">{item.name}</h2>

      <div className="detail-rows">
        <div className="detail-row">
          <span className="detail-label">Type</span>
          <span className={`file-type ${isDirectory ? "is-directory" : ""}`}>
            {item.type}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Size</span>
          <span className="detail-value">{formatFileSize(item.size)}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Created</span>
          <span className="detail-value">{formatDate(item.createdAt)}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Modified</span>
          <span className="detail-value">{formatDate(item.modifiedAt)}</span>
        </div>
      </div>
    </div>
  );
}

export default DetailPanel;
