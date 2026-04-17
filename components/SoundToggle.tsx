"use client";

interface Props {
  enabled: boolean;
  onToggle: () => void;
}

export default function SoundToggle({ enabled, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      title={enabled ? "Mute sound effects" : "Enable sound effects"}
      className={`flex items-center gap-2 px-3 py-1.5 border-2 text-xs font-bold uppercase tracking-wide transition-colors ${
        enabled
          ? "bg-gray-800 border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400"
          : "bg-gray-900 border-gray-800 text-gray-600 hover:border-green-600 hover:text-green-400"
      }`}
    >
      <span className="text-base">{enabled ? "🔊" : "🔇"}</span>
      <span>{enabled ? "Sound On" : "Sound Off"}</span>
    </button>
  );
}
