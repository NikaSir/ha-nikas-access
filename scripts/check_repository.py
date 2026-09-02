#!/usr/bin/env python3
"""Run deterministic repository-level checks for NikaS Access."""

from __future__ import annotations

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
    require(manifest["version"] == "0.1.2", "integration version drift")
    require(panel_manifest["ui_version"] == "0.1.2", "panel version drift")
    require(contract["integration"]["version"] == "0.1.2", "contract version drift")
    require(standard["standard_version"] == "1.17", "NikaS UI standard drift")
    require(panel_manifest["entry_route"] == "/dashboard-access-v1/home", "entry route drift")
    require(panel_manifest["parent_route"] == "/dashboard-house-v12/home", "parent route drift")
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
    require(contract["panel"]["header"]["title_line_2"] == "UI v0.1.2", "Header UI version drift")
    require(contract["panel"]["header"]["title_is_only_return_control"] is True, "duplicate return control allowed")
    require(contract["perimeters"]["diagnostic_inventory"] == "grouped_by_device", "perimeter diagnostics drift")
    require(contract["perimeters"]["unknown_is_safe"] is False, "unknown perimeter state must not be safe")
    require(contract["perimeters"]["unavailable_is_safe"] is False, "unavailable perimeter state must not be safe")

    subprocess.run(["node", "--check", str(DOMAIN / "frontend" / "nikas-access-panel.js")], check=True)
    subprocess.run(["node", str(ROOT / "scripts" / "build.mjs"), "--check"], check=True)
    subprocess.run(["node", str(ROOT / "tests" / "frontend_model_harness.mjs")], check=True)
    print("repository checks passed")


if __name__ == "__main__":
    main()
