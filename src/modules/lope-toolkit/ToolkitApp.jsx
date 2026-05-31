import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Copy,
  FolderPlus,
  LayoutTemplate,
  Move3D,
  Search,
  Sparkles,
  Trash2
} from 'lucide-react';
import EmptyState from './components/EmptyState';
import ItemGlyph from './components/ItemGlyph';
import SectionHeader from './components/SectionHeader';
import StatPill from './components/StatPill';
import {
  clampPlacementToVenue,
  createPlacement,
  formatLessonDate,
  getLessonStats,
  getPlacementPercentSize,
  getPlacementRenderBox,
  getVenueDimensions,
  meterToPercentPoint,
  percentToMeterPoint
} from './calculations';
import { createEmptyData, createLesson, createSampleData } from './dataModel';
import { generateBeweegdoelen } from './goalGenerator';
import { INVENTORY_CATEGORIES, INVENTORY_ITEMS, inventoryLookup } from './inventory';
import { storage } from './storage';
import { VENUE_TEMPLATES, venueLookup } from './venues';

const TABS = [
  { id: 'dashboard', label: 'Overzicht', icon: LayoutTemplate },
  { id: 'planner', label: 'Gymplanner', icon: Move3D },
  { id: 'goals', label: 'Beweegdoelen', icon: Sparkles }
];

const SCHOOL_TYPES = ['basisonderwijs', 'voortgezet onderwijs'];

const clone = (value) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
};

const getVenueColors = (background) => {
  if (background === 'field') {
    return { fill: '#8ecf9a', inset: '#76c488' };
  }

  if (background === 'track') {
    return { fill: '#c17862', inset: '#83c5a1' };
  }

  return { fill: '#f6e4b5', inset: '#edd79a' };
};

const VenueLines = ({ venue, dimensions }) => {
  const colors = getVenueColors(venue.background);
  const width = dimensions.width;
  const height = dimensions.height;
  const lineLayers = venue.buildLineLayers ? venue.buildLineLayers(dimensions) : venue.lineLayers;
  const strokeScale = Math.max(0.02, Math.min(width, height) / 120);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="pointer-events-none absolute inset-0 h-full w-full">
      <rect x="0" y="0" width={width} height={height} rx={Math.min(width, height) * 0.04} fill={colors.fill} />
      {venue.background === 'hall' ? (
        <rect
          x={width * 0.02}
          y={height * 0.03}
          width={width * 0.96}
          height={height * 0.94}
          fill={colors.inset}
          opacity="0.13"
          rx={Math.min(width, height) * 0.02}
        />
      ) : null}
      {venue.background === 'field' ? (
        <rect
          x={width * 0.02}
          y={height * 0.02}
          width={width * 0.96}
          height={height * 0.96}
          fill={colors.inset}
          opacity="0.16"
          rx={Math.min(width, height) * 0.01}
        />
      ) : null}
      {venue.background === 'track' ? (
        <rect
          x={width * 0.26}
          y={height * 0.25}
          width={width * 0.48}
          height={height * 0.5}
          fill={colors.inset}
          rx={Math.min(width, height) * 0.16}
        />
      ) : null}
      {lineLayers.map((layer, index) => {
        if (layer.type === 'rect') {
          return (
            <rect
              key={`${venue.id}_rect_${index}`}
              x={layer.x}
              y={layer.y}
              width={layer.width}
              height={layer.height}
              rx={layer.rx || 0}
              ry={layer.ry || 0}
              fill={layer.fill || 'none'}
              stroke={layer.stroke || '#ffffff'}
              strokeWidth={(layer.strokeWidth || 0.8) * strokeScale}
              strokeDasharray={layer.dash || undefined}
            />
          );
        }

        if (layer.type === 'circle') {
          return (
            <circle
              key={`${venue.id}_circle_${index}`}
              cx={layer.cx}
              cy={layer.cy}
              r={layer.r}
              fill={layer.fill || 'none'}
              stroke={layer.stroke || '#ffffff'}
              strokeWidth={(layer.strokeWidth || 0.8) * strokeScale}
            />
          );
        }

        if (layer.type === 'ellipse') {
          return (
            <ellipse
              key={`${venue.id}_ellipse_${index}`}
              cx={layer.cx}
              cy={layer.cy}
              rx={layer.rx}
              ry={layer.ry}
              fill={layer.fill || 'none'}
              stroke={layer.stroke || '#ffffff'}
              strokeWidth={(layer.strokeWidth || 0.8) * strokeScale}
            />
          );
        }

        if (layer.type === 'path') {
          return (
            <path
              key={`${venue.id}_path_${index}`}
              d={layer.d}
              fill={layer.fill || 'none'}
              stroke={layer.stroke || '#ffffff'}
              strokeWidth={(layer.strokeWidth || 0.8) * strokeScale}
              strokeDasharray={layer.dash || undefined}
            />
          );
        }

        return (
          <line
            key={`${venue.id}_line_${index}`}
            x1={layer.x1}
            y1={layer.y1}
            x2={layer.x2}
            y2={layer.y2}
            stroke={layer.stroke || '#ffffff'}
            strokeWidth={(layer.strokeWidth || 0.8) * strokeScale}
            strokeDasharray={layer.dash || undefined}
          />
        );
      })}
    </svg>
  );
};

const ToolkitApp = () => {
  const [data, setData] = useState(createEmptyData());
  const [loading, setLoading] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState('');
  const [activeTab, setActiveTab] = useState('planner');
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedPlacementId, setSelectedPlacementId] = useState('');
  const [toast, setToast] = useState('');
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const toastTimerRef = useRef(null);
  const goalResultsRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    storage.load().then((loaded) => {
      if (!mounted) return;
      setData(loaded);
      setActiveLessonId(loaded.lessons[0]?.id || '');
      setLoading(false);
    });

    return () => {
      mounted = false;
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    storage.save(data);
  }, [data, loading]);

  useEffect(() => {
    if (data.lessons.length > 0 && !data.lessons.find((lesson) => lesson.id === activeLessonId)) {
      setActiveLessonId(data.lessons[0].id);
    }
  }, [activeLessonId, data.lessons]);

  const showToast = (message) => {
    setToast(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast('');
    }, 2400);
  };

  const updateData = (updater) => {
    setData((current) => {
      const next = clone(current);
      updater(next);
      next.lastUpdated = new Date().toISOString();
      return next;
    });
  };

  const currentLesson = data.lessons.find((lesson) => lesson.id === activeLessonId) || null;
  const currentVenue = venueLookup[currentLesson?.venueTemplateId] || VENUE_TEMPLATES[0];
  const currentVenueDimensions = getVenueDimensions(currentLesson, currentVenue);
  const selectedPlacement =
    currentLesson?.layoutPlacements.find((placement) => placement.id === selectedPlacementId) || null;

  const lessonStats = currentLesson ? getLessonStats(currentLesson) : { inventoryCount: 0, placementCount: 0, hasGoals: false };

  const filteredInventory = useMemo(() => {
    const query = inventorySearch.trim().toLowerCase();
    return INVENTORY_ITEMS.filter((item) => {
      const matchesVenue = item.allowedVenueKinds.includes(currentVenue.kind);
      const matchesQuery = query ? item.nameNl.toLowerCase().includes(query) : true;
      return matchesVenue && matchesQuery;
    });
  }, [currentVenue.kind, inventorySearch]);

  const inventoryByCategory = useMemo(() => {
    return INVENTORY_CATEGORIES.map((category) => ({
      ...category,
      items: filteredInventory.filter((item) => item.category === category.id)
    })).filter((category) => category.items.length > 0);
  }, [filteredInventory]);

  const selectedInventory = useMemo(() => {
    if (!currentLesson) return [];
    return currentLesson.selectedInventoryIds.map((itemId) => inventoryLookup[itemId]).filter(Boolean);
  }, [currentLesson]);

  const updateCurrentLesson = (updater) => {
    if (!currentLesson) return;
    updateData((draft) => {
      const lesson = draft.lessons.find((item) => item.id === currentLesson.id);
      if (!lesson) return;
      updater(lesson);
      lesson.updatedAt = new Date().toISOString();
    });
  };

  const updateLessonField = (field, value) => {
    updateCurrentLesson((lesson) => {
      lesson[field] = value;
      if (field === 'schoolType' || field === 'classLabel' || field === 'activity') {
        lesson.goalInput[field] = value;
      }
    });
  };

  const createNewLesson = (overrides = {}) => {
    const lesson = createLesson(overrides);

    setData((current) => ({
      ...clone(current),
      lessons: [lesson, ...current.lessons],
      lastUpdated: new Date().toISOString()
    }));

    setActiveLessonId(lesson.id);
    setActiveTab('planner');
    setSelectedPlacementId('');
    showToast('Nieuwe les gestart');
  };

  const loadSample = () => {
    const sample = createSampleData();
    setData(sample);
    setActiveLessonId(sample.lessons[0].id);
    setActiveTab('planner');
    showToast('Voorbeeldles geladen');
  };

  const handleVenueChange = (venueTemplateId) => {
    updateCurrentLesson((lesson) => {
      const venue = venueLookup[venueTemplateId];
      lesson.venueTemplateId = venueTemplateId;
      lesson.venueDimensions = venue.dimensionEditable ? venue.defaultDimensions : null;
      lesson.layoutPlacements = lesson.layoutPlacements.filter((placement) => {
        const item = inventoryLookup[placement.inventoryItemId];
        return item?.allowedVenueKinds.includes(venue.kind);
      });
      lesson.selectedInventoryIds = lesson.selectedInventoryIds.filter((itemId) => {
        const item = inventoryLookup[itemId];
        return item?.allowedVenueKinds.includes(venue.kind);
      });
    });
    setSelectedPlacementId('');
  };

  const handleDimensionChange = (axis, value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return;

    updateCurrentLesson((lesson) => {
      lesson.venueDimensions = {
        ...currentVenueDimensions,
        [axis]: Number(numeric.toFixed(2))
      };
    });
  };

  const removeInventory = (itemId) => {
    updateCurrentLesson((lesson) => {
      lesson.selectedInventoryIds = lesson.selectedInventoryIds.filter((currentItemId) => currentItemId !== itemId);
      lesson.layoutPlacements = lesson.layoutPlacements.filter((placement) => placement.inventoryItemId !== itemId);
    });
    if (selectedPlacement?.inventoryItemId === itemId) {
      setSelectedPlacementId('');
    }
  };

  const getSpawnPoint = (count) => {
    const xStops = [0.18, 0.34, 0.5, 0.66];
    const yStops = [0.2, 0.4, 0.6];
    const xRatio = xStops[count % xStops.length];
    const yRatio = yStops[Math.floor(count / xStops.length) % yStops.length];

    return {
      xM: Number((currentVenueDimensions.width * xRatio).toFixed(2)),
      yM: Number((currentVenueDimensions.height * yRatio).toFixed(2))
    };
  };

  const getPointerMeters = (event) => {
    if (!canvasRef.current) return null;

    const rect = canvasRef.current.getBoundingClientRect();
    const pointerX = ((event.clientX - rect.left) / rect.width) * 100;
    const pointerY = ((event.clientY - rect.top) / rect.height) * 100;
    const point = percentToMeterPoint(pointerX, pointerY, currentVenueDimensions);

    return {
      pointerX,
      pointerY,
      xM: point.xM,
      yM: point.yM
    };
  };

  const getPlacementDisplay = (placement) => {
    const box = getPlacementRenderBox(placement, currentVenueDimensions);
    const sizePercent = getPlacementPercentSize(placement, currentVenueDimensions);

    return {
      box,
      widthPercent: sizePercent.width,
      heightPercent: sizePercent.height
    };
  };

  const placeInventoryItem = (itemId) => {
    if (!currentLesson) return;
    const item = inventoryLookup[itemId];
    if (!item) return;

    const point = getSpawnPoint(currentLesson.layoutPlacements.length);
    const placement = createPlacement({
      item,
      venueDimensions: currentVenueDimensions,
      xM: point.xM,
      yM: point.yM
    });

    updateCurrentLesson((lesson) => {
      if (!lesson.selectedInventoryIds.includes(item.id)) {
        lesson.selectedInventoryIds.push(item.id);
      }
      lesson.layoutPlacements.push(placement);
    });

    setSelectedPlacementId(placement.id);
    showToast(`${item.nameNl} geplaatst`);
  };

  const handleCanvasPointerDown = () => {
    setSelectedPlacementId('');
  };

  const handlePlacementPointerDown = (event, placement) => {
    event.stopPropagation();
    const pointer = getPointerMeters(event);
    if (!pointer) return;

    dragRef.current = {
      placementId: placement.id,
      offsetX: pointer.xM - placement.xM,
      offsetY: pointer.yM - placement.yM
    };

    setSelectedPlacementId(placement.id);
  };

  const handleCanvasPointerMove = (event) => {
    if (!dragRef.current || !currentLesson) return;
    const pointer = getPointerMeters(event);
    if (!pointer) return;

    updateCurrentLesson((lesson) => {
      const placement = lesson.layoutPlacements.find((item) => item.id === dragRef.current.placementId);
      if (!placement) return;

      placement.xM = pointer.xM - dragRef.current.offsetX;
      placement.yM = pointer.yM - dragRef.current.offsetY;
      Object.assign(placement, clampPlacementToVenue(placement, currentVenueDimensions));
    });
  };

  const stopDragging = () => {
    dragRef.current = null;
  };

  const updateSelectedPlacementField = (field, value) => {
    if (!selectedPlacement) return;
    updateCurrentLesson((lesson) => {
      const placement = lesson.layoutPlacements.find((item) => item.id === selectedPlacement.id);
      if (!placement) return;
      placement[field] = value;
      Object.assign(placement, clampPlacementToVenue(placement, currentVenueDimensions));
    });
  };

  const deleteSelectedPlacement = () => {
    if (!selectedPlacement) return;
    updateCurrentLesson((lesson) => {
      lesson.layoutPlacements = lesson.layoutPlacements.filter((placement) => placement.id !== selectedPlacement.id);
    });
    setSelectedPlacementId('');
  };

  const duplicateCurrentLesson = () => {
    if (!currentLesson) return;
    const duplicate = createLesson({
      ...clone(currentLesson),
      title: `${currentLesson.title} kopie`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setData((current) => ({
      ...clone(current),
      lessons: [duplicate, ...current.lessons],
      lastUpdated: new Date().toISOString()
    }));

    setActiveLessonId(duplicate.id);
    showToast('Les gedupliceerd');
  };

  const deleteCurrentLesson = () => {
    if (!currentLesson) return;
    if (!window.confirm('Deze les verwijderen?')) return;

    updateData((draft) => {
      draft.lessons = draft.lessons.filter((lesson) => lesson.id !== currentLesson.id);
    });
    setSelectedPlacementId('');
    showToast('Les verwijderd');
  };

  const handleGenerateGoals = () => {
    if (!currentLesson) return;

    const output = generateBeweegdoelen({
      ...currentLesson.goalInput,
      schoolType: currentLesson.schoolType,
      classLabel: currentLesson.classLabel,
      activity: currentLesson.activity
    });

    updateCurrentLesson((lesson) => {
      lesson.goalOutput = output;
    });

    setActiveTab('goals');
    showToast('Beweegdoelen gegenereerd');
    window.requestAnimationFrame(() => {
      goalResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const updateGoalInput = (field, value) => {
    updateCurrentLesson((lesson) => {
      lesson.goalInput[field] = value;
    });
  };

  const updateGoalOutput = (field, value) => {
    updateCurrentLesson((lesson) => {
      lesson.goalOutput[field] = value;
    });
  };

  const updateRoleVariant = (index, value) => {
    updateCurrentLesson((lesson) => {
      if (!lesson.goalOutput.roleVariants[index]) return;
      lesson.goalOutput.roleVariants[index].goal = value;
    });
  };

  const renderLessonForm = () => {
    if (!currentLesson) return null;

    return (
      <div className="glass-card rounded-[24px] p-4">
        <SectionHeader
          title="Lesinstellingen"
          subtitle="Compacte instellingen, zodat de focus op de plattegrond blijft."
          actions={
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                onClick={duplicateCurrentLesson}
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  <Copy size={14} />
                  Dupliceren
                </span>
              </button>
              <button
                className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600"
                onClick={deleteCurrentLesson}
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  <Trash2 size={14} />
                  Verwijderen
                </span>
              </button>
            </div>
          }
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700 xl:col-span-2">
            Lestitel
            <input value={currentLesson.title} onChange={(event) => updateLessonField('title', event.target.value)} />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Datum
            <input type="date" value={currentLesson.date} onChange={(event) => updateLessonField('date', event.target.value)} />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Onderwijs
            <select value={currentLesson.schoolType} onChange={(event) => updateLessonField('schoolType', event.target.value)}>
              {SCHOOL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Groep / klas
            <input value={currentLesson.classLabel} onChange={(event) => updateLessonField('classLabel', event.target.value)} />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Activiteit
            <input value={currentLesson.activity} onChange={(event) => updateLessonField('activity', event.target.value)} />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700 xl:col-span-2">
            Ruimte
            <select value={currentLesson.venueTemplateId} onChange={(event) => handleVenueChange(event.target.value)}>
              {VENUE_TEMPLATES.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.nameNl}
                </option>
              ))}
            </select>
          </label>
          {currentVenue.dimensionEditable ? (
            <>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Lengte (m)
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={currentVenueDimensions.width}
                  onChange={(event) => handleDimensionChange('width', event.target.value)}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Breedte (m)
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={currentVenueDimensions.height}
                  onChange={(event) => handleDimensionChange('height', event.target.value)}
                />
              </label>
            </>
          ) : null}
          <label className="grid gap-1.5 text-sm font-medium text-slate-700 xl:col-span-5">
            Lesnotities
            <textarea rows={2} value={currentLesson.notes} onChange={(event) => updateLessonField('notes', event.target.value)} />
          </label>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const totals = data.lessons.reduce(
      (summary, lesson) => {
        const stats = getLessonStats(lesson);
        return {
          lessons: summary.lessons + 1,
          placements: summary.placements + stats.placementCount,
          goals: summary.goals + (stats.hasGoals ? 1 : 0)
        };
      },
      { lessons: 0, placements: 0, goals: 0 }
    );

    return (
      <div className="space-y-6">
        <div className="glass-card rounded-[28px] p-6">
          <SectionHeader
            title="Docent LO Planner"
            subtitle="Combineer zaalopstellingen, buitenruimtes en doelgerichte beweegdoelen in een snelle lokale workflow."
            actions={
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => createNewLesson()}
                  type="button"
                >
                  <span className="inline-flex items-center gap-2">
                    <FolderPlus size={15} />
                    Nieuwe les
                  </span>
                </button>
                <button
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  onClick={loadSample}
                  type="button"
                >
                  Voorbeeld laden
                </button>
              </div>
            }
          />
          <div className="mt-5 flex flex-wrap gap-2">
            <StatPill label="Lessen" value={totals.lessons} tone="info" />
            <StatPill label="Plaatsingen" value={totals.placements} tone="warning" />
            <StatPill label="Doelen klaar" value={totals.goals} tone="success" />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card rounded-[28px] p-6">
            <SectionHeader title="Ruimtebibliotheek" subtitle="Voor elke ruimte staat de standaardbelijning al klaar." />
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {VENUE_TEMPLATES.map((venue) => (
                <button
                  key={venue.id}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-400"
                  onClick={() => {
                    if (!currentLesson) {
                      createNewLesson({ venueTemplateId: venue.id, venueDimensions: venue.dimensionEditable ? venue.defaultDimensions : null });
                      return;
                    }
                    handleVenueChange(venue.id);
                    setActiveTab('planner');
                  }}
                  type="button"
                >
                  <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: `${venue.defaultDimensions.width} / ${venue.defaultDimensions.height}` }}>
                    <VenueLines venue={venue} dimensions={venue.defaultDimensions} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{venue.nameNl}</p>
                  <p className="text-xs text-slate-500">
                    {venue.defaultDimensions.width} x {venue.defaultDimensions.height} meter
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-[28px] p-6">
              <SectionHeader title="Actieve les" subtitle="De huidige les blijft lokaal opgeslagen op dit apparaat." />
              {currentLesson ? (
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-white/85 p-4">
                    <p className="text-sm font-semibold text-slate-900">{currentLesson.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatLessonDate(currentLesson.date)} · {currentLesson.classLabel} · {currentVenue.nameNl}
                    </p>
                    <p className="mt-3 text-sm text-slate-600">{currentLesson.notes || 'Nog geen lesnotities toegevoegd.'}</p>
                  </div>
                  <button
                    className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                    onClick={() => setActiveTab('planner')}
                    type="button"
                  >
                    Open gymplanner
                  </button>
                </div>
              ) : (
                <EmptyState
                  title="Nog geen les"
                  description="Start een nieuwe les of laad de voorbeeldles om de planner meteen te testen."
                  action={
                    <button
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                      onClick={() => createNewLesson()}
                      type="button"
                    >
                      Nieuwe les
                    </button>
                  }
                />
              )}
            </div>

            {currentLesson?.goalOutput.baseGoal ? (
              <div className="glass-card rounded-[28px] p-6">
                <SectionHeader title="Laatste beweegdoel" subtitle={currentLesson.goalOutput.domain || 'Doeldomein'} />
                <p className="mt-4 text-sm leading-6 text-slate-700">{currentLesson.goalOutput.baseGoal}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  const renderPlanner = () => {
    if (!currentLesson) {
      return (
        <EmptyState
          title="Nog geen les actief"
          description="Start eerst een les om materiaal en ruimte in te plannen."
          action={
            <button
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => createNewLesson()}
              type="button"
            >
              Nieuwe les
            </button>
          }
        />
      );
    }

    return (
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[180px_minmax(0,1fr)_260px]">
          <div className="glass-card order-2 rounded-[24px] p-4 xl:order-1">
            <SectionHeader title="Inventaris" subtitle="Klik een item om het direct op de plattegrond te zetten." />
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                className="pl-10"
                placeholder="Zoek materiaal"
                value={inventorySearch}
                onChange={(event) => setInventorySearch(event.target.value)}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedInventory.map((item) => (
                <button
                  key={item.id}
                  className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                  onClick={() => removeInventory(item.id)}
                  type="button"
                >
                  {item.nameNl}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-4 overflow-y-auto pr-1" style={{ maxHeight: '70vh' }}>
              {inventoryByCategory.map((category) => (
                <div key={category.id}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{category.label}</p>
                  <div className="space-y-2">
                    {category.items.map((item) => {
                      const isSelected = currentLesson.selectedInventoryIds.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          className={`flex w-full items-center gap-3 rounded-[18px] border px-3 py-2.5 text-left transition ${
                            isSelected ? 'border-slate-900 bg-white shadow-sm' : 'border-transparent bg-white/70 hover:border-slate-200'
                          }`}
                          onClick={() => placeInventoryItem(item.id)}
                          type="button"
                        >
                          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-slate-100">
                            <ItemGlyph item={item} className="h-9 w-9" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">{item.nameNl}</p>
                            <p className="text-xs text-slate-500">
                              {item.renderMode === 'footprint' ? `${item.width} x ${item.height} m` : 'Symbool op de plattegrond'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card order-1 rounded-[28px] p-4 xl:order-2">
            <SectionHeader
              title="Plattegrond"
              subtitle="Materiaal komt direct op de ruimte. Versleep daarna naar de juiste plek."
              actions={
                <div className="flex flex-wrap gap-2">
                  <StatPill label="Ruimte" value={currentVenue.nameNl} tone="info" />
                  <StatPill label="Afmeting" value={`${currentVenueDimensions.width} x ${currentVenueDimensions.height} m`} tone="default" />
                </div>
              }
            />
            <div
              ref={canvasRef}
              className="relative mt-4 overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-inner"
              style={{
                width: '100%',
                aspectRatio: `${currentVenueDimensions.width} / ${currentVenueDimensions.height}`,
                maxHeight: currentVenue.kind === 'indoor' ? '82vh' : '86vh'
              }}
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={stopDragging}
              onPointerLeave={stopDragging}
            >
              <VenueLines venue={currentVenue} dimensions={currentVenueDimensions} />
              {currentLesson.layoutPlacements.map((placement) => {
                const item = inventoryLookup[placement.inventoryItemId];
                if (!item) return null;

                const isFootprint = item.renderMode === 'footprint';
                const display = getPlacementDisplay(placement);
                const iconPoint = meterToPercentPoint(
                  placement.xM + placement.widthM / 2,
                  placement.yM + placement.heightM / 2,
                  currentVenueDimensions
                );
                const footprintStyle = {
                  ...display.box,
                  transform: `rotate(${placement.rotation}deg)`
                };
                const iconStyle = {
                  left: `${iconPoint.x}%`,
                  top: `${iconPoint.y}%`,
                  transform: `translate(-50%, -50%) rotate(${placement.rotation}deg)`
                };

                return (
                  <button
                    key={placement.id}
                    className="absolute flex items-center justify-center border-0 bg-transparent p-0 outline-none transition focus:outline-none"
                    onPointerDown={(event) => handlePlacementPointerDown(event, placement)}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedPlacementId(placement.id);
                    }}
                    style={isFootprint ? footprintStyle : iconStyle}
                    type="button"
                    >
                    <ItemGlyph
                      item={item}
                      className={`drop-shadow-[0_2px_3px_rgba(24,53,47,0.16)] ${
                        isFootprint ? 'h-14 w-14' : 'h-10 w-10'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-card order-3 rounded-[24px] p-4 xl:order-3">
            <SectionHeader title="Plaatsing" subtitle="Werk positie en rotatie van het gekozen materiaal uit." />
            {selectedPlacement && currentLesson ? (
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-white/85 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <ItemGlyph item={inventoryLookup[selectedPlacement.inventoryItemId]} className="h-10 w-10" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{inventoryLookup[selectedPlacement.inventoryItemId]?.nameNl}</p>
                      <p className="text-xs text-slate-500">
                        {inventoryLookup[selectedPlacement.inventoryItemId]?.renderMode === 'footprint'
                          ? `${inventoryLookup[selectedPlacement.inventoryItemId]?.width} x ${inventoryLookup[selectedPlacement.inventoryItemId]?.height} m`
                          : 'Representatief symbool'}
                      </p>
                    </div>
                  </div>
                </div>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Rotatie
                  <input
                    type="number"
                    min="-180"
                    max="180"
                    value={selectedPlacement.rotation}
                    onChange={(event) => updateSelectedPlacementField('rotation', Number(event.target.value) || 0)}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  X positie (m)
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    max={currentVenueDimensions.width}
                    value={selectedPlacement.xM}
                    onChange={(event) => updateSelectedPlacementField('xM', Number(event.target.value) || 0)}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Y positie (m)
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    max={currentVenueDimensions.height}
                    value={selectedPlacement.yM}
                    onChange={(event) => updateSelectedPlacementField('yM', Number(event.target.value) || 0)}
                  />
                </label>
                <button
                  className="w-full rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600"
                  onClick={deleteSelectedPlacement}
                  type="button"
                >
                  Plaatsing verwijderen
                </button>
              </div>
            ) : (
              <EmptyState title="Geen plaatsing gekozen" description="Selecteer een item op de plattegrond om details te bewerken." />
            )}
          </div>
        </div>

        {renderLessonForm()}
      </div>
    );
  };

  const renderGoals = () => {
    if (!currentLesson) {
      return (
        <EmptyState
          title="Nog geen les actief"
          description="Maak eerst een les aan voordat je beweegdoelen laat genereren."
          action={
            <button
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => createNewLesson()}
              type="button"
            >
              Nieuwe les
            </button>
          }
        />
      );
    }

    return (
      <div className="space-y-6">
        {renderLessonForm()}
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-card rounded-[24px] p-5">
            <SectionHeader
              title="Promptgestuurde generator"
              subtitle="Lokaal opgebouwd uit sportregels en doelsjablonen. Geen betaalde AI nodig."
              actions={
                <button
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                  onClick={handleGenerateGoals}
                  type="button"
                >
                  <span className="inline-flex items-center gap-2">
                    <Sparkles size={15} />
                    Genereer doel
                  </span>
                </button>
              }
            />
            <div className="mt-5 space-y-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Korte lesprompt
                <textarea
                  rows={5}
                  placeholder="Bijvoorbeeld: Ik geef 2 vwo basketbal. Aan het einde van de les wil ik dat leerlingen de setshot kunnen uitvoeren."
                  value={currentLesson.goalInput.prompt}
                  onChange={(event) => updateGoalInput('prompt', event.target.value)}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Rollen (optioneel, komma-gescheiden)
                <input
                  placeholder="Bijvoorbeeld: tikker, renner"
                  value={currentLesson.goalInput.rolesText}
                  onChange={(event) => updateGoalInput('rolesText', event.target.value)}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Context lessenserie
                <textarea
                  rows={3}
                  placeholder="Bijvoorbeeld: tweede les uit reeks van vier, focus op schotkeuze en afronding."
                  value={currentLesson.goalInput.seriesContext}
                  onChange={(event) => updateGoalInput('seriesContext', event.target.value)}
                />
              </label>
            </div>
          </div>

          <div ref={goalResultsRef} className="glass-card rounded-[24px] p-5">
            <SectionHeader title="Uitgewerkte beweegdoelen" subtitle={currentLesson.goalOutput.domain || 'Nog niet gegenereerd'} />
            <div className="mt-5 space-y-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Basisdoel
                <textarea rows={4} value={currentLesson.goalOutput.baseGoal} onChange={(event) => updateGoalOutput('baseGoal', event.target.value)} />
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Onder gemiddeld
                  <textarea
                    rows={5}
                    value={currentLesson.goalOutput.underAverage}
                    onChange={(event) => updateGoalOutput('underAverage', event.target.value)}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Gemiddeld
                  <textarea
                    rows={5}
                    value={currentLesson.goalOutput.average}
                    onChange={(event) => updateGoalOutput('average', event.target.value)}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Boven gemiddeld
                  <textarea
                    rows={5}
                    value={currentLesson.goalOutput.aboveAverage}
                    onChange={(event) => updateGoalOutput('aboveAverage', event.target.value)}
                  />
                </label>
              </div>

              {currentLesson.goalOutput.roleVariants.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Rolvarianten</p>
                  {currentLesson.goalOutput.roleVariants.map((variant, index) => (
                    <label key={`${variant.role}_${index}`} className="grid gap-2 text-sm font-medium text-slate-700">
                      {variant.role}
                      <textarea rows={3} value={variant.goal} onChange={(event) => updateRoleVariant(index, event.target.value)} />
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Planner laden...
      </div>
    );
  }

  return (
    <div className="app-shell text-slate-900">
      <header className="border-b border-white/40 bg-white/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1900px] flex-wrap items-center justify-between gap-4 px-4 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Lichamelijke opvoeding</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Docent LO Planner</h1>
            <p className="mt-1 text-sm text-slate-600">Gymplanner, buitenruimteplanner en beweegdoelenmaker in één lokale MVP.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => createNewLesson()}
              type="button"
            >
              <span className="inline-flex items-center gap-2">
                <FolderPlus size={15} />
                Nieuwe les
              </span>
            </button>
            <button
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              onClick={loadSample}
              type="button"
            >
              Voorbeeld
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1900px] gap-6 px-4 py-6 xl:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="glass-card rounded-[28px] p-5">
            <SectionHeader title="Lessen" subtitle="Recente lessen blijven lokaal beschikbaar." />
            <div className="mt-4 space-y-2">
              {data.lessons.length > 0 ? (
                data.lessons.map((lesson) => {
                  const venue = venueLookup[lesson.venueTemplateId];
                  const isActive = lesson.id === activeLessonId;
                  return (
                    <button
                      key={lesson.id}
                      className={`w-full rounded-2xl border px-4 py-3 text-left ${
                        isActive ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white/80 text-slate-700'
                      }`}
                      onClick={() => setActiveLessonId(lesson.id)}
                      type="button"
                    >
                      <p className="text-sm font-semibold">{lesson.title}</p>
                      <p className={`mt-1 text-xs ${isActive ? 'text-white/70' : 'text-slate-500'}`}>
                        {formatLessonDate(lesson.date)} · {venue?.nameNl}
                      </p>
                    </button>
                  );
                })
              ) : (
                <EmptyState
                  title="Nog geen lessen"
                  description="Start met een nieuwe les of laad de voorbeeldles."
                  action={
                    <button
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                      onClick={() => createNewLesson()}
                      type="button"
                    >
                      Nieuwe les
                    </button>
                  }
                />
              )}
            </div>
          </div>

          {currentLesson ? (
            <div className="glass-card rounded-[28px] p-5">
              <SectionHeader title="Status" subtitle="Snelle blik op de actieve les." />
              <div className="mt-4 flex flex-wrap gap-2">
                <StatPill label="Materiaal" value={lessonStats.inventoryCount} tone="warning" />
                <StatPill label="Opstelling" value={lessonStats.placementCount} tone="info" />
                <StatPill label="Doel" value={lessonStats.hasGoals ? 'klaar' : 'open'} tone={lessonStats.hasGoals ? 'success' : 'default'} />
              </div>
            </div>
          ) : null}
        </aside>

        <section className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    active ? 'bg-slate-900 text-white' : 'bg-white/70 text-slate-700'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon size={15} />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {activeTab === 'dashboard' ? renderDashboard() : null}
          {activeTab === 'planner' ? renderPlanner() : null}
          {activeTab === 'goals' ? renderGoals() : null}
        </section>
      </main>

      {toast ? (
        <div className="fixed bottom-5 right-5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-2xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
};

export default ToolkitApp;
