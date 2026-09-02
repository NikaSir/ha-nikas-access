/* NikaS Access v0.1.7 | generated from frontend/src | do not edit bundle directly */

/* source: constants.js */
const ELEMENT_NAME = "nikas-access-panel";
const UI_VERSION = "0.1.7";
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

/* source: shell-v2.js */
/* NikaS specialized panel shell source kit v2.1.
 * Copy this file into a panel repository at build time and concatenate it into
 * that panel's single autonomous production bundle. Runtime imports are forbidden.
 */

const NIKAS_SHELL_V2_VERSION = "2.1";
const NIKAS_SOURCE_ROUTE_KEY = "nikas.specialized.source_route.v1";
const NIKAS_SOURCE_ROUTE_AT_KEY = "nikas.specialized.source_route_at.v1";
const NIKAS_SOURCE_ROUTE_MAX_AGE_MS = 30_000;
const NIKAS_SHELL_BOUNDARY_THRESHOLD_PX = 4;

const NIKAS_BASE_ROUTES = Object.freeze([
  Object.freeze({ root: "/dashboard-house-v13", entry: "/dashboard-house-v13/home" }),
  Object.freeze({ root: "/dashboard-rooms-v11", entry: "/dashboard-rooms-v11/rooms" }),
  Object.freeze({ root: "/dashboard-actions", entry: "/dashboard-actions/home" }),
  Object.freeze({ root: "/dashboard-infrastructure", entry: "/dashboard-infrastructure/overview" }),
]);
const NIKAS_SPECIALIZED_ROOTS = Object.freeze([
  "/dashboard-access-v1",
  "/dashboard-zont",
  "/starline",
  "/dashboard-s8-omni",
  "/dashboard-irrigation",
  "/dashboard-ups",
  "/dashboard-keenetic",
  "/dashboard-lider",
  "/dashboard-water-accounting",
]);

function nikasShellV2Styles() {
  return `
    :host{
      display:block;position:relative;inline-size:100%;block-size:100%;min-inline-size:0;min-block-size:0;
      overflow:hidden;overscroll-behavior:none;color:var(--primary-text-color,#15191d);
      background:var(--primary-background-color,#f4f6f8);
      font-family:var(--paper-font-body1_-_font-family,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif)
    }
    *{box-sizing:border-box}
    [hidden]{display:none!important}
    button{appearance:none;-webkit-appearance:none;font:inherit;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
    .nikas-shell{
      position:absolute;inset:0;inline-size:100%;block-size:100%;display:grid;min-inline-size:0;min-block-size:0;
      container:nikas-panel / inline-size;
      grid-template-areas:"header" "viewport" "tabs";
      grid-template-rows:calc(60px + env(safe-area-inset-top,0px)) minmax(0,1fr)
        calc(64px + env(safe-area-inset-bottom,0px));
      overflow:hidden;overscroll-behavior:none;background:var(--primary-background-color,#f4f6f8)
    }
    .nikas-shell--with-peer{
      grid-template-areas:"header" "peer" "viewport" "tabs";
      grid-template-rows:calc(60px + env(safe-area-inset-top,0px)) 52px minmax(0,1fr)
        calc(64px + env(safe-area-inset-bottom,0px))
    }
    .nikas-shell__header{
      grid-area:header;position:relative;z-index:20;min-inline-size:0;
      padding:env(safe-area-inset-top,0px) calc(12px + env(safe-area-inset-right,0px)) 0
        calc(12px + env(safe-area-inset-left,0px));
      display:grid;grid-template-columns:52px minmax(0,1fr) 52px;align-items:center;
      background:color-mix(in srgb,var(--primary-background-color,#f4f6f8) 97%,transparent);
      border-bottom:1px solid color-mix(in srgb,var(--divider-color,#dfe3e8) 70%,transparent);
      backdrop-filter:blur(18px) saturate(130%);-webkit-backdrop-filter:blur(18px) saturate(130%)
    }
    .nikas-shell__side-action{
      inline-size:44px;block-size:44px;padding:0;
      border:1px solid color-mix(in srgb,var(--divider-color,#dfe3e8) 72%,transparent);
      border-radius:16px;background:var(--card-background-color,#fff);box-shadow:0 7px 20px rgba(23,45,76,.08);
      display:grid;place-items:center;color:var(--primary-text-color,#17191c);cursor:pointer
    }
    .nikas-shell__side-action--right{justify-self:end;color:var(--primary-color,#03a9d9)}
    .nikas-shell__side-action:disabled{opacity:.55;cursor:wait}
    .nikas-shell__side-action ha-icon{--mdc-icon-size:25px}
    .nikas-shell__title{
      justify-self:center;inline-size:min(360px,100%);block-size:52px;padding:5px 14px;
      border:1px solid color-mix(in srgb,var(--primary-color,#03a9d9) 24%,var(--divider-color,#dfe3e8));
      border-radius:16px;background:color-mix(in srgb,var(--primary-color,#03a9d9) 5%,var(--card-background-color,#fff));
      box-shadow:0 5px 16px rgba(23,45,76,.06);color:inherit;display:grid;place-content:center;
      text-align:center;cursor:pointer;line-height:1.08
    }
    .nikas-shell__title strong{display:block;max-inline-size:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:23px;font-weight:800}
    .nikas-shell__title small{display:block;font-size:14px;font-weight:560;color:var(--secondary-text-color,#68737d)}
    .nikas-shell__title:active{
      transform:scale(.985);border-color:color-mix(in srgb,var(--primary-color,#03a9d9) 42%,var(--divider-color,#dfe3e8));
      background:color-mix(in srgb,var(--primary-color,#03a9d9) 13%,var(--card-background-color,#fff));
      box-shadow:0 2px 7px rgba(23,45,76,.05)
    }
    .nikas-shell__title:focus-visible,.nikas-shell__side-action:focus-visible{
      outline:2px solid var(--primary-color,#03a9d9);outline-offset:2px
    }
    .nikas-shell__side-action:active:not(:disabled){transform:scale(.985)}
    .nikas-shell__peer{grid-area:peer;min-inline-size:0;min-block-size:0}
    .nikas-shell__viewport{
      grid-area:viewport;position:relative;z-index:1;min-inline-size:0;min-block-size:0;
      overflow-y:auto;overflow-x:hidden;overscroll-behavior-x:none;overscroll-behavior-y:none;touch-action:pan-y;
      background:var(--primary-background-color,#f4f6f8);-webkit-overflow-scrolling:touch;overflow-anchor:none
    }
    .nikas-shell__viewport.zoomed{overflow:hidden;touch-action:none}
    .nikas-shell__canvas{inline-size:100%;min-block-size:100%;transform-origin:0 0}
    .nikas-shell__content{
      inline-size:100%;max-inline-size:1280px;min-block-size:100%;margin:0 auto;padding:12px 12px 20px
    }
    .nikas-shell__tabs{
      grid-area:tabs;position:relative;z-index:20;min-inline-size:0;min-block-size:0;
      padding:6px calc(6px + env(safe-area-inset-right,0px))
        calc(6px + env(safe-area-inset-bottom,0px)) calc(6px + env(safe-area-inset-left,0px));
      display:grid;grid-template-columns:repeat(var(--nikas-shell-tab-count,4),minmax(0,1fr));gap:2px;
      background:var(--card-background-color,#fff);border-top:1px solid var(--divider-color,#dfe3e8);
      box-shadow:0 -5px 22px rgba(23,45,76,.08)
    }
    .nikas-shell__tab{
      min-inline-size:0;block-size:52px;padding:2px 3px 6px;border:0;border-radius:16px;background:transparent;
      color:var(--secondary-text-color,#68737d);display:flex;flex-direction:column;align-items:center;
      justify-content:center;gap:1px;overflow:hidden;font-family:inherit;font-weight:700;line-height:1;cursor:pointer
    }
    .nikas-shell__tab ha-icon{--mdc-icon-size:26px;display:block;flex:0 0 26px}
    .nikas-shell__tab small{display:block;flex:0 0 14px;max-inline-size:100%;font-family:inherit;font-size:12px;font-weight:700;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .nikas-shell__tab.active{
      color:var(--primary-color,#2186d7);background:color-mix(in srgb,var(--primary-color,#2186d7) 11%,transparent)
    }
    @container nikas-panel (min-width:600px){.nikas-shell__content{padding-inline:16px}}
    @container nikas-panel (min-width:1024px){.nikas-shell__content{padding-inline:24px}}
    @container nikas-panel (max-width:359px){
      .nikas-shell__header{grid-template-columns:48px minmax(0,1fr) 48px}
      .nikas-shell__title{inline-size:100%;padding-inline:8px}
      .nikas-shell__title strong{font-size:21px}.nikas-shell__title small{font-size:13px}
    }
  `;
}

function shouldBlockNikasShellBoundaryMove({
  deltaX,
  deltaY,
  inViewport,
  scrollTop,
  scrollHeight,
  clientHeight,
}) {
  if (!Number.isFinite(deltaY) || Math.abs(deltaY) <= Math.abs(Number(deltaX) || 0)) return false;
  if (!inViewport) return true;
  const maximumScroll = Math.max(0, (Number(scrollHeight) || 0) - (Number(clientHeight) || 0));
  if (maximumScroll <= 1) return true;
  const currentScroll = Math.max(0, Number(scrollTop) || 0);
  if (deltaY > 0 && currentScroll <= 1) return true;
  return deltaY < 0 && currentScroll >= maximumScroll - 1;
}

function createNikasShellScrollBoundaryGuard({ host, viewport }) {
  if (!host?.addEventListener || !viewport) return () => {};
  let touch = null;

  const eventStartedInViewport = (event) => {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    return path.includes(viewport) || Boolean(viewport.contains?.(event.target));
  };
  const rememberTouch = (event) => {
    if (event.touches.length !== 1) {
      touch = null;
      return;
    }
    const current = event.touches[0];
    touch = {
      x: current.clientX,
      y: current.clientY,
      startX: current.clientX,
      startY: current.clientY,
      inViewport: eventStartedInViewport(event),
      blocked: false,
    };
  };
  const moveTouch = (event) => {
    if (event.touches.length !== 1) {
      touch = null;
      return;
    }
    const current = event.touches[0];
    if (!touch) {
      rememberTouch(event);
      return;
    }
    const deltaX = current.clientX - touch.x;
    const deltaY = current.clientY - touch.y;
    const travelX = current.clientX - touch.startX;
    const travelY = current.clientY - touch.startY;
    touch.x = current.clientX;
    touch.y = current.clientY;
    const verticalIntent = Math.abs(travelY) > NIKAS_SHELL_BOUNDARY_THRESHOLD_PX
      && Math.abs(travelY) > Math.abs(travelX);
    if (!touch.blocked && verticalIntent) {
      touch.blocked = shouldBlockNikasShellBoundaryMove({
        deltaX,
        deltaY,
        inViewport: touch.inViewport,
        scrollTop: viewport.scrollTop,
        scrollHeight: viewport.scrollHeight,
        clientHeight: viewport.clientHeight,
      });
    }
    if (touch.blocked && event.cancelable) {
      event.preventDefault();
    }
  };
  const endTouch = (event) => {
    if (event.touches.length === 1) rememberTouch(event);
    else touch = null;
  };
  const cancelTouch = () => {
    touch = null;
  };

  host.addEventListener("touchstart", rememberTouch, { passive: false, capture: true });
  host.addEventListener("touchmove", moveTouch, { passive: false, capture: true });
  host.addEventListener("touchend", endTouch, { passive: true, capture: true });
  host.addEventListener("touchcancel", cancelTouch, { passive: true, capture: true });

  return () => {
    host.removeEventListener("touchstart", rememberTouch, true);
    host.removeEventListener("touchmove", moveTouch, true);
    host.removeEventListener("touchend", endTouch, true);
    host.removeEventListener("touchcancel", cancelTouch, true);
    touch = null;
  };
}

function normalizeNikasBaseRoute(value) {
  if (typeof value !== "string" || !value || value.startsWith("//")) return null;
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    const match = NIKAS_BASE_ROUTES.find(
      ({ root }) => url.pathname === root || url.pathname.startsWith(`${root}/`),
    );
    return match?.entry || null;
  } catch (_error) {
    return null;
  }
}

function consumeNikasSourceHandoff(now = Date.now()) {
  let route = null;
  let timestamp = null;
  try {
    route = window.sessionStorage.getItem(NIKAS_SOURCE_ROUTE_KEY);
    timestamp = window.sessionStorage.getItem(NIKAS_SOURCE_ROUTE_AT_KEY);
  } catch (_error) {
    return null;
  } finally {
    try {
      window.sessionStorage.removeItem(NIKAS_SOURCE_ROUTE_KEY);
      window.sessionStorage.removeItem(NIKAS_SOURCE_ROUTE_AT_KEY);
    } catch (_error) {
      // Storage is optional; both values were still consumed for this mount.
    }
  }
  if (!route || !timestamp) return null;
  const createdAt = Number(timestamp);
  const age = now - createdAt;
  if (!Number.isFinite(createdAt) || age < 0 || age > NIKAS_SOURCE_ROUTE_MAX_AGE_MS) return null;
  return normalizeNikasBaseRoute(route);
}

function captureNikasShellReturnRoute({ panelId, parentRoute, safeReturnRoute }) {
  const savedKey = `nikas.${panelId}.return_route.v1`;
  const params = new URLSearchParams(window.location.search);
  const handoff = consumeNikasSourceHandoff();
  let saved = null;
  try {
    saved = window.localStorage.getItem(savedKey);
  } catch (_error) {
    // Saved return routes are an optional convenience.
  }
  const candidates = [
    ...params.getAll("return_to"),
    ...params.getAll("from"),
    handoff,
    saved,
    document.referrer,
    parentRoute,
    safeReturnRoute,
  ];
  const accepted = candidates.map(normalizeNikasBaseRoute).find(Boolean)
    || NIKAS_BASE_ROUTES[0].entry;
  try {
    window.localStorage.setItem(savedKey, accepted);
  } catch (_error) {
    // The captured route remains stable for the mounted panel instance.
  }
  return accepted;
}

function rememberNikasSpecializedSourceRoute(destination) {
  if (typeof destination !== "string" || !destination.startsWith("/")) return false;
  const target = new URL(destination, window.location.origin);
  const isSpecialized = target.origin === window.location.origin && NIKAS_SPECIALIZED_ROOTS.some(
    (root) => target.pathname === root || target.pathname.startsWith(`${root}/`),
  );
  if (!isSpecialized) return false;
  const sourceRoute = normalizeNikasBaseRoute(window.location.pathname);
  if (!sourceRoute) return false;
  try {
    window.sessionStorage.setItem(NIKAS_SOURCE_ROUTE_KEY, sourceRoute);
    window.sessionStorage.setItem(NIKAS_SOURCE_ROUTE_AT_KEY, String(Date.now()));
    return true;
  } catch (_error) {
    try {
      window.sessionStorage.removeItem(NIKAS_SOURCE_ROUTE_KEY);
      window.sessionStorage.removeItem(NIKAS_SOURCE_ROUTE_AT_KEY);
    } catch (_storageError) {
      // Destination navigation remains available without storage.
    }
    return false;
  }
}

function navigateNikasShell(path, { captureSource = false } = {}) {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) return false;
  const target = new URL(path, window.location.origin);
  if (target.origin !== window.location.origin) return false;
  const destination = `${target.pathname}${target.search}${target.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (current === destination) return true;
  if (captureSource) rememberNikasSpecializedSourceRoute(destination);
  window.history.pushState(null, "", destination);
  window.dispatchEvent(new Event("location-changed"));
  return true;
}

/* source: data/perimeters.js */
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

/* source: data/intercom.js */
const INTERCOM_MODULE = Object.freeze({
  enabled: false,
  entityIds: Object.freeze({}),
  capabilities: Object.freeze({
    connection: true,
    call: true,
    camera: true,
    unlock: true,
    eventHistory: true,
  }),
});

/* source: views/statuses-view.js */
function renderStatusesView() {
  return `
    <section class="panel-view active" data-view-panel="statuses" aria-labelledby="statuses-title">
      <div class="view-heading">
        <span><small>Главная</small><h1 id="statuses-title">Статусы</h1></span>
        <ha-icon icon="mdi:shield-home-outline"></ha-icon>
      </div>

      <section class="summary-card tone-red" data-status="access-summary" aria-live="polite">
        <span class="summary-icon"><ha-icon icon="mdi:shield-alert-outline"></ha-icon></span>
        <span class="summary-copy">
          <strong data-status-text>Есть точки без данных</strong>
          <small data-status-detail>Ожидание реестров Home Assistant</small>
        </span>
      </section>

      <div class="perimeter-grid">
        <article class="perimeter-card tone-red" data-status="perimeter-internal" aria-live="polite">
          <span class="perimeter-icon"><ha-icon icon="mdi:shield-alert-outline"></ha-icon></span>
          <span class="perimeter-copy">
            <small>Внутренний периметр</small>
            <strong data-status-text>Нет данных</strong>
            <em data-status-detail>Ожидание реестров Home Assistant</em>
          </span>
        </article>
        <article class="perimeter-card tone-red" data-status="perimeter-external" aria-live="polite">
          <span class="perimeter-icon"><ha-icon icon="mdi:shield-alert-outline"></ha-icon></span>
          <span class="perimeter-copy">
            <small>Внешний периметр</small>
            <strong data-status-text>Нет данных</strong>
            <em data-status-detail>Ожидание реестров Home Assistant</em>
          </span>
        </article>
        <article class="perimeter-card safety-card tone-red" data-status="safety" aria-live="assertive">
          <span class="perimeter-icon"><ha-icon icon="mdi:shield-alert-outline"></ha-icon></span>
          <span class="perimeter-copy">
            <small>Безопасность</small>
            <strong data-status-text>Нет данных</strong>
            <em data-status-detail>Ожидание реестров Home Assistant</em>
          </span>
        </article>
      </div>

      <p class="source-note">
        <ha-icon icon="mdi:label-outline"></ha-icon>
        Учитываются только действующие binary sensor с ярлыками периметров и безопасности. Unknown и unavailable всегда означают «Нет данных».
      </p>
    </section>`;
}

/* source: views/gates-view.js */
function renderGatesView() {
  return `
    <section class="panel-view" data-view-panel="gates" aria-labelledby="gates-title" hidden>
      <div class="view-heading">
        <span><small>Управление доступом</small><h1 id="gates-title">Ворота</h1></span>
        <ha-icon icon="mdi:gate"></ha-icon>
      </div>

      <div class="gate-grid">
        <article class="gate-card" data-gate="sectional">
          <div class="gate-heading">
            <span class="gate-visual"><ha-icon icon="mdi:garage-variant"></ha-icon></span>
            <span><h2>Секционные ворота</h2><p>Положение — только по датчику</p></span>
          </div>
          <div class="status-list">
            <button class="status-row tone-red" type="button" data-status="sectional-position" data-entity="${SECTIONAL_POSITION_ENTITY}">
              <ha-icon icon="mdi:garage-alert-variant"></ha-icon>
              <span><small>Физическое положение</small><strong data-status-text>Нет данных</strong></span>
            </button>
            <button class="status-row tone-red" type="button" data-status="sectional-control" data-entity="${SECTIONAL_CONTROL_ENTITY}">
              <ha-icon icon="mdi:lan-disconnect"></ha-icon>
              <span><small>Канал управления</small><strong data-status-text>Нет данных управления</strong></span>
            </button>
          </div>
          <div class="command-label">Каждая команда требует подтверждения</div>
          <div class="command-grid" aria-label="Команды секционных ворот">
            <button class="command" type="button" data-command="sectional:open" disabled>
              <ha-icon icon="mdi:arrow-up-bold"></ha-icon><span>Открыть</span>
            </button>
            <button class="command stop" type="button" data-command="sectional:stop" disabled>
              <ha-icon icon="mdi:stop-circle-outline"></ha-icon><span>Стоп</span>
            </button>
            <button class="command" type="button" data-command="sectional:close" disabled>
              <ha-icon icon="mdi:arrow-down-bold"></ha-icon><span>Закрыть</span>
            </button>
          </div>
        </article>

        <article class="gate-card" data-gate="swing">
          <div class="gate-heading">
            <span class="gate-visual"><ha-icon icon="mdi:gate"></ha-icon></span>
            <span><h2>Распашные ворота</h2><p>Физического датчика нет</p></span>
          </div>
          <div class="status-list">
            <div class="position-note">
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
              <span><small>Физическое положение</small><strong>Положение не контролируется</strong></span>
            </div>
            <button class="status-row tone-red" type="button" data-status="swing-control" data-entity="${SWING_CONTROL_ENTITY}">
              <ha-icon icon="mdi:lan-disconnect"></ha-icon>
              <span><small>Канал управления</small><strong data-status-text>Нет данных управления</strong></span>
            </button>
          </div>
          <div class="command-label">Каждая команда требует подтверждения</div>
          <div class="command-grid" aria-label="Команды распашных ворот">
            <button class="command" type="button" data-command="swing:open" disabled>
              <ha-icon icon="mdi:gate-arrow-right"></ha-icon><span>Открыть</span>
            </button>
            <button class="command stop" type="button" data-command="swing:stop" disabled>
              <ha-icon icon="mdi:stop-circle-outline"></ha-icon><span>Стоп</span>
            </button>
            <button class="command" type="button" data-command="swing:close" disabled>
              <ha-icon icon="mdi:gate-arrow-left"></ha-icon><span>Закрыть</span>
            </button>
          </div>
        </article>
      </div>
    </section>`;
}

/* source: views/intercom-view.js */
function renderIntercomView() {
  return `
    <section class="panel-view" data-view-panel="intercom" aria-labelledby="intercom-title" hidden>
      <div class="view-heading">
        <span><small>Подготовленный модуль</small><h1 id="intercom-title">Домофон</h1></span>
        <ha-icon icon="mdi:doorbell-video"></ha-icon>
      </div>
      <article class="empty-state">
        <span class="empty-icon"><ha-icon icon="mdi:doorbell-video"></ha-icon></span>
        <h2>Оборудование ещё не подключено</h2>
        <p>Сущности домофона не назначены. Панель не отправляет команды и не подставляет предполагаемые entity ID.</p>
      </article>
      <section class="capability-card" aria-label="Возможности будущего домофона">
        <h2>Подготовленные возможности</h2>
        <div class="capability-list">
          <span><ha-icon icon="mdi:lan-connect"></ha-icon>Состояние связи</span>
          <span><ha-icon icon="mdi:phone-ring-outline"></ha-icon>Входящий вызов</span>
          <span><ha-icon icon="mdi:cctv"></ha-icon>Просмотр камеры</span>
          <span><ha-icon icon="mdi:door-open"></ha-icon>Открытие калитки или двери</span>
          <span><ha-icon icon="mdi:history"></ha-icon>История событий</span>
        </div>
      </section>
    </section>`;
}

/* source: views/diagnostics-view.js */
function renderDiagnosticsView() {
  return `
    <section class="panel-view" data-view-panel="diagnostics" aria-labelledby="diagnostics-title" hidden>
      <div class="view-heading">
        <span><small>Источники и готовность</small><h1 id="diagnostics-title">Диагностика</h1></span>
        <ha-icon icon="mdi:stethoscope"></ha-icon>
      </div>

      <section class="diagnostic-card">
        <h2>Контрольные группы</h2>
        <div class="status-list">
          <div class="status-row tone-red" data-status="registry-status">
            <ha-icon icon="mdi:database-alert-outline"></ha-icon>
            <span><small>Реестры Home Assistant</small><strong data-status-text>Ожидание соединения</strong></span>
          </div>
          <div class="status-row tone-red" data-status="diagnostic-internal">
            <ha-icon icon="mdi:shield-alert-outline"></ha-icon>
            <span><small>Внутренний периметр</small><strong data-status-text>Нет данных</strong></span>
          </div>
          <div class="status-row tone-red" data-status="diagnostic-external">
            <ha-icon icon="mdi:shield-alert-outline"></ha-icon>
            <span><small>Внешний периметр</small><strong data-status-text>Нет данных</strong></span>
          </div>
          <div class="status-row tone-red" data-status="diagnostic-safety">
            <ha-icon icon="mdi:shield-alert-outline"></ha-icon>
            <span><small>Безопасность</small><strong data-status-text>Нет данных</strong></span>
          </div>
        </div>
      </section>

      <section class="diagnostic-card perimeter-inventory-card">
        <h2>Устройства контроля</h2>
        <p class="diagnostic-note">Показаны устройства и датчики, которые фактически входят в расчёт статусов.</p>
        <section class="perimeter-device-group" aria-labelledby="diagnostic-internal-devices-title">
          <div class="perimeter-device-group-heading">
            <ha-icon icon="mdi:shield-home-outline"></ha-icon>
            <span>
              <strong id="diagnostic-internal-devices-title">Внутренний периметр</strong>
              <small data-perimeter-device-count="internal">Устройств: 0 · датчиков: 0</small>
            </span>
          </div>
          <div class="perimeter-device-list" data-perimeter-device-list="internal">
            <p class="empty-diagnostic">Ожидание реестров Home Assistant</p>
          </div>
        </section>
        <section class="perimeter-device-group" aria-labelledby="diagnostic-external-devices-title">
          <div class="perimeter-device-group-heading">
            <ha-icon icon="mdi:shield-lock-outline"></ha-icon>
            <span>
              <strong id="diagnostic-external-devices-title">Внешний периметр</strong>
              <small data-perimeter-device-count="external">Устройств: 0 · датчиков: 0</small>
            </span>
          </div>
          <div class="perimeter-device-list" data-perimeter-device-list="external">
            <p class="empty-diagnostic">Ожидание реестров Home Assistant</p>
          </div>
        </section>
        <section class="perimeter-device-group" aria-labelledby="diagnostic-safety-devices-title">
          <div class="perimeter-device-group-heading">
            <ha-icon icon="mdi:shield-alert-outline"></ha-icon>
            <span>
              <strong id="diagnostic-safety-devices-title">Безопасность</strong>
              <small data-perimeter-device-count="safety">Устройств: 0 · датчиков: 0</small>
            </span>
          </div>
          <div class="perimeter-device-list" data-perimeter-device-list="safety">
            <p class="empty-diagnostic">Ожидание реестров Home Assistant</p>
          </div>
        </section>
      </section>

      <section class="diagnostic-card">
        <h2>Ворота</h2>
        <div class="status-list">
          <button class="status-row tone-red" type="button" data-status="diagnostic-sectional-position" data-entity="${SECTIONAL_POSITION_ENTITY}">
            <ha-icon icon="mdi:garage-alert-variant"></ha-icon>
            <span><small>Датчик секционных ворот</small><strong data-status-text>Нет данных</strong></span>
          </button>
          <button class="status-row tone-red" type="button" data-status="diagnostic-sectional-control" data-entity="${SECTIONAL_CONTROL_ENTITY}">
            <ha-icon icon="mdi:lan-disconnect"></ha-icon>
            <span><small>Управление секционными воротами</small><strong data-status-text>Нет данных управления</strong></span>
          </button>
          <button class="status-row tone-red" type="button" data-status="diagnostic-swing-control" data-entity="${SWING_CONTROL_ENTITY}">
            <ha-icon icon="mdi:lan-disconnect"></ha-icon>
            <span><small>Управление распашными воротами</small><strong data-status-text>Нет данных управления</strong></span>
          </button>
        </div>
      </section>

      <section class="diagnostic-meta">
        <span><small>Версия</small><strong>${UI_VERSION}</strong></span>
        <span><small>Маршрут</small><strong>${ROOT_PATH}</strong></span>
        <span><small>Команды</small><strong>Подтверждение + блокировка</strong></span>
        <span><small>Домофон</small><strong>Ожидает сущности</strong></span>
      </section>
    </section>`;
}

/* source: styles.js */
function panelStyles() {
  return `
    .domain-content{width:min(760px,100%);min-height:100%;margin:0 auto;display:flex;flex-direction:column;gap:11px}
    .panel-view{display:flex;min-width:0;flex-direction:column;gap:11px}
    .panel-view.active{animation:view-in .16s ease-out}
    @keyframes view-in{from{opacity:.7;transform:translateY(3px)}to{opacity:1;transform:none}}
    .view-heading{min-height:45px;padding:0 4px;display:flex;align-items:center;justify-content:space-between;gap:12px}
    .view-heading>span{min-width:0}.view-heading small{display:block;color:var(--secondary-text-color,#68737d);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.055em}
    .view-heading h1{margin:1px 0 0;font-size:25px;line-height:1.1}.view-heading>ha-icon{--mdc-icon-size:31px;color:var(--primary-color,#2186d7)}
    .summary-card{
      min-height:72px;padding:11px 14px;border:1px solid var(--divider-color,#dce1e6);border-radius:20px;
      background:var(--card-background-color,#fff);box-shadow:0 7px 24px rgba(23,45,76,.07);
      display:grid;grid-template-columns:44px minmax(0,1fr);gap:11px;align-items:center
    }
    .summary-card>.summary-icon{
      width:44px;height:44px;border-radius:15px;display:grid;place-items:center;
      background:color-mix(in srgb,var(--summary-color,#87909a) 12%,transparent);
      color:var(--summary-color,#87909a)
    }
    .summary-card>.summary-icon ha-icon{--mdc-icon-size:27px}
    .summary-copy{min-width:0;display:grid;gap:2px}
    .summary-copy strong{font-size:18px;font-weight:800;line-height:1.15}
    .summary-copy small{color:var(--secondary-text-color,#68737d);font-size:13px;line-height:1.25}
    .tone-green{--summary-color:var(--success-color,#2e9f62)}
    .tone-yellow{--summary-color:#d49a00}
    .tone-red{--summary-color:var(--error-color,#d94141)}
    .tone-blue{--summary-color:var(--primary-color,#2186d7)}
    .tone-grey{--summary-color:#7b858f}
    .perimeter-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}
    .perimeter-card{
      min-width:0;min-height:150px;padding:16px;border:1px solid color-mix(in srgb,var(--summary-color,#7b858f) 26%,var(--divider-color,#ddd));
      border-radius:22px;background:color-mix(in srgb,var(--summary-color,#7b858f) 5%,var(--card-background-color,#fff));
      box-shadow:0 8px 25px rgba(23,45,76,.065);display:grid;grid-template-columns:50px minmax(0,1fr);gap:12px;align-items:center
    }
    .perimeter-card.safety-card{grid-column:1/-1;min-height:112px}
    .perimeter-icon{width:50px;height:50px;border-radius:17px;display:grid;place-items:center;background:color-mix(in srgb,var(--summary-color,#7b858f) 13%,transparent);color:var(--summary-color,#7b858f)}
    .perimeter-icon ha-icon{--mdc-icon-size:31px}.perimeter-copy{min-width:0;display:grid;gap:3px}
    .perimeter-copy small{font-size:12px;font-weight:700;color:var(--secondary-text-color,#68737d)}
    .perimeter-copy strong{font-size:23px;line-height:1.08}.perimeter-copy em{font-style:normal;font-size:12px;line-height:1.3;color:var(--secondary-text-color,#68737d)}
    .source-note{margin:0;padding:11px 13px;border-radius:16px;background:var(--secondary-background-color,#eef1f4);display:grid;grid-template-columns:24px minmax(0,1fr);gap:8px;align-items:start;color:var(--secondary-text-color,#68737d);font-size:12px;line-height:1.35}
    .source-note ha-icon{--mdc-icon-size:21px;color:var(--primary-color,#2186d7)}
    .error-banner{
      padding:11px 12px;border:1px solid color-mix(in srgb,var(--error-color,#d94141) 45%,var(--divider-color,#ddd));
      border-radius:16px;background:color-mix(in srgb,var(--error-color,#d94141) 9%,var(--card-background-color,#fff));
      display:grid;grid-template-columns:24px minmax(0,1fr) 34px;gap:8px;align-items:start;color:var(--error-color,#c93232)
    }
    .error-banner>ha-icon{--mdc-icon-size:22px;margin-top:1px}
    .error-banner strong,.error-banner small{display:block}
    .error-banner strong{font-size:14px}.error-banner small{margin-top:2px;font-size:12px;line-height:1.3}
    .error-banner button{width:34px;height:34px;padding:0;border:0;border-radius:11px;background:transparent;color:inherit}
    .gate-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;align-items:stretch}
    .gate-card{
      min-width:0;padding:14px;border:1px solid var(--divider-color,#dce1e6);border-radius:22px;
      background:var(--card-background-color,#fff);box-shadow:0 8px 25px rgba(23,45,76,.065);
      display:flex;flex-direction:column;gap:11px
    }
    .gate-heading{display:grid;grid-template-columns:48px minmax(0,1fr);gap:11px;align-items:center}
    .gate-visual{
      width:48px;height:48px;border-radius:16px;background:color-mix(in srgb,var(--primary-color,#2186d7) 10%,transparent);
      display:grid;place-items:center;color:var(--primary-color,#2186d7)
    }
    .gate-visual ha-icon{--mdc-icon-size:30px}
    .gate-heading h2{margin:0;font-size:20px;line-height:1.08}.gate-heading p{margin:3px 0 0;color:var(--secondary-text-color,#68737d);font-size:12px}
    .status-list{display:grid;gap:7px}
    .status-row{
      width:100%;min-height:49px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--summary-color,#7b858f) 25%,var(--divider-color,#ddd));
      border-radius:15px;background:color-mix(in srgb,var(--summary-color,#7b858f) 6%,var(--card-background-color,#fff));
      color:inherit;display:grid;grid-template-columns:28px minmax(0,1fr);gap:8px;align-items:center;text-align:left
    }
    .status-row>ha-icon{--mdc-icon-size:22px;color:var(--summary-color,#7b858f)}
    .status-row span{min-width:0;display:grid;gap:1px}.status-row small{font-size:11px;color:var(--secondary-text-color,#68737d)}
    .status-row strong{font-size:14px;line-height:1.15;overflow:hidden;text-overflow:ellipsis}
    .position-note{
      min-height:49px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--primary-color,#2186d7) 25%,var(--divider-color,#ddd));
      border-radius:15px;background:color-mix(in srgb,var(--primary-color,#2186d7) 6%,var(--card-background-color,#fff));
      display:grid;grid-template-columns:28px minmax(0,1fr);gap:8px;align-items:center
    }
    .position-note ha-icon{--mdc-icon-size:22px;color:var(--primary-color,#2186d7)}
    .position-note small,.position-note strong{display:block}.position-note small{font-size:11px;color:var(--secondary-text-color,#68737d)}
    .position-note strong{font-size:14px;line-height:1.15}
    .command-label{margin-top:auto;padding-top:1px;color:var(--secondary-text-color,#68737d);font-size:11px;text-align:center}
    .command-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
    .command{
      min-width:0;min-height:58px;padding:7px 3px;border:1px solid color-mix(in srgb,var(--primary-color,#2186d7) 30%,var(--divider-color,#ddd));
      border-radius:16px;background:color-mix(in srgb,var(--primary-color,#2186d7) 7%,var(--card-background-color,#fff));
      color:var(--primary-text-color,#15191d);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
      font-size:12px;font-weight:800;cursor:pointer
    }
    .command ha-icon{--mdc-icon-size:24px;color:var(--primary-color,#2186d7)}
    .command.stop{border-color:color-mix(in srgb,var(--warning-color,#ef8f22) 38%,var(--divider-color,#ddd));background:color-mix(in srgb,var(--warning-color,#ef8f22) 8%,var(--card-background-color,#fff))}
    .command.stop ha-icon{color:var(--warning-color,#ef8f22)}
    .command:disabled{opacity:.42;filter:grayscale(.35);cursor:not-allowed}
    .command:active:not(:disabled){transform:scale(.97)}
    .empty-state{padding:24px 18px;border:1px solid var(--divider-color,#dce1e6);border-radius:22px;background:var(--card-background-color,#fff);box-shadow:0 8px 25px rgba(23,45,76,.065);text-align:center}
    .empty-icon{width:64px;height:64px;margin:0 auto 12px;border-radius:22px;background:color-mix(in srgb,var(--primary-color,#2186d7) 10%,transparent);color:var(--primary-color,#2186d7);display:grid;place-items:center}
    .empty-icon ha-icon{--mdc-icon-size:37px}.empty-state h2{margin:0;font-size:21px}.empty-state p{max-width:520px;margin:7px auto 0;color:var(--secondary-text-color,#68737d);font-size:13px;line-height:1.4}
    .capability-card,.diagnostic-card{padding:14px;border:1px solid var(--divider-color,#dce1e6);border-radius:20px;background:var(--card-background-color,#fff);box-shadow:0 7px 22px rgba(23,45,76,.055)}
    .capability-card h2,.diagnostic-card h2{margin:0 0 10px;font-size:17px}
    .capability-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
    .capability-list span{min-height:43px;padding:8px 10px;border-radius:14px;background:var(--secondary-background-color,#eef1f4);display:grid;grid-template-columns:25px minmax(0,1fr);gap:7px;align-items:center;font-size:12px;font-weight:700}
    .capability-list ha-icon{--mdc-icon-size:21px;color:var(--primary-color,#2186d7)}
    .diagnostic-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    .diagnostic-meta span{min-width:0;padding:10px 12px;border:1px solid var(--divider-color,#dce1e6);border-radius:15px;background:var(--card-background-color,#fff);display:grid;gap:2px}
    .diagnostic-meta small{color:var(--secondary-text-color,#68737d);font-size:10px;text-transform:uppercase;letter-spacing:.04em}.diagnostic-meta strong{font-size:12px;overflow-wrap:anywhere}
    .diagnostic-note{margin:-3px 0 11px;color:var(--secondary-text-color,#68737d);font-size:12px;line-height:1.35}
    .perimeter-device-group{display:grid;gap:8px;padding-top:11px;border-top:1px solid var(--divider-color,#dce1e6)}
    .perimeter-device-group+.perimeter-device-group{margin-top:13px}
    .perimeter-device-group-heading{display:grid;grid-template-columns:34px minmax(0,1fr);gap:8px;align-items:center}
    .perimeter-device-group-heading>ha-icon{--mdc-icon-size:26px;color:var(--primary-color,#2186d7)}
    .perimeter-device-group-heading span{min-width:0;display:grid;gap:1px}.perimeter-device-group-heading strong{font-size:15px}.perimeter-device-group-heading small{font-size:12px;color:var(--secondary-text-color,#68737d)}
    .perimeter-device-list{display:grid;gap:8px}.empty-diagnostic{margin:0;padding:11px;border-radius:14px;background:var(--secondary-background-color,#eef1f4);color:var(--secondary-text-color,#68737d);font-size:12px;line-height:1.35}
    .perimeter-device{padding:10px;border:1px solid var(--divider-color,#dce1e6);border-radius:16px;background:color-mix(in srgb,var(--secondary-background-color,#eef1f4) 45%,var(--card-background-color,#fff));display:grid;gap:8px}
    .perimeter-device-heading{display:grid;grid-template-columns:30px minmax(0,1fr);gap:8px;align-items:center}
    .perimeter-device-heading>ha-icon{--mdc-icon-size:23px;color:var(--primary-color,#2186d7)}
    .perimeter-device-heading span{min-width:0;display:grid;gap:1px}.perimeter-device-heading strong{font-size:14px;line-height:1.2}.perimeter-device-heading small{font-size:12px;color:var(--secondary-text-color,#68737d)}
    .perimeter-source-list{display:grid;gap:6px}
    .perimeter-source{width:100%;min-width:0;min-height:54px;padding:8px;border:1px solid color-mix(in srgb,var(--summary-color,#7b858f) 25%,var(--divider-color,#ddd));border-radius:13px;background:color-mix(in srgb,var(--summary-color,#7b858f) 5%,var(--card-background-color,#fff));color:inherit;display:grid;grid-template-columns:26px minmax(0,1fr) auto;gap:7px;align-items:center;text-align:left;cursor:pointer}
    .perimeter-source>ha-icon{--mdc-icon-size:21px;color:var(--summary-color,#7b858f)}.perimeter-source>span{min-width:0;display:grid;gap:2px}.perimeter-source strong{font-size:13px;line-height:1.2}.perimeter-source code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:var(--secondary-text-color,#68737d);overflow-wrap:anywhere}.perimeter-source em{font-style:normal;font-size:12px;font-weight:800;color:var(--summary-color,#7b858f);white-space:nowrap}
    .modal{
      position:absolute;inset:0;z-index:60;padding:calc(18px + env(safe-area-inset-top,0px)) 16px calc(18px + env(safe-area-inset-bottom,0px));
      background:rgba(13,18,23,.48);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);
      display:grid;place-items:center
    }
    .dialog{
      width:min(390px,100%);padding:18px;border-radius:24px;background:var(--card-background-color,#fff);
      box-shadow:0 24px 70px rgba(0,0,0,.28);display:grid;gap:12px
    }
    .dialog-icon{width:50px;height:50px;border-radius:17px;display:grid;place-items:center;background:color-mix(in srgb,var(--warning-color,#ef8f22) 12%,transparent);color:var(--warning-color,#ef8f22);margin:0 auto}
    .dialog-icon ha-icon{--mdc-icon-size:30px}.dialog h2{margin:0;text-align:center;font-size:21px}.dialog p{margin:0;text-align:center;line-height:1.35}
    .dialog .safety{padding:9px;border-radius:13px;background:var(--secondary-background-color,#eef1f4);font-size:12px;color:var(--secondary-text-color,#68737d)}
    .dialog-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:2px}
    .dialog-actions button{min-height:48px;border-radius:15px;font-weight:800;cursor:pointer}
    .dialog-cancel{border:1px solid var(--divider-color,#ddd);background:transparent;color:inherit}
    .dialog-confirm{border:1px solid var(--primary-color,#2186d7);background:var(--primary-color,#2186d7);color:#fff}
    .dialog-confirm:disabled{opacity:.5;cursor:wait}
    .zoom-toast,.command-toast{
      position:absolute;z-index:70;left:50%;transform:translate(-50%,-12px);opacity:0;pointer-events:none;
      padding:8px 13px;border-radius:999px;background:rgba(30,34,38,.92);color:#fff;font-size:12px;
      transition:opacity .2s,transform .2s;max-width:calc(100% - 28px);text-align:center
    }
    .zoom-toast{top:calc(68px + env(safe-area-inset-top,0px))}.command-toast{bottom:calc(78px + env(safe-area-inset-bottom,0px))}
    .zoom-toast.show,.command-toast.show{opacity:1;transform:translate(-50%,0)}
    button:focus-visible{outline:2px solid var(--primary-color,#2186d7);outline-offset:2px}
    @media(max-width:640px){
      .gate-grid,.perimeter-grid{grid-template-columns:1fr}.gate-card{padding:12px}
    }
    @media(max-width:620px){.gate-grid{grid-template-columns:1fr}}
    @media(max-width:390px){
      .gate-heading h2{font-size:19px}.summary-copy strong{font-size:17px}.view-heading h1{font-size:23px}
      .capability-list,.diagnostic-meta{grid-template-columns:1fr}
    }
    @media(max-height:720px){.gate-card{gap:8px}.summary-card{min-height:64px}.status-row,.position-note{min-height:45px}.command{min-height:53px}}
  `;
}

/* source: nikas-access-panel.js */
class NikasAccessPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._panel = null;
    this._mounted = false;
    this._activeView = "statuses";
    this._stateFrame = null;
    this._registries = null;
    this._registryLoading = false;
    this._registryError = "";
    this._registryLoadId = 0;
    this._accessSources = { internal: [], external: [], safety: [] };
    this._accessDevices = { internal: [], external: [], safety: [] };
    this._commandLock = false;
    this._pendingCommand = null;
    this._lastCommandAt = 0;
    this._unlockTimer = null;
    this._toastTimer = null;
    this._zoomToastTimer = null;
    this._zoom = this.loadZoom();
    this._gesture = null;
    this._lastTwoTap = 0;
    this._suppressClicksUntil = 0;
    this._touchPointers = new Set();
    this._tapSession = null;
    this._manualActivationTarget = null;
    this._manualActivationUntil = 0;
    this._returnRoute = null;
    this._scrollBoundaryGuardCleanup = null;
    this._onResize = () => this.applyTransform();
    this._onKeyDown = (event) => {
      if (event.key === "Escape" && this._pendingCommand && !this._commandLock) {
        this.closeConfirmation();
      }
    };
  }

  set panel(value) {
    this._panel = value;
  }

  set hass(value) {
    this._hass = value;
    if (this._mounted) {
      this.scheduleStatePatch();
      if (!this._registries && !this._registryLoading) void this.loadRegistries();
    }
  }

  connectedCallback() {
    this.mountShell();
    this._scrollBoundaryGuardCleanup?.();
    this._scrollBoundaryGuardCleanup = createNikasShellScrollBoundaryGuard({
      host: this,
      viewport: this._viewport,
    });
    if (window.location.pathname === PANEL_ROOT) {
      window.history.replaceState(null, "", ROOT_PATH);
    }
    window.addEventListener("resize", this._onResize, { passive: true });
    window.visualViewport?.addEventListener?.("resize", this._onResize, { passive: true });
    window.addEventListener("keydown", this._onKeyDown);
    this.scheduleStatePatch();
    void this.loadRegistries();
  }

  disconnectedCallback() {
    this._scrollBoundaryGuardCleanup?.();
    this._scrollBoundaryGuardCleanup = null;
    window.removeEventListener("resize", this._onResize);
    window.visualViewport?.removeEventListener?.("resize", this._onResize);
    window.removeEventListener("keydown", this._onKeyDown);
    if (this._stateFrame !== null) window.cancelAnimationFrame(this._stateFrame);
    window.clearTimeout(this._unlockTimer);
    window.clearTimeout(this._toastTimer);
    window.clearTimeout(this._zoomToastTimer);
    this._registryLoadId += 1;
    this._stateFrame = null;
  }

  mountShell() {
    if (this._mounted) return;
    this._mounted = true;
    this._returnRoute = captureNikasShellReturnRoute({
      panelId: RETURN_PANEL_ID,
      parentRoute: PARENT_ROUTE,
      safeReturnRoute: SAFE_RETURN_ROUTE,
    });
    this.shadowRoot.innerHTML = `
      <style>${nikasShellV2Styles()}${panelStyles()}</style>
      <div class="nikas-shell app" style="--nikas-shell-tab-count:4">
        <header class="nikas-shell__header header">
          <button class="nikas-shell__side-action shell-button menu" type="button" aria-label="Меню Home Assistant">
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>
          <button class="nikas-shell__title title-return" type="button" data-return-home
            aria-label="Контроль доступа — вернуться в исходную панель NikaS">
            <strong>Контроль доступа</strong>
            <small>UI v${UI_VERSION}</small>
          </button>
          <button class="nikas-shell__side-action nikas-shell__side-action--right shell-button refresh"
            type="button" data-registry-retry
            aria-label="Обновить реестры Home Assistant" title="Обновить реестры Home Assistant">
            <ha-icon icon="mdi:refresh"></ha-icon>
          </button>
        </header>

        <main class="nikas-shell__viewport viewport" id="viewport">
          <section class="nikas-shell__canvas canvas" id="canvas">
            <div class="nikas-shell__content content">
              <div class="domain-content">
                <section class="error-banner" id="error-banner" role="alert" aria-live="assertive" hidden>
                  <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                  <span>
                    <strong>Команда не выполнена</strong>
                    <small id="error-text"></small>
                  </span>
                  <button type="button" data-dismiss-error aria-label="Скрыть сообщение об ошибке">
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </section>
                ${renderStatusesView()}
                ${renderGatesView()}
                ${renderIntercomView()}
                ${renderDiagnosticsView()}
              </div>
            </div>
          </section>
        </main>

        <nav class="nikas-shell__tabs tabs" aria-label="Разделы панели Доступ">
          <button type="button" class="nikas-shell__tab active" data-view-target="statuses" aria-current="page" aria-label="Статусы">
            <ha-icon icon="mdi:shield-home-outline"></ha-icon><small>Статусы</small>
          </button>
          <button type="button" class="nikas-shell__tab" data-view-target="gates" aria-label="Ворота">
            <ha-icon icon="mdi:gate"></ha-icon><small>Ворота</small>
          </button>
          <button type="button" class="nikas-shell__tab" data-view-target="intercom" aria-label="Домофон">
            <ha-icon icon="mdi:doorbell-video"></ha-icon><small>Домофон</small>
          </button>
          <button type="button" class="nikas-shell__tab" data-view-target="diagnostics" aria-label="Диагностика">
            <ha-icon icon="mdi:stethoscope"></ha-icon><small>Диагностика</small>
          </button>
        </nav>

        <section class="modal" id="confirm-modal" aria-hidden="true" hidden>
          <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
            <span class="dialog-icon"><ha-icon icon="mdi:shield-lock-outline"></ha-icon></span>
            <h2 id="confirm-title">Подтвердите команду</h2>
            <p id="confirm-message"></p>
            <p class="safety">Положение ворот не изменяется на экране до получения фактических данных Home Assistant.</p>
            <div class="dialog-actions">
              <button class="dialog-cancel" type="button" data-confirm-cancel>Отмена</button>
              <button class="dialog-confirm" type="button" data-confirm-accept>Выполнить</button>
            </div>
          </div>
        </section>

        <div class="zoom-toast" aria-live="polite">Масштаб 100%</div>
        <div class="command-toast" aria-live="polite"></div>
      </div>`;

    this._viewport = this.shadowRoot.getElementById("viewport");
    this._canvas = this.shadowRoot.getElementById("canvas");
    this._modal = this.shadowRoot.getElementById("confirm-modal");
    this._confirmMessage = this.shadowRoot.getElementById("confirm-message");
    this._confirmButton = this.shadowRoot.querySelector("[data-confirm-accept]");
    this._errorBanner = this.shadowRoot.getElementById("error-banner");
    this._errorText = this.shadowRoot.getElementById("error-text");
    this._zoomToast = this.shadowRoot.querySelector(".zoom-toast");
    this._commandToast = this.shadowRoot.querySelector(".command-toast");
    this.shadowRoot.addEventListener("click", (event) => this.controlClick(event));
    this.shadowRoot.addEventListener("pointerdown", (event) => this.tapPointerDown(event), { passive: true });
    this.shadowRoot.addEventListener("pointermove", (event) => this.tapPointerMove(event), { passive: true });
    this.shadowRoot.addEventListener("pointerup", (event) => this.tapPointerUp(event), { passive: false });
    this.shadowRoot.addEventListener("pointercancel", (event) => this.tapPointerCancel(event), { passive: true });
    this._viewport.addEventListener("touchstart", (event) => this.touchStart(event), { passive: false });
    this._viewport.addEventListener("touchmove", (event) => this.touchMove(event), { passive: false });
    this._viewport.addEventListener("touchend", (event) => this.touchEnd(event), { passive: false });
    this._viewport.addEventListener("touchcancel", (event) => this.touchEnd(event), { passive: false });
    this.applyTransform();
  }

  actionButton(event) {
    const path = typeof event?.composedPath === "function" ? event.composedPath() : [];
    for (const node of path) {
      if (node === this.shadowRoot) break;
      if (typeof node?.matches === "function" && node.matches("button")) return node;
    }
    return event?.target?.closest?.("button") || null;
  }

  activateControl(button) {
    if (!button || button.disabled) return false;
    if (button.classList?.contains("menu")) {
      this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }));
      return true;
    }
    if (button.dataset?.entity) {
      this.dispatchEvent(new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId: button.dataset.entity },
      }));
      return true;
    }
    if (button.dataset?.viewTarget) {
      this.activateView(button.dataset.viewTarget);
      return true;
    }
    if (button.dataset?.registryRetry !== undefined) {
      void this.loadRegistries(true);
      return true;
    }
    if (button.dataset?.returnHome !== undefined) {
      navigateNikasShell(this._returnRoute);
      return true;
    }
    if (button.dataset?.command) {
      this.openConfirmation(button.dataset.command);
      return true;
    }
    if (button.dataset?.confirmCancel !== undefined) {
      this.closeConfirmation();
      return true;
    }
    if (button.dataset?.confirmAccept !== undefined) {
      void this.executePendingCommand();
      return true;
    }
    if (button.dataset?.dismissError !== undefined) {
      this.dismissError();
      return true;
    }
    return false;
  }

  activateView(viewId) {
    const view = INTERNAL_VIEWS[viewId];
    if (!view) return;
    this._activeView = view.id;
    for (const panel of this.shadowRoot.querySelectorAll("[data-view-panel]")) {
      const active = panel.dataset.viewPanel === view.id;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    }
    for (const button of this.shadowRoot.querySelectorAll("[data-view-target]")) {
      if (!button.closest(".tabs")) continue;
      const active = button.dataset.viewTarget === view.id;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
    this._viewport?.scrollTo({ left: 0, top: 0 });
    if (this._zoom.scale > 1.03) {
      this._zoom.x = 0;
      this._zoom.y = 0;
    }
    window.requestAnimationFrame(() => this.applyTransform());
    this.scheduleStatePatch();
  }

  controlClick(event) {
    const button = this.actionButton(event);
    if (!button) return;
    if (button === this._manualActivationTarget && Date.now() < this._manualActivationUntil) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      return;
    }
    if (Date.now() < this._suppressClicksUntil) return;
    if (this.activateControl(button)) event.preventDefault();
  }

  tapPointerDown(event) {
    if (event.pointerType !== "touch") return;
    this._touchPointers.add(event.pointerId);
    if (this._touchPointers.size > 1) {
      if (this._tapSession) this._tapSession.cancelled = true;
      return;
    }
    const button = this.actionButton(event);
    this._tapSession = button ? {
      pointerId: event.pointerId,
      button,
      startX: Number(event.clientX) || 0,
      startY: Number(event.clientY) || 0,
      cancelled: false,
    } : null;
  }

  tapPointerMove(event) {
    const session = this._tapSession;
    if (event.pointerType !== "touch" || !session || session.pointerId !== event.pointerId) return;
    const distance = Math.hypot(
      (Number(event.clientX) || 0) - session.startX,
      (Number(event.clientY) || 0) - session.startY,
    );
    if (distance >= TAP_MOVE_THRESHOLD_PX) session.cancelled = true;
  }

  tapPointerUp(event) {
    if (event.pointerType !== "touch") return;
    const session = this._tapSession;
    const isCandidate = session
      && session.pointerId === event.pointerId
      && !session.cancelled
      && this._touchPointers.size === 1
      && !this._gesture?.moved
      && this._gesture?.kind !== "pinch"
      && Date.now() >= this._suppressClicksUntil;
    this._touchPointers.delete(event.pointerId);
    this._tapSession = null;
    if (!isCandidate || !this.activateControl(session.button)) return;
    this._manualActivationTarget = session.button;
    this._manualActivationUntil = Date.now() + TAP_CLICK_GUARD_MS;
    if (event.cancelable) event.preventDefault();
  }

  tapPointerCancel(event) {
    if (event.pointerType !== "touch") return;
    this._touchPointers.delete(event.pointerId);
    if (this._tapSession?.pointerId === event.pointerId) this._tapSession = null;
  }

  registryTransport() {
    if (typeof this._hass?.callWS === "function") {
      return (message) => this._hass.callWS(message);
    }
    if (typeof this._hass?.connection?.sendMessagePromise === "function") {
      return (message) => this._hass.connection.sendMessagePromise(message);
    }
    return null;
  }

  registryValues(value) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") return Object.values(value);
    return null;
  }

  hassRegistrySnapshot() {
    const devices = this.registryValues(this._hass?.devices);
    const entities = this.registryValues(this._hass?.entities);
    if (!devices || !entities) return null;
    return {
      devices,
      entities,
      labels: this.registryValues(this._hass?.labels) || [],
    };
  }

  async registryRequest(type) {
    const transport = this.registryTransport();
    if (!transport) throw new Error("Соединение Home Assistant ещё не готово");
    return transport({ type });
  }

  applyRegistries(registries) {
    this._registries = registries;
    this._accessSources = discoverAccessSources(registries);
    this._accessDevices = discoverAccessDevices(registries, this._accessSources);
    this._registryError = "";
    this.renderAccessDevices();
    this.scheduleStatePatch();
  }

  renderAccessDevices() {
    for (const definition of Object.values(ACCESS_DEFINITIONS)) {
      const groups = this._accessDevices[definition.key] || [];
      const list = this.shadowRoot.querySelector(`[data-perimeter-device-list="${definition.key}"]`);
      const count = this.shadowRoot.querySelector(`[data-perimeter-device-count="${definition.key}"]`);
      const sensorCount = groups.reduce((total, group) => total + group.entities.length, 0);
      if (count) count.textContent = `Устройств: ${groups.length} · датчиков: ${sensorCount}`;
      if (!list) continue;
      if (groups.length === 0) {
        list.innerHTML = `<p class="empty-diagnostic">Действующие устройства с ярлыком «${escapeHtml(definition.label)}» не найдены</p>`;
        continue;
      }

      list.innerHTML = groups.map((group) => `
        <article class="perimeter-device">
          <div class="perimeter-device-heading">
            <ha-icon icon="mdi:devices"></ha-icon>
            <span>
              <strong>${escapeHtml(group.name)}</strong>
              <small>${group.deviceId ? "Устройство Home Assistant" : "Сущность без устройства"}</small>
            </span>
          </div>
          <div class="perimeter-source-list">
            ${group.entities.map((entity) => {
              const state = accessSourceStateModel(this._hass, entity.entityId, definition);
              const friendlyName = stateObject(this._hass, entity.entityId)?.attributes?.friendly_name || entity.name;
              return `
                <button class="perimeter-source tone-${state.tone}" type="button"
                  data-entity="${escapeHtml(entity.entityId)}" data-access-source="${escapeHtml(entity.entityId)}"
                  data-access-group="${escapeHtml(definition.key)}">
                  <ha-icon icon="${escapeHtml(state.icon)}"></ha-icon>
                  <span>
                    <strong>${escapeHtml(friendlyName)}</strong>
                    <code>${escapeHtml(entity.entityId)}</code>
                  </span>
                  <em data-source-state>${escapeHtml(state.text)}</em>
                </button>`;
            }).join("")}
          </div>
        </article>`).join("");
    }
  }

  async loadRegistries(force = false) {
    if (this._registryLoading) return;
    if (this._registries && !force) return;
    const loadId = ++this._registryLoadId;
    this._registryLoading = true;
    this._registryError = "";
    this.scheduleStatePatch();

    try {
      let snapshot = this.hassRegistrySnapshot();
      if (!snapshot) {
        const [devices, entities] = await Promise.all([
          this.registryRequest("config/device_registry/list"),
          this.registryRequest("config/entity_registry/list"),
        ]);
        if (!Array.isArray(devices) || !Array.isArray(entities)) {
          throw new Error("Home Assistant вернул некорректные реестры");
        }
        snapshot = { devices, entities, labels: [] };
      }

      if (snapshot.labels.length === 0 && this.registryTransport()) {
        try {
          const labels = await this.registryRequest("config/label_registry/list");
          if (Array.isArray(labels)) snapshot.labels = labels;
        } catch (_error) {
          // Stable label ids remain sufficient when names are unavailable.
        }
      }

      if (loadId !== this._registryLoadId) return;
      this.applyRegistries(snapshot);
    } catch (error) {
      if (loadId !== this._registryLoadId) return;
      this._registryError = errorText(error);
      this.scheduleStatePatch();
    } finally {
      if (loadId === this._registryLoadId) {
        this._registryLoading = false;
        this.scheduleStatePatch();
      }
    }
  }

  openConfirmation(commandKey) {
    const command = COMMANDS[commandKey];
    const now = Date.now();
    if (!command || this._commandLock || now - this._lastCommandAt < COMMAND_COOLDOWN_MS) return;
    if (!commandAvailable(this._hass, command)) {
      this.showPersistentError(`${command.objectLabel} · ${command.actionLabel}: нет данных канала управления.`);
      return;
    }
    if (this._pendingCommand?.key === command.key) return;
    this._pendingCommand = command;
    this._confirmMessage.textContent = `Объект: «${command.objectLabel}». Действие: «${command.actionLabel}». Выполнить команду?`;
    this._confirmButton.textContent = command.actionLabel;
    this._modal.hidden = false;
    this._modal.setAttribute("aria-hidden", "false");
    this._confirmButton.focus({ preventScroll: true });
  }

  closeConfirmation() {
    if (this._commandLock) return;
    this._pendingCommand = null;
    this._modal.hidden = true;
    this._modal.setAttribute("aria-hidden", "true");
  }

  async executePendingCommand() {
    const command = this._pendingCommand;
    const now = Date.now();
    if (!command || this._commandLock || now - this._lastCommandAt < COMMAND_COOLDOWN_MS) return;
    if (!commandAvailable(this._hass, command)) {
      this.closeConfirmation();
      this.showPersistentError(`${command.objectLabel} · ${command.actionLabel}: нет данных канала управления.`);
      return;
    }

    this._commandLock = true;
    this._lastCommandAt = now;
    this._pendingCommand = null;
    this._confirmButton.disabled = true;
    this._modal.hidden = true;
    this._modal.setAttribute("aria-hidden", "true");
    this.patchCommandLocks();

    try {
      await this._hass.callService("cover", command.service, { entity_id: command.entityId });
      this.showCommandToast(`Команда отправлена: ${command.objectLabel} — ${command.actionLabel.toLowerCase()}.`);
    } catch (error) {
      this.showPersistentError(`${command.objectLabel} · ${command.actionLabel}: ${errorText(error)}`);
    } finally {
      const elapsed = Date.now() - this._lastCommandAt;
      const delay = Math.max(0, COMMAND_COOLDOWN_MS - elapsed);
      window.clearTimeout(this._unlockTimer);
      this._unlockTimer = window.setTimeout(() => {
        this._commandLock = false;
        this._confirmButton.disabled = false;
        this.patchCommandLocks();
      }, delay);
    }
  }

  showPersistentError(message) {
    if (!this._errorBanner || !this._errorText) return;
    const timestamp = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    this._errorText.textContent = `${message} · ${timestamp}`;
    this._errorBanner.hidden = false;
  }

  dismissError() {
    if (!this._errorBanner || !this._errorText) return;
    this._errorText.textContent = "";
    this._errorBanner.hidden = true;
  }

  showCommandToast(message) {
    if (!this._commandToast) return;
    this._commandToast.textContent = message;
    this._commandToast.classList.add("show");
    window.clearTimeout(this._toastTimer);
    this._toastTimer = window.setTimeout(() => this._commandToast?.classList.remove("show"), 3000);
  }

  scheduleStatePatch() {
    if (this._stateFrame !== null) return;
    this._stateFrame = window.requestAnimationFrame(() => {
      this._stateFrame = null;
      this.patchStates();
    });
  }

  patchStates() {
    if (!this._mounted || !this.isConnected) return;
    const internal = perimeterModel(
      this._hass,
      this._accessSources.internal,
      PERIMETER_DEFINITIONS.internal,
    );
    const external = perimeterModel(
      this._hass,
      this._accessSources.external,
      PERIMETER_DEFINITIONS.external,
    );
    const safety = safetyModel(this._hass, this._accessSources.safety);
    const sectionalPosition = sectionalPositionModel(this._hass);
    const sectionalControl = gateControlModel(this._hass, GATES.sectional);
    const swingControl = gateControlModel(this._hass, GATES.swing);

    this.patchStatus("access-summary", accessSummaryModel(internal, external, safety));
    this.patchStatus("perimeter-internal", internal);
    this.patchStatus("perimeter-external", external);
    this.patchStatus("safety", safety);
    this.patchStatus("sectional-position", sectionalPosition);
    this.patchStatus("sectional-control", sectionalControl);
    this.patchStatus("swing-control", swingControl);
    this.patchStatus("registry-status", this.registryStatusModel());
    this.patchStatus("diagnostic-internal", this.accessGroupDiagnosticModel(internal));
    this.patchStatus("diagnostic-external", this.accessGroupDiagnosticModel(external));
    this.patchStatus("diagnostic-safety", this.accessGroupDiagnosticModel(safety));
    this.patchStatus("diagnostic-sectional-position", sectionalPosition);
    this.patchStatus("diagnostic-sectional-control", sectionalControl);
    this.patchStatus("diagnostic-swing-control", swingControl);
    this.patchAccessDeviceStates();
    this.patchRegistryRefresh();
    this.patchCommandLocks();
  }

  patchAccessDeviceStates() {
    for (const node of this.shadowRoot.querySelectorAll("[data-access-source]")) {
      const definition = ACCESS_DEFINITIONS[node.dataset.accessGroup];
      const model = accessSourceStateModel(this._hass, node.dataset.accessSource, definition);
      const text = node.querySelector("[data-source-state]");
      const icon = node.querySelector("ha-icon");
      if (text?.textContent !== model.text) text.textContent = model.text;
      if (icon?.getAttribute("icon") !== model.icon) icon.setAttribute("icon", model.icon);
      for (const tone of STATUS_TONES) node.classList.toggle(`tone-${tone}`, tone === model.tone);
    }
  }

  patchRegistryRefresh() {
    for (const button of this.shadowRoot.querySelectorAll("[data-registry-retry]")) {
      if (button.disabled !== this._registryLoading) button.disabled = this._registryLoading;
      const busy = String(this._registryLoading);
      const title = this._registryLoading ? "Реестры обновляются" : "Обновить реестры Home Assistant";
      if (button.getAttribute("aria-busy") !== busy) button.setAttribute("aria-busy", busy);
      if (button.title !== title) button.title = title;
    }
  }

  registryStatusModel() {
    if (this._registryLoading) {
      return { text: "Загрузка реестров", tone: "blue", icon: "mdi:database-sync-outline" };
    }
    if (this._registryError) {
      return { text: `Ошибка: ${this._registryError}`, tone: "red", icon: "mdi:database-alert-outline" };
    }
    if (this._registries) {
      return { text: "Реестры загружены", tone: "green", icon: "mdi:database-check-outline" };
    }
    return { text: "Ожидание соединения", tone: "red", icon: "mdi:database-alert-outline" };
  }

  accessGroupDiagnosticModel(model) {
    if (model.total === 0) {
      return { text: "Действующие датчики не найдены", tone: "red", icon: "mdi:shield-alert-outline" };
    }
    if (model.status === "alarm") {
      const missing = model.unavailable > 0 ? ` · без данных: ${model.unavailable}` : "";
      return {
        text: `${model.total} датч. · тревога: ${model.open}${missing}`,
        tone: "red",
        icon: "mdi:alert-octagon-outline",
      };
    }
    if (model.unavailable > 0) {
      return {
        text: `${model.total} датч. · без данных: ${model.unavailable}`,
        tone: "red",
        icon: "mdi:shield-alert-outline",
      };
    }
    return {
      text: `${model.total} датч. · данные доступны`,
      tone: model.status === "violated" ? "yellow" : "green",
      icon: model.status === "violated" ? "mdi:shield-off-outline" : "mdi:shield-check-outline",
    };
  }

  patchStatus(name, model) {
    const node = this.shadowRoot.querySelector(`[data-status="${name}"]`);
    if (!node) return;
    const text = node.querySelector("[data-status-text]");
    const detail = node.querySelector("[data-status-detail]");
    const icon = node.querySelector("ha-icon");
    const nextText = model.title || model.text || "";
    if (text && text.textContent !== nextText) text.textContent = nextText;
    if (detail && detail.textContent !== model.detail) detail.textContent = model.detail || "";
    if (icon && icon.getAttribute("icon") !== model.icon) icon.setAttribute("icon", model.icon);
    for (const tone of STATUS_TONES) node.classList.toggle(`tone-${tone}`, tone === model.tone);
  }

  patchCommandLocks() {
    for (const button of this.shadowRoot.querySelectorAll("[data-command]")) {
      const command = COMMANDS[button.dataset.command];
      const available = Boolean(command) && commandAvailable(this._hass, command);
      const disabled = this._commandLock || !available;
      if (button.disabled !== disabled) button.disabled = disabled;
      const title = this._commandLock
        ? "Дождитесь завершения предыдущей команды"
        : available
          ? `${command.objectLabel}: ${command.actionLabel}. Потребуется подтверждение.`
          : "Нет данных канала управления";
      if (button.title !== title) button.title = title;
    }
  }

  loadZoom() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ZOOM_KEY) || "{}");
      const scale = this.clamp(Number(parsed.scale) || 1, 0.75, 2);
      if (scale >= 0.97 && scale <= 1.03) return { scale: 1, x: 0, y: 0 };
      return { scale, x: Number(parsed.x) || 0, y: Number(parsed.y) || 0 };
    } catch (_error) {
      return { scale: 1, x: 0, y: 0 };
    }
  }

  touchStart(event) {
    const touches = event.touches;
    if (touches.length === 2) {
      event.preventDefault();
      this._suppressClicksUntil = Date.now() + 500;
      if (this._zoom.scale <= 1.03) {
        this._zoom.x = 0;
        this._zoom.y = -this._viewport.scrollTop;
        this._viewport.scrollTo({ left: 0, top: 0 });
      }
      const center = this.touchCenter(touches);
      this._gesture = {
        kind: "pinch",
        distance: this.touchDistance(touches),
        scale: this._zoom.scale,
        worldX: (center.x - this._zoom.x) / this._zoom.scale,
        worldY: (center.y - this._zoom.y) / this._zoom.scale,
        moved: false,
        started: performance.now(),
      };
    } else if (touches.length === 1 && this._zoom.scale > 1.03 && this.canPan()) {
      this._gesture = {
        kind: "pan",
        startX: touches[0].clientX,
        startY: touches[0].clientY,
        x: this._zoom.x,
        y: this._zoom.y,
        moved: false,
      };
    } else {
      this._gesture = null;
    }
  }

  touchMove(event) {
    if (!this._gesture) return;
    if (event.touches.length === 2 && this._gesture.kind === "pinch") {
      event.preventDefault();
      const center = this.touchCenter(event.touches);
      const ratio = this.touchDistance(event.touches) / Math.max(this._gesture.distance, 1);
      this._zoom.scale = this.clamp(this._gesture.scale * ratio, 0.75, 2);
      this._zoom.x = center.x - this._gesture.worldX * this._zoom.scale;
      this._zoom.y = center.y - this._gesture.worldY * this._zoom.scale;
      this._gesture.moved = Math.abs(ratio - 1) > 0.02;
      this.applyTransform();
    } else if (event.touches.length === 1 && this._gesture.kind === "pan") {
      event.preventDefault();
      const dx = event.touches[0].clientX - this._gesture.startX;
      const dy = event.touches[0].clientY - this._gesture.startY;
      this._zoom.x = this._gesture.x + dx;
      this._zoom.y = this._gesture.y + dy;
      this._gesture.moved = Math.abs(dx) + Math.abs(dy) > 6;
      this.applyTransform();
    }
  }

  touchEnd(event) {
    if (event.touches.length > 0) return;
    const gesture = this._gesture;
    if (!gesture) return;
    if (gesture.kind === "pinch") {
      const now = performance.now();
      if (!gesture.moved && now - gesture.started < 280) {
        if (now - this._lastTwoTap < 380) {
          this.resetZoom();
          this._lastTwoTap = 0;
        } else {
          this._lastTwoTap = now;
        }
      } else if (this._zoom.scale >= 0.97 && this._zoom.scale <= 1.03) {
        this._lastTwoTap = 0;
        this.resetZoom();
      } else {
        this._lastTwoTap = 0;
        this.saveZoom();
      }
      this._suppressClicksUntil = Date.now() + 500;
    } else {
      this.saveZoom();
      if (gesture.moved) this._suppressClicksUntil = Date.now() + 350;
    }
    this._gesture = null;
  }

  resetZoom() {
    this._zoom = { scale: 1, x: 0, y: 0 };
    this._viewport?.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    this.applyTransform();
    this.saveZoom();
    this._zoomToast?.classList.add("show");
    window.clearTimeout(this._zoomToastTimer);
    this._zoomToastTimer = window.setTimeout(() => this._zoomToast?.classList.remove("show"), 1100);
  }

  saveZoom() {
    try {
      localStorage.setItem(ZOOM_KEY, JSON.stringify(this._zoom));
    } catch (_error) {
      // The active transform still works when storage is unavailable.
    }
  }

  applyTransform() {
    if (!this._viewport || !this._canvas) return;
    const scale = this._zoom.scale;
    const viewportWidth = Math.max(1, this._viewport.clientWidth);
    const viewportHeight = Math.max(1, this._viewport.clientHeight);
    const contentWidth = Math.max(1, this._canvas.offsetWidth);
    const contentHeight = Math.max(1, this._canvas.scrollHeight);
    const scaledWidth = contentWidth * scale;
    const scaledHeight = contentHeight * scale;

    if (Math.abs(scale - 1) < 0.001) {
      this._zoom = { scale: 1, x: 0, y: 0 };
    } else {
      this._zoom.x = scaledWidth <= viewportWidth
        ? (viewportWidth - scaledWidth) / 2
        : Math.min(0, Math.max(viewportWidth - scaledWidth, this._zoom.x));
      this._zoom.y = scaledHeight <= viewportHeight
        ? 0
        : Math.min(0, Math.max(viewportHeight - scaledHeight, this._zoom.y));
    }

    this._viewport.classList.toggle("zoomed", this._zoom.scale > 1.03);
    this._canvas.style.transform = `translate3d(${this._zoom.x}px,${this._zoom.y}px,0) scale(${this._zoom.scale})`;
  }

  canPan() {
    if (!this._viewport || !this._canvas || this._zoom.scale <= 1.03) return false;
    return this._canvas.offsetWidth * this._zoom.scale > this._viewport.clientWidth + 1
      || this._canvas.scrollHeight * this._zoom.scale > this._viewport.clientHeight + 1;
  }

  touchCenter(touches) {
    const rect = this._viewport.getBoundingClientRect();
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2 - rect.left,
      y: (touches[0].clientY + touches[1].clientY) / 2 - rect.top,
    };
  }

  touchDistance(touches) {
    return Math.hypot(
      touches[1].clientX - touches[0].clientX,
      touches[1].clientY - touches[0].clientY,
    );
  }

  clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }
}

if (!customElements.get(ELEMENT_NAME)) customElements.define(ELEMENT_NAME, NikasAccessPanel);
