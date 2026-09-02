from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "custom_components" / "nikas_access" / "frontend" / "src"


class CommandSafetyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.constants = (SOURCE / "constants.js").read_text(encoding="utf-8")
        cls.panel = (
            (SOURCE / "nikas-access-panel.js").read_text(encoding="utf-8")
            + (SOURCE / "views" / "gates-view.js").read_text(encoding="utf-8")
        )
        cls.contract = json.loads((ROOT / "panel_contract.json").read_text(encoding="utf-8"))

    def test_only_approved_entities_are_used(self) -> None:
        expected = {
            "binary_sensor.sensor_do_zb_15_16_contact",
            "cover.umnyi_kontroller_dlia_vorot_roximo_door",
            "cover.umnyi_kontroller_dlia_vorot_roximo_2_door",
        }
        found = set(re.findall(r'"((?:binary_sensor|cover)\.[a-z0-9_]+)"', self.constants))
        self.assertEqual(found, expected)

    def test_sectional_position_uses_only_contact_sensor(self) -> None:
        start = self.constants.index("function sectionalPositionModel(hass)")
        end = self.constants.index("function gateControlModel", start)
        body = self.constants[start:end]
        self.assertIn("SECTIONAL_POSITION_ENTITY", body)
        self.assertNotIn("SECTIONAL_CONTROL_ENTITY", body)
        self.assertNotIn("SWING_CONTROL_ENTITY", body)
        self.assertIn('state === "on"', body)
        self.assertIn('state === "off"', body)
        self.assertIn('text: "Нет данных"', body)

    def test_swing_gate_never_claims_a_position(self) -> None:
        self.assertIn("Положение не контролируется", self.panel)
        self.assertNotIn("swingPositionModel", self.constants + self.panel)
        self.assertEqual(self.contract["swing_gate"]["position_source"], "none")

    def test_command_allowlist_and_services(self) -> None:
        keys = re.findall(r'^  "((?:sectional|swing):(?:open|stop|close))": Object\.freeze', self.constants, re.MULTILINE)
        self.assertEqual(len(keys), 6)
        self.assertEqual(set(keys), {
            "sectional:open", "sectional:stop", "sectional:close",
            "swing:open", "swing:stop", "swing:close",
        })
        services = set(re.findall(r'service: "([a-z_]+)"', self.constants))
        self.assertEqual(services, {"open_cover", "stop_cover", "close_cover"})
        self.assertIn('callService("cover", command.service, { entity_id: command.entityId })', self.panel)

    def test_every_write_requires_confirmation_and_lock(self) -> None:
        self.assertIn("openConfirmation(button.dataset.command)", self.panel)
        self.assertIn("Объект: «${command.objectLabel}». Действие: «${command.actionLabel}»", self.panel)
        self.assertIn("if (!command || this._commandLock", self.panel)
        self.assertIn("this._commandLock = true", self.panel)
        self.assertIn("COMMAND_COOLDOWN_MS", self.constants + self.panel)

    def test_command_failure_is_persistent_until_user_dismissal(self) -> None:
        start = self.panel.index("  showPersistentError(message)")
        end = self.panel.index("  dismissError()", start)
        body = self.panel[start:end]
        self.assertIn("this._errorBanner.hidden = false", body)
        self.assertNotIn("setTimeout", body)
        self.assertIn("this._errorBanner.hidden = true", self.panel[end:])

    def test_no_optimistic_position_assignment(self) -> None:
        combined = self.constants + self.panel
        self.assertNotRegex(combined, r"states\s*\[[^\]]+\]\s*=")
        self.assertNotIn("stateObj.state =", combined)
        self.assertNotIn("optimisticPosition", combined)


if __name__ == "__main__":
    unittest.main()
