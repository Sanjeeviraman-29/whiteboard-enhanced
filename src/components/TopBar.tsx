import React, { useState } from "react";

interface TopBarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onSaveImage: () => void;
  transparentBg: boolean;
  onToggleTransparentBg: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ projectName, onProjectNameChange, onSaveImage, transparentBg, onToggleTransparentBg }) => {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(projectName);

  const handleEdit = () => setEditing(true);
  const handleBlur = () => {
    setEditing(false);
    onProjectNameChange(tempName.trim() || "Untitled Project");
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-2xl shadow-md">
      <div className="flex items-center gap-4">
        {editing ? (
          <input
            className="text-2xl font-bold tracking-tight text-indigo-700 bg-white rounded px-2 py-1 outline-none shadow"
            value={tempName}
            onChange={e => setTempName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            maxLength={32}
            style={{ minWidth: 120 }}
          />
        ) : (
          <span
            className="text-2xl font-bold tracking-tight text-white drop-shadow cursor-pointer hover:underline"
            onClick={handleEdit}
            title="Rename Project"
          >
            {projectName}
          </span>
        )}
        <nav className="ml-6 text-white/80 text-sm font-medium">
          <span className="px-2 py-1 rounded bg-white/10">Project Nav</span>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
          onClick={onSaveImage}
          title="Save as JPG"
        >
          Save JPG
        </button>
        <label className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition cursor-pointer select-none">
          <input
            type="checkbox"
            checked={transparentBg}
            onChange={onToggleTransparentBg}
            className="accent-indigo-500"
          />
          Transparent BG
        </label>
        <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition">🌗</button>
      </div>
    </header>
  );
};

export default TopBar; 