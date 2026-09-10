#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

check_path = ROOT / "scripts" / "check-panel.mjs"
text = check_path.read_text(encoding="utf-8")
old = '''const patchStart = frontend.indexOf("  patchStates() {");
const patchEnd = frontend.indexOf("  patchStatus(", patchStart);
const patchBody = frontend.slice(patchStart, patchEnd);
requireContract(patchStart >= 0 && patchEnd > patchStart, "targeted state patch is missing");
requireContract(!patchBody.includes("innerHTML"), "state updates must not rebuild Shadow DOM");
requireContract(!patchBody.includes("replaceChildren"), "state updates must not replace the working view");
requireContract(!patchBody.includes("innerHTML"), "telemetry patch must not rebuild an internal view");
'''
new = '''const patchMatch = frontend.match(/  patchStates\\(\\) \\{[\\s\\S]*?this\\.patchRegistryRefresh\\(\\);[\\s\\S]*?this\\.patchCommandLocks\\(\\);\\n  \\}/);
requireContract(Boolean(patchMatch), "targeted state patch is missing");
const patchBody = patchMatch?.[0] || "";
requireContract(!patchBody.includes("innerHTML"), "state updates must not rebuild Shadow DOM");
requireContract(!patchBody.includes("replaceChildren"), "state updates must not replace the working view");
'''
if old not in text:
    raise SystemExit("old targeted-patch gate not found")
text = text.replace(old, new, 1)
check_path.write_text(text, encoding="utf-8")

test_path = ROOT / "tests" / "test_refresh_contract.py"
test_path.write_text('''import unittest\nfrom pathlib import Path\n\nROOT = Path(__file__).resolve().parents[1]\nSOURCE = ROOT / "custom_components" / "nikas_access" / "frontend" / "src" / "nikas-access-panel.js"\nSTYLES = ROOT / "custom_components" / "nikas_access" / "frontend" / "src" / "styles.js"\nCONSTANTS = ROOT / "custom_components" / "nikas_access" / "frontend" / "src" / "constants.js"\n\n\nclass RefreshContractTests(unittest.TestCase):\n    def test_refresh_action_contract_v11_is_implemented(self):\n        source = SOURCE.read_text(encoding="utf-8")\n        styles = STYLES.read_text(encoding="utf-8")\n        constants = CONSTANTS.read_text(encoding="utf-8")\n        self.assertIn("async runRegistryRefreshAction()", source)\n        self.assertIn("REFRESH_MIN_BUSY_MS = 900", constants)\n        self.assertIn("REFRESH_RESULT_MS = 1400", constants)\n        self.assertIn('this._refreshPhase = success ? "success" : "error"', source)\n        self.assertIn('button.classList.toggle("is-busy", busy)', source)\n        self.assertIn('button.classList.toggle("is-success", phase === "success")', source)\n        self.assertIn('button.classList.toggle("is-error", phase === "error")', source)\n        self.assertIn('window.clearTimeout(this._refreshResultTimer)', source)\n        self.assertIn("prefers-reduced-motion:reduce", styles)\n        self.assertIn(".refresh.is-success{color:#43a047}", styles)\n        self.assertIn(".refresh.is-error{color:#e53935}", styles)\n\n    def test_refresh_button_remains_same_geometry_and_allows_result_retry(self):\n        source = SOURCE.read_text(encoding="utf-8")\n        self.assertIn('button.disabled !== busy', source)\n        self.assertIn('const busy = phase === "busy"', source)\n        self.assertIn('phase === "success" || phase === "error"', source)\n        self.assertIn('void this.runRegistryRefreshAction();', source)\n\n\nif __name__ == "__main__":\n    unittest.main()\n''', encoding="utf-8")

print("Access A19 gate aligned")
