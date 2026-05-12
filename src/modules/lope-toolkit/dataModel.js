const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const createGoalInput = (overrides = {}) => ({
  schoolType: 'voortgezet onderwijs',
  classLabel: '2 vwo',
  activity: 'basketbal',
  prompt: '',
  rolesText: '',
  seriesContext: '',
  ...overrides
});

export const createGoalOutput = (overrides = {}) => ({
  baseGoal: '',
  underAverage: '',
  average: '',
  aboveAverage: '',
  roleVariants: [],
  domain: '',
  ...overrides
});

export const createLesson = (overrides = {}) => ({
  id: `lesson_${generateId()}`,
  title: 'Nieuwe les',
  date: new Date().toISOString().slice(0, 10),
  schoolType: 'voortgezet onderwijs',
  classLabel: '2 vwo',
  activity: 'basketbal',
  notes: '',
  venueTemplateId: 'gymzaal-standard',
  venueDimensions: null,
  selectedInventoryIds: [],
  layoutPlacements: [],
  goalInput: createGoalInput(),
  goalOutput: createGoalOutput(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

export const createEmptyData = () => ({
  version: 2,
  lessons: [],
  lastUpdated: new Date().toISOString()
});

export const ensureDataShape = (raw) => {
  if (!raw || typeof raw !== 'object') return createEmptyData();

  return {
    version: 2,
    lessons: Array.isArray(raw.lessons)
      ? raw.lessons.map((lesson) =>
          createLesson({
            ...lesson,
            goalInput: createGoalInput(lesson.goalInput),
            goalOutput: createGoalOutput(lesson.goalOutput),
            selectedInventoryIds: Array.isArray(lesson.selectedInventoryIds) ? lesson.selectedInventoryIds : [],
            layoutPlacements: Array.isArray(lesson.layoutPlacements) ? lesson.layoutPlacements : []
          })
        )
      : [],
    lastUpdated: raw.lastUpdated || new Date().toISOString()
  };
};

export const createSampleData = () => {
  return {
    version: 2,
    lessons: [
      createLesson({
        title: 'Setshot basketbal',
        classLabel: '2 vwo',
        activity: 'basketbal',
        selectedInventoryIds: ['basketbal', 'pilon', 'markeerschijf', 'scoreboard'],
        notes: 'Stationen in twee helften van de zaal. Eerst ritme, daarna schotkeuze.',
        goalInput: createGoalInput({
          classLabel: '2 vwo',
          activity: 'basketbal',
          prompt: 'Ik geef 2 vwo basketbal. Aan het einde van de les wil ik dat leerlingen de setshot kunnen uitvoeren.'
        }),
        goalOutput: createGoalOutput({
          baseGoal:
            'Leerlingen kunnen in een oefensituatie een setshot uitvoeren vanuit een stabiele basis, waarbij balbaan en armstrekking zichtbaar bijdragen aan richting naar de basket.',
          underAverage:
            'Onder gemiddeld: leerlingen kunnen vanuit stilstand een setshot uitvoeren van korte afstand, waarbij zij met twee voeten in balans starten en de bal met gestrekte armen richting basket lossen.',
          average:
            'Gemiddeld: leerlingen kunnen na het aannemen van de bal een setshot uitvoeren vanaf middellange afstand, waarbij zij balans houden, de schietarm volledig uitstrekken en de bal gericht op het doel plaatsen.',
          aboveAverage:
            'Boven gemiddeld: leerlingen kunnen onder tijdsdruk een setshot uitvoeren na een keuze voor positie, waarbij balans, armstrekking en gerichte afronding zichtbaar blijven.',
          domain: 'doelspellen'
        }),
        layoutPlacements: [
          {
            id: `placement_${generateId()}`,
            inventoryItemId: 'basketbal',
            x: 18,
            y: 36,
            width: 5,
            height: 5,
            rotation: 0,
            quantity: 6,
            renderMode: 'icon',
            zIndex: 1
          },
          {
            id: `placement_${generateId()}`,
            inventoryItemId: 'pilon',
            x: 34,
            y: 24,
            width: 5,
            height: 5,
            rotation: 0,
            quantity: 8,
            renderMode: 'icon',
            zIndex: 2
          }
        ]
      })
    ],
    lastUpdated: new Date().toISOString()
  };
};
