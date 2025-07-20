import React from "react";

interface ToolbarProps {
  projectType: string | null;
  selectedTool: "pen" | "eraser" | "shape" | "text" | "image" | "panel" | "bubble" | "sticker" | "quiz" | "move";
  onToolChange: (tool: ToolbarProps["selectedTool"]) => void;
  strokeColor: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  shapeType?: "rectangle" | "circle";
  onShapeTypeChange?: (type: "rectangle" | "circle") => void;
}

const TOOLSETS: Record<string, Array<{ icon: string; label: string; value: ToolbarProps["selectedTool"] }>> = {
  Design: [
    { icon: "✏️", label: "Pen", value: "pen" },
    { icon: "🧽", label: "Eraser", value: "eraser" },
    { icon: "⬛", label: "Shape", value: "shape" },
    { icon: "🅰️", label: "Text", value: "text" },
    { icon: "🖼️", label: "Image", value: "image" },
    { icon: "🔀", label: "Move", value: "move" },
  ],
  Story: [
    { icon: "✏️", label: "Pen", value: "pen" },
    { icon: "🧽", label: "Eraser", value: "eraser" },
    { icon: "📑", label: "Panel", value: "panel" },
    { icon: "💬", label: "Bubble", value: "bubble" },
    { icon: "🅰️", label: "Text", value: "text" },
    { icon: "🔀", label: "Move", value: "move" },
  ],
  Video: [
    { icon: "✏️", label: "Pen", value: "pen" },
    { icon: "🧽", label: "Eraser", value: "eraser" },
    { icon: "🎞️", label: "Frame", value: "panel" },
    { icon: "🅰️", label: "Text", value: "text" },
    { icon: "🖼️", label: "Image", value: "image" },
    { icon: "🔀", label: "Move", value: "move" },
  ],
  Education: [
    { icon: "✏️", label: "Pen", value: "pen" },
    { icon: "🧽", label: "Eraser", value: "eraser" },
    { icon: "🌟", label: "Sticker", value: "sticker" },
    { icon: "❓", label: "Quiz", value: "quiz" },
    { icon: "🅰️", label: "Text", value: "text" },
    { icon: "🔀", label: "Move", value: "move" },
  ],
};

const Toolbar: React.FC<ToolbarProps> = ({ projectType, selectedTool, onToolChange, strokeColor, onColorChange, strokeWidth, onStrokeWidthChange, shapeType, onShapeTypeChange }) => {
  const tools = TOOLSETS[projectType || "Design"] || TOOLSETS["Design"];
  return (
    <aside className="flex flex-col gap-6 p-4 bg-white/80 rounded-r-2xl shadow h-full min-w-[64px] items-center">
      <div className="flex flex-col gap-4">
        {tools.map((tool) => (
          <button
            key={tool.label}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition text-2xl ${selectedTool === tool.value ? "bg-indigo-200" : "hover:bg-indigo-100"}`}
            title={tool.label}
            onClick={() => onToolChange(tool.value)}
            aria-pressed={selectedTool === tool.value}
          >
            {tool.icon}
          </button>
        ))}
      </div>
      {/* Shape selector for shape tool */}
      {selectedTool === "shape" && (
        <div className="flex flex-col gap-2 items-center mt-4">
          <label className="text-xs text-slate-500">Shape</label>
          <div className="flex gap-2">
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-full border ${shapeType === "rectangle" ? "bg-indigo-200 border-indigo-400" : "bg-white border-slate-200"}`}
              onClick={() => onShapeTypeChange && onShapeTypeChange("rectangle")}
              title="Rectangle"
            >
              <span className="text-lg">⬛</span>
            </button>
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-full border ${shapeType === "circle" ? "bg-indigo-200 border-indigo-400" : "bg-white border-slate-200"}`}
              onClick={() => onShapeTypeChange && onShapeTypeChange("circle")}
              title="Circle"
            >
              <span className="text-lg">⚪</span>
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 mt-8 items-center">
        <label className="text-xs text-slate-500">Color</label>
        <input
          type="color"
          value={strokeColor}
          onChange={e => onColorChange(e.target.value)}
          className="w-8 h-8 rounded border-none p-0 bg-transparent cursor-pointer"
          disabled={selectedTool === "eraser"}
        />
      </div>
      <div className="flex flex-col gap-2 items-center">
        <label className="text-xs text-slate-500">Size</label>
        <input
          type="range"
          min={2}
          max={32}
          value={strokeWidth}
          onChange={e => onStrokeWidthChange(Number(e.target.value))}
          className="w-12"
        />
        <span className="text-xs text-slate-400">{strokeWidth}px</span>
      </div>
    </aside>
  );
};

export default Toolbar;