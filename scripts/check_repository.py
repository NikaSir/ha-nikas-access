#!/usr/bin/env python3
"""Run deterministic repository-level checks for NikaS Access."""

from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = ROOT / "custom_components" / "nikas_access"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def main() -> None:
    manifest = json.loads((DOMAIN / "manifest.json").read_text(encoding="utf-8"))
    panel_manifest = json.loads((DOMAIN / "panel_manifest.json").read_text(encoding="utf-8"))
    contract = json.loads((ROOT / "panel_contract.json").read_text(encoding="utf-8"))
    standard = json.loads((ROOT / ".nikas-ui-standard.json").read_text(encoding="utf-8"))
    panel_source = (DOMAIN / "panel.py").read_text(encoding="utf-8")
    frontend = (DOMAIN / "frontend" / "nikas-access-panel.js").read_text(encoding="utf-8")

    require(manifest["domain"] == "nikas_access", "integration domain drift")
    require(manifest["version"] == "0.1.7", "integration version drift")
    require(panel_manifest["ui_version"] == "0.1.7", "panel version drift")
    require(contract["integration"]["version"] == "0.1.7", "contract version drift")
    require(standard["standard_version"] == "2.1", "NikaS UI standard drift")
    require(standard["navigation_contract_version"] == "1.2", "navigation contract drift")
    require(panel_manifest["entry_route"] == "/dashboard-access-v1/home", "entry route drift")
    require(panel_manifest["parent_route"] == "/dashboard-house-v13/home", "parent route drift")
    require('PANEL_URL_PATH = "dashboard-access-v1"' in panel_source, "panel root drift")
    require("frontend.async_panel_exists(hass, PANEL_URL_PATH)" in panel_source, "route collision guard missing")
    require("domain_data.get(PANEL_ROUTE_OWNER) != entry_id" in panel_source, "route ownership guard missing")
    require("frontend.async_remove_panel(hass, PANEL_URL_PATH" in panel_source, "owned route removal missing")
    require("embed_iframe=False" in panel_source, "iframe must be disabled")
    require('?v={VERSION}' in panel_source, "frontend cache busting missing")
    require(frontend.count("class NikasAccessPanel") == 1, "one frontend panel class required")
    require(frontend.count("customElements.define(ELEMENT_NAME") == 1, "one custom element registration required")
    require("shadowRoot.innerHTML" in frontend, "initial shell mount missing")
    require(contract["panel"]["internal_views"] == ["statuses", "gates", "intercom", "diagnostics"], "internal navigation drift")
    require(contract["panel"]["header"]["title_line_2"] == "UI v0.1.7", "Header UI version drift")
    shell_path = ROOT / standard["shell_source"]
    shell_source = shell_path.read_text(encoding="utf-8")
    shell_digest = hashlib.sha256(shell_source.encode("utf-8")).hexdigest()
    require(shell_digest == standard["shell_source_sha256"], "vendored Shell v2 source drift")
    require(contract["shell"]["source_kit_sha256"] == shell_digest, "panel shell hash drift")
    require(contract["shell"]["host_boundary"] == "ha-panel", "panel must bind to the Home Assistant host")
    require(contract["shell"]["internal_tab_count"] == 4, "Access must retain four internal tabs")
    require("position:fixed" not in shell_source, "Shell v2 must not bind to the browser window")
    require("100vw" not in shell_source and "100vh" not in shell_source, "viewport units are forbidden in Shell v2")
    require("padding:2px 3px 6px" in shell_source, "Bottom Tab Bar label clearance drift")
    require("--mdc-icon-size:26px" in shell_source, "Bottom Tab Bar icon size drift")
    require("line-height:14px" in shell_source, "Bottom Tab Bar label line box drift")
    require("overscroll-behavior-y:none" in shell_source, "Shell v2 overscroll boundary drift")
    require("function shouldBlockNikasShellBoundaryMove" in shell_source, "Shell v2 boundary decision missing")
    require("function createNikasShellScrollBoundaryGuard" in shell_source, "Shell v2 boundary guard missing")
    require("NIKAS_SHELL_BOUNDARY_THRESHOLD_PX = 4" in shell_source, "Shell v2 tap threshold drift")
    require(
        'host.addEventListener("touchmove", moveTouch, { passive: false, capture: true })' in shell_source,
        "Shell v2 boundary guard must use a non-passive capture listener",
    )
    require(
        "this._scrollBoundaryGuardCleanup = createNikasShellScrollBoundaryGuard" in frontend,
        "Access panel does not install the Shell v2 boundary guard",
    )
    require(standard["scroll_boundary_guard"] == "capture-non-passive-touchmove", "scroll guard contract drift")
    require(standard["home_assistant_pull_to_refresh"] is False, "Home Assistant pull-to-refresh must be blocked")
    require(contract["shell"]["scroll_boundary_guard"] == "capture-non-passive-touchmove", "panel scroll guard drift")
    require(contract["panel"]["header"]["title_is_only_return_control"] is True, "duplicate return control allowed")
    require(contract["perimeters"]["diagnostic_inventory"] == "grouped_by_device", "perimeter diagnostics drift")
    require(contract["safety"]["label"] == "Безопасность", "safety label drift")
    require(contract["safety"]["icon"] == "mdi:shield-alert-outline", "safety icon drift")
    require(contract["safety"]["color"] == "red", "safety label color drift")
    require(contract["perimeters"]["label_metadata"]["internal"]["color"] == "cyan", "internal perimeter color drift")
    require(contract["perimeters"]["label_metadata"]["external"]["color"] == "blue", "external perimeter color drift")
    require(contract["safety"]["unknown_is_safe"] is False, "unknown safety state must not be safe")
    require(contract["safety"]["unavailable_is_safe"] is False, "unavailable safety state must not be safe")
    require(contract["perimeters"]["unknown_is_safe"] is False, "unknown perimeter state must not be safe")
    require(contract["perimeters"]["unavailable_is_safe"] is False, "unavailable perimeter state must not be safe")

    subprocess.run(["node", "--check", str(DOMAIN / "frontend" / "nikas-access-panel.js")], check=True)
    subprocess.run(["node", str(ROOT / "scripts" / "build.mjs"), "--check"], check=True)
    subprocess.run(["node", str(ROOT / "tests" / "frontend_model_harness.mjs")], check=True)
    print("repository checks passed")


if __name__ == "__main__":
    main()
