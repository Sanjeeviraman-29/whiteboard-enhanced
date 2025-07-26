import React, { 
  useRef, 
  useEffect, 
  useState, 
  forwardRef, 
  useImperativeHandle 
} from "react";

// AI Image Generation Utility
// Update Shape interface to include text property for text shapes
interface Shape {
  id: string;
  type: "rectangle" | "circle" | "line" | "image" | "text";
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  stroke: number;
  rotation?: number;
  imageUrl?: string;
  text?: string;
  fontSize?: number;
  fontWeight?: "normal" | "bold" | "italic";
}

interface TextObject {
  id: string;
  type: "text";
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: "normal" | "bold" | "italic";
  rotation?: number;
}

// Extend CanvasWorkspaceProps to include new prop
interface CanvasWorkspaceProps {
  projectType: string | null;
  selectedTool: "pen" | "eraser" | "shape" | "text" | "line" | "image" | "panel" | "bubble" | "sticker" | "quiz" | "move";
  strokeColor: string;
  strokeWidth: number;
  transparentBg: boolean;
  shapeType?: "rectangle" | "circle" | "line";
  // New prop for AI generation
  onAIImageGenerated?: (imageUrl: string) => void;
}

const CanvasWorkspace = forwardRef<HTMLCanvasElement, CanvasWorkspaceProps>(
  ({ 
    projectType, 
    selectedTool, 
    strokeColor, 
    strokeWidth, 
    transparentBg, 
    shapeType = "rectangle",
    onAIImageGenerated // New prop
  }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [currentShape, setCurrentShape] = useState<Shape | null>(null);
    const [textObjects, setTextObjects] = useState<TextObject[]>([]);
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [textInput, setTextInput] = useState("");
    const [selectedObject, setSelectedObject] = useState<{ type: "shape" | "text"; id: string } | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
    // Revert to previous state management
    const [history, setHistory] = useState<{
      shapes: Shape[];
      textObjects: TextObject[];
    }[]>([]);
    const [redoStack, setRedoStack] = useState<{
      shapes: Shape[];
      textObjects: TextObject[];
    }[]>([]);
    const [fontSize, setFontSize] = useState(24);

    // Ensure ref is properly handled
    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement, [canvasRef]);

    // Consolidate Undo/Redo methods
    const undoAction = () => {
      if (history.length === 0) return;

      // Add current state to redo stack
      setRedoStack(prev => [{ shapes, textObjects }, ...prev]);

      // Get the previous state
      const prev = history[history.length - 1];
      
      // Restore previous state
      setShapes(prev.shapes);
      setTextObjects(prev.textObjects);

      // Remove the last history state
      setHistory(h => h.slice(0, -1));

      // Clear any selected object
      setSelectedObject(null);
    };

    const redoAction = () => {
      if (redoStack.length === 0) return;

      // Add current state to history
      setHistory(h => [...h, { shapes, textObjects }]);

      // Get the next state from redo stack
      const next = redoStack[0];
      
      // Restore next state
      setShapes(next.shapes);
      setTextObjects(next.textObjects);

      // Remove the first redo stack state
      setRedoStack(r => r.slice(1));

      // Clear any selected object
      setSelectedObject(null);
    };

    // Function to capture canvas snapshot
    const captureCanvasSnapshot = (): string | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      // Create a temporary canvas to capture full drawing
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return null;

      // Match canvas dimensions
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      // Draw all shapes and text
      tempCtx.fillStyle = transparentBg ? 'rgba(0,0,0,0)' : '#ffffff';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Render shapes
      shapes.forEach(shape => {
        if (shape.type !== "text") {
          tempCtx.save();
          drawShape(tempCtx, shape);
          tempCtx.restore();
        }
      });

      // Render text objects
      textObjects.forEach(text => {
        tempCtx.save();
        tempCtx.font = `${text.fontWeight === "italic" ? "italic " : ""}${text.fontWeight === "bold" ? "bold " : ""}${text.fontSize}px ${text.fontFamily || "Inter, Arial, sans-serif"}`;
        tempCtx.fillStyle = text.color;
        tempCtx.fillText(text.text, text.x, text.y);
        tempCtx.restore();
      });

      // Return data URL
      return tempCanvas.toDataURL('image/png');
    };

    // Function to push canvas snapshot to undo stack
    const pushCanvasSnapshot = () => {
      // Add current state to history
      setHistory(prev => [...prev, { shapes, textObjects }]);
      // Clear redo stack when a new action is performed
      setRedoStack([]);
    };

    // Comprehensive canvas setup with precise sizing
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Set canvas width and height to match its display size
      const updateCanvasSize = () => {
        // Use offsetWidth/Height for precise sizing
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Ensure crisp rendering on high-DPI displays
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          canvas.style.width = `${canvas.offsetWidth}px`;
          canvas.style.height = `${canvas.offsetHeight}px`;
          
          // Scale canvas for high-DPI displays
          canvas.width = canvas.offsetWidth * dpr;
          canvas.height = canvas.offsetHeight * dpr;
          ctx.scale(dpr, dpr);
        }
      };

      // Initial and responsive sizing
      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);

      return () => {
        window.removeEventListener('resize', updateCanvasSize);
      };
    }, []);

    // Enhanced position calculation method
    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      // Get precise canvas bounding rectangle
      const rect = canvas.getBoundingClientRect();
      
      // Handle both mouse and touch events
      let clientX: number, clientY: number;
      if ('touches' in e) {
        const touch = e.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
      }

      // Calculate coordinates relative to canvas
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      return { x, y };
    };

    // Modify drawShape to handle text rendering
    const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
      if (shape.type === "image" && shape.imageUrl) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, shape.x, shape.y, shape.w, shape.h);
        };
        img.src = shape.imageUrl;
        return;
      }

      if (shape.type === "text" && shape.text) {
        ctx.save();
        ctx.font = `${shape.fontWeight === "italic" ? "italic " : ""}${shape.fontWeight === "bold" ? "bold " : ""}${shape.fontSize || 16}px Inter, Arial, sans-serif`;
        ctx.fillStyle = shape.color || "#000";
        ctx.fillText(shape.text, shape.x, shape.y);
        ctx.restore();
        return;
      }

      // Existing shape drawing logic
      ctx.save();
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = shape.stroke;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      switch (shape.type) {
        case "rectangle":
          ctx.rect(shape.x, shape.y, shape.w, shape.h);
          break;
        case "circle":
          const r = Math.sqrt(shape.w * shape.w + shape.h * shape.h) / 2;
          ctx.arc(shape.x + shape.w / 2, shape.y + shape.h / 2, r, 0, 2 * Math.PI);
          break;
        case "line":
          ctx.moveTo(shape.x, shape.y);
          ctx.lineTo(shape.x + shape.w, shape.y + shape.h);
          break;
      }
      ctx.stroke();
      ctx.restore();
    };

    // Modify AI image generation to work with updated types
    const generateAIImageFromShapes = async (shapes: Shape[]) => {
      // Convert shapes to a descriptive text prompt
      const describeShapes = (shapes: Shape[]): string => {
        const shapeDescriptions: string[] = shapes
          .filter(shape => shape.type !== "text" && shape.type !== "image")
          .map(shape => {
            switch (shape.type) {
              case "rectangle":
                return `A rectangle at (${shape.x}, ${shape.y}) with width ${shape.w} and height ${shape.h}`;
              case "circle":
                return `A circle at (${shape.x}, ${shape.y}) with radius ${shape.w / 2}`;
              case "line":
                return `A line from (${shape.x}, ${shape.y}) to (${shape.x + shape.w}, ${shape.y + shape.h})`;
              default:
                return "";
            }
          }).filter(desc => desc !== "");

        // Generate a creative prompt based on shapes
        if (shapeDescriptions.length === 0) return "A blank canvas";
        
        const basePrompt = shapeDescriptions.join(", ");
        const creativePrompts: Record<string, string> = {
          "rectangle": "Architectural blueprint",
          "circle": "Minimalist design",
          "line": "Abstract geometric composition"
        };

        // Select a creative prompt based on the most common shape
        const mostCommonShape = shapes.filter(s => s.type !== "text" && s.type !== "image")[0]?.type || "rectangle";
        return `${creativePrompts[mostCommonShape] || "A creative"} interpretation with ${basePrompt}. Artistic in high resolution.`;
      };

      try {
        // Use OpenAI's DALL-E API 
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: describeShapes(shapes),
            n: 1,
            size: "1024x1024"
          })
        });

        if (!response.ok) {
          throw new Error('Image generation failed');
        }

        const data = await response.json();
        return data.data[0].url;
      } catch (error) {
        console.error('Error generating image:', error);
        return null;
      }
    };

    // Type guard for freehand shape
    const isFreehandShape = (shape: Shape): shape is Shape & { points: { x: number; y: number }[] } => {
      return shape.type === "freehand" && Array.isArray(shape.points) && shape.points.length > 0;
    };

    // Drawing method
    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      
      if (selectedTool === "shape" && currentShape && lastPos) {
        const { x, y } = getPos(e);
        setCurrentShape({
          ...currentShape,
          w: x - lastPos.x,
          h: y - lastPos.y,
        });
      } else if (selectedTool === "pen" || selectedTool === "eraser") {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !lastPos) return;
        
        const { x, y } = getPos(e);
        
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(x, y);
        
        // Differentiate between pen and eraser
        if (selectedTool === "pen") {
          ctx.strokeStyle = strokeColor;
          ctx.globalCompositeOperation = "source-over";
        } else {
          // Eraser logic
          ctx.strokeStyle = transparentBg ? "rgba(0,0,0,0)" : "#fff";
          ctx.globalCompositeOperation = "destination-out";
        }
        
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        setLastPos({ x, y });
      }
    };

    // Start drawing method
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      const { x, y } = getPos(e);

      if (selectedTool === "shape") {
        setIsDrawing(true);
        setLastPos({ x, y });
        setCurrentShape({
          id: Date.now().toString(),
          type: shapeType,
          x,
          y,
          w: 0,
          h: 0,
          color: strokeColor,
          stroke: strokeWidth,
        });
      } else if (selectedTool === "pen" || selectedTool === "eraser") {
        setIsDrawing(true);
        setLastPos({ x, y });
      } else if (selectedTool === "move") {
        const hit = hitTest(x, y);
        if (hit) {
          setSelectedObject(hit);
          if (hit.type === "shape") {
            const shape = shapes.find((s) => s.id === hit.id);
            if (shape) {
              setDragOffset({ x: x - shape.x, y: y - shape.y });
            }
          } else if (hit.type === "text") {
            const t = textObjects.find((t) => t.id === hit.id);
            if (t) {
              setDragOffset({ x: x - t.x, y: y - t.y });
            }
          }
        } else {
          setSelectedObject(null);
        }
      } else if (selectedTool === "text") {
        const id = Date.now().toString();
        setTextObjects([...textObjects, { 
          id, 
          type: "text", 
          x, 
          y, 
          text: "", 
          color: strokeColor, 
          fontSize,
          fontFamily: "Inter, Arial, sans-serif",
          fontWeight: "normal",
        }]);
        setEditingTextId(id);
        setTextInput("");
        pushCanvasSnapshot(); // Use pushCanvasSnapshot here
      }
    };

    // Stop drawing method
    const stopDrawing = () => {
      if (selectedTool === "shape" && currentShape) {
        // Push the new shape to history
        const newShapes = [...shapes, currentShape];
        setHistory(prev => [...prev, { shapes, textObjects }]);
        setShapes(newShapes);
        setCurrentShape(null);
        
        // Clear redo stack
        setRedoStack([]);
      } else if (selectedTool === "pen" || selectedTool === "eraser") {
        // For pen and eraser, we'll add a mechanism to capture the drawing
        const canvas = canvasRef.current;
        if (canvas) {
          // Create a temporary canvas to capture the drawing
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            // Match canvas dimensions
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            
            // Copy the current canvas state
            tempCtx.drawImage(canvas, 0, 0);
            
            // Add to history
            setHistory(prev => [...prev, { 
              shapes, 
              textObjects 
            }]);
            
            // Clear redo stack
            setRedoStack([]);
          }
        }
      }
      
      setIsDrawing(false);
      setLastPos(null);
    };

    // Hit test method
    const hitTest = (x: number, y: number) => {
      // Check text objects first
      for (let i = textObjects.length - 1; i >= 0; i--) {
        const t = textObjects[i];
        const canvas = canvasRef.current;
        if (!canvas) continue;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        
        ctx.font = `${t.fontSize}px ${t.fontFamily || "Inter, Arial, sans-serif"}`;
        const w = ctx.measureText(t.text).width;
        const h = t.fontSize;
        
        if (x >= t.x && x <= t.x + w && y >= t.y && y <= t.y + h) {
          return { type: "text" as const, id: t.id };
        }
      }
      
      // Then shapes
      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        
        switch (shape.type) {
          case "rectangle":
            if (
              x >= shape.x &&
              x <= shape.x + shape.w &&
              y >= shape.y &&
              y <= shape.y + shape.h
            ) {
              return { type: "shape" as const, id: shape.id };
            }
            break;
          case "circle":
            const cx = shape.x + shape.w / 2;
            const cy = shape.y + shape.h / 2;
            const r = Math.sqrt(shape.w * shape.w + shape.h * shape.h) / 2;
            
            if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r) {
              return { type: "shape" as const, id: shape.id };
            }
            break;
          case "line":
            // Simple line hit test
            const lineLength = Math.sqrt(shape.w * shape.w + shape.h * shape.h);
            const dist = Math.abs(
              (shape.h * (x - shape.x) - shape.w * (y - shape.y)) / lineLength
            );
            
            if (dist < 5) {
              return { type: "shape" as const, id: shape.id };
            }
            break;
        }
      }
      
      return null;
    };

    // Render method
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set background
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = transparentBg ? "rgba(0,0,0,0)" : "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
      
      // Draw shapes
      shapes.forEach(shape => {
        drawShape(ctx, shape);
      });
      
      // Draw current shape
      if (currentShape) {
        drawShape(ctx, currentShape);
      }
    }, [shapes, currentShape, transparentBg]);

    // Text input handlers
    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTextInput(value);
      setTextObjects(prev => 
        prev.map(t => 
          t.id === editingTextId ? { ...t, text: value } : t
        )
      );
    };

    const handleTextInputBlur = () => {
      setEditingTextId(null);
      setTextInput("");
    };

    // Modify text input handler to include image generation
    const handleTextInputKeyDown = async (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        const textObj = textObjects.find((t) => t.id === editingTextId);
        
        if (textObj && textObj.text.trim()) {
          try {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            const textWidth = ctx ? ctx.measureText(textObj.text).width : 100;

            // Generate image based on text
            const imageUrl = await generateAIImageFromShapes([...shapes, {
              id: Date.now().toString(),
              type: "text",
              x: textObj.x,
              y: textObj.y + textObj.fontSize + 10, // Place below text
              w: textWidth, // Use actual text width
              h: textObj.fontSize,
              color: textObj.color,
              stroke: 0,
              text: textObj.text
            }]);
            
            if (imageUrl) {
              // Create image object
              const newImage: Shape = {
                id: Date.now().toString(),
                type: "image",
                x: textObj.x,
                y: textObj.y + textObj.fontSize + 10, // Place below text
                w: 200, // Default image width
                h: 200, // Default image height
                color: "", // Not used for images
                stroke: 0, // Not used for images
                imageUrl: imageUrl
              };

              // Add image to shapes
              setShapes(prev => [...prev, newImage]);
              
              // Push to history
              pushCanvasSnapshot(); // Use pushCanvasSnapshot here
            }
          } catch (error) {
            console.error('Image generation error:', error);
          }
        }

        // Reset text editing
        setEditingTextId(null);
        setTextInput("");
      }
    };

    // Find editing text object for overlay
    const editingTextObj = textObjects.find((t) => t.id === editingTextId);

    // New method to trigger AI image generation
    const handleAIImageGeneration = async () => {
      // Ensure we have shapes to generate from
      if (shapes.length === 0) {
        alert("Draw something first before generating an AI image!");
        return;
      }

      try {
        // Show loading indicator
        const loadingShape: Shape = {
          id: Date.now().toString(),
          type: "text",
          x: 50,
          y: 50,
          text: "Generating AI Image...",
          color: "#6366f1", // Indigo color
          fontSize: 24,
          fontWeight: "bold",
          w: 0, // Required property
          h: 0, // Required property
          stroke: 0 // Required property
        };

        // Add loading text
        setShapes(prev => [...prev, loadingShape]);

        // Generate AI image
        const imageUrl = await generateAIImageFromShapes(shapes);
        
        if (imageUrl) {
          // Create image object
          const newImage: Shape = {
            id: Date.now().toString(),
            type: "image",
            x: 50, // Default position
            y: 200, // Below loading text
            w: 300, // Default image width
            h: 300, // Default image height
            color: "", 
            stroke: 0,
            imageUrl: imageUrl
          };

          // Remove loading text and add image
          setShapes(prev => 
            prev
              .filter(s => s.id !== loadingShape.id)
              .concat(newImage)
          );

          // Callback for parent component if needed
          onAIImageGenerated?.(imageUrl);
        } else {
          // Remove loading text if generation fails
          setShapes(prev => 
            prev.filter(s => s.id !== loadingShape.id)
          );
        }
      } catch (error) {
        console.error('AI Image generation error:', error);
        // Remove loading text
        setShapes(prev => 
          prev.filter(s => s.id !== Date.now().toString())
        );
      }
    };

    // Comprehensive drawing image generation method
    const generateDrawingImage = () => {
      // Validate canvas reference
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('Canvas reference is null');
        alert('Unable to generate image: Canvas not found');
        return;
      }

      // Create a temporary canvas for high-quality export
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) {
        console.error('Unable to create canvas context');
        alert('Image generation failed: Cannot create drawing context');
        return;
      }

      // Determine content bounds
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      // Calculate bounding box for shapes
      shapes.forEach(shape => {
        switch (shape.type) {
          case "rectangle":
          case "circle":
          case "line":
          case "image":
            minX = Math.min(minX, shape.x);
            minY = Math.min(minY, shape.y);
            maxX = Math.max(maxX, shape.x + shape.w);
            maxY = Math.max(maxY, shape.y + shape.h);
            break;
        }
      });

      // Calculate bounding box for text objects
      const ctx = canvas.getContext('2d');
      if (ctx) {
        textObjects.forEach(text => {
          ctx.font = `${text.fontSize}px ${text.fontFamily || 'Inter, Arial, sans-serif'}`;
          const textWidth = ctx.measureText(text.text).width;
          
          minX = Math.min(minX, text.x);
          minY = Math.min(minY, text.y);
          maxX = Math.max(maxX, text.x + textWidth);
          maxY = Math.max(maxY, text.y + text.fontSize);
        });
      }

      // Handle empty canvas
      if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
        alert('No content to export. Please draw something first.');
        return;
      }

      // Add padding
      const padding = 40;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width, maxX + padding);
      maxY = Math.min(canvas.height, maxY + padding);

      // Calculate dimensions
      const width = maxX - minX;
      const height = maxY - minY;

      // Use high DPI for crisp image
      const dpr = window.devicePixelRatio || 1;
      tempCanvas.width = width * dpr;
      tempCanvas.height = height * dpr;

      // Scale context
      tempCtx.scale(dpr, dpr);
      tempCtx.imageSmoothingEnabled = true;
      tempCtx.imageSmoothingQuality = 'high';

      // Clear and set background
      tempCtx.clearRect(0, 0, width, height);
      tempCtx.fillStyle = transparentBg ? 'rgba(0,0,0,0)' : '#ffffff';
      tempCtx.fillRect(0, 0, width, height);

      // Render shapes
      shapes.forEach(shape => {
        if (shape.type !== "text") {
          tempCtx.save();
          tempCtx.translate(-minX, -minY);
          drawShape(tempCtx, shape);
          tempCtx.restore();
        }
      });

      // Render text objects
      textObjects.forEach(text => {
        tempCtx.save();
        tempCtx.translate(-minX, -minY);
        
        tempCtx.font = `${text.fontWeight === "italic" ? "italic " : ""}${text.fontWeight === "bold" ? "bold " : ""}${text.fontSize}px ${text.fontFamily || "Inter, Arial, sans-serif"}`;
        tempCtx.fillStyle = text.color;
        tempCtx.fillText(text.text, text.x, text.y);
        
        tempCtx.restore();
      });

      // Generate and download image
      try {
        // Convert to Blob for better compatibility
        tempCanvas.toBlob((blob) => {
          if (!blob) {
            console.error('Failed to generate image blob');
            alert('Image export failed. Please try again.');
            return;
          }

          // Create download link
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = 'infinite_canvas_drawing.png';
          
          // Trigger download
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          // Clean up
          URL.revokeObjectURL(downloadLink.href);
        }, 'image/png', 1.0);
      } catch (error) {
        console.error('Image generation error:', error);
        alert('An error occurred while generating the image. Please try again.');
      }
    };

    return (
      <main className="flex-1 bg-gradient-to-br from-slate-100 via-white to-slate-200 rounded-2xl shadow-inner flex items-center justify-center min-h-[800px] mx-4 my-6 relative">
        <canvas
          ref={canvasRef}
          width={1600}
          height={900}
          className="rounded-xl border shadow bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            touchAction: 'none',
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
        
        {/* Undo/Redo Buttons */}
        <div className="absolute top-4 left-4 flex gap-2">
          <button 
            onClick={undoAction}
            disabled={history.length === 0}
            className={`
              px-4 py-2 rounded-lg transition 
              ${history.length === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }
            `}
          >
            Undo
          </button>
          <button 
            onClick={redoAction}
            disabled={redoStack.length === 0}
            className={`
              px-4 py-2 rounded-lg transition 
              ${redoStack.length === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }
            `}
          >
            Redo
          </button>
        </div>

        {/* AI Image Generation Button */}
        <button 
          onClick={handleAIImageGeneration}
          className="absolute top-4 right-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          Generate AI Image
        </button>

        {/* Generate Drawing Image Button */}
        <button 
          onClick={generateDrawingImage}
          className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Generate Drawing Image
        </button>

        {/* Existing text input and other elements */}
        {editingTextObj && (
          <input
            type="text"
            value={editingTextObj.text}
            onChange={handleTextInputChange}
            onBlur={handleTextInputBlur}
            onKeyDown={handleTextInputKeyDown}
            style={{
              position: 'absolute',
              left: editingTextObj.x,
              top: editingTextObj.y,
              fontSize: editingTextObj.fontSize,
              color: editingTextObj.color,
              background: "#fff",
              border: "1px solid #6366f1",
              borderRadius: 4,
              padding: "2px 6px",
              zIndex: 10,
              minWidth: 80,
            }}
            autoFocus
          />
        )}
      </main>
    );
  }
);

export default CanvasWorkspace;
