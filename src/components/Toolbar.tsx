import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Tool {
  id: string;
  icon: any;
  label: string;
}

interface ToolbarProps {
  tools: Tool[];
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

export function Toolbar({ tools, selectedTool, onToolSelect }: ToolbarProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 p-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isSelected = selectedTool === tool.id;
          
          return (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={isSelected ? "default" : "tool"}
                  size="tool"
                  onClick={() => onToolSelect(tool.id)}
                  className={`
                    relative transition-all duration-200
                    ${isSelected ? 'shadow-ai' : ''}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {isSelected && (
                    <div className="absolute -right-1 -top-1 w-3 h-3 bg-primary rounded-full" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="glass border-glass-border">
                <p className="text-sm">{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}