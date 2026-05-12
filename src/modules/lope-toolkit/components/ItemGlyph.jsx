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
      {key === 'cone' ? <path d="M16 5 24 25H8Z" fill={fill} {...shared} /> : null}
      {key === 'marker' ? (
        <>
          <circle cx="16" cy="20" r="7" fill={fill} {...shared} />
          <path d="M12 11h8" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'mat' ? <rect x="5" y="8" width="22" height="16" rx="3" fill={fill} {...shared} /> : null}
      {key === 'bench' ? (
        <>
          <rect x="4" y="11" width="24" height="6" rx="2" fill={fill} {...shared} />
          <path d="M8 18v6M24 18v6" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'box' ? (
        <>
          <rect x="8" y="7" width="16" height="18" rx="2" fill={fill} {...shared} />
          <path d="M8 13h16M8 19h16" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'vault' ? (
        <>
          <path d="M10 10h12l2 6H8Z" fill={fill} {...shared} />
          <path d="M12 16v8M20 16v8" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'board' ? (
        <>
          <path d="M7 22 24 10l1 5-17 12Z" fill={fill} {...shared} />
        </>
      ) : null}
      {key === 'trampoline' ? (
        <>
          <rect x="7" y="10" width="18" height="10" rx="3" fill={fill} {...shared} />
          <path d="M10 21v4M22 21v4" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'rope' ? <path d="M10 5c5 3-3 7 4 10s-3 7 6 12" fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" /> : null}
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
          <path d="M8 24V11h16v13" fill="none" stroke={fill} strokeWidth="2.4" />
          <path d="M12 24V15M20 24V15M8 19h16" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'net' ? (
        <>
          <path d="M6 16h20M8 10v12M24 10v12" fill="none" stroke={fill} strokeWidth="2.4" />
          <path d="M10 12h12M10 20h12" fill="none" {...shared} />
        </>
      ) : null}
      {key === 'stick' ? <path d="M8 24 24 8" fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" /> : null}
      {key === 'racket' ? (
        <>
          <ellipse cx="18" cy="11" rx="7" ry="8" fill="none" stroke={fill} strokeWidth="2.2" />
          <path d="M13 16 8 24" fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" />
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
          <path d="M13 20v5M19 20v5" fill="none" {...shared} />
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
          <path d="M16 7v18" fill="none" {...shared} />
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
