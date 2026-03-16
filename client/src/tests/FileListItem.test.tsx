import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FileListItem from "../components/FileListItem";

const mockFile = {
  name: "notes.txt",
  type: "file" as const,
  size: 2048,
  createdAt: "2024-01-01T00:00:00.000Z",
  modifiedAt: "2024-01-01T00:00:00.000Z",
};

const mockDir = {
  name: "documents",
  type: "directory" as const,
  size: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  modifiedAt: "2024-01-01T00:00:00.000Z",
};

describe("FileListItem", () => {
  it("renders file name", () => {
    render(
      <FileListItem file={mockFile} onNavigate={vi.fn()} onSelect={vi.fn()} />
    );
    expect(screen.getByText("notes.txt")).toBeInTheDocument();
  });

  it("renders formatted file size", () => {
    render(
      <FileListItem file={mockFile} onNavigate={vi.fn()} onSelect={vi.fn()} />
    );
    expect(screen.getByText("2.0 KB")).toBeInTheDocument();
  });

  it("renders — for directory size", () => {
    render(
      <FileListItem file={mockDir} onNavigate={vi.fn()} onSelect={vi.fn()} />
    );
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("calls onNavigate when a directory is clicked", () => {
    const onNavigate = vi.fn();
    render(
      <FileListItem file={mockDir} onNavigate={onNavigate} onSelect={vi.fn()} />
    );
    fireEvent.click(screen.getByText("documents"));
    expect(onNavigate).toHaveBeenCalledWith("documents");
  });

  it("calls onSelect when a file is clicked", () => {
    const onSelect = vi.fn();
    render(
      <FileListItem file={mockFile} onNavigate={vi.fn()} onSelect={onSelect} />
    );
    fireEvent.click(screen.getByText("notes.txt"));
    expect(onSelect).toHaveBeenCalledWith(mockFile);
  });
});
