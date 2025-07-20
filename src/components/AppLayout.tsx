import React, { useState, useRef } from "react";
import TopBar from "./TopBar";
import Toolbar from "./Toolbar";
import CanvasWorkspace from "./CanvasWorkspace";
import AIAssistant from "./AIAssistant";
import ProjectTypeSelector from "./ProjectTypeSelector";

const AppLayout: React.FC = () => {
  const [showProjectType, setShowProjectType] = useState(true);
  const [projectType, setProjectType] = useState<string | null>(null);

  // Drawing tool state
  const [selectedTool, setSelectedTool] = useState<"pen" | "eraser" | "shape" | "text" | "image" | "panel" | "bubble" | "sticker" | "quiz" | "move">("pen");
  const [strokeColor, setStrokeColor] = useState<string>("#222222");
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [shapeType, setShapeType] = useState<"rectangle" | "circle">("rectangle");

  // Add new state for text styling
  const [textFontFamily, setTextFontFamily] = useState<string>("Inter, Arial, sans-serif");
  const [textFontWeight, setTextFontWeight] = useState<"normal" | "bold" | "italic">("normal");

  // Project name and background
  const [projectName, setProjectName] = useState("Infinite Canvas");
  const [transparentBg, setTransparentBg] = useState(false);

  // Canvas ref for export
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSelectType = (type: string) => {
    setProjectType(type);
    setShowProjectType(false);
    setSelectedTool("pen");
  };

  // Save canvas as JPG
  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let exportCanvas = canvas;
    if (transparentBg) {
      exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const ctx = exportCanvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
        ctx.drawImage(canvas, 0, 0);
      }
    }
    const link = document.createElement("a");
    link.download = `${projectName || "infinite-canvas"}.jpg`;
    link.href = exportCanvas.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex flex-col">
      <TopBar
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onSaveImage={handleSaveImage}
        transparentBg={transparentBg}
        onToggleTransparentBg={() => setTransparentBg((v) => !v)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar
          projectType={projectType}
          selectedTool={selectedTool}
          onToolChange={setSelectedTool}
          strokeColor={strokeColor}
          onColorChange={setStrokeColor}
          strokeWidth={strokeWidth}
          onStrokeWidthChange={setStrokeWidth}
          shapeType={shapeType}
          onShapeTypeChange={setShapeType}
          // New text styling props
          textFontFamily={textFontFamily}
          onTextFontFamilyChange={setTextFontFamily}
          textFontWeight={textFontWeight}
          onTextFontWeightChange={setTextFontWeight}
        />
        <CanvasWorkspace
          ref={canvasRef}
          projectType={projectType}
          selectedTool={selectedTool}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          transparentBg={transparentBg}
          shapeType={shapeType}
        />
        <AIAssistant projectType={projectType} />
      </div>
      {showProjectType && <ProjectTypeSelector onSelect={handleSelectType} />}
    </div>
  );
};

export default AppLayout; 