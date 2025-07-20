import React from "react";

interface ToolbarProps {
  projectType: string | null;
  selectedTool: "pen" | "eraser" | "shape" | "text" | "line" | "image" | "panel" | "bubble" | "sticker" | "quiz" | "move";
  onToolChange: (tool: ToolbarProps["selectedTool"]) => void;
  strokeColor: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  shapeType?: "rectangle" | "circle" | "line";
  onShapeTypeChange?: (type: "rectangle" | "circle" | "line") => void;
  // New text styling props
  textFontFamily?: string;
  onTextFontFamilyChange?: (family: string) => void;
  textFontWeight?: "normal" | "bold" | "italic";
  onTextFontWeightChange?: (weight: "normal" | "bold" | "italic") => void;
}

const TOOLSETS: Record<string, Array<{ icon: string; label: string; value: ToolbarProps["selectedTool"] }>> = {
  Design: [
    { icon: "✏️", label: "Pen", value: "pen" },
    { icon: "🧽", label: "Eraser", value: "eraser" },
    { icon: "⬛", label: "Shape", value: "shape" },
    { icon: "➖", label: "Line", value: "line" },
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

const Toolbar: React.FC<ToolbarProps> = ({
  projectType, 
  selectedTool, 
  onToolChange, 
  strokeColor, 
  onColorChange, 
  strokeWidth, 
  onStrokeWidthChange, 
  shapeType, 
  onShapeTypeChange,
  textFontFamily,
  onTextFontFamilyChange,
  textFontWeight,
  onTextFontWeightChange
}) => {
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
      {/* Shape selector with line added */}
      {(selectedTool === "shape" || selectedTool === "line") && (
        <div className="flex flex-col gap-2 items-center mt-4">
          <label className="text-xs text-slate-500">
            {selectedTool === "line" ? "Line" : "Shape"}
          </label>
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
            {selectedTool === "line" && (
              <button
                className={`w-8 h-8 flex items-center justify-center rounded-full border ${shapeType === "line" ? "bg-indigo-200 border-indigo-400" : "bg-white border-slate-200"}`}
                onClick={() => onShapeTypeChange && onShapeTypeChange("line")}
                title="Line"
              >
                <span className="text-lg">➖</span>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Text styling options */}
      {selectedTool === "text" && (
        <div className="flex flex-col gap-2 mt-4 items-center">
          <label className="text-xs text-slate-500">Font</label>
          <select
            value={textFontFamily}
            onChange={(e) => onTextFontFamilyChange && onTextFontFamilyChange(e.target.value)}
            className="w-full text-sm p-1 rounded border"
          >
            <option value="Inter, Arial, sans-serif">Inter</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Courier New, monospace">Courier</option>
            <option value="Georgia, serif">Georgia</option>
          </select>
          <div className="flex gap-2 mt-2">
            <button
              className={`w-8 h-8 flex items-center justify-center rounded border ${textFontWeight === "normal" ? "bg-indigo-200" : "bg-white"}`}
              onClick={() => onTextFontWeightChange && onTextFontWeightChange("normal")}
              title="Normal"
            >
              A
            </button>
            <button
              className={`w-8 h-8 flex items-center justify-center rounded border ${textFontWeight === "bold" ? "bg-indigo-200" : "bg-white"}`}
              onClick={() => onTextFontWeightChange && onTextFontWeightChange("bold")}
              title="Bold"
            >
              <strong>A</strong>
            </button>
            <button
              className={`w-8 h-8 flex items-center justify-center rounded border ${textFontWeight === "italic" ? "bg-indigo-200" : "bg-white"}`}
              onClick={() => onTextFontWeightChange && onTextFontWeightChange("italic")}
              title="Italic"
            >
              <em>A</em>
            </button>
          </div>
        </div>
      )}
      {/* Add eraser thickness control to the toolbar */}
      {selectedTool === "eraser" && (
        <div className="flex flex-col gap-4 items-center mt-4">
          <label className="text-xs text-slate-500">Eraser Size</label>
          
          {/* Predefined eraser sizes */}
          <div className="flex gap-2 mb-2">
            {[4, 8, 16, 32].map((size) => (
              <button
                key={size}
                className={`w-10 h-10 rounded-full border flex items-center justify-center 
                  ${strokeWidth === size ? 'bg-indigo-200 border-indigo-400' : 'bg-white border-slate-200'}
                `}
                onClick={() => onStrokeWidthChange(size)}
                title={`${size}px Eraser`}
              >
                <div 
                  className="rounded-full bg-slate-400" 
                  style={{ 
                    width: `${size}px`, 
                    height: `${size}px` 
                  }}
                />
              </button>
            ))}
          </div>

          {/* Custom slider for fine-tuning */}
          <div className="flex items-center gap-2 w-full px-2">
            <span className="text-xs text-slate-400">2</span>
            <input
              type="range"
              min={2}
              max={64}
              value={strokeWidth}
              onChange={e => onStrokeWidthChange(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-slate-400">64</span>
          </div>
          <span className="text-xs text-slate-500">Current: {strokeWidth}px</span>
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