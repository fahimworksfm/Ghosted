"use client";

interface Props {
  tips: string[];
}

export default function ImprovementTips({ tips }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-900 border-2 border-blue-400 p-3 text-center">
        <p className="text-blue-200 font-black text-xs uppercase tracking-widest">
          Official Improvement Recommendations
        </p>
        <p className="text-blue-400 text-xs mt-1">
          Following these tips will result in a different rejection.
        </p>
      </div>

      <ol className="space-y-3">
        {tips.map((tip, i) => {
          // Split at the parenthetical "(Note:..." for visual treatment
          const noteStart = tip.indexOf("(Note:");
          const mainText = noteStart > -1 ? tip.slice(0, noteStart).trim() : tip;
          const noteText = noteStart > -1 ? tip.slice(noteStart) : null;

          return (
            <li key={i} className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 bg-red-600 border-2 border-red-800 flex items-center justify-center text-white font-black text-sm">
                {i + 1}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-gray-200 text-sm">{mainText}</p>
                {noteText && (
                  <p className="text-yellow-600 text-xs italic font-mono bg-yellow-950/30 border border-yellow-900 px-2 py-1">
                    {noteText}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="text-center">
        <p className="text-gray-600 text-xs font-mono">
          These recommendations have been carefully designed to be simultaneously correct
          <br />
          and guaranteed to produce a different, equally valid reason for rejection.
        </p>
      </div>
    </div>
  );
}
