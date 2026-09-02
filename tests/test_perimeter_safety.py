from __future__ import annotations

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "custom_components" / "nikas_access" / "frontend" / "src"


class PerimeterSafetyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.perimeters = (SOURCE / "data" / "perimeters.js").read_text(encoding="utf-8")
        cls.panel = (SOURCE / "nikas-access-panel.js").read_text(encoding="utf-8")
        cls.contract = json.loads((ROOT / "panel_contract.json").read_text(encoding="utf-8"))

    def test_sources_are_discovered_from_registries_not_invented_ids(self) -> None:
        self.assertIn("function discoverPerimeterSources(registries)", self.perimeters)
        self.assertIn('entityId.startsWith("binary_sensor.")', self.perimeters)
        self.assertIn('const ACTIVE_LABEL = "v_ekspluatatsii"', self.perimeters)
        self.assertNotRegex(self.perimeters, r'"binary_sensor\.[a-z0-9_]+"')
        self.assertIn('this.registryRequest("config/entity_registry/list")', self.panel)
        self.assertIn('this.registryRequest("config/device_registry/list")', self.panel)
        self.assertIn('this.registryRequest("config/label_registry/list")', self.panel)

    def test_non_operational_sources_are_excluded(self) -> None:
        for label in ("na_obsluzhivanii", "trebuet_zameny", "vyvedeno_iz_ekspluatatsii", "rezerv"):
            self.assertIn(f'"{label}"', self.perimeters)
            self.assertIn(label, self.contract["perimeters"]["excluded_labels"])
        self.assertIn("isOperationalLabelSet(keys)", self.perimeters)

    def test_unknown_or_unavailable_never_becomes_closed(self) -> None:
        start = self.perimeters.index("function perimeterModel(")
        end = self.perimeters.index("function accessSummaryModel", start)
        body = self.perimeters[start:end]
        self.assertIn('state === "on"', body)
        self.assertIn('state !== "off"', body)
        self.assertIn('title: "Нет данных"', body)
        self.assertFalse(self.contract["perimeters"]["unknown_is_safe"])
        self.assertFalse(self.contract["perimeters"]["unavailable_is_safe"])

    def test_state_updates_remain_targeted(self) -> None:
        start = self.panel.index("  patchStates() {")
        end = self.panel.index("  registryStatusModel()", start)
        body = self.panel[start:end]
        self.assertNotIn("innerHTML", body)
        self.assertNotIn("replaceChildren", body)
        self.assertIn('this.patchStatus("perimeter-internal"', body)
        self.assertIn('this.patchStatus("perimeter-external"', body)


if __name__ == "__main__":
    unittest.main()
