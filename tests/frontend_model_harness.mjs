import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const constants = readFileSync(
  join(root, "custom_components", "nikas_access", "frontend", "src", "constants.js"),
  "utf8",
);
const perimeters = readFileSync(
  join(root, "custom_components", "nikas_access", "frontend", "src", "data", "perimeters.js"),
  "utf8",
);
const context = vm.createContext({ console, Set, Object, String, Boolean });
vm.runInContext(`${constants}\n${perimeters}\nthis.api = {
  sectionalPositionModel,
  accessSummaryModel,
  commandAvailable,
  discoverPerimeterSources,
  perimeterModel,
  PERIMETER_DEFINITIONS,
  COMMANDS,
};`, context);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hass(position, sectionalCover = "closed", swingCover = "closed") {
  return {
    callService() {},
    states: {
      "binary_sensor.sensor_do_zb_15_16_contact": { state: position },
      "cover.umnyi_kontroller_dlia_vorot_roximo_door": { state: sectionalCover },
      "cover.umnyi_kontroller_dlia_vorot_roximo_2_door": { state: swingCover },
    },
  };
}

assert(context.api.sectionalPositionModel(hass("on")).text === "Открыто", "sensor on must mean open");
assert(context.api.sectionalPositionModel(hass("off")).text === "Закрыто", "sensor off must mean closed");
assert(context.api.sectionalPositionModel(hass("unknown")).text === "Нет данных", "sensor unknown must not be safe");
assert(context.api.sectionalPositionModel(hass("unavailable")).text === "Нет данных", "sensor unavailable must not be safe");
assert(context.api.sectionalPositionModel(hass("off", "open")).text === "Закрыто", "cover state must not override the contact sensor");
assert(context.api.sectionalPositionModel(hass("on", "closed")).text === "Открыто", "cover state must not override the contact sensor");
assert(Object.keys(context.api.COMMANDS).length === 6, "exactly six commands must be allowlisted");
assert(new Set(Object.values(context.api.COMMANDS).map((item) => item.service)).size === 3, "only three cover services are allowed");

const registries = {
  labels: [
    { label_id: "v_ekspluatatsii", name: "В эксплуатации" },
    { label_id: "vnutrennii_perimetr", name: "Внутренний периметр" },
    { label_id: "outside", name: "Наружный контур" },
    { label_id: "na_obsluzhivanii", name: "На обслуживании" },
  ],
  devices: [
    { id: "inside", labels: ["v_ekspluatatsii", "vnutrennii_perimetr"] },
    { id: "outside", labels: ["v_ekspluatatsii", "outside"] },
    { id: "excluded", labels: ["v_ekspluatatsii", "vnutrennii_perimetr", "na_obsluzhivanii"] },
    { id: "disabled", disabled_by: "user", labels: ["v_ekspluatatsii", "vnutrennii_perimetr"] },
  ],
  entities: [
    { entity_id: "binary_sensor.inside", device_id: "inside", labels: [] },
    { entity_id: "binary_sensor.outside", device_id: "outside", labels: [] },
    { entity_id: "binary_sensor.excluded", device_id: "excluded", labels: [] },
    { entity_id: "binary_sensor.disabled", device_id: "disabled", labels: [] },
    { entity_id: "sensor.not_a_binary_sensor", device_id: "inside", labels: [] },
  ],
};
const sources = context.api.discoverPerimeterSources(registries);
assert(JSON.stringify(sources.internal) === '["binary_sensor.inside"]', "internal perimeter must use only operational labelled binary sensors");
assert(JSON.stringify(sources.external) === '["binary_sensor.outside"]', "external perimeter must resolve a registered label name");

const perimeterHass = {
  states: {
    "binary_sensor.inside": { state: "off" },
    "binary_sensor.outside": { state: "unavailable" },
  },
};
const internal = context.api.perimeterModel(perimeterHass, sources.internal, context.api.PERIMETER_DEFINITIONS.internal);
const external = context.api.perimeterModel(perimeterHass, sources.external, context.api.PERIMETER_DEFINITIONS.external);
assert(internal.title === "Закрыт" && internal.tone === "green", "all-off perimeter must be closed");
assert(external.title === "Нет данных" && external.tone === "red", "unavailable perimeter source must never be safe");
assert(context.api.accessSummaryModel(internal, external).tone === "red", "access summary must surface missing perimeter data");
perimeterHass.states["binary_sensor.outside"].state = "on";
const openExternal = context.api.perimeterModel(perimeterHass, sources.external, context.api.PERIMETER_DEFINITIONS.external);
assert(openExternal.title === "Нарушен" && openExternal.tone === "yellow", "on perimeter source must mean violated");

console.log("frontend model harness passed");
