import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Breadcrumb from "../components/Breadcrumb";

const mockSegments = [
  { name: "Users", path: "/Users" },
  { name: "sasaranoana", path: "/Users/sasaranoana" },
  { name: "documents", path: "/Users/sasaranoana/documents" },
];

describe("Breadcrumb", () => {
  it("renders home button always", () => {
    render(<Breadcrumb segments={[]} onNavigate={vi.fn()} />);
    expect(screen.getByText("home")).toBeInTheDocument();
  });

  it("renders all path segments", () => {
    render(<Breadcrumb segments={mockSegments} onNavigate={vi.fn()} />);
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("sasaranoana")).toBeInTheDocument();
    expect(screen.getByText("documents")).toBeInTheDocument();
  });

  it("calls onNavigate with / when home is clicked", () => {
    const onNavigate = vi.fn();
    render(<Breadcrumb segments={mockSegments} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByText("home"));
    expect(onNavigate).toHaveBeenCalledWith("/");
  });

  it("calls onNavigate with correct path when a segment is clicked", () => {
    const onNavigate = vi.fn();
    render(<Breadcrumb segments={mockSegments} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByText("Users"));
    expect(onNavigate).toHaveBeenCalledWith("/Users");
  });

  it("last segment is not clickable", () => {
    const onNavigate = vi.fn();
    render(<Breadcrumb segments={mockSegments} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByText("documents"));
    expect(onNavigate).not.toHaveBeenCalled();
  });
});
