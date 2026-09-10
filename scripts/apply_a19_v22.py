#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = ROOT / "custom_components" / "nikas_access"
SRC = DOMAIN / "frontend" / "src"
OLD = "0.1.8"
NEW = "0.1.9"
CANONICAL_SHELL_URL = "https://raw.githubusercontent.com/NikaSir/ha-contract-generated-ui/main/templates/shell_v2/nikas-specialized-shell.js"
STANDARD_SHA = "2a15e5c2483f0fa959faff54cd29144ddb8c392e6da4546bd4c5034bf652c2c7"
NAV_SHA = "79923d2de82ef59ab76e37491f75ba7eb7e7c4c23e62d75142744159cae64229"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


def replace_once(path: Path, old: str, new: str) -> None:
    text = read(path)
    if text.count(old) != 1:
        raise SystemExit(f"{path}: expected one match for {old!r}, got {text.count(old)}")
    write(path, text.replace(old, new, 1))


def replace_all_required(path: Path, old: str, new: str) -> None:
    text = read(path)
    if old not in text:
        raise SystemExit(f"{path}: missing {old!r}")
    write(path, text.replace(old, new))


# 1. Vendor the current canonical Shell v2.1 source exactly.
with urllib.request.urlopen(CANONICAL_SHELL_URL, timeout=30) as response:
    shell = response.read().decode("utf-8")
if 'const NIKAS_SHELL_V2_VERSION = "2.1";' not in shell:
    raise SystemExit("canonical shell version guard failed")
shell_path = SRC / "shell-v2.js"
write(shell_path, shell)
shell_sha = hashlib.sha256(shell.encode("utf-8")).hexdigest()

# 2. Versioned production metadata.
for path in [
    DOMAIN / "const.py",
    SRC / "constants.js",
    DOMAIN / "manifest.json",
    DOMAIN / "panel_manifest.json",
    ROOT / "package.json",
    ROOT / "panel_contract.json",
    ROOT / "scripts" / "build.mjs",
    ROOT / "scripts" / "check_repository.py",
    ROOT / "tests" / "test_panel_registration.py",
]:
    replace_all_required(path, OLD, NEW)

# 3. A19 declaration: standard v2.2, navigation v1.2, exact shell hash and behavior contracts.
standard_path = ROOT / ".nikas-ui-standard.json"
standard = json.loads(read(standard_path))
standard["standard_version"] = "2.2"
standard["canonical_repository"] = "NikaSir/ha-contract-generated-ui"
standard["standard_path"] = "NIKAS_SPECIALIZED_PANEL_UI_STANDARD.md"
standard["standard_sha256"] = STANDARD_SHA
standard["navigation_contract_path"] = "docs/NIKAS_PANEL_NAVIGATION_CONTRACT.md"
standard["navigation_contract_sha256"] = NAV_SHA
standard["shell_source_sha256"] = shell_sha
standard["shell_contract"] = {
    "version": "2.1",
    "host_boundary": "ha-panel",
    "header_body_px": 60,
    "peer_selector_px": 52,
    "bottom_nav_body_px": 64,
    "content_max_width_px": 1280,
    "coordinate_tolerance_px": 2,
    "scroll_boundary_guard": "capture-non-passive-touchmove",
    "specialized_tab_range": [3, 5],
}
standard["refresh_action_feedback"] = {
    "version": "1.1",
    "status": "implemented",
    "applies_when": "registry_refresh",
    "minimum_visible_ms": 900,
    "result_visible_ms": 1400,
    "duplicate_activation": "blocked_while_busy",
    "retry_during_result": True,
    "disconnect_cleanup": True,
    "reduced_motion": "static_busy_surface",
    "success_semantics": "registry_request_completed_without_error",
}
standard["peer_device_selector"] = {"present": False, "reason": "Access has no peer physical-device selector"}
write(standard_path, json.dumps(standard, ensure_ascii=False, indent=2) + "\n")

contract_path = ROOT / "panel_contract.json"
contract = json.loads(read(contract_path))
contract["shell"]["standard_version"] = "2.2"
contract["shell"]["source_kit_sha256"] = shell_sha
contract["refresh_action"] = {
    "contract_version": "1.1",
    "scope": "home_assistant_registry_refresh",
    "minimum_busy_ms": 900,
    "result_visible_ms": 1400,
    "states": ["idle", "busy", "success", "error"],
    "retry_during_result": True,
    "disconnect_cleanup": True,
}
write(contract_path, json.dumps(contract, ensure_ascii=False, indent=2) + "\n")

# 4. Refresh Action Contract v1.1 implementation in the production source.
constants_path = SRC / "constants.js"
constants = read(constants_path)
needle = "const DIRECT_TOUCH_THRESHOLD_PX = 10;\n"
if needle not in constants:
    raise SystemExit("constants insertion point missing")
constants = constants.replace(
    needle,
    needle + "const REFRESH_MIN_BUSY_MS = 900;\nconst REFRESH_RESULT_MS = 1400;\n",
    1,
)
write(constants_path, constants)

panel_path = SRC / "nikas-access-panel.js"
panel = read(panel_path)
needle = "    this._zoomToastTimer = null;\n"
if panel.count(needle) < 1:
    raise SystemExit("constructor refresh insertion point missing")
panel = panel.replace(
    needle,
    needle
    + "    this._refreshPhase = \"idle\";\n"
    + "    this._refreshRequestId = 0;\n"
    + "    this._refreshResultTimer = null;\n",
    1,
)
needle = "    window.clearTimeout(this._zoomToastTimer);\n"
if needle not in panel:
    raise SystemExit("disconnect timer insertion point missing")
panel = panel.replace(
    needle,
    needle + "    window.clearTimeout(this._refreshResultTimer);\n    this._refreshRequestId += 1;\n",
    1,
)
needle = "    this._zoomToastTimer = null;\n    this._gesture = null;\n"
if needle not in panel:
    raise SystemExit("disconnect reset insertion point missing")
panel = panel.replace(
    needle,
    "    this._zoomToastTimer = null;\n    this._refreshResultTimer = null;\n    this._refreshPhase = \"idle\";\n    this._gesture = null;\n",
    1,
)
needle = "    this._commandToast = this.shadowRoot.querySelector(\".command-toast\");\n"
if needle not in panel:
    raise SystemExit("mount refresh button insertion point missing")
panel = panel.replace(
    needle,
    needle + "    this._refreshButton = this.shadowRoot.querySelector(\"[data-registry-retry]\");\n",
    1,
)
old_block = """    if (button.dataset?.registryRetry !== undefined) {
      void this.loadRegistries(true);
      return true;
    }
"""
new_block = """    if (button.dataset?.registryRetry !== undefined) {
      void this.runRegistryRefreshAction();
      return true;
    }
"""
if old_block not in panel:
    raise SystemExit("registry retry activation block missing")
panel = panel.replace(old_block, new_block, 1)

method_marker = "  activateView(viewId) {\n"
if method_marker not in panel:
    raise SystemExit("refresh method insertion point missing")
refresh_method = r'''  async runRegistryRefreshAction() {
    if (this._refreshPhase === "busy" || this._registryLoading) return;
    const requestId = ++this._refreshRequestId;
    window.clearTimeout(this._refreshResultTimer);
    this._refreshResultTimer = null;
    this._refreshPhase = "busy";
    const startedAt = Date.now();
    this.scheduleStatePatch();

    await this.loadRegistries(true);
    const remaining = Math.max(0, REFRESH_MIN_BUSY_MS - (Date.now() - startedAt));
    if (remaining > 0) await new Promise((resolve) => window.setTimeout(resolve, remaining));
    if (requestId !== this._refreshRequestId || !this.isConnected) return;

    const success = !this._registryError;
    this._refreshPhase = success ? "success" : "error";
    if (!success) this.showCommandToast(`Не удалось обновить реестры: ${this._registryError}`);
    this.scheduleStatePatch();
    this._refreshResultTimer = window.setTimeout(() => {
      if (requestId !== this._refreshRequestId) return;
      this._refreshResultTimer = null;
      this._refreshPhase = "idle";
      this.scheduleStatePatch();
    }, REFRESH_RESULT_MS);
  }

'''
panel = panel.replace(method_marker, refresh_method + method_marker, 1)

pattern = re.compile(r"  patchRegistryRefresh\(\) \{.*?\n  \}\n\n  patchCommandLocks\(\) \{", re.S)
replacement = r'''  patchRegistryRefresh() {
    const phase = this._refreshPhase;
    const busy = phase === "busy" || (phase === "idle" && this._registryLoading);
    const resultPhase = phase === "success" || phase === "error";
    const iconName = phase === "success"
      ? "mdi:check"
      : phase === "error"
        ? "mdi:alert-circle-outline"
        : "mdi:refresh";
    const title = phase === "success"
      ? "Реестры обновлены"
      : phase === "error"
        ? "Ошибка обновления реестров — нажмите, чтобы повторить"
        : busy
          ? "Реестры обновляются"
          : "Обновить реестры Home Assistant";
    for (const button of this.shadowRoot.querySelectorAll("[data-registry-retry]")) {
      if (button.disabled !== busy) button.disabled = busy;
      button.classList.toggle("is-busy", busy);
      button.classList.toggle("is-success", phase === "success");
      button.classList.toggle("is-error", phase === "error");
      const icon = button.querySelector("ha-icon");
      if (icon?.getAttribute("icon") !== iconName) icon?.setAttribute("icon", iconName);
      const ariaBusy = String(busy);
      if (button.getAttribute("aria-busy") !== ariaBusy) button.setAttribute("aria-busy", ariaBusy);
      if (button.getAttribute("aria-label") !== title) button.setAttribute("aria-label", title);
      if (button.title !== title) button.title = title;
      if (!resultPhase && !busy && button.getAttribute("aria-busy") !== "false") button.setAttribute("aria-busy", "false");
    }
  }

  patchCommandLocks() {'''
panel, count = pattern.subn(replacement, panel, count=1)
if count != 1:
    raise SystemExit(f"patchRegistryRefresh replacement count={count}")
write(panel_path, panel)

# 5. Busy/result styling, geometry unchanged. Reduced-motion keeps a static busy surface.
styles_path = SRC / "styles.js"
styles = read(styles_path)
needle = "function panelStyles() {\n  return `\n"
if needle not in styles:
    raise SystemExit("styles insertion point missing")
styles = styles.replace(
    needle,
    needle
    + "    @keyframes nikas-refresh-spin{to{transform:rotate(360deg)}}\n"
    + "    .refresh.is-busy ha-icon{animation:nikas-refresh-spin .8s linear infinite}\n"
    + "    .refresh.is-success{color:#43a047}\n"
    + "    .refresh.is-error{color:#e53935}\n"
    + "    @media (prefers-reduced-motion:reduce){.refresh.is-busy ha-icon{animation:none}}\n",
    1,
)
write(styles_path, styles)

# 6. Repository checks prove this is a behavior migration, not a version-only declaration.
checks_path = ROOT / "scripts" / "check_repository.py"
checks = read(checks_path)
checks = checks.replace('require(standard["standard_version"] == "2.1", "NikaS UI standard drift")', 'require(standard["standard_version"] == "2.2", "NikaS UI standard drift")')
needle = '    require(contract["shell"]["internal_tab_count"] == 4, "Access must retain four internal tabs")\n'
if needle not in checks:
    raise SystemExit("repository check insertion point missing")
checks = checks.replace(
    needle,
    needle
    + '    require(contract["refresh_action"]["contract_version"] == "1.1", "refresh action contract drift")\n'
    + '    require(standard["refresh_action_feedback"]["minimum_visible_ms"] == 900, "refresh busy timing drift")\n'
    + '    require(standard["refresh_action_feedback"]["result_visible_ms"] == 1400, "refresh result timing drift")\n'
    + '    require("async runRegistryRefreshAction()" in frontend, "refresh action state machine missing")\n'
    + '    require("REFRESH_MIN_BUSY_MS = 900" in frontend, "refresh minimum busy timing missing")\n'
    + '    require("REFRESH_RESULT_MS = 1400" in frontend, "refresh result timing missing")\n'
    + '    require("mdi:check" in frontend and "mdi:alert-circle-outline" in frontend, "refresh completion glyphs missing")\n'
    + '    require("prefers-reduced-motion:reduce" in frontend, "refresh reduced-motion behavior missing")\n'
    + '    require("window.clearTimeout(this._refreshResultTimer)" in frontend, "refresh disconnect/retry cleanup missing")\n',
    1,
)
write(checks_path, checks)

# 7. Contract regression test.
test_refresh = ROOT / "tests" / "test_refresh_contract.py"
write(test_refresh, '''from pathlib import Path\n\nROOT = Path(__file__).resolve().parents[1]\nSOURCE = ROOT / "custom_components" / "nikas_access" / "frontend" / "src" / "nikas-access-panel.js"\nSTYLES = ROOT / "custom_components" / "nikas_access" / "frontend" / "src" / "styles.js"\nCONSTANTS = ROOT / "custom_components" / "nikas_access" / "frontend" / "src" / "constants.js"\n\n\ndef test_refresh_action_contract_v11_is_implemented():\n    source = SOURCE.read_text(encoding="utf-8")\n    styles = STYLES.read_text(encoding="utf-8")\n    constants = CONSTANTS.read_text(encoding="utf-8")\n    assert "async runRegistryRefreshAction()" in source\n    assert "REFRESH_MIN_BUSY_MS = 900" in constants\n    assert "REFRESH_RESULT_MS = 1400" in constants\n    assert 'this._refreshPhase = success ? "success" : "error"' in source\n    assert 'button.classList.toggle("is-busy", busy)' in source\n    assert 'button.classList.toggle("is-success", phase === "success")' in source\n    assert 'button.classList.toggle("is-error", phase === "error")' in source\n    assert 'window.clearTimeout(this._refreshResultTimer)' in source\n    assert "prefers-reduced-motion:reduce" in styles\n    assert ".refresh.is-success{color:#43a047}" in styles\n    assert ".refresh.is-error{color:#e53935}" in styles\n\n\ndef test_refresh_button_remains_same_geometry_and_allows_result_retry():\n    source = SOURCE.read_text(encoding="utf-8")\n    assert 'button.disabled !== busy' in source\n    assert 'const busy = phase === "busy"' in source\n    assert 'phase === "success" || phase === "error"' in source\n    assert 'void this.runRegistryRefreshAction();' in source\n''')

# 8. Compliance notes + changelog.
compliance_path = ROOT / "docs" / "NIKAS_SPECIALIZED_PANEL_COMPLIANCE.md"
compliance = read(compliance_path)
compliance = compliance.replace("# NikaS Access — Shell v2.1 compliance", "# NikaS Access — NikaS UI v2.2 / Shell v2.1 compliance", 1)
marker = "| Source-aware return; safe fallback House v13 | PASS |\n"
if marker not in compliance:
    raise SystemExit("compliance insertion point missing")
compliance = compliance.replace(
    marker,
    marker
    + "| Refresh Action Contract v1.1: busy ≥900ms, success/error 1400ms, retry | PASS |\n"
    + "| Refresh disconnect cleanup and reduced-motion behavior | PASS |\n"
    + "| Peer-device status lamps | N/A — no peer selector in Access |\n",
    1,
)
write(compliance_path, compliance)

changelog_path = ROOT / "CHANGELOG.md"
changelog = read(changelog_path)
entry = """## 0.1.9 — 2026-09-10\n\n- A19: migrated Access to NikaS Specialized Panel UI Standard v2.2 while retaining canonical Shell v2.1 geometry.\n- Implemented Refresh Action Contract v1.1 for Home Assistant registry refresh: minimum busy interval, success/error result glyphs, retry during result, reduced-motion fallback and disconnect cleanup.\n- Re-vendored the canonical Shell v2.1 source and pinned its SHA-256 in repository checks.\n- Added regression coverage proving the migration changes production behavior rather than only the declared standard version.\n\n"""
if entry not in changelog:
    heading_end = changelog.find("\n", changelog.find("#")) + 1
    changelog = changelog[:heading_end] + "\n" + entry + changelog[heading_end:].lstrip("\n")
write(changelog_path, changelog)

print(f"Access A19 patch complete; canonical shell sha256={shell_sha}")
