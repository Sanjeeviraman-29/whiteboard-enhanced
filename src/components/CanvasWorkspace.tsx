import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  MousePointer2, 
  Square, 
  Circle, 
  Type, 
  Image, 
  Undo2, 
  Redo2,
  ZoomIn,
  ZoomOut,
  Move3D,
  Layers,
  Settings,
  Save,
  Share2,
  Bot
} from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { Toolbar } from './Toolbar';

interface CanvasWorkspaceProps {
  projectType: any;
  onBack: () => void;
}

export function CanvasWorkspace({ projectType, onBack }: CanvasWorkspaceProps) {
  const [selectedTool, setSelectedTool] = useState('select');
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef<HTMLDivElement>(null);

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'image', icon: Image, label: 'Image' },
  ];

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));

  return (
    <div className="h-screen bg-gradient-canvas flex flex-col overflow-hidden">
      {/* Header */}
      <header className="glass border-b border-glass-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back
          </Button>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${projectType.gradient} flex items-center justify-center`}>
              <projectType.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">{projectType.name} Project</h1>
              <p className="text-xs text-muted-foreground">Untitled Canvas</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Redo2 className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-glass-border mx-2" />
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="default" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with Tools */}
        <div className="w-20 glass border-r border-glass-border">
          <Toolbar 
            tools={tools}
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Canvas Controls */}
          <div className="absolute top-4 left-4 z-10">
            <Card className="glass p-2 flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-mono min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-glass-border mx-1" />
              <Button variant="ghost" size="icon">
                <Move3D className="w-4 h-4" />
              </Button>
            </Card>
          </div>

          {/* Layer Panel Toggle */}
          <div className="absolute top-4 right-4 z-10">
            <Card className="glass p-2 flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Layers className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                variant={showAIAssistant ? "ai" : "ghost"} 
                size="icon"
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="relative"
              >
                <Bot className="w-4 h-4" />
                {showAIAssistant && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-ai-primary rounded-full animate-pulse" />
                )}
              </Button>
            </Card>
          </div>

          {/* Canvas */}
          <div 
            ref={canvasRef}
            className="w-full h-full canvas-grid bg-canvas relative overflow-auto"
            style={{ 
              backgroundSize: `${zoom}px ${zoom}px`,
              cursor: selectedTool === 'select' ? 'default' : 'crosshair'
            }}
          >
            {/* Infinite canvas content would go here */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="glass rounded-2xl p-8 text-center max-w-md">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${projectType.gradient} flex items-center justify-center mx-auto mb-4`}>
                  <projectType.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Create</h3>
                <p className="text-muted-foreground text-sm">
                  Start by selecting a tool from the left sidebar. Your AI assistant is ready to help!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <AIAssistant 
          isVisible={showAIAssistant}
          projectType={projectType}
          currentTool={selectedTool}
          onClose={() => setShowAIAssistant(false)}
        />
      </div>
    </div>
  );
}