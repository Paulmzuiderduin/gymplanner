const createRect = (x, y, width, height, extra = {}) => ({
  type: 'rect',
  x,
  y,
  width,
  height,
  ...extra
});

const createLine = (x1, y1, x2, y2, extra = {}) => ({
  type: 'line',
  x1,
  y1,
  x2,
  y2,
  ...extra
});

const createCircle = (cx, cy, r, extra = {}) => ({
  type: 'circle',
  cx,
  cy,
  r,
  ...extra
});

const createPath = (d, extra = {}) => ({
  type: 'path',
  d,
  ...extra
});

const createEllipse = (cx, cy, rx, ry, extra = {}) => ({
  type: 'ellipse',
  cx,
  cy,
  rx,
  ry,
  ...extra
});

const round = (value) => Number(value.toFixed(2));
const LINE_COLORS = {
  neutral: '#fffdf6',
  basketball: '#d94841',
  volleyball: '#e0b321',
  badminton: '#2f7de1',
  handball: '#fffdf6'
};

const buildGymzaalLines = ({ width, height }) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const paddingX = width * 0.045;
  const paddingY = height * 0.05;
  const courtWidth = width - paddingX * 2;
  const courtHeight = height - paddingY * 2;
  const thirdWidth = courtWidth / 3;
  const leftLaneX = paddingX;
  const midLaneX = paddingX + thirdWidth;
  const rightLaneX = paddingX + thirdWidth * 2;
  const basketballInsetX = width * 0.018;
  const basketballInsetY = height * 0.08;
  const basketLaneWidth = thirdWidth - basketballInsetX * 1.8;
  const basketLaneHeight = height - basketballInsetY * 2;
  const basketLeftX = leftLaneX + basketballInsetX;
  const basketMidX = midLaneX + basketballInsetX;
  const basketRightX = rightLaneX + basketballInsetX;
  const volleyballTop = height * 0.215;
  const volleyballHeight = height * 0.57;
  const volleyballWidth = thirdWidth * 1.78;
  const volleyballX = centerX - volleyballWidth / 2;
  const badmintonTop = height * 0.24;
  const badmintonHeight = height * 0.52;
  const badmintonWidth = thirdWidth * 0.92;
  const badmintonLeftX = leftLaneX + thirdWidth * 0.07;
  const badmintonRightX = rightLaneX + thirdWidth * 0.01;

  return [
    createRect(0.15, 0.15, width - 0.3, height - 0.3, { strokeWidth: 0.12, stroke: '#efe7d9' }),
    createRect(0.45, 0.45, width - 0.9, height - 0.9, { strokeWidth: 0.1, stroke: '#e8dec9' }),
    createLine(centerX, 0.35, centerX, height - 0.35, { strokeWidth: 0.08, dash: '0.3 0.25', stroke: LINE_COLORS.basketball }),

    // Basketball: three aligned courts with key areas and circles.
    createRect(basketLeftX, basketballInsetY, basketLaneWidth, basketLaneHeight, { strokeWidth: 0.12, stroke: LINE_COLORS.basketball }),
    createRect(basketMidX, basketballInsetY, basketLaneWidth, basketLaneHeight, { strokeWidth: 0.12, stroke: LINE_COLORS.basketball }),
    createRect(basketRightX, basketballInsetY, basketLaneWidth, basketLaneHeight, { strokeWidth: 0.12, stroke: LINE_COLORS.basketball }),
    createLine(leftLaneX + thirdWidth, basketballInsetY, leftLaneX + thirdWidth, height - basketballInsetY, { strokeWidth: 0.08, dash: '0.28 0.2', stroke: LINE_COLORS.basketball }),
    createLine(rightLaneX, basketballInsetY, rightLaneX, height - basketballInsetY, { strokeWidth: 0.08, dash: '0.28 0.2', stroke: LINE_COLORS.basketball }),
    createLine(basketLeftX + basketLaneWidth / 2, basketballInsetY, basketLeftX + basketLaneWidth / 2, height - basketballInsetY, { strokeWidth: 0.06, dash: '0.22 0.18', stroke: LINE_COLORS.basketball }),
    createLine(basketMidX + basketLaneWidth / 2, basketballInsetY, basketMidX + basketLaneWidth / 2, height - basketballInsetY, { strokeWidth: 0.06, dash: '0.22 0.18', stroke: LINE_COLORS.basketball }),
    createLine(basketRightX + basketLaneWidth / 2, basketballInsetY, basketRightX + basketLaneWidth / 2, height - basketballInsetY, { strokeWidth: 0.06, dash: '0.22 0.18', stroke: LINE_COLORS.basketball }),
    createCircle(leftLaneX + thirdWidth / 2, centerY, 1.7, { strokeWidth: 0.08, stroke: LINE_COLORS.basketball }),
    createCircle(centerX, centerY, 1.8, { strokeWidth: 0.08, stroke: LINE_COLORS.basketball }),
    createCircle(rightLaneX + thirdWidth / 2, centerY, 1.7, { strokeWidth: 0.08, stroke: LINE_COLORS.basketball }),
    createRect(leftLaneX + 0.5, centerY - 2.7, 5, 5.4, { strokeWidth: 0.08, stroke: LINE_COLORS.basketball }),
    createRect(leftLaneX + thirdWidth - 5.5, centerY - 2.7, 5, 5.4, { strokeWidth: 0.08, stroke: LINE_COLORS.basketball }),
    createRect(centerX - 2.5, centerY - 2.7, 5, 5.4, { strokeWidth: 0.08, stroke: LINE_COLORS.basketball }),
    createRect(rightLaneX + 0.5, centerY - 2.7, 5, 5.4, { strokeWidth: 0.08, stroke: LINE_COLORS.basketball }),
    createRect(width - thirdWidth + 0.5, centerY - 2.7, 5, 5.4, { strokeWidth: 0.08, stroke: LINE_COLORS.basketball }),

    // Volleyball: centered full-court and service areas.
    createRect(volleyballX, volleyballTop, volleyballWidth, volleyballHeight, { strokeWidth: 0.1, stroke: LINE_COLORS.volleyball }),
    createLine(centerX, volleyballTop, centerX, volleyballTop + volleyballHeight, { strokeWidth: 0.08, dash: '0.28 0.2', stroke: LINE_COLORS.volleyball }),
    createLine(volleyballX, volleyballTop + volleyballHeight / 2, volleyballX + volleyballWidth, volleyballTop + volleyballHeight / 2, { strokeWidth: 0.06, dash: '0.22 0.18', stroke: LINE_COLORS.volleyball }),
    createLine(volleyballX + volleyballWidth * 0.18, volleyballTop, volleyballX + volleyballWidth * 0.18, volleyballTop + volleyballHeight, { strokeWidth: 0.05, dash: '0.16 0.18', stroke: LINE_COLORS.volleyball }),
    createLine(volleyballX + volleyballWidth * 0.82, volleyballTop, volleyballX + volleyballWidth * 0.82, volleyballTop + volleyballHeight, { strokeWidth: 0.05, dash: '0.16 0.18', stroke: LINE_COLORS.volleyball }),

    // Badminton: two side courts.
    createRect(badmintonLeftX, badmintonTop, badmintonWidth, badmintonHeight, { strokeWidth: 0.08, stroke: LINE_COLORS.badminton }),
    createRect(width - badmintonLeftX - badmintonWidth, badmintonTop, badmintonWidth, badmintonHeight, { strokeWidth: 0.08, stroke: LINE_COLORS.badminton }),
    createLine(badmintonLeftX + badmintonWidth / 2, badmintonTop, badmintonLeftX + badmintonWidth / 2, badmintonTop + badmintonHeight, { strokeWidth: 0.06, dash: '0.18 0.18', stroke: LINE_COLORS.badminton }),
    createLine(width - badmintonLeftX - badmintonWidth / 2, badmintonTop, width - badmintonLeftX - badmintonWidth / 2, badmintonTop + badmintonHeight, { strokeWidth: 0.06, dash: '0.18 0.18', stroke: LINE_COLORS.badminton }),
    createLine(badmintonLeftX, badmintonTop + badmintonHeight / 2, badmintonLeftX + badmintonWidth, badmintonTop + badmintonHeight / 2, { strokeWidth: 0.05, dash: '0.15 0.18', stroke: LINE_COLORS.badminton }),
    createLine(width - badmintonLeftX - badmintonWidth, badmintonTop + badmintonHeight / 2, width - badmintonLeftX, badmintonTop + badmintonHeight / 2, { strokeWidth: 0.05, dash: '0.15 0.18', stroke: LINE_COLORS.badminton })
  ];
};

const buildSporthalLines = ({ width, height }) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const handballX = (width - 40) / 2;
  const handballY = (height - 20) / 2;
  const basketballX = (width - 28) / 2;
  const basketballY = (height - 15) / 2;

  return [
    createRect(0.25, 0.25, width - 0.5, height - 0.5, { strokeWidth: 0.12, stroke: '#efe7d9' }),
    createRect(0.55, 0.55, width - 1.1, height - 1.1, { strokeWidth: 0.08, stroke: '#e8dec9' }),
    createLine(centerX, 0.4, centerX, height - 0.4, { strokeWidth: 0.08, dash: '0.3 0.25', stroke: LINE_COLORS.handball }),
    createRect(handballX, handballY, 40, 20, { strokeWidth: 0.13, stroke: LINE_COLORS.handball }),
    createLine(centerX, handballY, centerX, handballY + 20, { strokeWidth: 0.08, stroke: LINE_COLORS.handball }),
    createCircle(centerX, centerY, 3, { strokeWidth: 0.08, stroke: LINE_COLORS.handball }),
    createPath(`M ${round(handballX + 6)} ${round(centerY - 6)} A 6 6 0 0 0 ${round(handballX + 6)} ${round(centerY + 6)}`, {
      strokeWidth: 0.11,
      stroke: LINE_COLORS.handball
    }),
    createPath(`M ${round(handballX + 34)} ${round(centerY - 6)} A 6 6 0 0 1 ${round(handballX + 34)} ${round(centerY + 6)}`, {
      strokeWidth: 0.11,
      stroke: LINE_COLORS.handball
    }),
    createRect(basketballX, basketballY, 28, 15, { strokeWidth: 0.1, stroke: LINE_COLORS.basketball }),
    createCircle(centerX, centerY, 1.8, { strokeWidth: 0.08, stroke: LINE_COLORS.basketball }),
    createRect(basketballX, centerY - 2.45, 4.9, 4.9, { strokeWidth: 0.08, stroke: LINE_COLORS.basketball }),
    createRect(basketballX + 23.1, centerY - 2.45, 4.9, 4.9, { strokeWidth: 0.08, stroke: LINE_COLORS.basketball }),
    createLine(4, centerY - 4, width - 4, centerY - 4, { strokeWidth: 0.05, dash: '0.2 0.2', stroke: LINE_COLORS.volleyball }),
    createLine(4, centerY + 4, width - 4, centerY + 4, { strokeWidth: 0.05, dash: '0.2 0.2', stroke: LINE_COLORS.volleyball })
  ];
};

const buildHockeyLines = ({ width, height }) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const DRadius = 14.63;
  const goalWidth = 3.66;
  const goalY = centerY - goalWidth / 2;
  const quarterLine = width * 0.25;
  const threeQuarterLine = width * 0.75;

  return [
    createRect(0.1, 0.1, width - 0.2, height - 0.2, { strokeWidth: 0.18 }),
    createRect(0.45, 0.45, width - 0.9, height - 0.9, { strokeWidth: 0.08, stroke: '#d5e7d1' }),
    createLine(centerX, 0, centerX, height, { strokeWidth: 0.1 }),
    createLine(quarterLine, 0, quarterLine, height, { strokeWidth: 0.08, dash: '0.26 0.18' }),
    createLine(threeQuarterLine, 0, threeQuarterLine, height, { strokeWidth: 0.08, dash: '0.26 0.18' }),
    createCircle(centerX, centerY, 0.3, { strokeWidth: 0.08, fill: '#ffffff' }),
    createPath(`M 0 ${round(centerY - DRadius)} A ${DRadius} ${DRadius} 0 0 1 0 ${round(centerY + DRadius)}`, {
      strokeWidth: 0.14
    }),
    createPath(`M ${width} ${round(centerY - DRadius)} A ${DRadius} ${DRadius} 0 0 0 ${width} ${round(centerY + DRadius)}`, {
      strokeWidth: 0.14
    }),
    createPath(`M 6.4 ${round(centerY - 9.15)} A 9.15 9.15 0 0 0 6.4 ${round(centerY + 9.15)}`, { strokeWidth: 0.08 }),
    createPath(`M ${round(width - 6.4)} ${round(centerY - 9.15)} A 9.15 9.15 0 0 1 ${round(width - 6.4)} ${round(centerY + 9.15)}`, { strokeWidth: 0.08 }),
    createRect(-0.1, goalY, 2.1, goalWidth, { strokeWidth: 0.08 }),
    createRect(width - 2, goalY, 2.1, goalWidth, { strokeWidth: 0.08 }),
    createPath(`M 10 ${round(height * 0.1)} A ${round(height * 0.28)} ${round(height * 0.28)} 0 0 1 10 ${round(height * 0.9)}`, {
      strokeWidth: 0.08,
      dash: '0.18 0.16'
    }),
    createPath(`M ${round(width - 10)} ${round(height * 0.1)} A ${round(height * 0.28)} ${round(height * 0.28)} 0 0 0 ${round(width - 10)} ${round(height * 0.9)}`, {
      strokeWidth: 0.08,
      dash: '0.18 0.16'
    })
  ];
};

const buildSoccerLines = ({ width, height }) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const penaltyBoxHeight = height * 0.56;
  const goalAreaHeight = height * 0.27;
  const penaltyBoxY = (height - penaltyBoxHeight) / 2;
  const goalAreaY = (height - goalAreaHeight) / 2;
  const cornerArc = Math.min(width, height) * 0.04;

  return [
    createRect(0.12, 0.12, width - 0.24, height - 0.24, { strokeWidth: 0.18 }),
    createRect(0.5, 0.5, width - 1, height - 1, { strokeWidth: 0.08, stroke: '#d8e9d8' }),
    createLine(centerX, 0, centerX, height, { strokeWidth: 0.1 }),
    createCircle(centerX, centerY, 9.15, { strokeWidth: 0.1 }),
    createRect(0, penaltyBoxY, 16.5, penaltyBoxHeight, { strokeWidth: 0.14 }),
    createRect(width - 16.5, penaltyBoxY, 16.5, penaltyBoxHeight, { strokeWidth: 0.14 }),
    createRect(0, goalAreaY, 5.5, goalAreaHeight, { strokeWidth: 0.12 }),
    createRect(width - 5.5, goalAreaY, 5.5, goalAreaHeight, { strokeWidth: 0.12 }),
    createCircle(11, centerY, 0.28, { strokeWidth: 0.18, fill: '#ffffff' }),
    createCircle(width - 11, centerY, 0.28, { strokeWidth: 0.18, fill: '#ffffff' }),
    createPath(`M 16.5 ${round(centerY - 9.15)} A 9.15 9.15 0 0 0 16.5 ${round(centerY + 9.15)}`, { strokeWidth: 0.1 }),
    createPath(`M ${round(width - 16.5)} ${round(centerY - 9.15)} A 9.15 9.15 0 0 1 ${round(width - 16.5)} ${round(centerY + 9.15)}`, {
      strokeWidth: 0.1
    }),
    createPath(`M 0 ${cornerArc} A ${cornerArc} ${cornerArc} 0 0 1 ${cornerArc} 0`, { strokeWidth: 0.08 }),
    createPath(`M ${width - cornerArc} 0 A ${cornerArc} ${cornerArc} 0 0 1 ${width} ${cornerArc}`, { strokeWidth: 0.08 }),
    createPath(`M ${width} ${height - cornerArc} A ${cornerArc} ${cornerArc} 0 0 1 ${width - cornerArc} ${height}`, {
      strokeWidth: 0.08
    }),
    createPath(`M ${cornerArc} ${height} A ${cornerArc} ${cornerArc} 0 0 1 0 ${height - cornerArc}`, { strokeWidth: 0.08 })
  ];
};

const buildAthleticsLines = ({ width, height }) => {
  const laneCount = 8;
  const laneWidth = Math.min(width, height) * 0.018;
  const outerRadius = height * 0.33;
  const trackInsetX = width * 0.1;
  const trackInsetY = height * 0.1;
  const trackWidth = width - trackInsetX * 2;
  const trackHeight = height - trackInsetY * 2;
  const innerInset = laneWidth * laneCount;
  const infieldWidth = trackWidth - innerInset * 1.15;
  const infieldHeight = trackHeight - innerInset * 1.15;
  const infieldX = trackInsetX + innerInset * 0.575;
  const infieldY = trackInsetY + innerInset * 0.575;
  const laneLines = [];

  for (let lane = 1; lane < laneCount; lane += 1) {
    const inset = lane * laneWidth;
    laneLines.push(
      createRect(trackInsetX + inset, trackInsetY + inset, trackWidth - inset * 2, trackHeight - inset * 2, {
        strokeWidth: 0.06 + lane * 0.008,
        rx: outerRadius - inset,
        ry: outerRadius - inset
      })
    );
  }

  return [
    createRect(trackInsetX, trackInsetY, trackWidth, trackHeight, {
      strokeWidth: 0.2,
      rx: outerRadius,
      ry: outerRadius
    }),
    ...laneLines,
    createRect(infieldX, infieldY, infieldWidth, infieldHeight, {
      strokeWidth: 0.1,
      rx: infieldHeight / 2,
      ry: infieldHeight / 2
    }),
    createLine(width / 2, trackInsetY, width / 2, height - trackInsetY, { strokeWidth: 0.1, dash: '0.4 0.28' }),
    createLine(trackInsetX, height / 2, width - trackInsetX, height / 2, { strokeWidth: 0.08 }),
    createPath(
      `M ${round(trackInsetX + 2)} ${round(height / 2 - 2.4)} A 2.4 2.4 0 0 1 ${round(trackInsetX + 2)} ${round(height / 2 + 2.4)}`,
      { strokeWidth: 0.08 }
    ),
    createPath(
      `M ${round(width - trackInsetX - 2)} ${round(height / 2 - 2.4)} A 2.4 2.4 0 0 0 ${round(width - trackInsetX - 2)} ${round(height / 2 + 2.4)}`,
      { strokeWidth: 0.08 }
    ),
    createLine(infieldX + infieldWidth * 0.5, infieldY, infieldX + infieldWidth * 0.5, infieldY + infieldHeight, { strokeWidth: 0.06, dash: '0.18 0.16' }),
    createLine(infieldX, infieldY + infieldHeight * 0.5, infieldX + infieldWidth, infieldY + infieldHeight * 0.5, { strokeWidth: 0.06, dash: '0.18 0.16' })
  ];
};

export const VENUE_TEMPLATES = [
  {
    id: 'gymzaal-standard',
    nameNl: 'Gymzaal standaard',
    kind: 'indoor',
    background: 'hall',
    defaultDimensions: { width: 28, height: 16 },
    dimensionEditable: true,
    buildLineLayers: buildGymzaalLines
  },
  {
    id: 'sporthal-standard',
    nameNl: 'Sporthal standaard',
    kind: 'indoor',
    background: 'hall',
    defaultDimensions: { width: 44, height: 24 },
    dimensionEditable: true,
    buildLineLayers: buildSporthalLines
  },
  {
    id: 'hockeyveld-standard',
    nameNl: 'Veldhockeyveld',
    kind: 'outdoor',
    background: 'field',
    defaultDimensions: { width: 91.4, height: 55 },
    dimensionEditable: false,
    buildLineLayers: buildHockeyLines
  },
  {
    id: 'voetbalveld-standard',
    nameNl: 'Voetbalveld',
    kind: 'outdoor',
    background: 'field',
    defaultDimensions: { width: 100, height: 64 },
    dimensionEditable: false,
    buildLineLayers: buildSoccerLines
  },
  {
    id: 'atletiek-standard',
    nameNl: 'Atletiekbaan',
    kind: 'outdoor',
    background: 'track',
    defaultDimensions: { width: 120, height: 75 },
    dimensionEditable: false,
    buildLineLayers: buildAthleticsLines
  }
];

export const venueLookup = Object.fromEntries(VENUE_TEMPLATES.map((venue) => [venue.id, venue]));
