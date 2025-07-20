import React from "react";

const AIAssistant: React.FC = () => {
  return (
    <aside className="w-80 bg-white/90 rounded-l-2xl shadow p-6 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-lg text-indigo-700">AI Assistant</span>
        <button className="text-slate-400 hover:text-indigo-500 transition text-xl">⏩</button>
      </div>
      <div className="flex-1 flex items-center justify-center text-slate-400 text-base">
        {/* Placeholder for AI suggestions */}
        Real-time suggestions will appear here.
      </div>
    </aside>
  );
};

export default AIAssistant;