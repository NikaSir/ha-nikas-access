import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const frontend = readFileSync(
  join(root, "custom_components", "nikas_access", "frontend", "nikas-access-panel.js"),
  "utf8",
);

function requireContract(condition, message) {
  if (!condition) {
    console.error(`contract failure: ${message}`);
    process.exit(1);
  }
}

function count(pattern) {
  return [...frontend.matchAll(pattern)].length;
}

requireContract(count(/<main class="viewport" id="viewport">/g) === 1, "one working viewport required");
requireContract(count(/<header class="header">/g) === 1, "one fixed header required");
requireContract(count(/<nav class="tabs"/g) === 1, "one fixed bottom navigation required");
requireContract(count(/data-command="(?:sectional|swing):(?:open|stop|close)"/g) === 6, "six explicit gate commands required");
requireContract(!frontend.includes("<iframe"), "iframe is forbidden");
requireContract(!/^\s*import\s/m.test(frontend) && !frontend.includes("import("), "production bundle must be autonomous");
requireContract(frontend.includes('const ROOT_PATH = "/dashboard-access-v1/home"'), "entry route drift");
requireContract(frontend.includes('const HOME_PATH = "/dashboard-house-v12/home"'), "parent route drift");
requireContract(frontend.includes('localStorage.setItem(ZOOM_KEY'), "zoom must be persisted locally");
requireContract(frontend.includes('touches.length === 2'), "pinch gesture is missing");
requireContract(frontend.includes("this.resetZoom()"), "two-finger reset is missing");
requireContract(frontend.includes('overflow-y:auto;overflow-x:hidden'), "100% horizontal overflow must be hidden");
requireContract(frontend.includes('await this._hass.callService("cover", command.service'), "commands must use the Home Assistant cover service");
requireContract(frontend.includes("this._commandLock = true"), "command lock is missing");
requireContract(frontend.includes("COMMAND_COOLDOWN_MS"), "command deduplication window is missing");
requireContract(frontend.includes("Объект: «${command.objectLabel}». Действие: «${command.actionLabel}»"), "confirmation must name object and action");
requireContract(frontend.includes("this.showPersistentError"), "persistent command error is missing");
requireContract(frontend.includes("Положение не контролируется"), "swing gate warning is missing");
requireContract(frontend.includes("INTERCOM_MODULE.enabled ? renderIntercomView() : \"\""), "disabled intercom boundary is missing");

const positionStart = frontend.indexOf("function sectionalPositionModel(hass)");
const positionEnd = frontend.indexOf("function gateControlModel", positionStart);
const positionBody = frontend.slice(positionStart, positionEnd);
requireContract(positionStart >= 0 && positionEnd > positionStart, "sectional position model is missing");
requireContract(positionBody.includes("SECTIONAL_POSITION_ENTITY"), "contact sensor must drive sectional position");
requireContract(!positionBody.includes("SECTIONAL_CONTROL_ENTITY"), "sectional cover must not drive physical position");
requireContract(!positionBody.includes("SWING_CONTROL_ENTITY"), "swing cover must not drive physical position");

const patchStart = frontend.indexOf("  patchStates() {");
const patchEnd = frontend.indexOf("  patchStatus(", patchStart);
const patchBody = frontend.slice(patchStart, patchEnd);
requireContract(patchStart >= 0 && patchEnd > patchStart, "targeted state patch is missing");
requireContract(!patchBody.includes("innerHTML"), "state updates must not rebuild Shadow DOM");
requireContract(!patchBody.includes("replaceChildren"), "state updates must not replace the working view");

console.log("frontend contract checks passed");
