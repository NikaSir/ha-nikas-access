"""Config flow for NikaS Access."""

from __future__ import annotations

from homeassistant import config_entries

from .const import DOMAIN


class NikasAccessConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Create the single local Access panel entry."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Add the autonomous Access panel."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is not None:
            return self.async_create_entry(title="Доступ", data={})
        return self.async_show_form(step_id="user")
