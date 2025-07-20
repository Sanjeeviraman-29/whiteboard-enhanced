import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";

interface Shape {
  id: string;
  type: "rectangle" | "circle";
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  stroke: number;
}

interface TextObject {
  id: string;
  type: "text";
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
}

interface CanvasWorkspaceProps {
  projectType: string | null;
  selectedTool: "pen" | "eraser" | "shape" | "text" | "image" | "panel" | "bubble" | "sticker" | "quiz" | "move";
  strokeColor: string;
  strokeWidth: number;
  transparentBg: boolean;
  shapeType?: "rectangle" | "circle";
}

const CanvasWorkspace = forwardRef<HTMLCanvasElement, CanvasWorkspaceProps>(
  ({ projectType, selectedTool, strokeColor, strokeWidth, transparentBg, shapeType = "rectangle" }, ref) => {
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
    const [history, setHistory] = useState<{ shapes: Shape[]; textObjects: TextObject[] }[]>([]);
    const [redoStack, setRedoStack] = useState<{ shapes: Shape[]; textObjects: TextObject[] }[]>([]);
    const [fontSize, setFontSize] = useState(24);

    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement, []);

    // Undo/redo helpers
    const pushHistory = (newShapes: Shape[], newText: TextObject[]) => {
      setHistory((h) => [...h, { shapes, textObjects }]);
      setRedoStack([]);
      setShapes(newShapes);
      setTextObjects(newText);
    };
    const handleUndo = () => {
      if (history.length === 0) return;
      setRedoStack((r) => [{ shapes, textObjects }, ...r]);
      const prev = history[history.length - 1];
      setShapes(prev.shapes);
      setTextObjects(prev.textObjects);
      setHistory((h) => h.slice(0, -1));
      setSelectedObject(null);
    };
    const handleRedo = () => {
      if (redoStack.length === 0) return;
      setHistory((h) => [...h, { shapes, textObjects }]);
      const next = redoStack[0];
      setShapes(next.shapes);
      setTextObjects(next.textObjects);
      setRedoStack((r) => r.slice(1));
      setSelectedObject(null);
    };

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === "Backspace" || e.key === "Delete") && selectedObject) {
          if (selectedObject.type === "shape") {
            pushHistory(shapes.filter((s) => s.id !== selectedObject.id), textObjects);
          } else if (selectedObject.type === "text") {
            pushHistory(shapes, textObjects.filter((t) => t.id !== selectedObject.id));
          }
          setSelectedObject(null);
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "z") {
          handleUndo();
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
          handleRedo();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    });

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
        ctx.save();
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.stroke;
        ctx.beginPath();
        if (shape.type === "rectangle") {
          ctx.rect(shape.x, shape.y, shape.w, shape.h);
        } else if (shape.type === "circle") {
          const r = Math.sqrt(shape.w * shape.w + shape.h * shape.h) / 2;
          ctx.arc(shape.x + shape.w / 2, shape.y + shape.h / 2, r, 0, 2 * Math.PI);
        }
        ctx.stroke();
        // Highlight if selected
        if (selectedObject && selectedObject.type === "shape" && shape.id === selectedObject.id) {
          ctx.save();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = "#6366f1";
          ctx.lineWidth = 2;
          ctx.beginPath();
          if (shape.type === "rectangle") {
            ctx.rect(shape.x - 4, shape.y - 4, shape.w + 8, shape.h + 8);
          } else if (shape.type === "circle") {
            const r = Math.sqrt(shape.w * shape.w + shape.h * shape.h) / 2 + 4;
            ctx.arc(shape.x + shape.w / 2, shape.y + shape.h / 2, r, 0, 2 * Math.PI);
          }
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
      });
      // Draw text objects
      textObjects.forEach(textObj => {
        ctx.save();
        ctx.font = `${textObj.fontSize}px Inter, Arial, sans-serif`;
        ctx.fillStyle = textObj.color;
        ctx.textBaseline = "top";
        ctx.fillText(textObj.text, textObj.x, textObj.y);
        // Highlight if selected
        if (selectedObject && selectedObject.type === "text" && textObj.id === selectedObject.id) {
          const metrics = ctx.measureText(textObj.text);
          const w = metrics.width;
          const h = textObj.fontSize + 8;
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = "#6366f1";
          ctx.lineWidth = 2;
          ctx.strokeRect(textObj.x - 4, textObj.y - 4, w + 8, h);
        }
        ctx.restore();
      });
      // Draw current shape
      if (currentShape) {
        ctx.save();
        ctx.strokeStyle = currentShape.color;
        ctx.lineWidth = currentShape.stroke;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        if (currentShape.type === "rectangle") {
          ctx.rect(currentShape.x, currentShape.y, currentShape.w, currentShape.h);
        } else if (currentShape.type === "circle") {
          const r = Math.sqrt(currentShape.w * currentShape.w + currentShape.h * currentShape.h) / 2;
          ctx.arc(currentShape.x + currentShape.w / 2, currentShape.y + currentShape.h / 2, r, 0, 2 * Math.PI);
        }
        ctx.stroke();
        ctx.restore();
      }
    }, [transparentBg, shapes, currentShape, selectedObject, textObjects]);

    // Drawing shapes
    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      if ("touches" in e) {
        const touch = e.touches[0];
        return {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
      } else {
        return {
          x: (e as React.MouseEvent).clientX - rect.left,
          y: (e as React.MouseEvent).clientY - rect.top,
        };
      }
    };

    // Hit test for selection
    const hitTest = (x: number, y: number) => {
      // Check text objects first (topmost)
      for (let i = textObjects.length - 1; i >= 0; i--) {
        const t = textObjects[i];
        const canvas = canvasRef.current;
        if (!canvas) continue;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        ctx.font = `${t.fontSize}px Inter, Arial, sans-serif`;
        const w = ctx.measureText(t.text).width;
        const h = t.fontSize + 8;
        if (x >= t.x && x <= t.x + w && y >= t.y && y <= t.y + h) {
          return { type: "text" as const, id: t.id };
        }
      }
      // Then shapes
      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        if (shape.type === "rectangle") {
          if (
            x >= shape.x &&
            x <= shape.x + shape.w &&
            y >= shape.y &&
            y <= shape.y + shape.h
          ) {
            return { type: "shape" as const, id: shape.id };
          }
        } else if (shape.type === "circle") {
          const cx = shape.x + shape.w / 2;
          const cy = shape.y + shape.h / 2;
          const r = Math.sqrt(shape.w * shape.w + shape.h * shape.h) / 2;
          if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r) {
            return { type: "shape" as const, id: shape.id };
          }
        }
      }
      return null;
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      if (selectedTool === "shape") {
        const { x, y } = getPos(e);
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
        setLastPos(getPos(e));
      } else if (selectedTool === "move") {
        const { x, y } = getPos(e);
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
        const { x, y } = getPos(e);
        const id = Date.now().toString();
        setTextObjects([...textObjects, { id, type: "text", x, y, text: "", color: strokeColor, fontSize }]);
        setEditingTextId(id);
        setTextInput("");
        pushHistory(shapes, [...textObjects, { id, type: "text", x, y, text: "", color: strokeColor, fontSize }]);
      }
    };

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
        ctx.strokeStyle = selectedTool === "pen" ? strokeColor : "#fff";
        ctx.lineWidth = strokeWidth;
        ctx.globalCompositeOperation = selectedTool === "eraser" ? "destination-out" : "source-over";
        ctx.stroke();
        setLastPos({ x, y });
      } else if (selectedTool === "move" && selectedObject && dragOffset) {
        const { x, y } = getPos(e);
        if (selectedObject.type === "shape") {
          setShapes((prev) =>
            prev.map((shape) =>
              shape.id === selectedObject.id
                ? { ...shape, x: x - dragOffset.x, y: y - dragOffset.y }
                : shape
            )
          );
        } else if (selectedObject.type === "text") {
          setTextObjects((prev) =>
            prev.map((t) =>
              t.id === selectedObject.id
                ? { ...t, x: x - dragOffset.x, y: y - dragOffset.y }
                : t
            )
          );
        }
      }
    };

    const stopDrawing = () => {
      if (selectedTool === "shape" && currentShape) {
        pushHistory([...shapes, currentShape], textObjects);
        setCurrentShape(null);
        setIsDrawing(false);
        setLastPos(null);
      } else if (selectedTool === "pen" || selectedTool === "eraser") {
        setIsDrawing(false);
        setLastPos(null);
      } else if (selectedTool === "move" && selectedObject) {
        // Save move to history
        pushHistory([...shapes], [...textObjects]);
        setIsDrawing(false);
        setDragOffset(null);
      }
    };

    // Text editing overlay
    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTextInput(e.target.value);
      setTextObjects((prev) =>
        prev.map((t) =>
          t.id === editingTextId ? { ...t, text: e.target.value } : t
        )
      );
    };
    const handleTextInputBlur = () => {
      setEditingTextId(null);
      setTextInput("");
    };
    const handleTextInputKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        setEditingTextId(null);
        setTextInput("");
      }
    };

    // Find editing text object for overlay
    const editingTextObj = textObjects.find((t) => t.id === editingTextId);

    return (
      <main className="flex-1 bg-gradient-to-br from-slate-100 via-white to-slate-200 rounded-2xl shadow-inner flex items-center justify-center min-h-[600px] mx-4 my-6 relative">
        <canvas
          ref={canvasRef}
          width={1200}
          height={700}
          className="rounded-xl border shadow bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ touchAction: "none", maxWidth: "100%", maxHeight: "100%" }}
        />
        {/* Text input overlay */}
        {editingTextObj && (
          <input
            type="text"
            value={editingTextObj.text}
            onChange={handleTextInputChange}
            onBlur={handleTextInputBlur}
            onKeyDown={handleTextInputKeyDown}
            style={{
              position: "absolute",
              left: editingTextObj.x + 16,
              top: editingTextObj.y + 16,
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