import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import useFileExplorer from "../hooks/useFileExplorer";
import * as filesApi from "../api/filesApi";

// Mock the API layer so tests don't make real HTTP calls
vi.mock("../api/filesApi");

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

beforeEach(() => {
  vi.mocked(filesApi.fetchDirectory).mockResolvedValue(mockFiles);
  vi.mocked(filesApi.fetchFileInfo).mockResolvedValue(mockFiles[1]);
});

describe("useFileExplorer", () => {
  it("starts with path set to /", () => {
    const { result } = renderHook(() => useFileExplorer());
    expect(result.current.path).toBe("/");
  });

  it("fetches directory contents on mount", async () => {
    const { result } = renderHook(() => useFileExplorer());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.dirContents).toEqual(mockFiles);
  });

  it("navigateTo updates path and clears selected item", async () => {
    const { result } = renderHook(() => useFileExplorer());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.navigateTo("documents");
    });

    expect(result.current.path).toBe("/documents");
    expect(result.current.selectedItem).toBeNull();
  });

  it("navigateTo joins path correctly from nested directory", async () => {
    const { result } = renderHook(() => useFileExplorer());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.navigateTo("documents"));
    act(() => result.current.navigateTo("work"));

    expect(result.current.path).toBe("/documents/work");
  });

  it("selectItem sets the selected item", async () => {
    const { result } = renderHook(() => useFileExplorer());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.selectItem(mockFiles[1]);
    });

    expect(result.current.selectedItem).toEqual(mockFiles[1]);
  });

  it("sets error state when fetchDirectory fails", async () => {
    vi.mocked(filesApi.fetchDirectory).mockRejectedValue(
      new Error("Network error")
    );

    const { result } = renderHook(() => useFileExplorer());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Network error");
    expect(result.current.dirContents).toEqual([]);
  });

  it("pathSegments splits path correctly", async () => {
    const { result } = renderHook(() => useFileExplorer());

    act(() => result.current.navigateTo("Users"));
    act(() => result.current.navigateTo("documents"));

    expect(result.current.pathSegments).toEqual([
      { name: "Users", path: "/Users" },
      { name: "documents", path: "/Users/documents" },
    ]);
  });

  it("navigateTo from breadcrumb uses absolute path directly", async () => {
    const { result } = renderHook(() => useFileExplorer());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.navigateTo("/Users/sasaranoana"));
    expect(result.current.path).toBe("/Users/sasaranoana");
  });

  it("loading is true while fetching", async () => {
    const { result } = renderHook(() => useFileExplorer());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("clears error on successful fetch after failure", async () => {
    vi.mocked(filesApi.fetchDirectory).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { result } = renderHook(() => useFileExplorer());
    await waitFor(() => expect(result.current.error).toBe("Network error"));

    vi.mocked(filesApi.fetchDirectory).mockResolvedValueOnce(mockFiles);
    act(() => result.current.navigateTo("documents"));

    await waitFor(() => expect(result.current.error).toBeNull());
  });
});
