import React from 'react';
import { LocationId, LocationInfo } from '../types';
import { LOCATIONS } from '../data/locations';

interface LocationSelectorProps {
  currentLocationId: LocationId;
  onSelectLocation: (loc: LocationInfo) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocationId,
  onSelectLocation
}) => {
  const getIcon = (id: LocationId) => {
    switch (id) {
      case 'attic':
        return '🌧️';
      case 'forest':
        return '🌲';
      case 'beach':
        return '🌊';
      case 'tatami':
        return '🍵';
      case 'space':
        return '🚀';
    }
  };

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
      {LOCATIONS.map(loc => {
        const isSelected = currentLocationId === loc.id;
        return (
          <button
            key={loc.id}
            onClick={() => onSelectLocation(loc)}
            className={`px-3.5 py-2.5 rounded-2xl border text-left whitespace-nowrap transition-all flex items-center gap-2.5 ${
              isSelected
                ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <span className="text-xl p-1 bg-black/40 rounded-xl border border-white/5">
              {getIcon(loc.id)}
            </span>
            <div>
              <div className="font-bold text-xs text-white leading-tight">{loc.nameVi}</div>
              <div className="text-[10px] text-slate-400 leading-tight">{loc.name}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

