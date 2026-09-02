const ACTIVE_LABEL = "v_ekspluatatsii";
const EXCLUDED_OPERATIONAL_LABELS = new Set([
  "na_obsluzhivanii",
  "trebuet_zameny",
  "vyvedeno_iz_ekspluatatsii",
  "rezerv",
]);

const PERIMETER_DEFINITIONS = Object.freeze({
  internal: Object.freeze({
    key: "internal",
    label: "Внутренний периметр",
    icon: "mdi:shield-home-outline",
    aliases: Object.freeze([
      "vnutrennii_perimetr",
      "vnutrennii_kontur",
      "внутренний периметр",
      "внутренний контур",
    ]),
  }),
  external: Object.freeze({
    key: "external",
    label: "Внешний периметр",
    icon: "mdi:shield-lock-outline",
    aliases: Object.freeze([
      "vneshnii_perimetr",
      "naruzhnyi_perimetr",
      "vneshnii_kontur",
      "naruzhnyi_kontur",
      "внешний периметр",
      "наружный периметр",
      "внешний контур",
      "наружный контур",
    ]),
  }),
});

function labelsOf(item) {
  const labels = item?.labels;
  if (!labels) return [];
  if (Array.isArray(labels)) return labels;
  if (labels instanceof Set) return [...labels];
  if (typeof labels === "object") return Object.keys(labels).filter((key) => labels[key]);
  return [];
}

function normalizedLabel(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function labelKeys(item, labelNames) {
  const keys = new Set();
  for (const labelId of labelsOf(item)) {
    keys.add(normalizedLabel(labelId));
    const name = labelNames.get(labelId);
    if (name) keys.add(normalizedLabel(name));
  }
  return keys;
}

function combinedLabelKeys(entity, device, labelNames) {
  return new Set([
    ...labelKeys(device, labelNames),
    ...labelKeys(entity, labelNames),
  ]);
}

function isOperationalLabelSet(keys) {
  if (!keys.has(ACTIVE_LABEL)) return false;
  return ![...EXCLUDED_OPERATIONAL_LABELS].some((label) => keys.has(label));
}

function matchesPerimeter(keys, definition) {
  return definition.aliases.some((alias) => keys.has(normalizedLabel(alias)));
}

function discoverPerimeterSources(registries) {
  const empty = { internal: [], external: [] };
  if (!registries) return empty;

  const entities = Array.isArray(registries.entities) ? registries.entities : [];
  const devices = Array.isArray(registries.devices) ? registries.devices : [];
  const labels = Array.isArray(registries.labels) ? registries.labels : [];
  const deviceMap = new Map(devices.map((device) => [device.id, device]));
  const labelNames = new Map(labels.map((label) => [label.label_id, label.name || label.label_id]));
  const result = { internal: [], external: [] };

  for (const entity of entities) {
    const entityId = String(entity?.entity_id || "");
    if (!entityId.startsWith("binary_sensor.")) continue;
    if (entity.disabled_by || entity.hidden_by || entity.hidden) continue;
    const device = deviceMap.get(entity.device_id) || null;
    if (device?.disabled_by) continue;
    const keys = combinedLabelKeys(entity, device, labelNames);
    if (!isOperationalLabelSet(keys)) continue;

    for (const definition of Object.values(PERIMETER_DEFINITIONS)) {
      if (matchesPerimeter(keys, definition)) result[definition.key].push(entityId);
    }
  }

  result.internal.sort();
  result.external.sort();
  return result;
}

function perimeterModel(hass, entityIds, definition) {
  const ids = Array.isArray(entityIds) ? entityIds : [];
  if (ids.length === 0) {
    return {
      title: "Нет данных",
      detail: `Не найдены действующие датчики с ярлыком «${definition.label}»`,
      tone: "red",
      icon: "mdi:shield-alert-outline",
      total: 0,
      open: 0,
      unavailable: 0,
    };
  }

  let open = 0;
  let unavailable = 0;
  for (const entityId of ids) {
    const state = normalizedState(stateObject(hass, entityId)?.state);
    if (state === "on") open += 1;
    else if (state !== "off") unavailable += 1;
  }

  if (unavailable > 0) {
    const openDetail = open > 0 ? `, открыто: ${open}` : "";
    return {
      title: "Нет данных",
      detail: `Без данных: ${unavailable} из ${ids.length}${openDetail}`,
      tone: "red",
      icon: "mdi:shield-alert-outline",
      total: ids.length,
      open,
      unavailable,
    };
  }
  if (open > 0) {
    return {
      title: "Нарушен",
      detail: `Открыто: ${open} из ${ids.length}`,
      tone: "yellow",
      icon: "mdi:shield-off-outline",
      total: ids.length,
      open,
      unavailable: 0,
    };
  }
  return {
    title: "Закрыт",
    detail: `Контролируется точек: ${ids.length}`,
    tone: "green",
    icon: definition.icon,
    total: ids.length,
    open: 0,
    unavailable: 0,
  };
}

function accessSummaryModel(internal, external) {
  const models = [internal, external];
  if (models.some((model) => model.tone === "red")) {
    return {
      title: "Есть точки без данных",
      detail: "Ни один периметр с неполными данными не считается закрытым",
      tone: "red",
      icon: "mdi:shield-alert-outline",
    };
  }
  if (models.some((model) => model.tone === "yellow")) {
    return {
      title: "Периметр нарушен",
      detail: "Есть открытые точки доступа",
      tone: "yellow",
      icon: "mdi:shield-off-outline",
    };
  }
  return {
    title: "Периметры закрыты",
    detail: "Внутренний и внешний периметры без открытых точек",
    tone: "green",
    icon: "mdi:shield-check-outline",
  };
}
