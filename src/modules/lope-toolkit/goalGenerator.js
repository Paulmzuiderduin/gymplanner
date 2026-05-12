const DOMAIN_CONFIG = {
  basketbal: {
    domain: 'doelspellen',
    skill: 'setshot',
    context: 'in een basketbalsituatie',
    visible: 'balans, armstrekking, polsactie en gerichte afronding',
    underSupport: 'vanuit stilstand en op korte afstand',
    averageSupport: 'na het aannemen van de bal en vanaf passende afstand',
    aboveSupport: 'onder oplopende tijdsdruk en na een keuze voor positie'
  },
  voetbal: {
    domain: 'doelspellen',
    skill: 'gerichte passing of afronding',
    context: 'in een voetbalsituatie',
    visible: 'kijkgedrag, balsnelheid en richting naar medespeler of doel',
    underSupport: 'vanuit een overzichtelijke oefenvorm met weinig druk',
    averageSupport: 'in een spelvorm met passieve tegenstand',
    aboveSupport: 'in een spelvorm met actieve weerstand en keuze-momenten'
  },
  hockey: {
    domain: 'doelspellen',
    skill: 'aannemen, drijven of pushen',
    context: 'in een hockeysituatie',
    visible: 'stickvoering, balcontrole en richting van de uitvoering',
    underSupport: 'in een vaste route zonder tegenspeler',
    averageSupport: 'in een spelvorm met medespeler en beperkte druk',
    aboveSupport: 'in een variabele spelvorm met actieve keuze onder druk'
  },
  atletiek: {
    domain: 'atletiek',
    skill: 'technisch uitvoeren van het onderdeel',
    context: 'binnen een atletiekonderdeel',
    visible: 'ritme, houding, inzet en gerichte afronding van de beweging',
    underSupport: 'met duidelijke deelstappen en extra feedbackmomenten',
    averageSupport: 'in een vloeiende uitvoering met passende snelheid',
    aboveSupport: 'in een complete uitvoering met hogere prestatie-eis'
  },
  turnen: {
    domain: 'turnen',
    skill: 'de afgesproken turnvaardigheid',
    context: 'in een turnsituatie',
    visible: 'spanning, steunname, lichaamscontrole en veilige landing',
    underSupport: 'met extra materiaalhulp en lage complexiteit',
    averageSupport: 'in een volledige uitvoering met beperkte hulp',
    aboveSupport: 'in een strakkere uitvoering met hogere kwaliteitseisen'
  },
  tikspel: {
    domain: 'tikspelen',
    skill: 'rollen herkennen en daarop reageren',
    context: 'in een tikspel',
    visible: 'kijkgedrag, routekeuze, tempoverandering en beslissingen',
    underSupport: 'in een overzichtelijke spelvorm met weinig prikkels',
    averageSupport: 'in een spelvorm met meerdere keuzes tegelijk',
    aboveSupport: 'in een dynamische spelvorm met snelle rolwisselingen'
  },
  volleybal: {
    domain: 'netspelen',
    skill: 'bovenhands of onderhands verwerken',
    context: 'in een volleybalsituatie',
    visible: 'lichaamshouding, plaatsing onder de bal en gerichte afspeelrichting',
    underSupport: 'met rustige aanspeelballen en vaste positie',
    averageSupport: 'in een oefenvorm met verplaatsing en samenwerking',
    aboveSupport: 'in een spelvorm met hogere balsnelheid en keuze-momenten'
  },
  racketspel: {
    domain: 'racketspelen',
    skill: 'slaan en positioneren',
    context: 'in een racketspelsituatie',
    visible: 'klaarstaan, raakpunt en richting van de slag',
    underSupport: 'met voorspelbare aanvoer',
    averageSupport: 'met variatie in plaatsing en tempo',
    aboveSupport: 'met tactische keuzes onder tijdsdruk'
  },
  dans: {
    domain: 'bewegen op muziek',
    skill: 'bewegingspatronen uitvoeren op ritme',
    context: 'in een bewegen-op-muziek-situatie',
    visible: 'maatgevoel, coördinatie, houding en afstemming op de groep',
    underSupport: 'met korte reeksen en duidelijke telstructuur',
    averageSupport: 'in een langere combinatie met overgangen',
    aboveSupport: 'in een vloeiende uitvoering met expressie en zelfstandigheid'
  },
  stoeien: {
    domain: 'zelfverdediging en stoeien',
    skill: 'controleren, reageren en veilig uitvoeren',
    context: 'in een stoei- of verdedigingssituatie',
    visible: 'lichaamscontrole, timing, balans en respect voor afspraken',
    underSupport: 'in een eenvoudige vorm met veel stopmomenten',
    averageSupport: 'in een vorm met doorlopende interactie',
    aboveSupport: 'in een vorm met meerdere keuzes en snelle omschakeling'
  }
};

const KEYWORD_MAP = [
  ['basket', 'basketbal'],
  ['setshot', 'basketbal'],
  ['voetbal', 'voetbal'],
  ['soccer', 'voetbal'],
  ['hockey', 'hockey'],
  ['atletiek', 'atletiek'],
  ['sprint', 'atletiek'],
  ['verspring', 'atletiek'],
  ['turn', 'turnen'],
  ['rol', 'turnen'],
  ['koprol', 'turnen'],
  ['tik', 'tikspel'],
  ['tikker', 'tikspel'],
  ['volley', 'volleybal'],
  ['badminton', 'racketspel'],
  ['tennis', 'racketspel'],
  ['squash', 'racketspel'],
  ['dans', 'dans'],
  ['muziek', 'dans'],
  ['stoei', 'stoeien'],
  ['verdedig', 'stoeien']
];

const ROLE_HINTS = {
  tikker: {
    name: 'Tikker',
    emphasis: 'kiezen wie haalbaar is om te tikken en tempo vasthouden'
  },
  renner: {
    name: 'Renner',
    emphasis: 'tikkers volgen, ruimte lezen en een veilige route kiezen'
  },
  aanvaller: {
    name: 'Aanvaller',
    emphasis: 'vrijlopen, kiezen en doelgericht afronden'
  },
  verdediger: {
    name: 'Verdediger',
    emphasis: 'positie houden, inschatten en op tijd ingrijpen'
  }
};

const normalize = (value) => (value || '').trim();

export const inferActivityKey = (activity, prompt) => {
  const haystack = `${normalize(activity)} ${normalize(prompt)}`.toLowerCase();

  for (const [keyword, key] of KEYWORD_MAP) {
    if (haystack.includes(keyword)) {
      return key;
    }
  }

  return 'basketbal';
};

const inferSkill = (prompt, fallback) => {
  const trimmed = normalize(prompt);
  if (!trimmed) return fallback;
  const match =
    trimmed.match(/wil ik dat .*? (de|het) (.+?) kunnen/i) ||
    trimmed.match(/wil ik dat .*? (.+?) kunnen/i) ||
    trimmed.match(/einddoel .*? (de|het) (.+)/i);

  if (!match) return fallback;
  const value = match[2] || match[1] || fallback;
  return value.replace(/[.]/g, '').trim();
};

const buildSentence = ({ context, skill, support, visible, extra }) => {
  return `Leerlingen kunnen ${context} ${support} ${skill} uitvoeren, waarbij ${visible}${extra ? ` en ${extra}` : ''}.`;
};

const splitRoles = (rolesText) => {
  return normalize(rolesText)
    .split(',')
    .map((role) => role.trim().toLowerCase())
    .filter(Boolean);
};

export const generateBeweegdoelen = (input) => {
  const activityKey = inferActivityKey(input.activity, input.prompt);
  const config = DOMAIN_CONFIG[activityKey] || DOMAIN_CONFIG.basketbal;
  const skill = inferSkill(input.prompt, config.skill);
  const schoolPrefix =
    input.schoolType === 'basisonderwijs'
      ? 'passend bij het niveau van de groep'
      : `passend bij ${normalize(input.classLabel) || 'de klas'}`;

  const baseGoal = buildSentence({
    context: config.context,
    skill,
    support: schoolPrefix,
    visible: `${config.visible} zichtbaar bijdragen aan een geslaagde uitvoering`,
    extra: 'de gekozen criteria herkenbaar zijn in het beweeggedrag'
  });

  const underAverage = buildSentence({
    context: config.context,
    skill,
    support: config.underSupport,
    visible: `${config.visible} herkenbaar blijven`,
    extra: 'de leerling met steun tot een stabiele uitvoering komt'
  });

  const average = buildSentence({
    context: config.context,
    skill,
    support: config.averageSupport,
    visible: `${config.visible} bijdragen aan controle en richting`,
    extra: 'de leerling de kern van de vaardigheid zelfstandig uitvoert'
  });

  const aboveAverage = buildSentence({
    context: config.context,
    skill,
    support: config.aboveSupport,
    visible: `${config.visible} ook onder complexere omstandigheden zichtbaar blijven`,
    extra: 'de leerling kwaliteit en keuzevermogen combineert'
  });

  const roles = splitRoles(input.rolesText).map((role) => {
    const roleConfig = ROLE_HINTS[role];
    if (!roleConfig) return null;
    return {
      role: roleConfig.name,
      goal: `In de rol van ${roleConfig.name.toLowerCase()} kan de leerling ${roleConfig.emphasis}, waarbij ${config.visible} ondersteunend zijn aan die keuze.`
    };
  });

  return {
    domain: config.domain,
    baseGoal,
    underAverage,
    average,
    aboveAverage,
    roleVariants: roles.filter(Boolean)
  };
};
