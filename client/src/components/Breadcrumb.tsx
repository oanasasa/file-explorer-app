import type { Segment } from "../types";

interface BreadcrumbProps {
  segments: Segment[];
  onNavigate: (path: string) => void;
}

function Breadcrumb({ segments, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb">
      <button className="breadcrumb-item" onClick={() => onNavigate("/")}>
        home
      </button>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        return (
          <span key={segment.path} className="breadcrumb-segment">
            <span className="breadcrumb-separator">/</span>
            {isLast ? (
              <span className="breadcrumb-item is-active">{segment.name}</span>
            ) : (
              <button
                className="breadcrumb-item"
                onClick={() => onNavigate(segment.path)}
              >
                {segment.name}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
