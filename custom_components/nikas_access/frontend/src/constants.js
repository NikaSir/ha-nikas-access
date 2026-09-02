const ELEMENT_NAME = "nikas-access-panel";
const UI_VERSION = "0.1.6";
const PANEL_ROOT = "/dashboard-access-v1";
const ROOT_PATH = "/dashboard-access-v1/home";
const PARENT_ROUTE = "/dashboard-house-v13/home";
const SAFE_RETURN_ROUTE = "/dashboard-house-v13/home";
const RETURN_PANEL_ID = "access";
const ZOOM_KEY = "nikas.access.zoom.v1";
const COMMAND_COOLDOWN_MS = 1400;
const TAP_CLICK_GUARD_MS = 700;
const TAP_MOVE_THRESHOLD_PX = 8;
const DIRECT_TOUCH_THRESHOLD_PX = 10;
const UNKNOWN_STATES = new Set(["unknown", "unavailable", "none", "null", ""]);
const STATUS_TONES = ["green", "yellow", "red", "blue", "grey"];

const SECTIONAL_POSITION_ENTITY = "binary_sensor.sensor_do_zb_15_16_contact";
const SECTIONAL_CONTROL_ENTITY = "cover.umnyi_kontroller_dlia_vorot_roximo_door";
const SWING_CONTROL_ENTITY = "cover.umnyi_kontroller_dlia_vorot_roximo_2_door";

const INTERNAL_VIEWS = Object.freeze({
  statuses: Object.freeze({ id: "statuses", label: "Статусы", icon: "mdi:shield-home-outline" }),
  gates: Object.freeze({ id: "gates", label: "Ворота", icon: "mdi:gate" }),
  intercom: Object.freeze({ id: "intercom", label: "Домофон", icon: "mdi:doorbell-video" }),
  diagnostics: Object.freeze({ id: "diagnostics", label: "Диагностика", icon: "mdi:stethoscope" }),
});

const GATES = Object.freeze({
  sectional: Object.freeze({
    key: "sectional",
    label: "Секционные ворота",
    controlEntityId: SECTIONAL_CONTROL_ENTITY,
  }),
  swing: Object.freeze({
    key: "swing",
    label: "Распашные ворота",
    controlEntityId: SWING_CONTROL_ENTITY,
  }),
});

const COMMANDS = Object.freeze({
  "sectional:open": Object.freeze({
    key: "sectional:open",
    gateKey: "sectional",
    objectLabel: "Секционные ворота",
    actionLabel: "Открыть",
    service: "open_cover",
    entityId: SECTIONAL_CONTROL_ENTITY,
  }),
  "sectional:stop": Object.freeze({
    key: "sectional:stop",
    gateKey: "sectional",
    objectLabel: "Секционные ворота",
    actionLabel: "Стоп",
    service: "stop_cover",
    entityId: SECTIONAL_CONTROL_ENTITY,
  }),
  "sectional:close": Object.freeze({
    key: "sectional:close",
    gateKey: "sectional",
    objectLabel: "Секционные ворота",
    actionLabel: "Закрыть",
    service: "close_cover",
    entityId: SECTIONAL_CONTROL_ENTITY,
  }),
  "swing:open": Object.freeze({
    key: "swing:open",
    gateKey: "swing",
    objectLabel: "Распашные ворота",
    actionLabel: "Открыть",
    service: "open_cover",
    entityId: SWING_CONTROL_ENTITY,
  }),
  "swing:stop": Object.freeze({
    key: "swing:stop",
    gateKey: "swing",
    objectLabel: "Распашные ворота",
    actionLabel: "Стоп",
    service: "stop_cover",
    entityId: SWING_CONTROL_ENTITY,
  }),
  "swing:close": Object.freeze({
    key: "swing:close",
    gateKey: "swing",
    objectLabel: "Распашные ворота",
    actionLabel: "Закрыть",
    service: "close_cover",
    entityId: SWING_CONTROL_ENTITY,
  }),
});

function normalizedState(value) {
  return String(value ?? "").trim().toLowerCase();
}

function stateObject(hass, entityId) {
  return hass?.states?.[entityId] || null;
}

function hasUsableState(hass, entityId) {
  const item = stateObject(hass, entityId);
  return Boolean(item) && !UNKNOWN_STATES.has(normalizedState(item.state));
}

function sectionalPositionModel(hass) {
  const state = normalizedState(stateObject(hass, SECTIONAL_POSITION_ENTITY)?.state);
  if (state === "on") {
    return { text: "Открыто", tone: "yellow", icon: "mdi:garage-open-variant" };
  }
  if (state === "off") {
    return { text: "Закрыто", tone: "grey", icon: "mdi:garage-variant-lock" };
  }
  return { text: "Нет данных", tone: "red", icon: "mdi:garage-alert-variant" };
}

function gateControlModel(hass, gate) {
  if (hasUsableState(hass, gate.controlEntityId)) {
    return { text: "Управление доступно", tone: "green", icon: "mdi:lan-connect" };
  }
  return { text: "Нет данных управления", tone: "red", icon: "mdi:lan-disconnect" };
}

function commandAvailable(hass, command) {
  return hasUsableState(hass, command.entityId) && typeof hass?.callService === "function";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function errorText(error) {
  const raw = error?.message || error?.body?.message || String(error || "Неизвестная ошибка");
  return String(raw).replace(/\s+/g, " ").trim().slice(0, 240) || "Неизвестная ошибка";
}
