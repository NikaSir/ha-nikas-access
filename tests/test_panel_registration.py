from __future__ import annotations

import asyncio
import importlib
import sys
import types
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class StaticPathConfig:
    def __init__(self, url_path: str, path: str, cache_headers: bool) -> None:
        self.url_path = url_path
        self.path = path
        self.cache_headers = cache_headers


class FakeHttp:
    def __init__(self) -> None:
        self.paths = []

    async def async_register_static_paths(self, paths) -> None:
        self.paths.extend(paths)


class FakeHass:
    def __init__(self) -> None:
        self.data = {}
        self.http = FakeHttp()


frontend = types.ModuleType("homeassistant.components.frontend")
panel_custom = types.ModuleType("homeassistant.components.panel_custom")
http = types.ModuleType("homeassistant.components.http")
http.StaticPathConfig = StaticPathConfig
frontend.exists = False
frontend.removed = []
panel_custom.registered = []


def async_panel_exists(_hass, _path):
    return frontend.exists


def async_remove_panel(_hass, path, warn_if_unknown=False):
    frontend.removed.append((path, warn_if_unknown))


async def async_register_panel(**kwargs):
    panel_custom.registered.append(kwargs)


frontend.async_panel_exists = async_panel_exists
frontend.async_remove_panel = async_remove_panel
panel_custom.async_register_panel = async_register_panel

homeassistant = types.ModuleType("homeassistant")
components = types.ModuleType("homeassistant.components")
config_entries = types.ModuleType("homeassistant.config_entries")
core = types.ModuleType("homeassistant.core")
config_entries.ConfigEntry = type("ConfigEntry", (), {})
config_entries.ConfigFlow = type("ConfigFlow", (), {"__init_subclass__": classmethod(lambda cls, **kwargs: None)})
core.HomeAssistant = type("HomeAssistant", (), {})
components.frontend = frontend
components.panel_custom = panel_custom

sys.modules.update({
    "homeassistant": homeassistant,
    "homeassistant.components": components,
    "homeassistant.components.frontend": frontend,
    "homeassistant.components.panel_custom": panel_custom,
    "homeassistant.components.http": http,
    "homeassistant.config_entries": config_entries,
    "homeassistant.core": core,
})
sys.path.insert(0, str(ROOT / "custom_components"))
panel = importlib.import_module("nikas_access.panel")


class PanelRegistrationTests(unittest.TestCase):
    def setUp(self) -> None:
        frontend.exists = False
        frontend.removed.clear()
        panel_custom.registered.clear()

    def test_registers_only_the_requested_autonomous_route(self) -> None:
        hass = FakeHass()
        registered = asyncio.run(panel.async_register_panel(hass, "entry-a"))
        self.assertTrue(registered)
        self.assertEqual(len(hass.http.paths), 1)
        self.assertEqual(hass.http.paths[0].url_path, "/nikas_access_panel")
        self.assertFalse(hass.http.paths[0].cache_headers)
        self.assertEqual(len(panel_custom.registered), 1)
        kwargs = panel_custom.registered[0]
        self.assertEqual(kwargs["frontend_url_path"], "dashboard-access-v1")
        self.assertEqual(kwargs["webcomponent_name"], "nikas-access-panel")
        self.assertEqual(kwargs["sidebar_title"], "Доступ")
        self.assertEqual(kwargs["module_url"], "/nikas_access_panel/nikas-access-panel.js?v=0.1.5")
        self.assertFalse(kwargs["embed_iframe"])
        self.assertTrue(kwargs["handle_safe_area"])

    def test_existing_route_is_preserved_and_not_claimed(self) -> None:
        hass = FakeHass()
        frontend.exists = True
        registered = asyncio.run(panel.async_register_panel(hass, "entry-a"))
        self.assertFalse(registered)
        self.assertEqual(panel_custom.registered, [])
        self.assertNotIn(panel.PANEL_ROUTE_OWNER, hass.data[panel.DOMAIN])

    def test_unload_removes_only_route_owned_by_exact_entry(self) -> None:
        hass = FakeHass()
        asyncio.run(panel.async_register_panel(hass, "entry-a"))
        panel.async_unregister_panel(hass, "entry-b")
        self.assertEqual(frontend.removed, [])
        panel.async_unregister_panel(hass, "entry-a")
        self.assertEqual(frontend.removed, [("dashboard-access-v1", False)])
        panel.async_unregister_panel(hass, "entry-a")
        self.assertEqual(len(frontend.removed), 1)


if __name__ == "__main__":
    unittest.main()
