from __future__ import annotations

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
        self.assertEqual(self.source.count('<main class="viewport" id="viewport">'), 1)
        self.assertEqual(self.source.count('<header class="header">'), 1)
        self.assertEqual(self.source.count('<nav class="tabs"'), 1)
        self.assertIn("position:fixed;inset:0", self.source)
        self.assertIn("overflow-y:auto;overflow-x:hidden", self.source)
        self.assertIn("env(safe-area-inset-top,0px)", self.source)

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

    def test_navigation_uses_home_assistant_anchor_contract(self) -> None:
        self.assertIn('const HOME_PATH = "/dashboard-house-v12/home"', self.source)
        self.assertIn('id="navigation-proxy"', self.source)
        self.assertIn("anchor.href = path", self.source)
        self.assertIn("anchor.click()", self.source)
        self.assertNotIn("history.back(", self.source)

    def test_intercom_module_is_reserved_but_hidden(self) -> None:
        self.assertIn("const INTERCOM_MODULE = Object.freeze", self.source)
        self.assertIn("enabled: false", self.source)
        self.assertIn("entityIds: Object.freeze({})", self.source)
        self.assertIn('INTERCOM_MODULE.enabled ? renderIntercomView() : ""', self.source)


if __name__ == "__main__":
    unittest.main()
