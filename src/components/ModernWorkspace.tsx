import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService, Project as APIProject } from "../services/api";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Slider } from "./ui/slider";
import { 
  Home, 
  Infinity, 
  Save, 
  Download, 
  Undo, 
  Redo, 
  Palette, 
  Brush, 
  Type, 
  Square, 
  Circle, 
  Move, 
  Zap,
  Video,
  Camera,
  Layers,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Crop,
  RotateCw,
  Filter,
  Contrast,
  Sun,
  Eye,
  PenTool,
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  Grid,
  AlignLeft,
  AlignCenter,
  Bold,
  Italic,
  Underline,
  Sparkles,
  Brain,
  Wand2,
  Image as ImageIcon,
  Upload,
  Scissors,
  Copy,
  Trash2
} from "lucide-react";

// Use API Project type
type Project = APIProject;

interface CanvasElement {
  id: string;
  type: 'rectangle' | 'circle' | 'text' | 'image' | 'brush' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  properties: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    imageUrl?: string;
    points?: { x: number; y: number }[];
  };
}

const ModernWorkspace: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'canvas' | 'video' | 'photo' | 'design'>('canvas');
  const [selectedTool, setSelectedTool] = useState<string>('pen');
  const [strokeColor, setStrokeColor] = useState('#3b82f6');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [fillColor, setFillColor] = useState('#93c5fd');
  const [fontSize, setFontSize] = useState(16);
  const [currentProject, setCurrentProject] = useState<Project>({
    id: '1',
    name: 'Untitled Project',
    type: 'canvas',
    lastModified: new Date()
  });

  // Canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Video editing state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);

  // Photo editing state
  const photoRef = useRef<HTMLImageElement>(null);
  const [photoSrc, setPhotoSrc] = useState<string>('');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);

  // Design components
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  
  const tools = {
    canvas: [
      { id: 'pen', icon: Brush, label: 'Brush' },
      { id: 'eraser', icon: Brush, label: 'Eraser' },
      { id: 'text', icon: Type, label: 'Text' },
      { id: 'rectangle', icon: Square, label: 'Rectangle' },
      { id: 'circle', icon: Circle, label: 'Circle' },
      { id: 'line', icon: PenTool, label: 'Line' },
      { id: 'move', icon: Move, label: 'Move' },
      { id: 'ai-enhance', icon: Sparkles, label: 'AI Enhance' },
    ],
    video: [
      { id: 'cut', icon: Scissors, label: 'Cut' },
      { id: 'copy', icon: Copy, label: 'Copy' },
      { id: 'crop', icon: Crop, label: 'Crop' },
      { id: 'transition', icon: Zap, label: 'Transition' },
      { id: 'text-overlay', icon: Type, label: 'Text' },
      { id: 'ai-generate', icon: Brain, label: 'AI Generate' },
    ],
    photo: [
      { id: 'crop', icon: Crop, label: 'Crop' },
      { id: 'rotate', icon: RotateCw, label: 'Rotate' },
      { id: 'filter', icon: Filter, label: 'Filter' },
      { id: 'adjust', icon: Contrast, label: 'Adjust' },
      { id: 'heal', icon: Wand2, label: 'Heal' },
      { id: 'ai-enhance', icon: Sparkles, label: 'AI Enhance' },
    ],
    design: [
      { id: 'select', icon: MousePointer, label: 'Select' },
      { id: 'frame', icon: Square, label: 'Frame' },
      { id: 'text', icon: Type, label: 'Text' },
      { id: 'component', icon: Layers, label: 'Component' },
      { id: 'grid', icon: Grid, label: 'Grid' },
      { id: 'ai-layout', icon: Brain, label: 'AI Layout' },
    ]
  };

  // Backend API functions
  const saveProject = async (project: Project) => {
    try {
      const result = await apiService.saveProject(project);
      if (result.success) {
        console.log('Project saved successfully');
        // Track usage for analytics
        await apiService.trackUsage('project_saved', {
          projectType: project.type,
          elementCount: elements.length
        });
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const loadProject = async (projectId: string) => {
    try {
      const project = await apiService.loadProject(projectId);
      setCurrentProject(project);
      if (project.elements) {
        setElements(project.elements);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  };

  // AI integration functions
  const enhanceWithAI = async (elements: CanvasElement[]) => {
    try {
      const response = await apiService.enhanceWithAI(elements, activeMode);
      if (response.success) {
        // Show AI suggestions to user
        if (response.suggestions) {
          console.log('AI Suggestions:', response.suggestions);
        }
        return response.data.elements || elements;
      }
    } catch (error) {
      console.error('AI enhancement failed:', error);
    }
    return elements;
  };

  const generateAIContent = async (prompt: string, type: string) => {
    try {
      const response = await apiService.generateAIContent(prompt, type);
      if (response.success) {
        await apiService.trackUsage('ai_content_generated', {
          type,
          prompt: prompt.substring(0, 50)
        });
        return response.data.content;
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    }
    return null;
  };

  const getAISuggestions = async () => {
    try {
      const context = {
        mode: activeMode,
        elements: elements.slice(0, 10), // Send limited context
        projectType: currentProject.type
      };
      const response = await apiService.getAISuggestions(context);
      if (response.success && response.data.suggestions) {
        return response.data.suggestions;
      }
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
    }
    return [];
  };

  // Canvas functions
  const getCanvasPosition = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    const pos = getCanvasPosition(e);
    setIsDrawing(true);
    setLastPos(pos);

    if (selectedTool === 'rectangle' || selectedTool === 'circle') {
      const newElement: CanvasElement = {
        id: Date.now().toString(),
        type: selectedTool,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        properties: {
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth
        }
      };
      setElements(prev => [...prev, newElement]);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !lastPos) return;
    
    const pos = getCanvasPosition(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    if (selectedTool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    setLastPos(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);

    // Save to history
    setHistory(prev => [...prev.slice(0, historyStep + 1), elements]);
    setHistoryStep(prev => prev + 1);

    // Auto-save project
    const updatedProject = {
      ...currentProject,
      elements,
      lastModified: new Date()
    };
    setCurrentProject(updatedProject);
    saveProject(updatedProject);
  };

  // AI-specific functions
  const handleAIEnhance = async () => {
    if (elements.length === 0) {
      alert('Add some elements to the canvas first!');
      return;
    }

    const enhanced = await enhanceWithAI(elements);
    if (enhanced && enhanced !== elements) {
      setElements(enhanced);
      // Save to history
      setHistory(prev => [...prev.slice(0, historyStep + 1), enhanced]);
      setHistoryStep(prev => prev + 1);
    }
  };

  const handleAIGenerate = async () => {
    const prompt = window.prompt('Describe what you want to create:');
    if (!prompt) return;

    const content = await generateAIContent(prompt, activeMode);
    if (content) {
      // Add generated content to canvas
      if (content.url) {
        const newElement: CanvasElement = {
          id: Date.now().toString(),
          type: 'image',
          x: 50,
          y: 50,
          width: content.dimensions?.width || 200,
          height: content.dimensions?.height || 200,
          properties: {
            imageUrl: content.url
          }
        };
        setElements(prev => [...prev, newElement]);
      }
    }
  };

  const handleAISuggestions = async () => {
    const suggestions = await getAISuggestions();
    if (suggestions.length > 0) {
      const suggestionText = suggestions.join('\n• ');
      alert(`AI Suggestions:\n\n• ${suggestionText}`);
    }
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(prev => prev - 1);
      setElements(history[historyStep - 1]);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(prev => prev + 1);
      setElements(history[historyStep + 1]);
    }
  };

  // Video functions
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await apiService.uploadMedia(file, 'video');
        setVideoSrc(result.url);
        await apiService.trackUsage('video_uploaded', {
          size: file.size,
          duration: result.metadata?.duration
        });
      } catch (error) {
        // Fallback to local URL
        const url = URL.createObjectURL(file);
        setVideoSrc(url);
      }
    }
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Photo functions
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await apiService.uploadMedia(file, 'image');
        setPhotoSrc(result.url);
        await apiService.trackUsage('photo_uploaded', {
          size: file.size,
          dimensions: `${result.metadata?.width}x${result.metadata?.height}`
        });
      } catch (error) {
        // Fallback to local URL
        const url = URL.createObjectURL(file);
        setPhotoSrc(url);
      }
    }
  };

  const applyPhotoFilters = () => {
    const photo = photoRef.current;
    if (!photo) return;
    
    photo.style.filter = `
      brightness(${brightness}%) 
      contrast(${contrast}%) 
      saturate(${saturation}%) 
      blur(${blur}px)
    `;
  };

  useEffect(() => {
    applyPhotoFilters();
  }, [brightness, contrast, saturation, blur]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear and set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Infinity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">InfiniteCanvas</span>
            </Link>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <input 
              type="text"
              value={currentProject.name}
              onChange={(e) => setCurrentProject(prev => ({ ...prev, name: e.target.value }))}
              className="text-lg font-semibold bg-transparent border-none outline-none text-gray-900"
              onBlur={() => saveProject(currentProject)}
            />
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {activeMode.charAt(0).toUpperCase() + activeMode.slice(1)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={historyStep <= 0}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={historyStep >= history.length - 1}>
              <Redo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => saveProject(currentProject)}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tools */}
        <div className="w-20 bg-white/90 backdrop-blur-md border-r border-gray-200 flex flex-col items-center py-4 gap-2">
          {tools[activeMode].map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              className={`w-12 h-12 flex flex-col items-center gap-1 text-xs ${
                tool.id.includes('ai-') ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' : ''
              }`}
              onClick={() => {
                if (tool.id === 'ai-enhance') {
                  handleAIEnhance();
                } else if (tool.id === 'ai-generate') {
                  handleAIGenerate();
                } else if (tool.id === 'ai-layout') {
                  handleAISuggestions();
                } else {
                  setSelectedTool(tool.id);
                }
              }}
              title={tool.label}
            >
              <tool.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col">
          {/* Mode Tabs */}
          <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)} className="border-b border-gray-200">
            <TabsList className="h-12 bg-transparent border-0 p-0">
              <TabsTrigger value="canvas" className="flex items-center gap-2 px-6 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                <Brush className="w-4 h-4" />
                AI Canvas
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2 px-6 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                <Video className="w-4 h-4" />
                Video Editor
              </TabsTrigger>
              <TabsTrigger value="photo" className="flex items-center gap-2 px-6 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                <Camera className="w-4 h-4" />
                Photo Editor
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2 px-6 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                <Layers className="w-4 h-4" />
                UI/UX Design
              </TabsTrigger>
            </TabsList>

            {/* Canvas Workspace */}
            <TabsContent value="canvas" className="flex-1 p-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex">
                <div className="flex-1 relative">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  
                  {/* AI Suggestions Overlay */}
                  {selectedTool === 'ai-enhance' && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        <span className="text-sm font-medium">AI Enhancement Active</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Video Editor Workspace */}
            <TabsContent value="video" className="flex-1 p-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
                <div className="flex-1 bg-gray-900 flex items-center justify-center relative">
                  {videoSrc ? (
                    <video
                      ref={videoRef}
                      src={videoSrc}
                      className="max-w-full max-h-full"
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                      onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Video className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg mb-4">Upload a video to start editing</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        id="video-upload"
                      />
                      <label htmlFor="video-upload">
                        <Button className="bg-blue-600 text-white">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Video
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
                
                {videoSrc && (
                  <div className="p-4 border-t border-gray-200">
                    {/* Video Controls */}
                    <div className="flex items-center gap-4 mb-4">
                      <Button variant="outline" size="sm" onClick={togglePlayPause}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <SkipForward className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        <Slider
                          value={[volume]}
                          onValueChange={(value) => setVolume(value[0])}
                          max={100}
                          step={1}
                          className="w-20"
                        />
                      </div>
                    </div>
                    
                    {/* Timeline */}
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded opacity-80">
                        <div className="flex items-center justify-center h-full text-white text-sm">
                          Video Timeline - {Math.floor(currentTime)}s / {Math.floor(duration)}s
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Photo Editor Workspace */}
            <TabsContent value="photo" className="flex-1 p-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex">
                <div className="flex-1 bg-gray-900 flex items-center justify-center relative">
                  {photoSrc ? (
                    <img
                      ref={photoRef}
                      src={photoSrc}
                      alt="Edit"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg mb-4">Upload a photo to start editing</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload">
                        <Button className="bg-blue-600 text-white">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photo
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
                
                {photoSrc && (
                  <div className="w-80 bg-gray-50 p-4 border-l border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Adjustments</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <Sun className="w-4 h-4" />
                          Brightness
                        </label>
                        <Slider
                          value={[brightness]}
                          onValueChange={(value) => setBrightness(value[0])}
                          min={0}
                          max={200}
                          step={1}
                        />
                        <span className="text-xs text-gray-500">{brightness}%</span>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <Contrast className="w-4 h-4" />
                          Contrast
                        </label>
                        <Slider
                          value={[contrast]}
                          onValueChange={(value) => setContrast(value[0])}
                          min={0}
                          max={200}
                          step={1}
                        />
                        <span className="text-xs text-gray-500">{contrast}%</span>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <Palette className="w-4 h-4" />
                          Saturation
                        </label>
                        <Slider
                          value={[saturation]}
                          onValueChange={(value) => setSaturation(value[0])}
                          min={0}
                          max={200}
                          step={1}
                        />
                        <span className="text-xs text-gray-500">{saturation}%</span>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <Eye className="w-4 h-4" />
                          Blur
                        </label>
                        <Slider
                          value={[blur]}
                          onValueChange={(value) => setBlur(value[0])}
                          min={0}
                          max={10}
                          step={0.1}
                        />
                        <span className="text-xs text-gray-500">{blur}px</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Enhance
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* UI/UX Design Workspace */}
            <TabsContent value="design" className="flex-1 p-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex">
                <div className="flex-1 bg-gray-50 flex items-center justify-center relative">
                  <div className="w-80 h-96 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Layers className="w-12 h-12 mx-auto mb-3" />
                      <p className="text-lg font-medium">Design Canvas</p>
                      <p className="text-sm">Start creating your UI/UX design</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-80 bg-gray-50 p-4 border-l border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Components</h3>
                  
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <Card className="p-3 cursor-pointer hover:bg-blue-50 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <Square className="w-6 h-6 text-blue-600" />
                        <span className="text-xs font-medium">Button</span>
                      </div>
                    </Card>
                    <Card className="p-3 cursor-pointer hover:bg-blue-50 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <Type className="w-6 h-6 text-blue-600" />
                        <span className="text-xs font-medium">Text</span>
                      </div>
                    </Card>
                    <Card className="p-3 cursor-pointer hover:bg-blue-50 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="w-6 h-6 text-blue-600" />
                        <span className="text-xs font-medium">Image</span>
                      </div>
                    </Card>
                    <Card className="p-3 cursor-pointer hover:bg-blue-50 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <Layers className="w-6 h-6 text-blue-600" />
                        <span className="text-xs font-medium">Card</span>
                      </div>
                    </Card>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Font Size
                      </label>
                      <Slider
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                        min={8}
                        max={72}
                        step={1}
                      />
                      <span className="text-xs text-gray-500">{fontSize}px</span>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={strokeColor}
                          onChange={(e) => setStrokeColor(e.target.value)}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={strokeColor}
                          onChange={(e) => setStrokeColor(e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Brain className="w-4 h-4 mr-2" />
                    AI Layout Suggest
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white/90 backdrop-blur-md border-l border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Stroke Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Fill Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Stroke Width
              </label>
              <Slider
                value={[strokeWidth]}
                onValueChange={(value) => setStrokeWidth(value[0])}
                min={1}
                max={20}
                step={1}
              />
              <span className="text-xs text-gray-500">{strokeWidth}px</span>
            </div>
          </div>
          
          {/* AI Assistant Panel */}
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-purple-900">AI Assistant</h4>
            </div>
            <p className="text-sm text-purple-700 mb-3">
              Get intelligent suggestions for your current project
            </p>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm"
              onClick={handleAISuggestions}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get AI Suggestions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernWorkspace;
