import React from 'react';
import { EquipmentItem } from '../types';

interface SleepDioramaProps {
  equippedBed: EquipmentItem;
  equippedPillow: EquipmentItem;
  equippedBlanket: EquipmentItem;
  equippedPajamas: EquipmentItem;
  equippedCompanion: EquipmentItem;
  isSleeping: boolean;
  onOpenEquipmentModal: () => void;
}

export const SleepDiorama: React.FC<SleepDioramaProps> = ({
  equippedBed,
  equippedPillow,
  equippedBlanket,
  equippedPajamas,
  equippedCompanion,
  isSleeping,
  onOpenEquipmentModal
}) => {
  // --- 1. BED VISUAL RENDERER ---
  const renderBedBase = () => {
    switch (equippedBed.id) {
      case 'bed-tatami':
        return (
          <g id="bed-tatami">
            {/* Tatami straw mat border and grid */}
            <rect x="50" y="165" width="300" height="110" rx="8" fill="#4d5334" stroke="#2e331e" strokeWidth="3" />
            <rect x="58" y="172" width="284" height="96" rx="4" fill="#88915b" />
            {/* Tatami woven weave lines */}
            <path d="M60 190 H340 M60 210 H340 M60 230 H340 M60 250 H340" stroke="#757e4c" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.6" />
            {/* Black fabric edge borders (heri) */}
            <rect x="50" y="165" width="300" height="7" fill="#1c1f17" />
            <rect x="50" y="268" width="300" height="7" fill="#1c1f17" />
            {/* Low wooden riser feet */}
            <rect x="65" y="275" width="25" height="8" rx="2" fill="#2d1e12" />
            <rect x="310" y="275" width="25" height="8" rx="2" fill="#2d1e12" />
          </g>
        );

      case 'bed-cloud':
        return (
          <g id="bed-cloud">
            {/* Floating shadow */}
            <ellipse cx="200" cy="278" rx="140" ry="14" fill="#000000" opacity="0.35" filter="blur(4px)" />
            {/* Cloud puffy mattress body */}
            <g className="animate-float" style={{ animationDuration: '4s' }}>
              <path
                d="M80 230 
                   C60 220 55 185 85 175 
                   C95 150 140 145 165 165 
                   C185 145 235 145 255 165 
                   C280 145 325 155 330 180 
                   C355 190 355 230 330 245 
                   C340 265 305 280 275 270 
                   C250 285 195 285 170 270 
                   C145 285 100 275 80 250 Z"
                fill="url(#cloudGrad)"
                stroke="#c4b5fd"
                strokeWidth="2.5"
              />
              {/* Cloud puffy highlight cushions */}
              <ellipse cx="140" cy="205" rx="45" ry="22" fill="#ffffff" opacity="0.35" />
              <ellipse cx="255" cy="205" rx="50" ry="24" fill="#ffffff" opacity="0.3" />
              {/* Tiny floating star sparkles around cloud bed */}
              <text x="65" y="165" fontSize="14" fill="#fde047" className="animate-twinkle">✨</text>
              <text x="330" y="160" fontSize="12" fill="#fde047" className="animate-twinkle" style={{ animationDelay: '1s' }}>✦</text>
            </g>
          </g>
        );

      case 'bed-hammock':
        return (
          <g id="bed-hammock" className="animate-breathe" style={{ animationDuration: '6s', transformOrigin: 'center' }}>
            {/* Left & Right Hanging Ropes */}
            <path d="M20 120 Q60 170 85 200" stroke="#d4b996" strokeWidth="4" strokeLinecap="round" />
            <path d="M380 120 Q340 170 315 200" stroke="#d4b996" strokeWidth="4" strokeLinecap="round" />
            {/* Wooden spreader bars */}
            <rect x="78" y="190" width="10" height="35" rx="3" fill="#854d0e" />
            <rect x="312" y="190" width="10" height="35" rx="3" fill="#854d0e" />
            {/* Woven hammock canvas body */}
            <path
              d="M85 200 Q200 270 315 200 Q200 295 85 200 Z"
              fill="url(#hammockGrad)"
              stroke="#e2d4be"
              strokeWidth="2"
            />
            {/* Fringe tassels dangling */}
            <path d="M120 260 v15 M150 272 v16 M180 278 v18 M210 280 v18 M240 275 v16 M270 263 v14" stroke="#d4b996" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'bed-cyberpod':
        return (
          <g id="bed-cyberpod">
            {/* Outer Pod Shell (Sleek sci-fi capsule) */}
            <rect x="45" y="150" width="310" height="125" rx="36" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" filter="drop-shadow(0 0 12px rgba(56,189,248,0.4))" />
            {/* Inner illuminated bed chamber */}
            <rect x="58" y="162" width="284" height="100" rx="26" fill="#1e293b" />
            {/* Neon rim glows */}
            <path d="M70 175 H330" stroke="#06b6d4" strokeWidth="2.5" opacity="0.8" />
            <path d="M70 248 H330" stroke="#c084fc" strokeWidth="2" opacity="0.7" />
            {/* Pod control panel screen */}
            <rect x="305" y="180" width="24" height="40" rx="5" fill="#0284c7" opacity="0.8" />
            <line x1="310" y1="190" x2="324" y2="190" stroke="#e0f2fe" strokeWidth="1.5" />
            <line x1="310" y1="198" x2="320" y2="198" stroke="#a7f3d0" strokeWidth="1.5" />
            <line x1="310" y1="206" x2="322" y2="206" stroke="#fbcfe8" strokeWidth="1.5" />
            {/* Anti-gravity magnetic glow rings beneath */}
            <ellipse cx="110" cy="278" rx="28" ry="6" fill="#38bdf8" opacity="0.6" filter="blur(3px)" />
            <ellipse cx="290" cy="278" rx="28" ry="6" fill="#c084fc" opacity="0.6" filter="blur(3px)" />
          </g>
        );

      case 'bed-vintage-wood':
      default:
        return (
          <g id="bed-vintage-wood">
            {/* High Carved Wooden Headboard */}
            <rect x="50" y="130" width="300" height="60" rx="8" fill="#5c2c16" stroke="#3b1b0b" strokeWidth="3" />
            {/* Headboard wooden slats */}
            <path d="M75 140 v45 M105 140 v45 M135 140 v45 M165 140 v45 M195 140 v45 M225 140 v45 M255 140 v45 M285 140 v45 M315 140 v45" stroke="#3b1b0b" strokeWidth="2" opacity="0.7" />
            <rect x="46" y="126" width="308" height="10" rx="3" fill="#78350f" />
            {/* Bed Mattress Base */}
            <rect x="56" y="178" width="288" height="92" rx="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="52" y="260" width="296" height="18" rx="4" fill="#78350f" stroke="#3b1b0b" strokeWidth="2" />
            {/* Four turned wooden legs */}
            <rect x="58" y="278" width="16" height="12" rx="2" fill="#451a03" />
            <rect x="326" y="278" width="16" height="12" rx="2" fill="#451a03" />
          </g>
        );
    }
  };

  // --- 2. PILLOW VISUAL RENDERER ---
  const renderPillow = () => {
    switch (equippedPillow.id) {
      case 'pillow-memory-foam':
        return (
          <g id="pillow-memory-foam" transform="translate(85, 172)">
            {/* Dual wave contour shape */}
            <path
              d="M0 25 C10 8 30 10 45 20 C60 12 75 12 85 24 C85 38 75 48 45 48 C15 48 0 40 0 25 Z"
              fill="url(#memoryFoamGrad)"
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            {/* Ergonomic neck dip */}
            <ellipse cx="45" cy="28" rx="18" ry="6" fill="#0369a1" opacity="0.25" />
          </g>
        );

      case 'pillow-buckwheat':
        return (
          <g id="pillow-buckwheat" transform="translate(82, 174)">
            {/* Traditional cylindrical bolster roll */}
            <rect x="5" y="10" width="78" height="34" rx="12" fill="#e2d4be" stroke="#a38b69" strokeWidth="2" />
            {/* Tie rope at end */}
            <ellipse cx="8" cy="27" rx="4" ry="12" fill="#78593a" />
            <ellipse cx="80" cy="27" rx="4" ry="12" fill="#78593a" />
            <path d="M12 27 L2 20 M12 27 L2 34" stroke="#78593a" strokeWidth="2" />
          </g>
        );

      case 'pillow-star':
        return (
          <g id="pillow-star" transform="translate(86, 168)" className="animate-pulse" style={{ animationDuration: '3s' }}>
            {/* Glowing 5-point star */}
            <polygon
              points="45,2 57,32 90,34 64,54 74,86 45,68 16,86 26,54 0,34 33,32"
              fill="#fef08a"
              stroke="#eab308"
              strokeWidth="2"
              transform="scale(0.55)"
              filter="drop-shadow(0 0 8px rgba(250,204,21,0.6))"
            />
            {/* Star blush & smile */}
            <circle cx="20" cy="24" r="2" fill="#f59e0b" />
            <circle cx="30" cy="24" r="2" fill="#f59e0b" />
            <path d="M22 28 Q25 31 28 28" stroke="#b45309" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'pillow-cloud-feather':
      default:
        return (
          <g id="pillow-cloud-feather" transform="translate(80, 168)">
            {/* Super puffy white feather pillow */}
            <rect x="0" y="5" width="90" height="42" rx="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
            {/* Head indent crease */}
            <ellipse cx="45" cy="26" rx="25" ry="8" fill="#e2e8f0" opacity="0.6" />
            {/* Fluffy feather sticking out corner */}
            <path d="M5 8 C-4 0 0 -8 8 -2 C10 4 6 8 5 8 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
          </g>
        );
    }
  };

  // --- 3. SLEEPING HUMAN CHARACTER & PAJAMAS RENDERER ---
  const renderCharacter = () => {
    // Pajama Styling definitions
    let bodyFill = '#3b82f6';
    let armFill = '#2563eb';
    let collarStroke = '#ffffff';

    if (equippedPajamas.id === 'pj-panda') {
      bodyFill = '#ffffff';
      armFill = '#1e293b';
      collarStroke = '#1e293b';
    } else if (equippedPajamas.id === 'pj-kimono') {
      bodyFill = '#f472b6';
      armFill = '#db2777';
      collarStroke = '#fbcfe8';
    } else if (equippedPajamas.id === 'pj-astronaut') {
      bodyFill = '#e2e8f0';
      armFill = '#cbd5e1';
      collarStroke = '#06b6d4';
    }

    return (
      <g id="character-avatar" className={isSleeping ? 'animate-breathe' : 'animate-float'} style={{ animationDuration: '4s' }}>
        {/* Sleeping Character Body Under Neck (Shoulders & Chest) */}
        <path d="M110 205 Q145 200 200 205 L210 240 Q150 245 110 240 Z" fill={bodyFill} />
        
        {/* Pajamas Specific Pattern / Accents */}
        {equippedPajamas.id === 'pj-stripes' && (
          <g opacity="0.4">
            <line x1="125" y1="205" x2="125" y2="238" stroke="#ffffff" strokeWidth="3" />
            <line x1="145" y1="203" x2="145" y2="240" stroke="#ffffff" strokeWidth="3" />
            <line x1="165" y1="203" x2="165" y2="240" stroke="#ffffff" strokeWidth="3" />
            <line x1="185" y1="205" x2="185" y2="238" stroke="#ffffff" strokeWidth="3" />
          </g>
        )}

        {equippedPajamas.id === 'pj-kimono' && (
          <g>
            {/* Crossover kimono collar (eri) */}
            <path d="M120 205 L138 225 L156 205" stroke="#fce7f3" strokeWidth="3" fill="none" />
            {/* Sakura flower petal print */}
            <circle cx="170" cy="220" r="3" fill="#fdf2f8" />
            <circle cx="185" cy="228" r="2.5" fill="#fdf2f8" />
          </g>
        )}

        {equippedPajamas.id === 'pj-astronaut' && (
          <g>
            {/* NASA-style mini chest patch */}
            <circle cx="140" cy="222" r="5" fill="#0284c7" />
            <path d="M136 222 L144 222" stroke="#ef4444" strokeWidth="1.5" />
            <line x1="120" y1="235" x2="200" y2="235" stroke="#06b6d4" strokeWidth="2" />
          </g>
        )}

        {/* Arms hugging pillow/blanket edge */}
        <ellipse cx="120" cy="225" rx="10" ry="16" fill={armFill} transform="rotate(-15 120 225)" />
        <ellipse cx="195" cy="225" rx="10" ry="16" fill={armFill} transform="rotate(15 195 225)" />
        {/* Soft hands peeking out */}
        <circle cx="125" cy="235" r="7" fill="#fed7aa" />
        <circle cx="190" cy="235" r="7" fill="#fed7aa" />

        {/* --- CHARACTER HEAD & FACE --- */}
        <g id="character-head" transform="translate(125, 155)">
          {/* Head Base */}
          <circle cx="30" cy="30" r="26" fill="#ffedd5" stroke="#fed7aa" strokeWidth="1.5" />

          {/* Hair or Pajama Hood */}
          {equippedPajamas.id === 'pj-panda' ? (
            <g id="panda-hood">
              {/* Panda Hood Cap */}
              <path d="M5 25 C5 6 55 6 55 25 C55 12 5 12 5 25 Z" fill="#1e293b" />
              {/* Two cute round black panda ears */}
              <circle cx="10" cy="8" r="9" fill="#0f172a" />
              <circle cx="10" cy="8" r="5" fill="#f87171" opacity="0.6" />
              <circle cx="50" cy="8" r="9" fill="#0f172a" />
              <circle cx="50" cy="8" r="5" fill="#f87171" opacity="0.6" />
            </g>
          ) : equippedPajamas.id === 'pj-astronaut' ? (
            <g id="astronaut-soft-cap">
              {/* Soft space communications cap */}
              <path d="M4 28 C4 8 56 8 56 28 Z" fill="#64748b" />
              <circle cx="2" cy="28" r="6" fill="#0284c7" />
              <circle cx="58" cy="28" r="6" fill="#0284c7" />
              <line x1="2" y1="24" x2="2" y2="12" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
              <circle cx="2" cy="11" r="2.5" fill="#38bdf8" />
            </g>
          ) : (
            <g id="normal-sleepy-hair">
              {/* Cozy brown/dark messy sleep hair */}
              <path d="M4 26 C2 10 20 4 32 4 C48 4 58 12 56 26 C52 14 38 12 30 14 C20 14 10 18 4 26 Z" fill="#451a03" />
              {/* Little cowlick tuft */}
              <path d="M30 4 Q33 -3 28 -4 Q26 2 30 4 Z" fill="#451a03" />
            </g>
          )}

          {/* Sleeping Face: Curved Eyelashes */}
          <path d="M18 28 Q23 33 28 28" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M36 28 Q41 33 46 28" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
          
          {/* Blushing cheeks */}
          <circle cx="16" cy="34" r="4.5" fill="#fda4af" opacity="0.75" />
          <circle cx="48" cy="34" r="4.5" fill="#fda4af" opacity="0.75" />

          {/* Gentle smiling mouth */}
          <path d="M29 37 Q32 40 35 37" stroke="#9a3412" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Floating 'zZz' bubbles when in active sleep */}
          {isSleeping && (
            <g className="animate-bounce" style={{ animationDuration: '2.5s' }}>
              <text x="54" y="10" fontSize="11" fontWeight="bold" fill="#c084fc" fontFamily="monospace">z</text>
              <text x="62" y="-1" fontSize="14" fontWeight="bold" fill="#a855f7" fontFamily="monospace">Z</text>
              <text x="71" y="-14" fontSize="18" fontWeight="bold" fill="#facc15" fontFamily="monospace">Z</text>
            </g>
          )}
        </g>
      </g>
    );
  };

  // --- 4. BLANKET VISUAL RENDERER ---
  const renderBlanket = () => {
    switch (equippedBlanket.id) {
      case 'blanket-weighted':
        return (
          <g id="blanket-weighted">
            {/* Deep Slate Quilted Blanket with square box-stitches */}
            <path
              d="M60 220 C100 215 220 215 340 220 L340 268 C220 274 100 274 60 268 Z"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Quilt stitching grid */}
            <path
              d="M95 220 L95 268 M135 218 L135 270 M175 216 L175 271 M215 216 L215 271 M255 218 L255 270 M295 220 L295 268"
              stroke="#475569"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <path
              d="M60 236 C100 232 220 232 340 236 M60 252 C100 248 220 248 340 252"
              stroke="#475569"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            {/* Heavy rolled top edge */}
            <path d="M60 220 C100 213 220 213 340 220" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          </g>
        );

      case 'blanket-silk':
        return (
          <g id="blanket-silk">
            {/* Smooth Shiny Liquid Silk drape */}
            <path
              d="M58 218 C110 208 210 212 342 218 L340 270 C220 276 100 276 58 270 Z"
              fill="url(#silkGrad)"
              stroke="#f472b6"
              strokeWidth="1.5"
            />
            {/* Silk sheen glossy reflections */}
            <path d="M90 226 Q180 222 280 230" stroke="#ffffff" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
            <path d="M120 246 Q210 242 310 250" stroke="#ffffff" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
          </g>
        );

      case 'blanket-patchwork':
        return (
          <g id="blanket-patchwork">
            {/* Vintage Quilt Base */}
            <path
              d="M58 218 C110 212 210 212 342 218 L340 270 C220 276 100 276 58 270 Z"
              fill="#fed7aa"
              stroke="#ea580c"
              strokeWidth="2"
            />
            {/* Colorful Patchwork Blocks */}
            <rect x="70" y="222" width="40" height="22" fill="#fca5a5" stroke="#f87171" strokeWidth="1" strokeDasharray="3 1" />
            <rect x="110" y="222" width="40" height="22" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 1" />
            <rect x="150" y="222" width="40" height="22" fill="#86efac" stroke="#4ade80" strokeWidth="1" strokeDasharray="3 1" />
            <rect x="190" y="222" width="40" height="22" fill="#fde047" stroke="#facc15" strokeWidth="1" strokeDasharray="3 1" />
            <rect x="230" y="222" width="40" height="22" fill="#d8b4fe" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 1" />
            <rect x="270" y="222" width="40" height="22" fill="#fdba74" stroke="#fb923c" strokeWidth="1" strokeDasharray="3 1" />

            <rect x="70" y="244" width="40" height="24" fill="#a7f3d0" stroke="#34d399" strokeWidth="1" strokeDasharray="3 1" />
            <rect x="110" y="244" width="40" height="24" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1" strokeDasharray="3 1" />
            <rect x="150" y="244" width="40" height="24" fill="#fed7aa" stroke="#fb923c" strokeWidth="1" strokeDasharray="3 1" />
            <rect x="190" y="244" width="40" height="24" fill="#bae6fd" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 1" />
            <rect x="230" y="244" width="40" height="24" fill="#fecdd3" stroke="#fb7185" strokeWidth="1" strokeDasharray="3 1" />
            <rect x="270" y="244" width="40" height="24" fill="#e9d5ff" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 1" />
          </g>
        );

      case 'blanket-wool':
      default:
        return (
          <g id="blanket-wool">
            {/* Chunky Knitted Wool Blanket with cable pattern */}
            <path
              d="M58 218 C110 210 210 210 342 218 L340 270 C220 276 100 276 58 270 Z"
              fill="url(#woolGrad)"
              stroke="#b45309"
              strokeWidth="2.5"
            />
            {/* Cable knit braided pattern lines */}
            <path
              d="M75 220 Q85 245 75 270 M105 220 Q115 245 105 270 M135 218 Q145 245 135 272 M165 218 Q175 245 165 272 M195 218 Q205 245 195 272 M225 218 Q235 245 225 272 M255 218 Q265 245 255 272 M285 220 Q295 245 285 270 M315 220 Q325 245 315 270"
              stroke="#fef3c7"
              strokeWidth="2"
              opacity="0.5"
              strokeDasharray="4 3"
            />
            {/* Thick folded cozy rim */}
            <rect x="56" y="212" width="288" height="12" rx="6" fill="#fef08a" stroke="#d97706" strokeWidth="2" />
          </g>
        );
    }
  };

  // --- 5. COMPANION & ACCESSORY RENDERER ---
  const renderCompanion = () => {
    switch (equippedCompanion.id) {
      case 'pet-cat':
        return (
          <g id="companion-cat" transform="translate(260, 215)" className="animate-breathe" style={{ animationDuration: '3.5s' }}>
            {/* Orange Tabby Cat curled up sleeping */}
            {/* Cat body oval */}
            <ellipse cx="30" cy="25" rx="22" ry="16" fill="#ea580c" />
            {/* Ginger stripes */}
            <path d="M22 13 Q25 20 22 27 M30 11 Q33 20 30 29 M38 13 Q41 20 38 27" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />
            {/* Cat Head */}
            <circle cx="16" cy="18" r="13" fill="#f97316" />
            {/* Cat Ears */}
            <polygon points="7,10 13,3 15,11" fill="#ea580c" />
            <polygon points="8,10 12,5 14,11" fill="#fecdd3" />
            <polygon points="18,10 23,3 27,11" fill="#ea580c" />
            <polygon points="19,10 22,5 25,11" fill="#fecdd3" />
            {/* Sleeping eyes & pink nose */}
            <path d="M11 20 Q13 22 15 20 M17 20 Q19 22 21 20" stroke="#7c2d12" strokeWidth="1.2" fill="none" />
            <polygon points="15,22 17,22 16,24" fill="#fda4af" />
            {/* Curled bushy tail */}
            <path d="M48 30 C56 25 54 10 44 8" stroke="#ea580c" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M48 30 C56 25 54 10 44 8" stroke="#9a3412" strokeWidth="2" strokeDasharray="3 3" fill="none" strokeLinecap="round" />
            {/* Purring heart / notes */}
            {isSleeping && (
              <text x="42" y="4" fontSize="10" fill="#f43f5e" className="animate-bounce">purr~❤️</text>
            )}
          </g>
        );

      case 'pet-shiba':
        return (
          <g id="companion-shiba" transform="translate(262, 218)" className="animate-breathe" style={{ animationDuration: '4s' }}>
            {/* Shiba Inu sleeping with mini blanket */}
            <ellipse cx="28" cy="22" rx="22" ry="15" fill="#d97706" />
            <ellipse cx="28" cy="25" rx="14" ry="10" fill="#fef3c7" />
            {/* Shiba Head */}
            <circle cx="14" cy="16" r="12" fill="#d97706" />
            <ellipse cx="14" cy="20" rx="7" ry="5" fill="#fef3c7" />
            {/* Pointy fox-like ears */}
            <polygon points="6,9 10,2 14,8" fill="#b45309" />
            <polygon points="16,8 20,2 24,9" fill="#b45309" />
            {/* Sleeping eyes and black nose */}
            <path d="M10 16 Q12 18 14 16" stroke="#451a03" strokeWidth="1.2" fill="none" />
            <circle cx="14" cy="19" r="1.8" fill="#1c1917" />
            {/* Curled donut tail */}
            <circle cx="46" cy="18" r="6" fill="#b45309" stroke="#fef3c7" strokeWidth="2" />
          </g>
        );

      case 'acc-teddy':
        return (
          <g id="companion-teddy" transform="translate(75, 205)">
            {/* Vintage Brown Teddy Bear sitting hugging blanket */}
            <circle cx="20" cy="28" r="14" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
            <ellipse cx="20" cy="30" rx="8" ry="10" fill="#fde68a" />
            {/* Teddy Head */}
            <circle cx="20" cy="14" r="11" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
            {/* Ears */}
            <circle cx="11" cy="6" r="4.5" fill="#78350f" />
            <circle cx="11" cy="6" r="2.5" fill="#fde68a" />
            <circle cx="29" cy="6" r="4.5" fill="#78350f" />
            <circle cx="29" cy="6" r="2.5" fill="#fde68a" />
            {/* Button eyes & muzzle */}
            <circle cx="17" cy="12" r="1.5" fill="#1c1917" />
            <circle cx="23" cy="12" r="1.5" fill="#1c1917" />
            <ellipse cx="20" cy="16" rx="4" ry="3" fill="#fde68a" />
            <circle cx="20" cy="15" r="1.2" fill="#1c1917" />
            {/* Cute patch stitch on ear */}
            <line x1="8" y1="5" x2="14" y2="7" stroke="#fde68a" strokeWidth="1" />
          </g>
        );

      case 'acc-diffuser':
        return (
          <g id="companion-diffuser" transform="translate(305, 175)">
            {/* Ceramic / Wood grain Aroma Diffuser */}
            <path d="M12 40 L28 40 L26 26 L20 18 L14 26 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            {/* Glowing aroma mist slit */}
            <line x1="16" y1="36" x2="24" y2="36" stroke="#c084fc" strokeWidth="2" filter="drop-shadow(0 0 4px #c084fc)" />
            {/* Puffs of lavender vapor drifting upward */}
            <g className="animate-float" style={{ animationDuration: '3s' }}>
              <ellipse cx="20" cy="12" rx="4" ry="2.5" fill="#e9d5ff" opacity="0.6" />
              <ellipse cx="23" cy="4" rx="6" ry="3" fill="#d8b4fe" opacity="0.4" />
              <ellipse cx="18" cy="-5" rx="8" ry="4" fill="#c084fc" opacity="0.25" />
            </g>
          </g>
        );

      case 'acc-headphones':
        return (
          <g id="companion-headphones" transform="translate(122, 142)">
            {/* Sleek over-ear noise-cancelling headphones on head */}
            <path d="M12 28 C12 6 52 6 52 28" stroke="#1e293b" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            {/* Left & Right Cushioned Earcups with glowing cyan LED status */}
            <rect x="7" y="24" width="8" height="16" rx="4" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
            <circle cx="11" cy="32" r="1.5" fill="#38bdf8" />
            <rect x="49" y="24" width="8" height="16" rx="4" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
            <circle cx="53" cy="32" r="1.5" fill="#38bdf8" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div
      onClick={onOpenEquipmentModal}
      className="relative w-[310px] sm:w-[380px] h-[210px] sm:h-[240px] cursor-pointer group transition-transform hover:scale-[1.02] active:scale-[0.99] select-none"
      title="Bấm vào để tùy chỉnh nhanh trang bị giường, gối, chăn, pijama và thú cưng"
    >
      <svg
        viewBox="30 115 340 185"
        className="w-full h-full filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
      >
        <defs>
          {/* Cloud Bed Gradient */}
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#ede9fe" />
            <stop offset="100%" stopColor="#ddd6fe" />
          </linearGradient>

          {/* Hammock Gradient */}
          <linearGradient id="hammockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="50%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Memory Foam Gradient */}
          <linearGradient id="memoryFoamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>

          {/* Wool Blanket Gradient */}
          <linearGradient id="woolGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Silk Blanket Gradient */}
          <linearGradient id="silkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="40%" stopColor="#f472b6" />
            <stop offset="70%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>
        </defs>

        {/* 1. Bed Base Layer */}
        {renderBedBase()}

        {/* 2. Pillow Layer */}
        {renderPillow()}

        {/* 3. Character Avatar with Pajamas Layer */}
        {renderCharacter()}

        {/* 4. Blanket Layer (Covers character body) */}
        {renderBlanket()}

        {/* 5. Companion / Pet / Accessories Layer */}
        {renderCompanion()}
      </svg>

      {/* Floating Interactive Hover Pill */}
      <div className="absolute -bottom-2 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="bg-purple-900/90 text-purple-200 text-[10px] font-bold px-3 py-1 rounded-full border border-purple-400/40 shadow-lg backdrop-blur-sm flex items-center gap-1">
          <span>✨</span>
          <span>Bấm vào để đổi Giường, Chăn, Đồ Ngủ & Pet</span>
        </span>
      </div>
    </div>
  );
};

