"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Bookmark,
  FolderOpen,
  Trash2,
  LayoutGrid,
  Minus,
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
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Sidebar Component
export function AppSidebar({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  tags,
  setTags,
  projects,
  setProjects,
  bookmarks,
  clearAllData,
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
  bookmarks: any;
  clearAllData: () => void;
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
            <img src="/logo.svg" alt="logo" className="w-6 h-6" />
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

              {projects.map((project) => {
                // Get bookmarks in this project
                const projectBookmarks = bookmarks.filter((bookmark) =>
                  bookmark.projects?.some((p) => p.id === project.id)
                );

                return (
                  <SidebarMenuItem key={project.id} className="">
                    <SidebarMenuButton tooltip={project.name} className="">
                      <FolderOpen className="w-4 h-4" />
                      <span>{project.name}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {projectBookmarks.length}
                      </span>
                    </SidebarMenuButton>
                    {/* Optional: Show bookmark list when expanded */}
                    {projectBookmarks.length > 0 && (
                      <div className="ml-6 mt-1 text-xs text-gray-600">
                        {projectBookmarks.map((b) => b.title).join(", ")}
                      </div>
                    )}
                  </SidebarMenuItem>
                );
              })}
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

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu className="flex justify-center">
          <SidebarMenuItem className="w-full">
            <SidebarMenuButton
              tooltip="Clear all data"
              className="
          group
          w-full
          text-muted-foreground
          hover:text-red-600
          hover:bg-red-50 
          transition-colors
        "
              onClick={() => {
                toast.error("Clear all links?", {
                  description:
                    "This will permanently remove all bookmarks, tags, and folders.",
                  action: {
                    label: "Clear",
                    onClick: () => {
                      clearAllData();
                      toast.success("All data cleared");
                    },
                  },
                  cancel: {
                    label: "Cancel",
                    onClick: () => {},
                  },
                });
              }}
            >
              <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />

              <span className="font-medium">Clear all links</span>

              <span className="ml-auto text-xs text-red-500 opacity-70">
                irreversible
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
