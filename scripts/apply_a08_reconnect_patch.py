#!/usr/bin/env python3
"""One-shot exact patch for audit finding A08; removed by the workflow after use."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PANEL = ROOT / "custom_components/nikas_access/frontend/src/nikas-access-panel.js"

OLD_DISCONNECT = '''  disconnectedCallback() {
    this._scrollBoundaryGuardCleanup?.();
    this._scrollBoundaryGuardCleanup = null;
    window.removeEventListener("resize", this._onResize);
    window.visualViewport?.removeEventListener?.("resize", this._onResize);
    window.removeEventListener("keydown", this._onKeyDown);
    if (this._stateFrame !== null) window.cancelAnimationFrame(this._stateFrame);
    window.clearTimeout(this._unlockTimer);
    window.clearTimeout(this._toastTimer);
    window.clearTimeout(this._zoomToastTimer);
    this._registryLoadId += 1;
    this._stateFrame = null;
  }
'''

NEW_DISCONNECT = '''  disconnectedCallback() {
    this._scrollBoundaryGuardCleanup?.();
    this._scrollBoundaryGuardCleanup = null;
    window.removeEventListener("resize", this._onResize);
    window.visualViewport?.removeEventListener?.("resize", this._onResize);
    window.removeEventListener("keydown", this._onKeyDown);
    if (this._stateFrame !== null) window.cancelAnimationFrame(this._stateFrame);
    window.clearTimeout(this._unlockTimer);
    window.clearTimeout(this._toastTimer);
    window.clearTimeout(this._zoomToastTimer);
    this._registryLoadId += 1;
    this._stateFrame = null;
    this._registryLoading = false;
    this._commandLock = false;
    this._pendingCommand = null;
    this._unlockTimer = null;
    this._toastTimer = null;
    this._zoomToastTimer = null;
    this._gesture = null;
    this._touchPointers.clear();
    this._tapSession = null;
    this._manualActivationTarget = null;
    this._manualActivationUntil = 0;
    this._suppressClicksUntil = 0;
    if (this._confirmButton) this._confirmButton.disabled = false;
    if (this._modal) {
      this._modal.hidden = true;
      this._modal.setAttribute("aria-hidden", "true");
    }
    this._zoomToast?.classList.remove("show");
    this._commandToast?.classList.remove("show");
  }
'''


def replace_exact(path: Path, old: str, new: str, *, count: int | None = None) -> None:
    text = path.read_text(encoding="utf-8")
    actual = text.count(old)
    expected = count if count is not None else 1
    if actual != expected:
        raise SystemExit(f"{path.relative_to(ROOT)}: expected {expected} occurrence(s), found {actual}")
    path.write_text(text.replace(old, new), encoding="utf-8")


source = PANEL.read_text(encoding="utf-8")
if source.count(OLD_DISCONNECT) != 1:
    raise SystemExit("frontend source: disconnectedCallback baseline drift")
PANEL.write_text(source.replace(OLD_DISCONNECT, NEW_DISCONNECT), encoding="utf-8")

# Version/cache-busting update. These are current-version surfaces, not the standard declaration.
version_files = [
    ROOT / ".nikas-ui-standard.json",
    ROOT / "README.md",
    ROOT / "custom_components/nikas_access/const.py",
    ROOT / "custom_components/nikas_access/frontend/src/constants.js",
    ROOT / "custom_components/nikas_access/manifest.json",
    ROOT / "custom_components/nikas_access/panel_manifest.json",
    ROOT / "package.json",
    ROOT / "panel_contract.json",
    ROOT / "scripts/build.mjs",
    ROOT / "scripts/check_repository.py",
]
for path in version_files:
    text = path.read_text(encoding="utf-8")
    if "0.1.7" not in text:
        raise SystemExit(f"{path.relative_to(ROOT)}: current version marker missing")
    path.write_text(text.replace("0.1.7", "0.1.8"), encoding="utf-8")

changelog = ROOT / "CHANGELOG.md"
text = changelog.read_text(encoding="utf-8")
anchor = "# История изменений\n\n"
if anchor not in text:
    raise SystemExit("CHANGELOG anchor missing")
entry = """## 0.1.8

- Исправлен lifecycle reconnect по finding A08: прерванная загрузка реестров больше не оставляет `_registryLoading` в вечном состоянии.
- После detach снимается только transient command lock и закрывается устаревшее подтверждение; `_lastCommandAt` сохраняется, поэтому защитный cooldown нельзя обойти переподключением панели.
- Очищаются отменённые UI-таймеры, жесты и toast-состояния, чтобы повторный attach начинался из нейтрального transient-состояния.
- Добавлен регрессионный тест detach/attach контракта; production bundle пересобирается только штатным `scripts/build.mjs`.

"""
if "## 0.1.8" in text:
    raise SystemExit("CHANGELOG already contains 0.1.8")
changelog.write_text(text.replace(anchor, anchor + entry, 1), encoding="utf-8")

# Regression contract: inspect the source lifecycle block and preserve the safety cooldown.
test_path = ROOT / "tests/test_lifecycle_reconnect.py"
test_path.write_text('''from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "custom_components/nikas_access/frontend/src/nikas-access-panel.js"
BUNDLE = ROOT / "custom_components/nikas_access/frontend/nikas-access-panel.js"


class ReconnectLifecycleTests(unittest.TestCase):
    def _disconnect_block(self, text: str) -> str:
        match = re.search(r"  disconnectedCallback\\(\\) \\{(?P<body>.*?)\\n  \\}\\n\\n  mountShell\\(\\)", text, re.S)
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
''', encoding="utf-8")

# Build is intentionally delegated to the canonical generator in the workflow.
print("A08 exact patch staged")
