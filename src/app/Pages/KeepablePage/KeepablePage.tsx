"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Bookmark,
  FolderOpen,
  Lightbulb,
  Book,
  Wrench,
  MoreHorizontal,
  Pin,
  PinOffIcon,
  Edit,
  Trash,
  Copy,
  Folder,
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { AppSidebar } from "@/app/components/SideBar/AppSidebar";

export default function KeepablePage() {
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState([""]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<any | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showProjectsDialog, setShowProjectsDialog] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [selectedBookmarkId, setSelectedBookmarkId] = useState(null);

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const filteredBookmarks = bookmarks.filter((b) => {
    const matchesFilter =
      activeFilter === "all" || b.tags.includes(activeFilter);
    const matchesSearch =
      b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const pinnedBookmarks = bookmarks.filter((b) => b.isPinned);
  const unpinnedBookmarks = filteredBookmarks.filter((b) => !b.isPinned);

  const fetchMetadata = async (url: string) => {
    try {
      const response = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      return {
        title: data.data?.title || new URL(url).hostname,
        description: data.data?.description || "",
        image: data.data?.image?.url || data.data?.screenshot?.url || "",
        logo:
          data.data?.logo?.url ||
          `https://www.google.com/s2/favicons?domain=${
            new URL(url).hostname
          }&sz=128`,
      };
    } catch (error) {
      const domain = new URL(url).hostname;
      return {
        title: domain,
        description: "",
        image: "",
        logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      };
    }
  };

  const addBookmark = async () => {
    if (url.trim()) {
      setIsLoading(true);
      const metadata = await fetchMetadata(url.trim());

      const newBookmark = {
        id: Date.now(),
        url: url.trim(),
        tags: selectedTags,
        createdAt: new Date().toISOString(),
        title: metadata.title,
        description: metadata.description,
        image: metadata.image,
        logo: metadata.logo,
        isPinned: false,
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
      setUrl("");
      setSelectedTags([""]);
      setIsLoading(false);
    }
  };

  const deleteBookmark = (id: number) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    if (openMenuId === id) setOpenMenuId(null);
  };

  const togglePin = (id: number) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPinned: !b.isPinned } : b))
    );
    setOpenMenuId(null);
  };

  const unTogglePin = (id: number) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPinned: false } : b))
    );
    setOpenMenuId(null);
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setOpenMenuId(null);
  };

  const openEditDialog = (bookmark: any) => {
    setEditingBookmark(bookmark.id);
    setOpenMenuId(null);
  };

  const toggleEditTag = (tagName: string) => {
    setBookmarks((prev) =>
      prev.map((b) =>
        b.id === editingBookmark.id
          ? {
              ...b,
              tags: b.tags.includes(tagName)
                ? b.tags.filter((t) => t !== tagName)
                : [...b.tags, tagName],
            }
          : b
      )
    );
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const STORAGE_KEYS = {
    BOOKMARKS: "keepable_bookmarks",
    TAGS: "keepable_tags",
    PROJECTS: "keepable_projects",
  };

  const [tags, setTags] = useState([
    { id: 1, name: "Read later", icon: Bookmark },
    { id: 2, name: "Learning", icon: Book },
    { id: 3, name: "Tools", icon: Wrench },
    { id: 4, name: "Inspiration", icon: Lightbulb },
  ]);

  const addBookmarkToProject = (bookmarkId: number, projectId: number) => {
    // Find the project details
    const project = projects.find((p) => p.id === projectId);

    if (!project) return;

    setBookmarks((prev) =>
      prev.map((b) => {
        if (b.id === bookmarkId) {
          const currentProjects = b.projects || [];
          const existingProjectIndex = currentProjects.findIndex(
            (p) => p.id === projectId
          );

          if (existingProjectIndex !== -1) {
            // Update existing project (in case name changed)
            const updatedProjects = [...currentProjects];
            updatedProjects[existingProjectIndex] = {
              id: project.id,
              name: project.name,
            };
            return {
              ...b,
              projects: updatedProjects,
            };
          } else {
            // Add new project
            return {
              ...b,
              projects: [
                ...currentProjects,
                { id: project.id, name: project.name },
              ],
            };
          }
        }
        return b;
      })
    );
  };

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);

      if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));
      if (storedProjects) setProjects(JSON.parse(storedProjects));
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  const clearAllData = () => {
    localStorage.clear();
    setBookmarks([]);
    setTags([]);
    setProjects([]);
  };

  return (
    <SidebarProvider
      defaultOpen={true}
      className="w-full"
      style={{
        width: "100%",
      }}
      onOpenChange={() => {}}
      open={true}
    >
      <div className="flex min-h-screen w-full">
        <AppSidebar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          tags={tags}
          setTags={setTags}
          projects={projects}
          setProjects={setProjects}
          bookmarks={bookmarks}
          clearAllData={clearAllData}
        />

        <main className="flex-1 flex flex-col bg-amber-50/30">
          {/* Header with Trigger and User Avatar */}
          <header className="flex items-center justify-between p-4 md:px-8">
            <SidebarTrigger
              className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-amber-300 transition-all md:hidden"
              onClick={() => {}}
            />
            <div className="flex-1" />
            <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-amber-300 transition-all">
              <span className="text-sm">😊</span>
            </div>
          </header>

          {/* Add Bookmark Card */}
          <div className="px-4 md:px-8 mb-6 md:mb-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your link or image here..."
                className="mb-4 text-sm md:text-base border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                onKeyDown={(e) => e.key === "Enter" && addBookmark()}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag) => {
                    const Icon = tag.icon;
                    const isSelected = selectedTags.includes(tag.name);
                    return (
                      <button
                        key={tag.name}
                        onClick={() => toggleTag(tag.name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{tag.name}</span>
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="default"
                  size="sm"
                  onClick={addBookmark}
                  disabled={!url.trim() || isLoading}
                  className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {isLoading ? "Loading..." : "Bookmark this"}
                </Button>
              </div>
            </div>
          </div>

          {/* Pinned Bookmarks */}
          {pinnedBookmarks.length > 0 && (
            <div className="px-4 md:px-8 mb-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-lg font-semibold mb-4">Pinned bookmarks</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4  ">
                  {pinnedBookmarks.map((bookmark) => (
                    <motion.a
                      key={bookmark.id}
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 group relative"
                      whileHover={{ y: -6 }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 20,
                      }}
                    >
                      <div
                        className="absolute top-0 right-2 rounded-full z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          unTogglePin(bookmark.id);
                        }}
                      >
                        <PinOffIcon className="w-4 h-4 text-black cursor-pointer" />
                      </div>
                      <motion.img
                        src={bookmark.logo}
                        alt={bookmark.title}
                        className="w-16 h-16 object-contain rounded-xl bg-white"
                        whileHover={{
                          scale: 1.18,
                          boxShadow: "0px 12px 30px rgba(0,0,0,0.18)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 18,
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />

                      <motion.span
                        className="text-xs text-center font-medium text-gray-700 line-clamp-2"
                        initial={{ opacity: 0.85 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {bookmark.title}
                      </motion.span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* All Bookmarks */}
          <div className="flex-1 px-4 md:px-8 overflow-auto pb-8">
            {unpinnedBookmarks.length === 0 && pinnedBookmarks.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-300 text-xl font-light">
                  No bookmarks yet
                </p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {unpinnedBookmarks.length > 0 && (
                  <h2 className="text-lg font-semibold mb-4">All bookmarks</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unpinnedBookmarks.map((bookmark) => (
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 20,
                      }}
                      key={bookmark.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group"
                    >
                      {/* 3-dot menu */}
                      <div className="absolute top-2 right-2 z-10">
                        <DropdownMenu className="w-fit">
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded-lg bg-[#222222CC]">
                              <MoreHorizontal className="w-4 h-4 text-white" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="flex flex-col w-fit flex-start"
                          >
                            <DropdownMenuItem
                              onClick={() => copyLink(bookmark.url)}
                              inset
                              className="flex gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedBookmarkId(bookmark.id); // Store which bookmark we're adding to a project
                                setShowProjectsDialog(true); // Open the projects dialog
                              }}
                              inset
                              className="flex gap-2"
                            >
                              <FolderOpen className="w-4 h-4" />
                              Add to project
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setEditingBookmark(bookmark)}
                              inset
                              className="flex gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit tags
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => togglePin(bookmark.id)}
                              inset
                              className="flex items-center gap-2"
                            >
                              <Pin className="w-4 h-4" />
                              Pin to top
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-2" />
                            <DropdownMenuItem
                              onClick={() => deleteBookmark(bookmark.id)}
                              inset
                              className="flex items-center gap-2 text-red-600 hover:text-red-600"
                            >
                              <Trash className="w-4 h-4 text-red-600" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Image / preview */}
                      <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                        {bookmark.image ? (
                          <img
                            src={bookmark.image}
                            alt={bookmark.title}
                            className="w-full h-full object-cover"
                          />
                        ) : bookmark.favicon ? (
                          <div className="flex items-center justify-center">
                            <img
                              src={bookmark.favicon}
                              alt={bookmark.title}
                              className="w-10 h-10 rounded-xl object-contain"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            No preview
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm font-semibold text-gray-900 truncate hover:underline"
                        >
                          {bookmark.title || bookmark.url}
                        </a>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                          <img
                            src={bookmark?.logo}
                            alt={bookmark?.title}
                            width={16}
                            height={16}
                          />
                          {getDomain(bookmark.url)}
                        </p>

                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {bookmark.tags.map((tagName) => {
                            const tag = tags.find((t) => t.name === tagName);
                            const Icon = tag?.icon || Bookmark;
                            return (
                              <span
                                key={tagName}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full"
                              >
                                <Icon className="w-3 h-3" />
                                {tagName}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Edit Tags Dialog */}
          {editingBookmark && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setEditingBookmark(null)}
            >
              <div
                className="bg-white rounded-2xl p-6 w-fit shadow-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditDialog(editingBookmark);
                }}
              >
                <h3 className="text-lg font-semibold mb-4">Edit tags</h3>

                <div className="space-y-2 mb-6">
                  {tags.map((tag) => {
                    const Icon = tag.icon;
                    const isSelected = bookmarks
                      .find((b) => b.id === editingBookmark.id)
                      ?.tags.includes(tag.name);

                    return (
                      <label
                        key={tag.name}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleEditTag(tag.name)}
                          className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">{tag.name}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingBookmark(null)}
                    className="px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4"
                  >
                    Apply tags
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Projects Dialog */}
          {showProjectsDialog && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowProjectsDialog(false)}
            >
              <div
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">Select Project</h3>

                <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                  {projects.map((project) => {
                    const isSelected = selectedProjectId === project.id;

                    return (
                      <label
                        key={project.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="project"
                          checked={isSelected}
                          onChange={() => setSelectedProjectId(project.id)}
                          className="w-5 h-5 border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <Folder className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">
                          {project.name}
                        </span>
                      </label>
                    );
                  })}

                  {/* Add New Folder Option */}
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowProjectsDialog(false);
                        setShowNewFolderDialog(true);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer w-full text-left"
                    >
                      <Plus className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-600">
                        Add new folder
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowProjectsDialog(false)}
                    className="px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4"
                    disabled={!selectedProjectId}
                    onClick={() => {
                      if (selectedBookmarkId && selectedProjectId) {
                        addBookmarkToProject(
                          selectedBookmarkId,
                          selectedProjectId
                        );

                        // Reset and close
                        setShowProjectsDialog(false);
                        setSelectedProjectId(null);
                        setSelectedBookmarkId(null);
                      }
                    }}
                  >
                    Select
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* New Folder Dialog */}
          {showNewFolderDialog && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowNewFolderDialog(false)}
            >
              <div
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">Add New Folder</h3>

                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-6"
                  autoFocus
                />

                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowNewFolderDialog(false);
                      setNewFolderName("");
                    }}
                    className="px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4"
                    onClick={() => {
                      if (newFolderName.trim()) {
                        const newProject = {
                          id: Date.now(),
                          name: newFolderName.trim(),
                        };
                        setProjects([...projects, newProject]);
                        setSelectedProjectId(newProject.id);
                        setNewFolderName("");
                        setShowNewFolderDialog(false);
                        setShowProjectsDialog(true);
                      }
                    }}
                  >
                    Add Folder
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
