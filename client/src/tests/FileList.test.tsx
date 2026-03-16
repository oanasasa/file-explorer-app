import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FileList from "../components/FileList";

const mockFiles = [
  {
    name: "documents",
    type: "directory" as const,
    size: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    modifiedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    name: "notes.txt",
    type: "file" as const,
    size: 1024,
    createdAt: "2024-01-01T00:00:00.000Z",
    modifiedAt: "2024-01-01T00:00:00.000Z",
  },
];

describe("FileList", () => {
  it("renders a row for each file", () => {
    render(
      <FileList files={mockFiles} onNavigate={vi.fn()} onSelect={vi.fn()} />
    );
    expect(screen.getByText("documents")).toBeInTheDocument();
    expect(screen.getByText("notes.txt")).toBeInTheDocument();
  });

  it("renders empty state when files array is empty", () => {
    render(<FileList files={[]} onNavigate={vi.fn()} onSelect={vi.fn()} />);
    expect(screen.getByText("This directory is empty")).toBeInTheDocument();
  });

  it("renders header columns", () => {
    render(
      <FileList files={mockFiles} onNavigate={vi.fn()} onSelect={vi.fn()} />
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByText("Modified")).toBeInTheDocument();
  });
});
