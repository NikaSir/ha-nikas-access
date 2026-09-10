import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "custom_components" / "nikas_access" / "frontend" / "src" / "nikas-access-panel.js"
STYLES = ROOT / "custom_components" / "nikas_access" / "frontend" / "src" / "styles.js"
CONSTANTS = ROOT / "custom_components" / "nikas_access" / "frontend" / "src" / "constants.js"


class RefreshContractTests(unittest.TestCase):
    def test_refresh_action_contract_v11_is_implemented(self):
        source = SOURCE.read_text(encoding="utf-8")
        styles = STYLES.read_text(encoding="utf-8")
        constants = CONSTANTS.read_text(encoding="utf-8")
        self.assertIn("async runRegistryRefreshAction()", source)
        self.assertIn("REFRESH_MIN_BUSY_MS = 900", constants)
        self.assertIn("REFRESH_RESULT_MS = 1400", constants)
        self.assertIn('this._refreshPhase = success ? "success" : "error"', source)
        self.assertIn('button.classList.toggle("is-busy", busy)', source)
        self.assertIn('button.classList.toggle("is-success", phase === "success")', source)
        self.assertIn('button.classList.toggle("is-error", phase === "error")', source)
        self.assertIn('window.clearTimeout(this._refreshResultTimer)', source)
        self.assertIn("prefers-reduced-motion:reduce", styles)
        self.assertIn(".refresh.is-success{color:#43a047}", styles)
        self.assertIn(".refresh.is-error{color:#e53935}", styles)

    def test_refresh_button_remains_same_geometry_and_allows_result_retry(self):
        source = SOURCE.read_text(encoding="utf-8")
        self.assertIn('button.disabled !== busy', source)
        self.assertIn('const busy = phase === "busy"', source)
        self.assertIn('phase === "success" || phase === "error"', source)
        self.assertIn('void this.runRegistryRefreshAction();', source)


if __name__ == "__main__":
    unittest.main()
