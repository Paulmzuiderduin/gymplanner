export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const getVenueDimensions = (lesson, venue) => {
  return lesson?.venueDimensions || venue?.defaultDimensions || { width: 28, height: 16 };
};

export const getPlacementSize = (item, venueDimensions) => {
  if (!item) return { width: 6, height: 6, renderMode: 'icon' };

  if (item.renderMode === 'icon') {
    return {
      width: item.width,
      height: item.height,
      renderMode: 'icon'
    };
  }

  return {
    width: Number(((item.width / venueDimensions.width) * 100).toFixed(2)),
    height: Number(((item.height / venueDimensions.height) * 100).toFixed(2)),
    renderMode: 'footprint'
  };
};

export const createPlacement = ({ item, venueDimensions, x, y, quantity = 1 }) => {
  const size = getPlacementSize(item, venueDimensions);
  const clampedX = clamp(x - size.width / 2, 0, 100 - size.width);
  const clampedY = clamp(y - size.height / 2, 0, 100 - size.height);

  return {
    id: `placement_${crypto.randomUUID()}`,
    inventoryItemId: item.id,
    x: Number(clampedX.toFixed(2)),
    y: Number(clampedY.toFixed(2)),
    width: size.width,
    height: size.height,
    rotation: 0,
    quantity,
    renderMode: size.renderMode,
    zIndex: 1
  };
};

export const clampPlacementToCanvas = (placement) => {
  return {
    ...placement,
    x: clamp(placement.x, 0, 100 - placement.width),
    y: clamp(placement.y, 0, 100 - placement.height)
  };
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
