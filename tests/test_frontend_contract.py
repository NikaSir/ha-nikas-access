from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = ROOT / "custom_components" / "nikas_access"
FRONTEND = DOMAIN / "frontend" / "nikas-access-panel.js"


class FrontendContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = FRONTEND.read_text(encoding="utf-8")

    def test_autonomous_single_bundle(self) -> None:
        self.assertNotRegex(self.source, r"^\s*import\s")
        self.assertNotIn("import(", self.source)
        self.assertNotIn("<iframe", self.source)
        self.assertEqual(self.source.count("class NikasAccessPanel"), 1)
        self.assertEqual(self.source.count("customElements.define(ELEMENT_NAME"), 1)

    def test_fixed_shell_has_one_working_viewport(self) -> None:
        self.assertEqual(self.source.count('<main class="nikas-shell__viewport viewport" id="viewport">'), 1)
        self.assertEqual(self.source.count('<header class="nikas-shell__header header">'), 1)
        self.assertEqual(self.source.count('<nav class="nikas-shell__tabs tabs"'), 1)
        self.assertIn('const NIKAS_SHELL_V2_VERSION = "2.1"', self.source)
        self.assertIn("block-size:100%", self.source)
        self.assertNotIn("position:fixed", self.source)
        self.assertNotIn("100vw", self.source)
        self.assertNotIn("100vh", self.source)
        self.assertNotIn("100dvh", self.source)
        self.assertIn("overflow-y:auto;overflow-x:hidden", self.source)
        self.assertIn("env(safe-area-inset-top,0px)", self.source)
        self.assertIn("max-inline-size:1280px", self.source)
        self.assertIn("container:nikas-panel / inline-size", self.source)
        self.assertIn("@container nikas-panel (min-width:600px)", self.source)
        self.assertIn("@container nikas-panel (min-width:1024px)", self.source)

    def test_zoom_is_scoped_and_persistent(self) -> None:
        self.assertIn('this._viewport.addEventListener("touchstart"', self.source)
        self.assertIn("touches.length === 2", self.source)
        self.assertIn("this.resetZoom()", self.source)
        self.assertIn("localStorage.getItem(ZOOM_KEY)", self.source)
        self.assertIn("localStorage.setItem(ZOOM_KEY", self.source)
        self.assertIn("0.75, 2", self.source)

    def test_live_states_are_patched_without_shell_rebuild(self) -> None:
        start = self.source.index("  patchStates() {")
        end = self.source.index("  patchStatus(", start)
        body = self.source[start:end]
        self.assertNotIn("innerHTML", body)
        self.assertNotIn("replaceChildren", body)
        self.assertIn("this.patchStatus", body)
        self.assertIn("window.requestAnimationFrame", self.source)

    def test_navigation_uses_source_aware_home_assistant_contract(self) -> None:
        self.assertIn('const PARENT_ROUTE = "/dashboard-house-v13/home"', self.source)
        self.assertIn('const SAFE_RETURN_ROUTE = "/dashboard-house-v13/home"', self.source)
        self.assertIn("captureNikasShellReturnRoute", self.source)
        self.assertIn("window.history.pushState", self.source)
        self.assertIn('new Event("location-changed")', self.source)
        self.assertNotIn('id="navigation-proxy"', self.source)
        self.assertNotIn("window.location.assign", self.source)
        self.assertNotIn("history.back(", self.source)

    def test_header_matches_nikas_knowledge_base(self) -> None:
        header_start = self.source.index('<header class="nikas-shell__header header">')
        header_end = self.source.index("</header>", header_start)
        header = self.source[header_start:header_end]
        self.assertIn('<strong>Контроль доступа</strong>', header)
        self.assertIn('<small>UI v${UI_VERSION}</small>', header)
        self.assertIn('class="nikas-shell__side-action shell-button menu"', header)
        self.assertIn('nikas-shell__side-action--right shell-button refresh', header)
        self.assertIn('icon="mdi:refresh"', header)
        self.assertNotIn('data-view-target="diagnostics"', header)
        self.assertIn("grid-template-columns:52px minmax(0,1fr) 52px", self.source)
        self.assertIn("font-size:23px;font-weight:800", self.source)
        self.assertIn("font-size:14px;font-weight:560", self.source)
        self.assertIn(".nikas-shell__title:focus-visible,.nikas-shell__side-action:focus-visible", self.source)
        self.assertNotIn('class="return-home"', self.source)
        self.assertNotIn("Вернуться в панель «Дом»", self.source)

    def test_bottom_navigation_is_internal_and_ordered(self) -> None:
        nav_start = self.source.index('<nav class="nikas-shell__tabs tabs"')
        nav_end = self.source.index("</nav>", nav_start)
        nav = self.source[nav_start:nav_end]
        targets = re.findall(r'data-view-target="([a-z]+)"', nav)
        self.assertEqual(targets, ["statuses", "gates", "intercom", "diagnostics"])
        self.assertNotIn("data-path=", nav)
        self.assertNotIn("/dashboard-actions/", nav)
        self.assertNotIn("/dashboard-infrastructure/", nav)
        self.assertIn('this._activeView = "statuses"', self.source)

    def test_all_internal_views_share_one_working_area(self) -> None:
        self.assertEqual(self.source.count('data-view-panel="statuses"'), 1)
        self.assertEqual(self.source.count('data-view-panel="gates"'), 1)
        self.assertEqual(self.source.count('data-view-panel="intercom"'), 1)
        self.assertEqual(self.source.count('data-view-panel="diagnostics"'), 1)
        self.assertIn("activateView(viewId)", self.source)
        start = self.source.index("  activateView(viewId) {")
        end = self.source.index("  controlClick(event) {", start)
        self.assertNotIn("history.pushState", self.source[start:end])

    def test_diagnostics_lists_perimeter_devices_and_sensors(self) -> None:
        self.assertIn("function discoverAccessDevices(registries, sources)", self.source)
        self.assertEqual(self.source.count('data-perimeter-device-list="internal"'), 1)
        self.assertEqual(self.source.count('data-perimeter-device-list="external"'), 1)
        self.assertEqual(self.source.count('data-perimeter-device-list="safety"'), 1)
        self.assertIn("data-access-source", self.source)
        self.assertIn("this.patchAccessDeviceStates()", self.source)
        self.assertIn("hass-more-info", self.source)

    def test_safety_label_has_fail_safe_state_model(self) -> None:
        self.assertIn('label: "Безопасность"', self.source)
        self.assertIn('icon: "mdi:shield-alert-outline"', self.source)
        self.assertIn('"bezopasnost"', self.source)
        self.assertIn("function safetyModel(hass, entityIds)", self.source)
        self.assertIn('title: "Тревога"', self.source)
        self.assertIn('title: "Норма"', self.source)
        self.assertIn('data-status="safety"', self.source)
        self.assertIn('data-status="diagnostic-safety"', self.source)

    def test_intercom_module_is_visible_but_has_no_entities_or_controls(self) -> None:
        self.assertIn("const INTERCOM_MODULE = Object.freeze", self.source)
        self.assertIn("enabled: false", self.source)
        self.assertIn("entityIds: Object.freeze({})", self.source)
        self.assertIn("${renderIntercomView()}", self.source)
        self.assertIn("Сущности домофона не назначены", self.source)
        intercom_start = self.source.index("function renderIntercomView()")
        intercom_end = self.source.index("function renderDiagnosticsView()", intercom_start)
        intercom = self.source[intercom_start:intercom_end]
        self.assertNotIn("data-command", intercom)
        self.assertNotRegex(intercom, r'(?:binary_sensor|camera|lock|button|switch)\.[a-z0-9_]+')


if __name__ == "__main__":
    unittest.main()
