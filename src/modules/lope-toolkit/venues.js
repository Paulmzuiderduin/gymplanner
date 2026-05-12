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

const round = (value) => Number(value.toFixed(2));

const buildGymzaalLines = ({ width, height }) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const basketCourtY = (height - 15) / 2;
  const volleyCourtY = (height - 9) / 2;
  const badmintonCourtY = (height - 6.1) / 2;

  return [
    createRect(0.2, 0.2, width - 0.4, height - 0.4, { strokeWidth: 0.12 }),
    createRect(0.5, basketCourtY, width - 1, 15, { strokeWidth: 0.12 }),
    createLine(centerX, basketCourtY, centerX, basketCourtY + 15, { strokeWidth: 0.1 }),
    createCircle(centerX, centerY, 1.8, { strokeWidth: 0.1 }),
    createRect(0.5, centerY - 2.45, 4.9, 4.9, { strokeWidth: 0.1 }),
    createRect(width - 5.4, centerY - 2.45, 4.9, 4.9, { strokeWidth: 0.1 }),
    createCircle(5.8, centerY, 1.8, { strokeWidth: 0.08 }),
    createCircle(width - 5.8, centerY, 1.8, { strokeWidth: 0.08 }),
    createRect(5, volleyCourtY, 18, 9, { strokeWidth: 0.08 }),
    createLine(centerX, volleyCourtY, centerX, volleyCourtY + 9, { strokeWidth: 0.08, dash: '0.35 0.25' }),
    createRect(0.9, badmintonCourtY, 13.4, 6.1, { strokeWidth: 0.06 }),
    createRect(width - 14.3, badmintonCourtY, 13.4, 6.1, { strokeWidth: 0.06 }),
    createLine(7.6, badmintonCourtY, 7.6, badmintonCourtY + 6.1, { strokeWidth: 0.05, dash: '0.25 0.2' }),
    createLine(width - 7.6, badmintonCourtY, width - 7.6, badmintonCourtY + 6.1, { strokeWidth: 0.05, dash: '0.25 0.2' })
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
    createRect(0.25, 0.25, width - 0.5, height - 0.5, { strokeWidth: 0.12 }),
    createRect(handballX, handballY, 40, 20, { strokeWidth: 0.13 }),
    createLine(centerX, handballY, centerX, handballY + 20, { strokeWidth: 0.1 }),
    createCircle(centerX, centerY, 3, { strokeWidth: 0.1 }),
    createPath(
      `M ${round(handballX + 6)} ${round(centerY - 6)} A 6 6 0 0 0 ${round(handballX + 6)} ${round(centerY + 6)}`,
      { strokeWidth: 0.12 }
    ),
    createPath(
      `M ${round(handballX + 34)} ${round(centerY - 6)} A 6 6 0 0 1 ${round(handballX + 34)} ${round(centerY + 6)}`,
      { strokeWidth: 0.12 }
    ),
    createRect(basketballX, basketballY, 28, 15, { strokeWidth: 0.08 }),
    createCircle(centerX, centerY, 1.8, { strokeWidth: 0.08 }),
    createRect(basketballX, centerY - 2.45, 4.9, 4.9, { strokeWidth: 0.08 }),
    createRect(basketballX + 23.1, centerY - 2.45, 4.9, 4.9, { strokeWidth: 0.08 })
  ];
};

const buildHockeyLines = ({ width, height }) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const line23Left = 22.9;
  const line23Right = width - 22.9;
  const circleRadius = 14.63;
  const goalWidth = 3.66;
  const goalY = centerY - goalWidth / 2;

  return [
    createRect(0.1, 0.1, width - 0.2, height - 0.2, { strokeWidth: 0.18 }),
    createLine(centerX, 0, centerX, height, { strokeWidth: 0.1 }),
    createLine(line23Left, 0, line23Left, height, { strokeWidth: 0.1 }),
    createLine(line23Right, 0, line23Right, height, { strokeWidth: 0.1 }),
    createPath(
      `M 0 ${round(centerY - circleRadius)} A ${circleRadius} ${circleRadius} 0 0 1 0 ${round(centerY + circleRadius)}`,
      { strokeWidth: 0.14 }
    ),
    createPath(
      `M ${width} ${round(centerY - circleRadius)} A ${circleRadius} ${circleRadius} 0 0 0 ${width} ${round(centerY + circleRadius)}`,
      { strokeWidth: 0.14 }
    ),
    createLine(6.4, centerY - 0.2, 6.4, centerY + 0.2, { strokeWidth: 0.22 }),
    createLine(width - 6.4, centerY - 0.2, width - 6.4, centerY + 0.2, { strokeWidth: 0.22 }),
    createRect(-0.1, goalY, 2.1, goalWidth, { strokeWidth: 0.08 }),
    createRect(width - 2, goalY, 2.1, goalWidth, { strokeWidth: 0.08 })
  ];
};

const buildSoccerLines = ({ width, height }) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const penaltyBoxHeight = 40.32;
  const goalAreaHeight = 18.32;
  const penaltyBoxY = (height - penaltyBoxHeight) / 2;
  const goalAreaY = (height - goalAreaHeight) / 2;

  return [
    createRect(0.1, 0.1, width - 0.2, height - 0.2, { strokeWidth: 0.18 }),
    createLine(centerX, 0, centerX, height, { strokeWidth: 0.1 }),
    createCircle(centerX, centerY, 9.15, { strokeWidth: 0.1 }),
    createRect(0, penaltyBoxY, 16.5, penaltyBoxHeight, { strokeWidth: 0.14 }),
    createRect(width - 16.5, penaltyBoxY, 16.5, penaltyBoxHeight, { strokeWidth: 0.14 }),
    createRect(0, goalAreaY, 5.5, goalAreaHeight, { strokeWidth: 0.12 }),
    createRect(width - 5.5, goalAreaY, 5.5, goalAreaHeight, { strokeWidth: 0.12 }),
    createCircle(11, centerY, 0.28, { strokeWidth: 0.18, fill: '#ffffff' }),
    createCircle(width - 11, centerY, 0.28, { strokeWidth: 0.18, fill: '#ffffff' }),
    createPath(
      `M 16.5 ${round(centerY - 9.15)} A 9.15 9.15 0 0 0 16.5 ${round(centerY + 9.15)}`,
      { strokeWidth: 0.1 }
    ),
    createPath(
      `M ${round(width - 16.5)} ${round(centerY - 9.15)} A 9.15 9.15 0 0 1 ${round(width - 16.5)} ${round(centerY + 9.15)}`,
      { strokeWidth: 0.1 }
    )
  ];
};

const buildAthleticsLines = ({ width, height }) => {
  const marginX = width * 0.11;
  const marginY = height * 0.08;
  const laneWidth = Math.min(width, height) * 0.017;
  const outerWidth = width - marginX * 2;
  const outerHeight = height - marginY * 2;
  const outerRadius = outerHeight / 2;
  const infieldX = marginX + laneWidth * 4.5;
  const infieldY = marginY + laneWidth * 4.5;
  const infieldWidth = outerWidth - laneWidth * 9;
  const infieldHeight = outerHeight - laneWidth * 9;

  return [
    createRect(marginX, marginY, outerWidth, outerHeight, {
      strokeWidth: 0.2,
      rx: outerRadius,
      ry: outerRadius
    }),
    createRect(marginX + laneWidth, marginY + laneWidth, outerWidth - laneWidth * 2, outerHeight - laneWidth * 2, {
      strokeWidth: 0.16,
      rx: outerRadius - laneWidth,
      ry: outerRadius - laneWidth
    }),
    createRect(marginX + laneWidth * 2, marginY + laneWidth * 2, outerWidth - laneWidth * 4, outerHeight - laneWidth * 4, {
      strokeWidth: 0.14,
      rx: outerRadius - laneWidth * 2,
      ry: outerRadius - laneWidth * 2
    }),
    createRect(marginX + laneWidth * 3, marginY + laneWidth * 3, outerWidth - laneWidth * 6, outerHeight - laneWidth * 6, {
      strokeWidth: 0.12,
      rx: outerRadius - laneWidth * 3,
      ry: outerRadius - laneWidth * 3
    }),
    createRect(marginX + laneWidth * 4, marginY + laneWidth * 4, outerWidth - laneWidth * 8, outerHeight - laneWidth * 8, {
      strokeWidth: 0.1,
      rx: outerRadius - laneWidth * 4,
      ry: outerRadius - laneWidth * 4
    }),
    createRect(infieldX, infieldY, infieldWidth, infieldHeight, {
      strokeWidth: 0.1,
      rx: infieldHeight / 2,
      ry: infieldHeight / 2
    }),
    createLine(width / 2, marginY, width / 2, height - marginY, { strokeWidth: 0.12, dash: '1.8 1.2' }),
    createLine(marginX, height / 2, width - marginX, height / 2, { strokeWidth: 0.1 }),
    createLine(width * 0.23, marginY, width * 0.23, marginY + outerHeight * 0.22, { strokeWidth: 0.14 }),
    createLine(width * 0.77, height - marginY, width * 0.77, height - marginY - outerHeight * 0.22, { strokeWidth: 0.14 })
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
