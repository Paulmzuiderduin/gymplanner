import React from 'react';

const shared = {
  stroke: 'rgba(24, 53, 47, 0.78)',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

const ItemGlyph = ({ item, className = 'h-8 w-8' }) => {
  const fill = item?.color || '#9ca3af';
  const key = item?.imageKey || 'ball';

  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      {key === 'ball' ? (
        <>
          <circle cx="16" cy="16" r="10" fill={fill} {...shared} />
          <path d="M8 12c4 2 12 2 16 0" fill="none" {...shared} />
          <path d="M10 22c3-3 9-3 12 0" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'basketball' ? (
        <>
          <circle cx="16" cy="16" r="10" fill={fill} {...shared} />
          <path d="M6 16h20M16 6v20" fill="none" {...shared} />
          <path d="M9 8c3 3 3 13 0 16M23 8c-3 3-3 13 0 16" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'soccerball' ? (
        <>
          <circle cx="16" cy="16" r="10" fill={fill} {...shared} />
          <path d="M16 10l3 2-1 4h-4l-1-4Z" fill="rgba(255,255,255,0.45)" stroke="rgba(24, 53, 47, 0.75)" strokeWidth="1.2" />
          <path d="M10 12 8 16l3 3M22 12l2 4-3 3M12 22h8" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'volleyball' ? (
        <>
          <circle cx="16" cy="16" r="10" fill={fill} {...shared} />
          <path d="M11 7c4 3 6 8 5 15M22 9c-5 1-8 5-10 11M7 16c4-2 10-2 16 1" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'handball' ? (
        <>
          <circle cx="16" cy="16" r="10" fill={fill} {...shared} />
          <path d="M9 11c4 1 9 1 14 0M11 21c3-2 7-2 10 0M16 6c2 4 2 16 0 20" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'korfball' ? (
        <>
          <circle cx="16" cy="16" r="10" fill={fill} {...shared} />
          <path d="M8 12h16M10 21c3-2 9-2 12 0" fill="none" {...shared} />
          <path d="M11 8c2 3 8 3 10 0" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'hockeyball' ? (
        <>
          <circle cx="16" cy="16" r="8.5" fill={fill} {...shared} />
          <circle cx="13.5" cy="13.5" r="1.4" fill="rgba(255,255,255,0.72)" />
        </>
      ) : null}
      {key === 'tennisball' ? (
        <>
          <circle cx="16" cy="16" r="10" fill={fill} {...shared} />
          <path d="M11 7c-2 2-4 6-4 9s2 7 4 9M21 7c2 2 4 6 4 9s-2 7-4 9" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
        </>
      ) : null}
      {key === 'medicineball' ? (
        <>
          <circle cx="16" cy="16" r="10" fill={fill} {...shared} />
          <path d="M11 11h10v10H11Z" fill="rgba(255,255,255,0.18)" stroke="rgba(24, 53, 47, 0.65)" strokeWidth="1.1" />
        </>
      ) : null}
      {key === 'oval-ball' ? (
        <ellipse cx="16" cy="16" rx="10" ry="7" fill={fill} {...shared} transform="rotate(-22 16 16)" />
      ) : null}
      {key === 'ring' ? (
        <>
          <circle cx="16" cy="16" r="10" fill="none" stroke={fill} strokeWidth="4" />
          <circle cx="16" cy="16" r="4" fill="rgba(255,255,255,0.9)" />
        </>
      ) : null}
      {key === 'disc' ? <ellipse cx="16" cy="16" rx="10" ry="4.5" fill={fill} {...shared} /> : null}
      {key === 'cone' ? (
        <>
          <path d="M16 5 23 24H9Z" fill={fill} {...shared} />
          <path d="M11 24h10" fill="none" {...shared} />
          <path d="M13 14h6" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'marker' ? (
        <>
          <circle cx="16" cy="20" r="7" fill={fill} {...shared} />
          <path d="M12 11h8" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'mat' ? (
        <>
          <rect x="4.5" y="7" width="23" height="18" rx="3.5" fill={fill} />
          <path d="M8 12h16M8 20h16" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round" />
        </>
      ) : null}
      {key === 'bench' ? (
        <>
          <rect x="4" y="10" width="24" height="5" rx="2" fill={fill} {...shared} />
          <rect x="6" y="15.5" width="20" height="2.5" rx="1.2" fill="rgba(255,255,255,0.45)" />
          <path d="M8 18v6M24 18v6M11 18v5M21 18v5" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'box' ? (
        <>
          <rect x="8" y="6.5" width="16" height="19" rx="2" fill={fill} {...shared} />
          <path d="M8 12.5h16M8 18.5h16M8 24.5h16" fill="none" {...shared} />
          <path d="M11 9.5h10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.1" />
        </>
      ) : null}
      {key === 'vault' ? (
        <>
          <path d="M9 12c2-3 12-3 14 0l-1.5 5H10.5Z" fill={fill} {...shared} />
          <path d="M12 17v7M20 17v7" fill="none" {...shared} />
          <path d="M11 14h10" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="1.1" />
        </>
      ) : null}
      {key === 'board' ? (
        <>
          <path d="M8 23c4-5 8-8 15-13l1 4c-6 3-10 7-15 12Z" fill={fill} {...shared} />
          <path d="M13 19 20 14" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
        </>
      ) : null}
      {key === 'trampoline' ? (
        <>
          <rect x="7" y="10" width="18" height="10" rx="4" fill={fill} {...shared} />
          <rect x="9.5" y="12.5" width="13" height="5" rx="2.5" fill="rgba(255,255,255,0.38)" stroke="rgba(24, 53, 47, 0.4)" strokeWidth="1" />
          <path d="M10 21v4M22 21v4M13 20.5v4M19 20.5v4" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'rope' ? (
        <>
          <path d="M10 5c5 3-3 7 4 10s-3 7 6 12" fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" />
          <circle cx="11" cy="7" r="1.5" fill={fill} />
        </>
      ) : null}
      {key === 'rings' ? (
        <>
          <path d="M11 7v7M21 7v7" fill="none" {...shared} />
          <circle cx="11" cy="18" r="4" fill="none" stroke={fill} strokeWidth="3" />
          <circle cx="21" cy="18" r="4" fill="none" stroke={fill} strokeWidth="3" />
        </>
      ) : null}
      {key === 'ladder' ? (
        <>
          <path d="M10 6v20M22 6v20M10 10h12M10 15h12M10 20h12" fill="none" stroke={fill} strokeWidth="2.2" />
        </>
      ) : null}
      {key === 'bar' ? (
        <>
          <path d="M7 12h18M10 12v10M22 12v10" fill="none" stroke={fill} strokeWidth="2.4" />
        </>
      ) : null}
      {key === 'goal' ? (
        <>
          <path d="M8 23V10h14v13" fill="none" stroke={fill} strokeWidth="2.4" />
          <path d="M22 13v10M22 13H8M22 23H8" fill="none" stroke="rgba(24, 53, 47, 0.48)" strokeWidth="1.8" />
          <path d="M12 23V15M18 23V15M8 19h14" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'net' ? (
        <>
          <path d="M6 16h20M8 9v14M24 9v14" fill="none" stroke={fill} strokeWidth="2.4" />
          <path d="M10 12h12M10 16h12M10 20h12M13 10v12M19 10v12" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'stick' ? (
        <>
          <path d="M9 23 24 8" fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" />
          <path d="M7 24h4l2-2" fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : null}
      {key === 'racket' ? (
        <>
          <ellipse cx="18" cy="11" rx="7" ry="8" fill="none" stroke={fill} strokeWidth="2.2" />
          <path d="M13 16 8 24" fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" />
          <path d="M14 7v8M18 4v14M22 7v8M12 11h12" fill="none" stroke="rgba(24, 53, 47, 0.38)" strokeWidth="1" />
        </>
      ) : null}
      {key === 'paddle' ? (
        <>
          <circle cx="17" cy="11" r="6" fill={fill} {...shared} />
          <path d="M14 17 10 24" fill="none" stroke="rgba(24, 53, 47, 0.78)" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : null}
      {key === 'bag' ? <rect x="9" y="10" width="14" height="12" rx="3" fill={fill} {...shared} /> : null}
      {key === 'blocks' ? (
        <>
          <rect x="7" y="16" width="8" height="8" rx="2" fill={fill} {...shared} />
          <rect x="17" y="8" width="8" height="8" rx="2" fill={fill} {...shared} />
        </>
      ) : null}
      {key === 'juggle' ? (
        <>
          <circle cx="11" cy="18" r="4" fill={fill} {...shared} />
          <circle cx="21" cy="18" r="4" fill={fill} {...shared} />
          <circle cx="16" cy="10" r="4" fill={fill} {...shared} />
        </>
      ) : null}
      {key === 'bib' ? <path d="M10 8h12l-2 16H12Z" fill={fill} {...shared} /> : null}
      {key === 'base' ? <rect x="8" y="8" width="16" height="16" rx="2" fill={fill} {...shared} transform="rotate(45 16 16)" /> : null}
      {key === 'shuttle' ? (
        <>
          <circle cx="16" cy="22" r="3" fill={fill} {...shared} />
          <path d="M16 7v12M12 10l4 4 4-4" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'timer' ? (
        <>
          <circle cx="16" cy="18" r="8" fill="none" stroke={fill} strokeWidth="2.4" />
          <path d="M16 10V6M16 18l4-3" fill="none" stroke={fill} strokeWidth="2.4" strokeLinecap="round" />
        </>
      ) : null}
      {key === 'tape' ? (
        <>
          <path d="M6 20h20" fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" />
          <path d="M10 16v8M16 16v8M22 16v8" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'scoreboard' ? (
        <>
          <rect x="7" y="8" width="18" height="12" rx="2" fill={fill} {...shared} />
          <path d="M11 12h4M17 12h4M13 20v5M19 20v5" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'pump' ? (
        <>
          <rect x="12" y="9" width="8" height="11" rx="2" fill={fill} {...shared} />
          <path d="M16 9V5M20 12h5" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'cart' ? (
        <>
          <rect x="8" y="9" width="16" height="10" rx="2" fill={fill} {...shared} />
          <circle cx="12" cy="24" r="2" fill={fill} />
          <circle cx="20" cy="24" r="2" fill={fill} />
        </>
      ) : null}
      {key === 'cabinet' ? (
        <>
          <rect x="8" y="7" width="16" height="18" rx="2" fill={fill} {...shared} />
          <path d="M16 7v18M14 16h1M17 16h1" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'rack' ? (
        <>
          <path d="M10 22V10M22 22V10M10 22h12" fill="none" {...shared} />
          <circle cx="16" cy="11" r="4" fill="none" stroke={fill} strokeWidth="2.4" />
        </>
      ) : null}
      {key === 'whiteboard' ? (
        <>
          <rect x="6" y="7" width="20" height="14" rx="2" fill={fill} {...shared} />
          <path d="M11 22v4M21 22v4" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'tray' ? <rect x="8" y="13" width="16" height="8" rx="2" fill={fill} {...shared} /> : null}
      {key === 'whistle' ? (
        <>
          <path d="M9 18c0-3 2-5 5-5h4v8h-4c-3 0-5-2-5-3Z" fill={fill} {...shared} />
          <circle cx="21" cy="16" r="3" fill="none" stroke={fill} strokeWidth="2.4" />
        </>
      ) : null}
    </svg>
  );
};

export default ItemGlyph;
