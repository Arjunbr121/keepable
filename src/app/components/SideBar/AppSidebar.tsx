"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Bookmark,
  FolderOpen,
  Lightbulb,
  Trash2,
  Book,
  Wrench,
  LayoutGrid,
  MoreHorizontal,
  X,
  Minus,
  Pin,
  PinOffIcon,
  Edit,
  Trash,
  CopyPlus,
  Copy,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const tags = [
  { name: "Read later", icon: Bookmark },
  { name: "Learning", icon: Book },
  { name: "Tools", icon: Wrench },
  { name: "Inspiration", icon: Lightbulb },
];

// Sidebar Component
function AppSidebar({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  tags,
  setTags,
  projects,
  setProjects,
}: {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  tags: { name: string; icon: React.ComponentType<{ className?: string }> }[];
  setTags: React.Dispatch<
    React.SetStateAction<
      { name: string; icon: React.ComponentType<{ className?: string }> }[]
    >
  >;
  projects: { id: number; name: string }[];
  setProjects: React.Dispatch<
    React.SetStateAction<{ id: number; name: string }[]>
  >;
}) {
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const [showNewTag, setShowNewTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const addTag = () => {
    if (!newTagName.trim()) return;

    setTags((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newTagName.trim(),
        icon: Bookmark, // default icon
      },
    ]);

    setNewTagName("");
    setShowNewTag(false);
  };

  const addProject = () => {
    if (!newProjectName.trim()) return;

    setProjects((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newProjectName.trim(),
      },
    ]);

    setNewProjectName("");
    setShowNewProject(false);
  };

  return (
    <Sidebar collapsible="icon" className="">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤚</span>
            <span className="font-semibold group-data-[collapsible=icon]:hidden">
              Keepable
            </span>
          </div>
          <button className="p-1.5 hover:bg-sidebar-accent rounded-md transition-colors group-data-[collapsible=icon]:hidden">
            <LayoutGrid className="w-4 h-4 text-sidebar-foreground/60" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="">
        {/* Search */}
        <div className="px-3 py-4 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search bookmarks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-12 bg-sidebar-accent border-0"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-sidebar-accent/50 px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Projects */}
        <SidebarGroup className="">
          <SidebarGroupLabel className="">Projects</SidebarGroupLabel>
          <SidebarGroupAction
            className=""
            onClick={() => setShowNewProject(!showNewProject)}
            title="Add Project"
          >
            {showNewProject ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent className="">
            <SidebarMenu className="">
              <SidebarMenuItem className="">
                <SidebarMenuButton
                  className=""
                  onClick={() => setShowNewProject(true)}
                  tooltip="Create a new project"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Create a new project</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {showNewProject && (
                <div className="px-2 py-1 flex flex-col gap-2 group-data-[collapsible=icon]:hidden">
                  <Input
                    type="text"
                    placeholder="Tag name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addProject();
                      if (e.key === "Escape") setShowNewProject(false);
                    }}
                    className="h-8 flex-1"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewProject(false)}
                      className="h-8 px-3 text-xs"
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addProject}
                      disabled={!newProjectName.trim()}
                      className="h-8 px-3 text-xs"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}

              {projects.map((project) => (
                <SidebarMenuItem key={project.id} className="">
                  <SidebarMenuButton tooltip={project.name} className="">
                    <FolderOpen className="w-4 h-4" />
                    <span>{project.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tags */}
        <SidebarGroup className="">
          <SidebarGroupLabel className="">Tags</SidebarGroupLabel>

          <SidebarGroupAction
            className=""
            title="Add Tag"
            onClick={() => setShowNewTag(!showNewTag)}
          >
            {showNewTag ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </SidebarGroupAction>

          <SidebarGroupContent className="">
            <SidebarMenu className="">
              {/* ✅ Inline Input (same behavior as projects) */}
              {showNewTag && (
                <div className="px-2 py-1 flex flex-col  gap-2 group-data-[collapsible=icon]:hidden">
                  <Input
                    type="text"
                    placeholder="Tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addTag();
                      if (e.key === "Escape") setShowNewTag(false);
                    }}
                    className="h-8 flex-1"
                    autoFocus
                  />

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowNewTag(false)}
                      disabled={!newTagName.trim()}
                      className="h-8 px-3 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addTag}
                      disabled={!newTagName.trim()}
                      className="h-8 px-3 text-xs"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}

              {/* ✅ Existing Tags */}
              {tags.map((tag, index) => {
                const Icon = tag.icon;
                return (
                  <SidebarMenuItem key={index} className="">
                    <SidebarMenuButton
                      className=""
                      isActive={activeFilter === tag.name}
                      onClick={() =>
                        setActiveFilter(
                          activeFilter === tag.name ? "all" : tag.name
                        )
                      }
                      tooltip={tag.name}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tag.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu className="">
          <SidebarMenuItem className="">
            <SidebarMenuButton className="" tooltip="Recycle bin">
              <Trash2 className="w-4 h-4" />
              <span>Recycle bin</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// Main Page Component
export default function KeepablePage() {
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState([""]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<number | null>(null);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

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

  const addToProject = (id: number) => {
    setProjects((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPinned: !b.isPinned } : b))
    );
    setOpenMenuId(null);
  };

  const openEditDialog = (bookmark: any) => {
    setEditingBookmark(bookmark.id);
    setEditTags(bookmark.tags);
    setOpenMenuId(null);
  };

  const saveEditedTags = () => {
    console.log(editTags);
    if (editTags.map((t) => t.trim()).includes("")) return;
    setBookmarks((prev) =>
      prev.map((b) => (b.id === editingBookmark ? { ...b, tags: editTags } : b))
    );
    setEditingBookmark(null);
    setOpenMenuId(null);
  };

  const toggleEditTag = (tagName: string) => {
    console.log(tagName);
    setEditTags((prev) =>
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

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };
  const [tags, setTags] = useState([
    { id: 1, name: "Read later", icon: Bookmark },
    { id: 2, name: "Learning", icon: Book },
    { id: 3, name: "Tools", icon: Wrench },
    { id: 4, name: "Inspiration", icon: Lightbulb },
  ]);
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);

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
        />

        <main className="flex-1 flex flex-col bg-amber-50/30">
          {/* Header with Trigger and User Avatar */}
          <header className="flex items-center justify-between p-4 md:px-8">
            <SidebarTrigger className="md:hidden" onClick={() => {}} />
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
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 ">
                  {pinnedBookmarks.map((bookmark) => (
                    <motion.a
                      key={bookmark.id}
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 group"
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
                              onClick={() => addToProject(bookmark.id)}
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
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">Edit tags</h3>

                <div className="space-y-2 mb-6">
                  {tags.map((tag) => {
                    const Icon = tag.icon;
                    const isSelected = editTags.includes(tag.name);
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
                    onClick={() => saveEditedTags()}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4"
                  >
                    Apply tags
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
