import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export function DragAndDropHelp() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Info className="h-4 w-4" />
            <span>Drag & Drop</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">Organize with Drag & Drop</p>
            <ul className="space-y-1 text-sm">
              <li>• Drag prompts to folders in the sidebar</li>
              <li>• Drop on folder badges to organize</li>
              <li>• Drop zones appear when dragging</li>
              <li>• Works with both mouse and touch</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
