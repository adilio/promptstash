import { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PromptCard } from '@/components/PromptCard';
import { PromptCardSkeleton } from '@/components/PromptCardSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { Loading } from '@/components/Loading';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { listPrompts, deletePrompt } from '@/api/prompts';
import { useToast } from '@/components/ui/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import type { Prompt } from '@/lib/types';

interface ContextType {
  currentTeamId?: string;
}

export function Dashboard() {
  const { currentTeamId } = useOutletContext<ContextType>();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useKeyboardShortcut({
    key: 'n',
    ctrlKey: true,
    callback: () => navigate('/app/p/new'),
  });

  useKeyboardShortcut({
    key: 'k',
    ctrlKey: true,
    callback: () => searchInputRef.current?.focus(),
  });

  useEffect(() => {
    if (currentTeamId) {
      loadPrompts();
    }
  }, [currentTeamId, debouncedSearchQuery]);

  const loadPrompts = async () => {
    if (!currentTeamId) return;

    setLoading(true);
    try {
      const data = await listPrompts(currentTeamId, undefined, debouncedSearchQuery);
      setPrompts(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePromptId) return;

    try {
      await deletePrompt(deletePromptId);
      setPrompts((prev) => prev.filter((p) => p.id !== deletePromptId));
      toast({
        title: 'Success',
        description: 'Prompt deleted',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeletePromptId(null);
    }
  };

  const togglePromptSelection = (promptId: string) => {
    setSelectedPrompts((prev) => {
      const next = new Set(prev);
      if (next.has(promptId)) {
        next.delete(promptId);
      } else {
        next.add(promptId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedPrompts.size === prompts.length) {
      setSelectedPrompts(new Set());
    } else {
      setSelectedPrompts(new Set(prompts.map((p) => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPrompts.size === 0) return;

    try {
      await Promise.all(
        Array.from(selectedPrompts).map((id) => deletePrompt(id))
      );
      setPrompts((prev) => prev.filter((p) => !selectedPrompts.has(p.id)));
      setSelectedPrompts(new Set());
      setBulkMode(false);
      toast({
        title: 'Success',
        description: `${selectedPrompts.size} prompt(s) deleted`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-muted/40 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage your prompts and organize them into folders
            </p>
          </div>
          <div className="flex gap-2">
            {bulkMode && selectedPrompts.size > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {selectedPrompts.size}
              </Button>
            )}
            <ExportImportDialog teamId={currentTeamId!} onImportComplete={loadPrompts} />
            <Button
              variant={bulkMode ? "secondary" : "outline"}
              onClick={() => {
                setBulkMode(!bulkMode);
                setSelectedPrompts(new Set());
              }}
            >
              {bulkMode ? 'Cancel' : 'Select'}
            </Button>
            <Button onClick={() => navigate('/app/p/new')}>
              <Plus className="mr-2 h-4 w-4" />
              New Prompt
            </Button>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <Input
              ref={searchInputRef}
              placeholder="Search prompts... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {showFilters && (
            <div className="p-4 border rounded-lg bg-muted/20 space-y-3">
              {/* Folder Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Folder</label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedFolder === null ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedFolder(null)}
                  >
                    All Folders
                  </Badge>
                  {folders.map((folder) => (
                    <Badge
                      key={folder.id}
                      variant={selectedFolder === folder.id ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedFolder(folder.id)}
                    >
                      {folder.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedTags((prev) =>
                          prev.includes(tag.id)
                            ? prev.filter((id) => id !== tag.id)
                            : [...prev, tag.id]
                        );
                      }}
                    >
                      {tag.name}
                      {selectedTags.includes(tag.id) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedFolder || selectedTags.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFolder(null);
                    setSelectedTags([]);
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PromptCardSkeleton key={i} />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No prompts yet"
            description="Create your first prompt to get started"
            action={{
              label: 'New Prompt',
              onClick: () => navigate('/app/p/new'),
            }}
          />
        ) : (
          <div>
            {bulkMode && (
              <div className="mb-4 flex items-center gap-2">
                <Checkbox
                  checked={selectedPrompts.size === prompts.length}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  {selectedPrompts.size === prompts.length ? 'Deselect' : 'Select'} all
                </span>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {prompts.map((prompt) => (
                <div key={prompt.id} className="relative">
                  {bulkMode && (
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedPrompts.has(prompt.id)}
                        onCheckedChange={() => togglePromptSelection(prompt.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                  <PromptCard
                    prompt={prompt}
                    onEdit={(p) => navigate(`/app/p/${p.id}/edit`)}
                    onDelete={(p) => setDeletePromptId(p.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deletePromptId}
        onOpenChange={(open) => !open && setDeletePromptId(null)}
        title="Delete Prompt"
        description="Are you sure you want to delete this prompt? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
      />
    </div>
  );
}
