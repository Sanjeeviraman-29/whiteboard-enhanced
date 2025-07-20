import React from "react";

const projectTypes = [
  { label: "Video", icon: "🎬" },
  { label: "Design", icon: "🎨" },
  { label: "Education", icon: "📚" },
  { label: "Story", icon: "📖" },
  { label: "Photo Edit", icon: "🖌️" },
];

const ProjectTypeSelector: React.FC<{ onSelect: (type: string) => void }> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6 min-w-[340px]">
        <h2 className="text-2xl font-bold text-center mb-2">Select Project Type</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {projectTypes.map((type) => (
            <button
              key={type.label}
              className="flex flex-col items-center gap-2 px-6 py-4 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-xl shadow hover:scale-105 transition"
              onClick={() => onSelect(type.label)}
            >
              <span className="text-3xl">{type.icon}</span>
              <span className="font-medium text-indigo-700">{type.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectTypeSelector;