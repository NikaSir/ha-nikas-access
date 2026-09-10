from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "custom_components/nikas_access/frontend/src/nikas-access-panel.js"
BUNDLE = ROOT / "custom_components/nikas_access/frontend/nikas-access-panel.js"


class ReconnectLifecycleTests(unittest.TestCase):
    def _disconnect_block(self, text: str) -> str:
        match = re.search(r"  disconnectedCallback\(\) \{(?P<body>.*?)\n  \}\n\n  mountShell\(\)", text, re.S)
        self.assertIsNotNone(match, "disconnectedCallback block missing")
        return match.group("body")

    def test_detach_resets_transient_locks(self) -> None:
        block = self._disconnect_block(SOURCE.read_text(encoding="utf-8"))
        for statement in (
            "this._registryLoadId += 1;",
            "this._registryLoading = false;",
            "this._commandLock = false;",
            "this._pendingCommand = null;",
            "this._unlockTimer = null;",
            "this._toastTimer = null;",
            "this._zoomToastTimer = null;",
            "this._touchPointers.clear();",
            'this._modal.setAttribute("aria-hidden", "true");',
        ):
            self.assertIn(statement, block)
        self.assertNotIn("this._lastCommandAt = 0;", block, "reconnect must not bypass command cooldown")

    def test_generated_bundle_contains_same_lifecycle_contract(self) -> None:
        source_block = self._disconnect_block(SOURCE.read_text(encoding="utf-8"))
        bundle_block = self._disconnect_block(BUNDLE.read_text(encoding="utf-8"))
        self.assertEqual(source_block, bundle_block)


if __name__ == "__main__":
    unittest.main()
