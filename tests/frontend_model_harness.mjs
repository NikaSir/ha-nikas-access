import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const constants = readFileSync(
  join(root, "custom_components", "nikas_access", "frontend", "src", "constants.js"),
  "utf8",
);
const context = vm.createContext({ console, Set, Object, String, Boolean });
vm.runInContext(`${constants}\nthis.api = { sectionalPositionModel, accessSummaryModel, commandAvailable, COMMANDS };`, context);

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
assert(context.api.accessSummaryModel(hass("off", "unavailable")).tone === "red", "unavailable control must remain an error");
assert(Object.keys(context.api.COMMANDS).length === 6, "exactly six commands must be allowlisted");
assert(new Set(Object.values(context.api.COMMANDS).map((item) => item.service)).size === 3, "only three cover services are allowed");

console.log("frontend model harness passed");
