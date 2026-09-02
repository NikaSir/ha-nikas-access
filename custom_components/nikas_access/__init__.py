"""Autonomous NikaS Access panel integration."""

from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .panel import async_register_panel, async_unregister_panel

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Register the integration-owned Access panel."""
    try:
        await async_register_panel(hass, entry.entry_id)
    except (OSError, RuntimeError, ValueError) as err:
        _LOGGER.error("Cannot register NikaS Access panel: %s", err)
        return False
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove only the Access route registered by this config entry."""
    async_unregister_panel(hass, entry.entry_id)
    return True
