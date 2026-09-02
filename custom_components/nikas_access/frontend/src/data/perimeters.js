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
    recommendedColor: "cyan",
    description: "Датчики и устройства внутреннего контура дома: входные двери, окна и другие контролируемые проёмы",
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
    recommendedColor: "blue",
    description: "Датчики и устройства наружного контура участка: ворота, калитки, наружные двери и другие точки доступа",
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

const SAFETY_DEFINITION = Object.freeze({
  key: "safety",
  label: "Безопасность",
  icon: "mdi:shield-alert-outline",
  recommendedColor: "red",
  description: "Датчики угроз для людей и дома: газ, дым, угарный газ, пожар и другие аварийные сигналы",
  aliases: Object.freeze([
    "bezopasnost",
    "безопасность",
  ]),
});

const ACCESS_DEFINITIONS = Object.freeze({
  ...PERIMETER_DEFINITIONS,
  safety: SAFETY_DEFINITION,
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

function matchesAccessGroup(keys, definition) {
  return definition.aliases.some((alias) => keys.has(normalizedLabel(alias)));
}

function discoverAccessSources(registries) {
  const empty = { internal: [], external: [], safety: [] };
  if (!registries) return empty;

  const entities = Array.isArray(registries.entities) ? registries.entities : [];
  const devices = Array.isArray(registries.devices) ? registries.devices : [];
  const labels = Array.isArray(registries.labels) ? registries.labels : [];
  const deviceMap = new Map(devices.map((device) => [device.id, device]));
  const labelNames = new Map(labels.map((label) => [label.label_id, label.name || label.label_id]));
  const result = { internal: [], external: [], safety: [] };

  for (const entity of entities) {
    const entityId = String(entity?.entity_id || "");
    if (!entityId.startsWith("binary_sensor.")) continue;
    if (entity.disabled_by || entity.hidden_by || entity.hidden) continue;
    const device = deviceMap.get(entity.device_id) || null;
    if (device?.disabled_by) continue;
    const keys = combinedLabelKeys(entity, device, labelNames);
    if (!isOperationalLabelSet(keys)) continue;

    for (const definition of Object.values(ACCESS_DEFINITIONS)) {
      if (matchesAccessGroup(keys, definition)) result[definition.key].push(entityId);
    }
  }

  result.internal.sort();
  result.external.sort();
  result.safety.sort();
  return result;
}

function deviceDisplayName(device) {
  return device?.name_by_user
    || device?.name
    || device?.model
    || device?.id
    || "Устройство без названия";
}

function entityDisplayName(entity) {
  return entity?.name
    || entity?.original_name
    || entity?.entity_id
    || "Датчик без названия";
}

function discoverAccessDevices(registries, sources) {
  const empty = { internal: [], external: [], safety: [] };
  if (!registries) return empty;

  const entities = Array.isArray(registries.entities) ? registries.entities : [];
  const devices = Array.isArray(registries.devices) ? registries.devices : [];
  const entityMap = new Map(entities.map((entity) => [entity.entity_id, entity]));
  const deviceMap = new Map(devices.map((device) => [device.id, device]));
  const result = { internal: [], external: [], safety: [] };

  for (const definition of Object.values(ACCESS_DEFINITIONS)) {
    const groups = new Map();
    for (const entityId of sources?.[definition.key] || []) {
      const entity = entityMap.get(entityId) || { entity_id: entityId };
      const device = deviceMap.get(entity.device_id) || null;
      const groupKey = device?.id || `entity:${entityId}`;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          key: groupKey,
          deviceId: device?.id || null,
          name: device ? deviceDisplayName(device) : entityDisplayName(entity),
          entities: [],
        });
      }
      groups.get(groupKey).entities.push({
        entityId,
        name: entityDisplayName(entity),
      });
    }

    result[definition.key] = [...groups.values()]
      .map((group) => ({
        ...group,
        entities: group.entities.sort((left, right) => left.name.localeCompare(right.name, "ru")),
      }))
      .sort((left, right) => left.name.localeCompare(right.name, "ru"));
  }

  return result;
}

function perimeterSourceStateModel(hass, entityId) {
  const state = normalizedState(stateObject(hass, entityId)?.state);
  if (state === "on") return { text: "Открыто", tone: "yellow", icon: "mdi:door-open" };
  if (state === "off") return { text: "Закрыто", tone: "green", icon: "mdi:door-closed-lock" };
  return { text: "Нет данных", tone: "red", icon: "mdi:alert-circle-outline" };
}

function safetySourceStateModel(hass, entityId) {
  const state = normalizedState(stateObject(hass, entityId)?.state);
  if (state === "on") return { text: "Тревога", tone: "red", icon: "mdi:alert-octagon-outline" };
  if (state === "off") return { text: "Норма", tone: "green", icon: "mdi:shield-check-outline" };
  return { text: "Нет данных", tone: "red", icon: "mdi:alert-circle-outline" };
}

function accessSourceStateModel(hass, entityId, definition) {
  return definition?.key === SAFETY_DEFINITION.key
    ? safetySourceStateModel(hass, entityId)
    : perimeterSourceStateModel(hass, entityId);
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
      status: "no_data",
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
      status: "no_data",
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
      status: "violated",
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
    status: "safe",
  };
}

function safetyModel(hass, entityIds) {
  const ids = Array.isArray(entityIds) ? entityIds : [];
  if (ids.length === 0) {
    return {
      title: "Нет данных",
      detail: `Не найдены действующие датчики с ярлыком «${SAFETY_DEFINITION.label}»`,
      tone: "red",
      icon: "mdi:shield-alert-outline",
      total: 0,
      open: 0,
      unavailable: 0,
      status: "no_data",
    };
  }

  let alarms = 0;
  let unavailable = 0;
  for (const entityId of ids) {
    const state = normalizedState(stateObject(hass, entityId)?.state);
    if (state === "on") alarms += 1;
    else if (state !== "off") unavailable += 1;
  }

  if (alarms > 0) {
    const unavailableDetail = unavailable > 0 ? ` · без данных: ${unavailable}` : "";
    return {
      title: "Тревога",
      detail: `Сработало: ${alarms} из ${ids.length}${unavailableDetail}`,
      tone: "red",
      icon: "mdi:alert-octagon-outline",
      total: ids.length,
      open: alarms,
      unavailable,
      status: "alarm",
    };
  }
  if (unavailable > 0) {
    return {
      title: "Нет данных",
      detail: `Без данных: ${unavailable} из ${ids.length}`,
      tone: "red",
      icon: "mdi:shield-alert-outline",
      total: ids.length,
      open: 0,
      unavailable,
      status: "no_data",
    };
  }
  return {
    title: "Норма",
    detail: `Контролируется датчиков: ${ids.length}`,
    tone: "green",
    icon: "mdi:shield-check-outline",
    total: ids.length,
    open: 0,
    unavailable: 0,
    status: "safe",
  };
}

function accessSummaryModel(internal, external, safety) {
  const models = [internal, external, safety];
  if (safety.status === "alarm") {
    return {
      title: "Тревога безопасности",
      detail: `Сработало датчиков: ${safety.open}`,
      tone: "red",
      icon: "mdi:alert-octagon-outline",
    };
  }
  if (models.some((model) => model.tone === "red")) {
    return {
      title: "Есть точки без данных",
      detail: "Периметры и безопасность с неполными данными не считаются нормой",
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
    title: "Доступ под контролем",
    detail: "Периметры закрыты, датчики безопасности в норме",
    tone: "green",
    icon: "mdi:shield-check-outline",
  };
}
