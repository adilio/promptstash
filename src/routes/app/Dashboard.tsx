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
          <Button onClick={() => navigate('/app/p/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>
        <div className="mt-4">
          <Input
            ref={searchInputRef}
            placeholder="Search prompts... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onEdit={(p) => navigate(`/app/p/${p.id}/edit`)}
                onDelete={(p) => setDeletePromptId(p.id)}
              />
            ))}
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
