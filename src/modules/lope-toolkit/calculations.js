export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const getVenueDimensions = (lesson, venue) => {
  return lesson?.venueDimensions || venue?.defaultDimensions || { width: 28, height: 16 };
};

export const getPlacementMeterSize = (item) => {
  if (!item) {
    return { widthM: 0.9, heightM: 0.9, renderMode: 'icon' };
  }

  if (item.renderMode === 'icon') {
    return {
      widthM: 0.9,
      heightM: 0.9,
      renderMode: 'icon'
    };
  }

  return {
    widthM: item.width,
    heightM: item.height,
    renderMode: 'footprint'
  };
};

export const getPlacementPercentSize = (placement, venueDimensions) => {
  return {
    width: Number(((placement.widthM / venueDimensions.width) * 100).toFixed(2)),
    height: Number(((placement.heightM / venueDimensions.height) * 100).toFixed(2))
  };
};

export const meterToPercentPoint = (xM, yM, venueDimensions) => {
  return {
    x: Number(((xM / venueDimensions.width) * 100).toFixed(2)),
    y: Number(((yM / venueDimensions.height) * 100).toFixed(2))
  };
};

export const percentToMeterPoint = (x, y, venueDimensions) => {
  return {
    xM: Number(((x / 100) * venueDimensions.width).toFixed(2)),
    yM: Number(((y / 100) * venueDimensions.height).toFixed(2))
  };
};

export const createPlacement = ({ item, venueDimensions, xM, yM, quantity = 1 }) => {
  const size = getPlacementMeterSize(item);
  const maxX = Math.max(0, venueDimensions.width - size.widthM);
  const maxY = Math.max(0, venueDimensions.height - size.heightM);
  const clampedX = clamp(xM - size.widthM / 2, 0, maxX);
  const clampedY = clamp(yM - size.heightM / 2, 0, maxY);

  return {
    id: `placement_${crypto.randomUUID()}`,
    inventoryItemId: item.id,
    xM: Number(clampedX.toFixed(2)),
    yM: Number(clampedY.toFixed(2)),
    widthM: size.widthM,
    heightM: size.heightM,
    rotation: 0,
    quantity,
    renderMode: size.renderMode,
    zIndex: 1
  };
};

export const clampPlacementToVenue = (placement, venueDimensions) => {
  const maxX = Math.max(0, venueDimensions.width - placement.widthM);
  const maxY = Math.max(0, venueDimensions.height - placement.heightM);

  return {
    ...placement,
    xM: clamp(placement.xM, 0, maxX),
    yM: clamp(placement.yM, 0, maxY)
  };
};

export const getPlacementRenderBox = (placement, venueDimensions) => {
  const position = meterToPercentPoint(placement.xM, placement.yM, venueDimensions);
  const size = getPlacementPercentSize(placement, venueDimensions);

  return {
    left: `${position.x}%`,
    top: `${position.y}%`,
    width: `${size.width}%`,
    height: `${size.height}%`
  };
};

export const migrateLegacyPlacement = (placement, item, venueDimensions) => {
  if (placement?.xM !== undefined && placement?.yM !== undefined) {
    const meterSize =
      placement.widthM !== undefined && placement.heightM !== undefined
        ? { widthM: placement.widthM, heightM: placement.heightM }
        : getPlacementMeterSize(item);

    return clampPlacementToVenue(
      {
        ...placement,
        widthM: meterSize.widthM,
        heightM: meterSize.heightM
      },
      venueDimensions
    );
  }

  const point = percentToMeterPoint(placement?.x || 0, placement?.y || 0, venueDimensions);
  const size = getPlacementMeterSize(item);

  return clampPlacementToVenue(
    {
      ...placement,
      xM: point.xM,
      yM: point.yM,
      widthM: size.widthM,
      heightM: size.heightM
    },
    venueDimensions
  );
};

export const getLessonStats = (lesson) => {
  return {
    inventoryCount: lesson.selectedInventoryIds.length,
    placementCount: lesson.layoutPlacements.length,
    hasGoals: Boolean(lesson.goalOutput?.baseGoal)
  };
};

export const formatLessonDate = (date) => {
  return new Date(date).toLocaleDateString('nl-NL', {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  });
};
