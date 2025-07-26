import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Infinity } from "lucide-react";

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
        <Link to="/" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Infinity className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">InfiniteCanvas</span>
        </Link>
        <div className="h-6 w-px bg-white/30 mx-2"></div>
        {editing ? (
          <input
            className="text-xl font-bold tracking-tight text-indigo-700 bg-white rounded px-2 py-1 outline-none shadow"
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
            className="text-xl font-bold tracking-tight text-white drop-shadow cursor-pointer hover:underline"
            onClick={handleEdit}
            title="Rename Project"
          >
            {projectName}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Link to="/" className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition flex items-center gap-2" title="Back to Home">
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
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
