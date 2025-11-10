import { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { Loading } from '@/components/Loading';
import { getPrompt, createPrompt, updatePrompt } from '@/api/prompts';
import { useToast } from '@/components/ui/use-toast';

interface ContextType {
  currentTeamId?: string;
}

export function PromptEditor() {
  const { promptId } = useParams<{ promptId: string }>();
  const { currentTeamId } = useOutletContext<ContextType>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const isNew = promptId === 'new';

  useEffect(() => {
    if (promptId && !isNew) {
      loadPrompt();
    }
  }, [promptId]);

  const loadPrompt = async () => {
    if (!promptId || isNew) return;

    setLoading(true);
    try {
      const data = await getPrompt(promptId);
      setTitle(data.title);
      setBody(data.body_md);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/app');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    if (!currentTeamId && isNew) {
      toast({
        title: 'Error',
        description: 'Please select a team',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const created = await createPrompt({
          team_id: currentTeamId!,
          title,
          body_md: body,
        });
        toast({
          title: 'Success',
          description: 'Prompt created',
        });
        navigate(`/app/p/${created.id}`);
      } else {
        await updatePrompt(promptId!, {
          title,
          body_md: body,
        });
        toast({
          title: 'Success',
          description: 'Prompt updated',
        });
        navigate(`/app/p/${promptId}`);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-muted/40 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(isNew ? '/app' : `/app/p/${promptId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{isNew ? 'New Prompt' : 'Edit Prompt'}</h1>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter prompt title..."
              maxLength={140}
            />
          </div>

          <Tabs defaultValue="edit" className="flex-1">
            <TabsList>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="mt-4 h-[500px]">
              <MarkdownEditor value={body} onChange={setBody} />
            </TabsContent>
            <TabsContent value="preview" className="mt-4">
              <div className="border rounded-lg p-6 min-h-[500px]">
                <MarkdownViewer content={body} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
