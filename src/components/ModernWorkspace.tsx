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
  type: 'rectangle' | 'circle' | 'text' | 'image' | 'brush' | 'line' | 'annotation' | 'flow';
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
    annotationType?: 'note' | 'arrow' | 'highlight';
    flowType?: 'sequence' | 'decision' | 'process';
    targetId?: string;
  };
}

interface StoryboardFrame {
  id: string;
  title: string;
  elements: CanvasElement[];
  thumbnail?: string;
  duration?: number;
  notes?: string;
}

interface FlowConnection {
  id: string;
  fromFrameId: string;
  toFrameId: string;
  label?: string;
  type: 'sequence' | 'decision' | 'parallel';
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
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoTrim, setVideoTrim] = useState({ start: 0, end: 0 });
  const [videoFilters, setVideoFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sepia: 0
  });

  // Photo editing state
  const photoRef = useRef<HTMLImageElement>(null);
  const [photoSrc, setPhotoSrc] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [hue, setHue] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [invert, setInvert] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);

  // Design components
  const [selectedComponent, setSelectedComponent] = useState<string>('');

  // Removed storyboarding state for cleaner interface

  // AI Auto-complete state
  const [isAIAutoComplete, setIsAIAutoComplete] = useState(false);
  const [incompleteShapes, setIncompleteShapes] = useState<CanvasElement[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<CanvasElement[]>([]);

  // Text to Image state
  const [textToImagePrompt, setTextToImagePrompt] = useState('');
  
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
      { id: 'ai-complete', icon: Brain, label: 'AI Complete' },
      { id: 'text-to-image', icon: ImageIcon, label: 'Text→Image' },
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
  const saveProject = (project: Project) => {
    // Save only to localStorage - no network operations
    localStorage.setItem(`project-${project.id}`, JSON.stringify(project));
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
  // Removed the old enhanceWithAI function that was causing fetch errors

  // Removed the old generateAIContent function - now using local text-to-image generation

  const getAISuggestions = () => {
    // Local AI suggestions - no network requests
    const suggestions = [
      'Try adding more visual hierarchy to your design',
      'Consider using complementary colors for better contrast',
      'Add some spacing between elements for better readability',
      'Use consistent typography throughout your design',
      'Apply AI enhance to improve colors and visibility',
      'Try the auto-complete feature to finish incomplete shapes',
      'Use text-to-image to generate creative elements'
    ];

    // Return contextual suggestions based on current elements
    if (elements.length === 0) {
      return ['Start by drawing some shapes or adding text to get AI suggestions!'];
    }

    const hasText = elements.some(el => el.type === 'text');
    const hasShapes = elements.some(el => el.type === 'rectangle' || el.type === 'circle');

    if (!hasText && hasShapes) {
      return ['Consider adding text labels to your shapes', ...suggestions.slice(0, 3)];
    }

    if (!hasShapes && hasText) {
      return ['Try adding some shapes to complement your text', ...suggestions.slice(0, 3)];
    }

    return suggestions.slice(0, 4);
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
    } else if (selectedTool === 'line') {
      const lineElement: CanvasElement = {
        id: Date.now().toString(),
        type: 'line',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        properties: {
          stroke: strokeColor,
          strokeWidth: strokeWidth
        }
      };
      setElements(prev => [...prev, lineElement]);
    } else if (selectedTool === 'text') {
      const textElement: CanvasElement = {
        id: Date.now().toString(),
        type: 'text',
        x: pos.x,
        y: pos.y,
        width: 100,
        height: 20,
        properties: {
          text: 'Click to edit',
          fontSize: fontSize,
          fill: strokeColor,
          fontFamily: 'Arial, sans-serif'
        }
      };
      setElements(prev => [...prev, textElement]);
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

  const stopDrawing = (e?: React.MouseEvent) => {
    if (selectedTool === 'line' && lastPos && e) {
      const pos = getCanvasPosition(e);
      // Update the last line element with final dimensions
      setElements(prev => {
        const newElements = [...prev];
        if (newElements.length > 0) {
          const lastElement = newElements[newElements.length - 1];
          if (lastElement.type === 'line') {
            lastElement.width = pos.x - lastElement.x;
            lastElement.height = pos.y - lastElement.y;
          }
        }
        return newElements;
      });
    }

    setIsDrawing(false);
    setLastPos(null);

    // Save current state to history for undo/redo
    const newHistory = [...history.slice(0, historyStep + 1), [...elements]];
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);

    // Update project
    const updatedProject = {
      ...currentProject,
      elements,
      lastModified: new Date()
    };
    setCurrentProject(updatedProject);

    // Save to localStorage only (no network requests)
    localStorage.setItem(`project-${updatedProject.id}`, JSON.stringify(updatedProject));
  };

  // Removed storyboarding functions for cleaner interface

  // AI-specific functions
  const handleAIEnhance = () => {
    if (elements.length === 0) {
      alert('Add some elements to the canvas first!');
      return;
    }

    // AI enhance works locally - no network requests
    const enhanced = enhanceElementsLocally(elements);
    if (enhanced && enhanced.length > 0) {
      setElements(enhanced);
      // Save to history
      setHistory(prev => [...prev.slice(0, historyStep + 1), enhanced]);
      setHistoryStep(prev => prev + 1);
      alert('✨ AI Enhanced your drawing with improved colors and layout!');
    }
  };

  // Local AI enhancement function
  const enhanceElementsLocally = (currentElements: CanvasElement[]): CanvasElement[] => {
    return currentElements.map(element => {
      const enhanced = { ...element };

      // Enhance colors to be more vibrant
      if (enhanced.properties.fill) {
        enhanced.properties.fill = enhanceColor(enhanced.properties.fill);
      }
      if (enhanced.properties.stroke) {
        enhanced.properties.stroke = enhanceColor(enhanced.properties.stroke);
      }

      // Improve stroke width for better visibility
      if (enhanced.properties.strokeWidth && enhanced.properties.strokeWidth < 2) {
        enhanced.properties.strokeWidth = 2;
      }

      // Enhance text readability
      if (enhanced.type === 'text') {
        if (enhanced.properties.fontSize && enhanced.properties.fontSize < 14) {
          enhanced.properties.fontSize = 14;
        }
        if (enhanced.properties.fill === '#ffffff' || enhanced.properties.fill === 'white') {
          enhanced.properties.fill = '#000000'; // Make white text black for readability
        }
      }

      return enhanced;
    });
  };

  // Helper function to enhance colors
  const enhanceColor = (color: string): string => {
    // Simple color enhancement - make colors more vibrant
    const colorMap: Record<string, string> = {
      '#000000': '#2c3e50', // Dark blue-gray instead of pure black
      '#ffffff': '#ecf0f1', // Off-white instead of pure white
      '#ff0000': '#e74c3c', // Enhanced red
      '#00ff00': '#2ecc71', // Enhanced green
      '#0000ff': '#3498db', // Enhanced blue
      '#ffff00': '#f1c40f', // Enhanced yellow
      '#ff00ff': '#9b59b6', // Enhanced magenta
      '#00ffff': '#1abc9c', // Enhanced cyan
    };

    return colorMap[color.toLowerCase()] || color;
  };

  // AI Auto-complete function
  const handleAIAutoComplete = () => {
    if (elements.length === 0) {
      alert('Draw something first for AI to complete!');
      return;
    }

    // Analyze current elements and suggest completions
    const suggestions = generateAutoCompleteSuggestions(elements);
    setAiSuggestions(suggestions);

    // Apply suggestions
    if (suggestions.length > 0) {
      const completedElements = [...elements, ...suggestions];
      setElements(completedElements);

      // Save to history
      const newHistory = [...history.slice(0, historyStep + 1), completedElements];
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);

      alert(`✨ AI completed your drawing with ${suggestions.length} new elements!`);
    }
  };

  const generateAutoCompleteSuggestions = (currentElements: CanvasElement[]): CanvasElement[] => {
    const suggestions: CanvasElement[] = [];

    // Get lines for shape completion analysis
    const lines = currentElements.filter(el => el.type === 'line');
    const rectangles = currentElements.filter(el => el.type === 'rectangle');
    const circles = currentElements.filter(el => el.type === 'circle');

    // SMART SQUARE/RECTANGLE COMPLETION
    if (lines.length >= 3) {
      const incompleteSquare = detectIncompleteSquare(lines);
      if (incompleteSquare) {
        suggestions.push({
          id: `ai-complete-square-${Date.now()}`,
          type: 'line',
          x: incompleteSquare.startX,
          y: incompleteSquare.startY,
          width: incompleteSquare.endX - incompleteSquare.startX,
          height: incompleteSquare.endY - incompleteSquare.startY,
          properties: {
            stroke: '#FF4444',
            strokeWidth: 3,
            fill: 'transparent'
          }
        });
      }
    }

    // SMART TRIANGLE COMPLETION
    if (lines.length === 2) {
      const triangleCompletion = detectIncompleteTriangle(lines);
      if (triangleCompletion) {
        suggestions.push({
          id: `ai-complete-triangle-${Date.now()}`,
          type: 'line',
          x: triangleCompletion.startX,
          y: triangleCompletion.startY,
          width: triangleCompletion.endX - triangleCompletion.startX,
          height: triangleCompletion.endY - triangleCompletion.startY,
          properties: {
            stroke: '#FF4444',
            strokeWidth: 3
          }
        });
      }
    }

    // CIRCLE TO FACE COMPLETION
    if (circles.length === 1) {
      const face = circles[0];
      const eyeSize = Math.max(8, face.width * 0.08);

      // Left eye
      suggestions.push({
        id: `ai-eye-left-${Date.now()}`,
        type: 'circle',
        x: face.x + face.width * 0.3,
        y: face.y + face.height * 0.35,
        width: eyeSize,
        height: eyeSize,
        properties: { fill: '#000000', stroke: '#000000', strokeWidth: 1 }
      });

      // Right eye
      suggestions.push({
        id: `ai-eye-right-${Date.now()}`,
        type: 'circle',
        x: face.x + face.width * 0.6,
        y: face.y + face.height * 0.35,
        width: eyeSize,
        height: eyeSize,
        properties: { fill: '#000000', stroke: '#000000', strokeWidth: 1 }
      });

      // Smile (curved line approximated)
      suggestions.push({
        id: `ai-smile-${Date.now()}`,
        type: 'line',
        x: face.x + face.width * 0.35,
        y: face.y + face.height * 0.65,
        width: face.width * 0.3,
        height: face.height * 0.1,
        properties: { stroke: '#000000', strokeWidth: 2 }
      });
    }

    // HOUSE COMPLETION
    if (rectangles.length === 1 && lines.length === 0) {
      const house = rectangles[0];
      // Add roof (triangle)
      suggestions.push({
        id: `ai-roof-1-${Date.now()}`,
        type: 'line',
        x: house.x,
        y: house.y,
        width: house.width / 2,
        height: -house.height * 0.4,
        properties: { stroke: '#8B4513', strokeWidth: 3 }
      });

      suggestions.push({
        id: `ai-roof-2-${Date.now()}`,
        type: 'line',
        x: house.x + house.width / 2,
        y: house.y - house.height * 0.4,
        width: house.width / 2,
        height: house.height * 0.4,
        properties: { stroke: '#8B4513', strokeWidth: 3 }
      });

      // Add door
      const doorWidth = house.width * 0.2;
      const doorHeight = house.height * 0.6;
      suggestions.push({
        id: `ai-door-${Date.now()}`,
        type: 'rectangle',
        x: house.x + house.width * 0.4,
        y: house.y + house.height - doorHeight,
        width: doorWidth,
        height: doorHeight,
        properties: { fill: '#654321', stroke: '#654321', strokeWidth: 2 }
      });

      // Add window
      const windowSize = house.width * 0.15;
      suggestions.push({
        id: `ai-window-${Date.now()}`,
        type: 'rectangle',
        x: house.x + house.width * 0.7,
        y: house.y + house.height * 0.3,
        width: windowSize,
        height: windowSize,
        properties: { fill: '#87CEEB', stroke: '#000000', strokeWidth: 2 }
      });
    }

    // AUTO-LABEL SHAPES
    const unlabeledShapes = currentElements.filter(el =>
      (el.type === 'rectangle' || el.type === 'circle') &&
      !currentElements.some(text => text.type === 'text' &&
        Math.abs(text.x - el.x) < 50 && Math.abs(text.y - el.y) < 50)
    );

    unlabeledShapes.forEach((shape, index) => {
      suggestions.push({
        id: `ai-label-${Date.now()}-${index}`,
        type: 'text',
        x: shape.x + shape.width / 4,
        y: shape.y + shape.height / 2,
        width: 60,
        height: 20,
        properties: {
          text: shape.type === 'circle' ? 'Circle' : 'Box',
          fontSize: 14,
          fill: '#000000',
          fontFamily: 'Arial, sans-serif'
        }
      });
    });

    return suggestions;
  };

  // Helper function to detect incomplete squares/rectangles
  const detectIncompleteSquare = (lines: CanvasElement[]) => {
    if (lines.length < 3) return null;

    // Sort lines and find potential square pattern
    const sortedLines = lines.sort((a, b) => a.x - b.x);

    // Simple heuristic: if we have 3 lines that could form 3 sides of a rectangle
    // Return the 4th side coordinates
    const firstLine = sortedLines[0];
    const lastLine = sortedLines[sortedLines.length - 1];

    // Calculate where the missing line should be
    const minX = Math.min(...lines.map(l => l.x));
    const maxX = Math.max(...lines.map(l => l.x + l.width));
    const minY = Math.min(...lines.map(l => l.y));
    const maxY = Math.max(...lines.map(l => l.y + l.height));

    // Return the missing line to complete the rectangle
    return {
      startX: minX,
      startY: maxY,
      endX: maxX,
      endY: maxY
    };
  };

  // Helper function to detect incomplete triangles
  const detectIncompleteTriangle = (lines: CanvasElement[]) => {
    if (lines.length !== 2) return null;

    const line1 = lines[0];
    const line2 = lines[1];

    // Find the endpoints
    const points = [
      { x: line1.x, y: line1.y },
      { x: line1.x + line1.width, y: line1.y + line1.height },
      { x: line2.x, y: line2.y },
      { x: line2.x + line2.width, y: line2.y + line2.height }
    ];

    // Find which points are connected and which need to be connected
    // Return coordinates for the third line
    return {
      startX: points[0].x,
      startY: points[0].y,
      endX: points[3].x,
      endY: points[3].y
    };
  };

  // Text-to-Image generation function
  const handleTextToImage = async () => {
    const prompt = window.prompt('Describe the image you want to create:\n(e.g., "A cute cartoon cat playing with a ball", "Simple house drawing", "Geometric pattern")');

    if (!prompt || prompt.trim().length === 0) {
      return;
    }

    setTextToImagePrompt(prompt);

    try {
      // Generate image based on text prompt
      const generatedImage = await generateImageFromText(prompt);

      if (generatedImage) {
        const imageElement: CanvasElement = {
          id: Date.now().toString(),
          type: 'image',
          x: 50,
          y: 50,
          width: 300,
          height: 300,
          properties: {
            imageUrl: generatedImage.url,
            text: prompt
          }
        };

        setElements(prev => [...prev, imageElement]);

        // Save to history
        const newHistory = [...history.slice(0, historyStep + 1), [...elements, imageElement]];
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);

        alert('✨ AI generated image added to canvas! You can move and resize it.');
      }
    } catch (error) {
      console.error('Text-to-image generation failed:', error);
      alert('⚠️ Image generation failed. Please try a different prompt or try again later.');
    }
  };

  const generateImageFromText = async (prompt: string): Promise<{ url: string; alt: string } | null> => {
    try {
      // For demo purposes, we'll create a placeholder based on the prompt
      // In a real implementation, this would call DALL-E, Midjourney, or Stable Diffusion API

      // Create a simple generated image placeholder
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = 400;
      canvas.height = 400;

      // Create a gradient background based on prompt keywords
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

      if (prompt.toLowerCase().includes('cat')) {
        gradient.addColorStop(0, '#ffeaa7');
        gradient.addColorStop(1, '#fab1a0');
      } else if (prompt.toLowerCase().includes('house')) {
        gradient.addColorStop(0, '#74b9ff');
        gradient.addColorStop(1, '#0984e3');
      } else if (prompt.toLowerCase().includes('geometric')) {
        gradient.addColorStop(0, '#a29bfe');
        gradient.addColorStop(1, '#6c5ce7');
      } else if (prompt.toLowerCase().includes('nature')) {
        gradient.addColorStop(0, '#00b894');
        gradient.addColorStop(1, '#00cec9');
      } else {
        gradient.addColorStop(0, '#fd79a8');
        gradient.addColorStop(1, '#fdcb6e');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some basic shapes based on prompt
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('AI Generated:', canvas.width / 2, 50);

      ctx.font = '18px Arial';
      const words = prompt.split(' ').slice(0, 4);
      words.forEach((word, index) => {
        ctx.fillText(word, canvas.width / 2, 100 + index * 30);
      });

      // Add some decorative elements
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 10 + Math.random() * 20;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Convert to blob URL
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({ url, alt: `AI generated: ${prompt}` });
          } else {
            resolve(null);
          }
        }, 'image/png');
      });

    } catch (error) {
      console.error('Image generation error:', error);
      return null;
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

  const handleAISuggestions = () => {
    const suggestions = getAISuggestions();
    if (suggestions.length > 0) {
      const suggestionText = suggestions.join('\n• ');
      alert(`💡 AI Suggestions:\n\n• ${suggestionText}`);
    }
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      setElements(history[newStep] || []);

      // Clear and redraw canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      setElements(history[newStep] || []);

      // Clear and redraw canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  };

  // Video functions
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store file reference
      setVideoFile(file);

      // Always use local URL immediately for best user experience
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      console.log('Video loaded:', file.name);

      // No background processing needed - all local

      // Reset filters and trim when new video is uploaded
      setVideoFilters({ brightness: 100, contrast: 100, saturation: 100, sepia: 0 });
      setVideoTrim({ start: 0, end: 0 });
      setCurrentTime(0);
      setIsPlaying(false);
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

  const changePlaybackSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const seekToTime = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  };

  const applyVideoFilters = () => {
    const video = videoRef.current;
    if (!video) return;

    video.style.filter = `
      brightness(${videoFilters.brightness}%)
      contrast(${videoFilters.contrast}%)
      saturate(${videoFilters.saturation}%)
      sepia(${videoFilters.sepia}%)
    `;
  };

  // Apply video filters whenever they change
  useEffect(() => {
    applyVideoFilters();
  }, [videoFilters]);

  const downloadEditedVideo = async () => {
    if (!videoSrc || !videoFile) {
      alert('No video to download. Please upload a video first.');
      return;
    }

    const video = videoRef.current;
    if (!video) {
      alert('Video not ready. Please wait for video to load.');
      return;
    }

    try {
      // Create a canvas to process video frames
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Cannot create canvas context');
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Check if any filters are applied
      const hasFilters = videoFilters.brightness !== 100 ||
                        videoFilters.contrast !== 100 ||
                        videoFilters.saturation !== 100 ||
                        videoFilters.sepia !== 0;

      if (!hasFilters) {
        // No filters applied, download original
        const link = document.createElement('a');
        link.href = videoSrc;
        link.download = `${videoFile.name}`;
        link.click();
        alert('✅ Original video downloaded (no filters were applied).');
        return;
      }

      // For filtered video, we'll create a processed frame as a demo
      // In a real implementation, this would process all frames
      alert('🎬 Processing video with filters...');

      // Capture current frame with filters applied
      video.pause();

      // Apply filters to canvas context
      ctx.filter = `
        brightness(${videoFilters.brightness}%)
        contrast(${videoFilters.contrast}%)
        saturate(${videoFilters.saturation}%)
        sepia(${videoFilters.sepia}%)
      `;

      // Draw the current video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to image and download as a preview
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const fileName = videoFile.name.replace(/\.[^/.]+$/, "");
          link.download = `edited-frame-${fileName}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);

          alert('✅ Downloaded current frame with filters applied as PNG!\n\nNote: Full video processing with filters requires specialized video encoding. This preview shows how your filters look.');
        }
      }, 'image/png');

      // Also offer to download the original video
      setTimeout(() => {
        const downloadOriginal = confirm('Would you also like to download the original video file?');
        if (downloadOriginal) {
          const link = document.createElement('a');
          link.href = videoSrc;
          link.download = `original-${videoFile.name}`;
          link.click();
        }
      }, 1000);

    } catch (error) {
      console.error('Video processing failed:', error);

      // Fallback: download original video
      const link = document.createElement('a');
      link.href = videoSrc;
      link.download = `${videoFile.name}`;
      link.click();
      alert('⚠️ Filter processing failed. Downloaded original video instead.');
    }
  };

  // Photo functions
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store file reference
      setPhotoFile(file);

      // Always use local URL immediately for best user experience
      const url = URL.createObjectURL(file);
      setPhotoSrc(url);
      console.log('Photo loaded:', file.name);

      // No background processing needed - all local

      // Reset all filters when new photo is uploaded
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setBlur(0);
      setHue(0);
      setSepia(0);
      setGrayscale(0);
      setInvert(0);
      setRotation(0);
      setFlipHorizontal(false);
      setFlipVertical(false);
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
      hue-rotate(${hue}deg)
      sepia(${sepia}%)
      grayscale(${grayscale}%)
      invert(${invert}%)
    `;

    photo.style.transform = `
      rotate(${rotation}deg)
      scaleX(${flipHorizontal ? -1 : 1})
      scaleY(${flipVertical ? -1 : 1})
    `;
  };

  const resetPhotoFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setHue(0);
    setSepia(0);
    setGrayscale(0);
    setInvert(0);
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
  };

  const downloadEditedPhoto = () => {
    const photo = photoRef.current;
    if (!photo || !photoSrc || !photoFile) {
      alert('No photo to download. Please upload a photo first.');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Create an image element from the original file
      const img = new Image();

      img.onload = () => {
        try {
          // Set canvas size to image dimensions
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          // Save context state
          ctx.save();

          // Apply transformations to center point
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);

          // Calculate filter values for canvas context
          const brightnessMultiplier = brightness / 100;
          const contrastMultiplier = contrast / 100;
          const saturationMultiplier = saturation / 100;

          // Apply CSS filters (these work in modern browsers)
          ctx.filter = `
            brightness(${brightness}%)
            contrast(${contrast}%)
            saturate(${saturation}%)
            blur(${blur}px)
            hue-rotate(${hue}deg)
            sepia(${sepia}%)
            grayscale(${grayscale}%)
            invert(${invert}%)
          `;

          // Draw the image centered
          ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2);

          // Restore context state
          ctx.restore();

          // Convert to blob and download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              const fileName = photoFile.name.replace(/\.[^/.]+$/, ""); // Remove extension
              link.download = `edited-${fileName}.png`;
              link.href = url;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);

              alert('✅ Edited photo downloaded successfully with all filters applied!');
            } else {
              throw new Error('Failed to create blob');
            }
          }, 'image/png', 1.0);

        } catch (error) {
          console.error('Canvas processing failed:', error);
          // Fallback: download original with alert
          const link = document.createElement('a');
          link.href = photoSrc;
          link.download = `edited-${photoFile.name}`;
          link.click();
          alert('⚠️ Downloaded original image. Some filters may not be applied in download.');
        }
      };

      img.onerror = () => {
        alert('❌ Could not process image. Please try uploading a different image format.');
      };

      // Load the original image
      img.src = photoSrc;

    } catch (error) {
      console.error('Download preparation failed:', error);
      alert('❌ Download failed. Please try again or use a different browser.');
    }
  };

  useEffect(() => {
    try {
      applyPhotoFilters();
    } catch (error) {
      console.debug('Filter application failed:', error);
    }
  }, [brightness, contrast, saturation, blur, hue, sepia, grayscale, invert, rotation, flipHorizontal, flipVertical]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas and reset background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear elements and update history
    setElements([]);
    const newHistory = [...history.slice(0, historyStep + 1), []];
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

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

    // Initialize history with empty state
    if (history.length === 0) {
      setHistory([[]]);
      setHistoryStep(0);
    }
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
            <Button variant="outline" size="sm" onClick={() => {
              const projectToSave = { ...currentProject, elements, lastModified: new Date() };
              localStorage.setItem(`project-${projectToSave.id}`, JSON.stringify(projectToSave));
              alert('Project saved locally!');
            }}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
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
        <div className="w-20 bg-white/95 backdrop-blur-md border-r border-gray-300 flex flex-col items-center py-4 gap-2 shadow-md">
          {tools[activeMode].map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              className={`w-12 h-12 flex flex-col items-center gap-1 text-xs font-medium transition-all hover:scale-105 ${
                tool.id.includes('ai-')
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                  : selectedTool === tool.id
                    ? 'bg-black text-white shadow-lg'
                    : 'text-black hover:bg-gray-100 hover:text-black border border-gray-300'
              }`}
              onClick={() => {
                if (tool.id === 'ai-enhance') {
                  handleAIEnhance();
                } else if (tool.id === 'ai-generate') {
                  handleAIGenerate();
                } else if (tool.id === 'ai-layout') {
                  handleAISuggestions();
                } else if (tool.id === 'ai-complete') {
                  handleAIAutoComplete();
                } else if (tool.id === 'text-to-image') {
                  handleTextToImage();
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

                  {/* AI Auto-Complete Overlay */}
                  {selectedTool === 'ai-complete' && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        <span className="text-sm font-medium">AI Auto-Complete: Draw shapes for AI to complete!</span>
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
                    <>
                      <video
                        ref={videoRef}
                        src={videoSrc}
                        className="max-w-full max-h-full"
                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                      />
                      {/* Upload New Video Button */}
                      <div className="absolute top-4 right-4">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                          id="video-upload-new"
                          ref={(input) => {
                            if (input) {
                              (window as any).videoUploadNewRef = input;
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/90 hover:bg-white"
                          onClick={() => {
                            const input = document.getElementById('video-upload-new') as HTMLInputElement;
                            if (input) {
                              input.click();
                            }
                          }}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New
                        </Button>
                      </div>
                    </>
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
                      <Button
                        className="bg-blue-600 text-white"
                        onClick={() => {
                          const input = document.getElementById('video-upload') as HTMLInputElement;
                          if (input) {
                            input.click();
                          }
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Video
                      </Button>
                    </div>
                  )}
                </div>
                
                {videoSrc && (
                  <div className="p-4 border-t border-gray-200 space-y-4">
                    {/* Video Info */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>File:</strong> {videoFile?.name || 'Video'} |
                        <strong> Size:</strong> {videoFile ? (videoFile.size / (1024 * 1024)).toFixed(2) : '0'} MB |
                        <strong> Duration:</strong> {Math.floor(duration)}s
                      </p>
                    </div>

                    {/* Video Controls */}
                    <div className="flex items-center gap-4 mb-4">
                      <Button variant="outline" size="sm" onClick={togglePlayPause}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => seekToTime(Math.max(0, currentTime - 10))}>
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => seekToTime(Math.min(duration, currentTime + 10))}>
                        <SkipForward className="w-4 h-4" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        <Slider
                          value={[volume]}
                          onValueChange={(value) => {
                            setVolume(value[0]);
                            if (videoRef.current) videoRef.current.volume = value[0] / 100;
                          }}
                          max={100}
                          step={1}
                          className="w-20"
                        />
                        <span className="text-xs w-8">{volume}%</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs">Speed:</span>
                        <select
                          value={playbackSpeed}
                          onChange={(e) => changePlaybackSpeed(Number(e.target.value))}
                          className="text-xs border rounded px-1"
                        >
                          <option value={0.5}>0.5x</option>
                          <option value={0.75}>0.75x</option>
                          <option value={1}>1x</option>
                          <option value={1.25}>1.25x</option>
                          <option value={1.5}>1.5x</option>
                          <option value={2}>2x</option>
                        </select>
                      </div>
                    </div>

                    {/* Video Timeline */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{Math.floor(currentTime)}s</span>
                        <span>{Math.floor(duration)}s</span>
                      </div>
                      <Slider
                        value={[currentTime]}
                        onValueChange={(value) => seekToTime(value[0])}
                        max={duration}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    {/* Video Filters */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Video Filters</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Brightness</label>
                          <Slider
                            value={[videoFilters.brightness]}
                            onValueChange={(value) => setVideoFilters(prev => ({ ...prev, brightness: value[0] }))}
                            min={0}
                            max={200}
                            step={1}
                          />
                          <span className="text-xs text-gray-500">{videoFilters.brightness}%</span>
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Contrast</label>
                          <Slider
                            value={[videoFilters.contrast]}
                            onValueChange={(value) => setVideoFilters(prev => ({ ...prev, contrast: value[0] }))}
                            min={0}
                            max={200}
                            step={1}
                          />
                          <span className="text-xs text-gray-500">{videoFilters.contrast}%</span>
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Saturation</label>
                          <Slider
                            value={[videoFilters.saturation]}
                            onValueChange={(value) => setVideoFilters(prev => ({ ...prev, saturation: value[0] }))}
                            min={0}
                            max={200}
                            step={1}
                          />
                          <span className="text-xs text-gray-500">{videoFilters.saturation}%</span>
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Sepia</label>
                          <Slider
                            value={[videoFilters.sepia]}
                            onValueChange={(value) => setVideoFilters(prev => ({ ...prev, sepia: value[0] }))}
                            min={0}
                            max={100}
                            step={1}
                          />
                          <span className="text-xs text-gray-500">{videoFilters.sepia}%</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setVideoFilters({ brightness: 100, contrast: 100, saturation: 100, sepia: 0 })}
                        >
                          Reset Filters
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadEditedVideo}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Video
                        </Button>
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
                    <>
                      <img
                        ref={photoRef}
                        src={photoSrc}
                        alt="Edit"
                        className="max-w-full max-h-full object-contain"
                      />
                      {/* Upload New Photo Button */}
                      <div className="absolute top-4 right-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-upload-new"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/90 hover:bg-white"
                          onClick={() => {
                            const input = document.getElementById('photo-upload-new') as HTMLInputElement;
                            if (input) {
                              input.click();
                            }
                          }}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New
                        </Button>
                      </div>
                    </>
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
                      <Button
                        className="bg-blue-600 text-white"
                        onClick={() => {
                          const input = document.getElementById('photo-upload') as HTMLInputElement;
                          if (input) {
                            input.click();
                          }
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                  )}
                </div>
                
                {photoSrc && (
                  <div className="w-80 bg-gray-50 p-4 border-l border-gray-200 overflow-y-auto">
                    {/* Photo Info */}
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>File:</strong> {photoFile?.name || 'Photo'}<br/>
                        <strong>Size:</strong> {photoFile ? (photoFile.size / (1024 * 1024)).toFixed(2) : '0'} MB
                      </p>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-4">Photo Editor</h3>

                    {/* Basic Adjustments */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-medium text-gray-800">Basic Adjustments</h4>

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

                    {/* Color Adjustments */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-medium text-gray-800">Color Effects</h4>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Hue Rotate</label>
                        <Slider
                          value={[hue]}
                          onValueChange={(value) => setHue(value[0])}
                          min={-180}
                          max={180}
                          step={1}
                        />
                        <span className="text-xs text-gray-500">{hue}°</span>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Sepia</label>
                        <Slider
                          value={[sepia]}
                          onValueChange={(value) => setSepia(value[0])}
                          min={0}
                          max={100}
                          step={1}
                        />
                        <span className="text-xs text-gray-500">{sepia}%</span>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Grayscale</label>
                        <Slider
                          value={[grayscale]}
                          onValueChange={(value) => setGrayscale(value[0])}
                          min={0}
                          max={100}
                          step={1}
                        />
                        <span className="text-xs text-gray-500">{grayscale}%</span>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Invert</label>
                        <Slider
                          value={[invert]}
                          onValueChange={(value) => setInvert(value[0])}
                          min={0}
                          max={100}
                          step={1}
                        />
                        <span className="text-xs text-gray-500">{invert}%</span>
                      </div>
                    </div>

                    {/* Transform Controls */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-medium text-gray-800">Transform</h4>

                      <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <RotateCw className="w-4 h-4" />
                          Rotation
                        </label>
                        <Slider
                          value={[rotation]}
                          onValueChange={(value) => setRotation(value[0])}
                          min={-180}
                          max={180}
                          step={1}
                        />
                        <span className="text-xs text-gray-500">{rotation}°</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={flipHorizontal ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFlipHorizontal(!flipHorizontal)}
                          className="flex-1"
                        >
                          Flip H
                        </Button>
                        <Button
                          variant={flipVertical ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFlipVertical(!flipVertical)}
                          className="flex-1"
                        >
                          Flip V
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={resetPhotoFilters}
                      >
                        Reset All Filters
                      </Button>

                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        onClick={() => {
                          if (photoSrc) {
                            // Apply AI-like auto-enhancement locally
                            setBrightness(110);
                            setContrast(115);
                            setSaturation(105);
                            setBlur(0);
                            setHue(5);
                            alert('AI Enhancement Applied! The photo has been automatically adjusted for better quality.');
                          } else {
                            alert('Please upload a photo first to use AI enhancement.');
                          }
                        }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Enhance
                      </Button>

                      <Button
                        className="w-full bg-blue-600 text-white"
                        onClick={downloadEditedPhoto}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Edited
                      </Button>
                    </div>
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
                  
                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    onClick={async () => {
                      const suggestions = await getAISuggestions();
                      if (suggestions.length > 0) {
                        const chosen = window.confirm(
                          `AI suggests: "${suggestions[0]}"\n\nWould you like to apply this suggestion?`
                        );
                        if (chosen) {
                          // Apply AI layout suggestion
                          console.log('Applying AI layout suggestion:', suggestions[0]);
                        }
                      }
                    }}
                  >
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
