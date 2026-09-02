class NikasAccessPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._panel = null;
    this._mounted = false;
    this._activeView = "statuses";
    this._stateFrame = null;
    this._registries = null;
    this._registryLoading = false;
    this._registryError = "";
    this._registryLoadId = 0;
    this._accessSources = { internal: [], external: [], safety: [] };
    this._accessDevices = { internal: [], external: [], safety: [] };
    this._commandLock = false;
    this._pendingCommand = null;
    this._lastCommandAt = 0;
    this._unlockTimer = null;
    this._toastTimer = null;
    this._zoomToastTimer = null;
    this._zoom = this.loadZoom();
    this._gesture = null;
    this._lastTwoTap = 0;
    this._suppressClicksUntil = 0;
    this._touchPointers = new Set();
    this._tapSession = null;
    this._manualActivationTarget = null;
    this._manualActivationUntil = 0;
    this._returnRoute = null;
    this._scrollBoundaryGuardCleanup = null;
    this._onResize = () => this.applyTransform();
    this._onKeyDown = (event) => {
      if (event.key === "Escape" && this._pendingCommand && !this._commandLock) {
        this.closeConfirmation();
      }
    };
  }

  set panel(value) {
    this._panel = value;
  }

  set hass(value) {
    this._hass = value;
    if (this._mounted) {
      this.scheduleStatePatch();
      if (!this._registries && !this._registryLoading) void this.loadRegistries();
    }
  }

  connectedCallback() {
    this.mountShell();
    this._scrollBoundaryGuardCleanup?.();
    this._scrollBoundaryGuardCleanup = createNikasShellScrollBoundaryGuard({
      host: this,
      viewport: this._viewport,
    });
    if (window.location.pathname === PANEL_ROOT) {
      window.history.replaceState(null, "", ROOT_PATH);
    }
    window.addEventListener("resize", this._onResize, { passive: true });
    window.visualViewport?.addEventListener?.("resize", this._onResize, { passive: true });
    window.addEventListener("keydown", this._onKeyDown);
    this.scheduleStatePatch();
    void this.loadRegistries();
  }

  disconnectedCallback() {
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

  mountShell() {
    if (this._mounted) return;
    this._mounted = true;
    this._returnRoute = captureNikasShellReturnRoute({
      panelId: RETURN_PANEL_ID,
      parentRoute: PARENT_ROUTE,
      safeReturnRoute: SAFE_RETURN_ROUTE,
    });
    this.shadowRoot.innerHTML = `
      <style>${nikasShellV2Styles()}${panelStyles()}</style>
      <div class="nikas-shell app" style="--nikas-shell-tab-count:4">
        <header class="nikas-shell__header header">
          <button class="nikas-shell__side-action shell-button menu" type="button" aria-label="Меню Home Assistant">
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>
          <button class="nikas-shell__title title-return" type="button" data-return-home
            aria-label="Контроль доступа — вернуться в исходную панель NikaS">
            <strong>Контроль доступа</strong>
            <small>UI v${UI_VERSION}</small>
          </button>
          <button class="nikas-shell__side-action nikas-shell__side-action--right shell-button refresh"
            type="button" data-registry-retry
            aria-label="Обновить реестры Home Assistant" title="Обновить реестры Home Assistant">
            <ha-icon icon="mdi:refresh"></ha-icon>
          </button>
        </header>

        <main class="nikas-shell__viewport viewport" id="viewport">
          <section class="nikas-shell__canvas canvas" id="canvas">
            <div class="nikas-shell__content content">
              <div class="domain-content">
                <section class="error-banner" id="error-banner" role="alert" aria-live="assertive" hidden>
                  <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                  <span>
                    <strong>Команда не выполнена</strong>
                    <small id="error-text"></small>
                  </span>
                  <button type="button" data-dismiss-error aria-label="Скрыть сообщение об ошибке">
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </section>
                ${renderStatusesView()}
                ${renderGatesView()}
                ${renderIntercomView()}
                ${renderDiagnosticsView()}
              </div>
            </div>
          </section>
        </main>

        <nav class="nikas-shell__tabs tabs" aria-label="Разделы панели Доступ">
          <button type="button" class="nikas-shell__tab active" data-view-target="statuses" aria-current="page" aria-label="Статусы">
            <ha-icon icon="mdi:shield-home-outline"></ha-icon><small>Статусы</small>
          </button>
          <button type="button" class="nikas-shell__tab" data-view-target="gates" aria-label="Ворота">
            <ha-icon icon="mdi:gate"></ha-icon><small>Ворота</small>
          </button>
          <button type="button" class="nikas-shell__tab" data-view-target="intercom" aria-label="Домофон">
            <ha-icon icon="mdi:doorbell-video"></ha-icon><small>Домофон</small>
          </button>
          <button type="button" class="nikas-shell__tab" data-view-target="diagnostics" aria-label="Диагностика">
            <ha-icon icon="mdi:stethoscope"></ha-icon><small>Диагностика</small>
          </button>
        </nav>

        <section class="modal" id="confirm-modal" aria-hidden="true" hidden>
          <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
            <span class="dialog-icon"><ha-icon icon="mdi:shield-lock-outline"></ha-icon></span>
            <h2 id="confirm-title">Подтвердите команду</h2>
            <p id="confirm-message"></p>
            <p class="safety">Положение ворот не изменяется на экране до получения фактических данных Home Assistant.</p>
            <div class="dialog-actions">
              <button class="dialog-cancel" type="button" data-confirm-cancel>Отмена</button>
              <button class="dialog-confirm" type="button" data-confirm-accept>Выполнить</button>
            </div>
          </div>
        </section>

        <div class="zoom-toast" aria-live="polite">Масштаб 100%</div>
        <div class="command-toast" aria-live="polite"></div>
      </div>`;

    this._viewport = this.shadowRoot.getElementById("viewport");
    this._canvas = this.shadowRoot.getElementById("canvas");
    this._modal = this.shadowRoot.getElementById("confirm-modal");
    this._confirmMessage = this.shadowRoot.getElementById("confirm-message");
    this._confirmButton = this.shadowRoot.querySelector("[data-confirm-accept]");
    this._errorBanner = this.shadowRoot.getElementById("error-banner");
    this._errorText = this.shadowRoot.getElementById("error-text");
    this._zoomToast = this.shadowRoot.querySelector(".zoom-toast");
    this._commandToast = this.shadowRoot.querySelector(".command-toast");
    this.shadowRoot.addEventListener("click", (event) => this.controlClick(event));
    this.shadowRoot.addEventListener("pointerdown", (event) => this.tapPointerDown(event), { passive: true });
    this.shadowRoot.addEventListener("pointermove", (event) => this.tapPointerMove(event), { passive: true });
    this.shadowRoot.addEventListener("pointerup", (event) => this.tapPointerUp(event), { passive: false });
    this.shadowRoot.addEventListener("pointercancel", (event) => this.tapPointerCancel(event), { passive: true });
    this._viewport.addEventListener("touchstart", (event) => this.touchStart(event), { passive: false });
    this._viewport.addEventListener("touchmove", (event) => this.touchMove(event), { passive: false });
    this._viewport.addEventListener("touchend", (event) => this.touchEnd(event), { passive: false });
    this._viewport.addEventListener("touchcancel", (event) => this.touchEnd(event), { passive: false });
    this.applyTransform();
  }

  actionButton(event) {
    const path = typeof event?.composedPath === "function" ? event.composedPath() : [];
    for (const node of path) {
      if (node === this.shadowRoot) break;
      if (typeof node?.matches === "function" && node.matches("button")) return node;
    }
    return event?.target?.closest?.("button") || null;
  }

  activateControl(button) {
    if (!button || button.disabled) return false;
    if (button.classList?.contains("menu")) {
      this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }));
      return true;
    }
    if (button.dataset?.entity) {
      this.dispatchEvent(new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId: button.dataset.entity },
      }));
      return true;
    }
    if (button.dataset?.viewTarget) {
      this.activateView(button.dataset.viewTarget);
      return true;
    }
    if (button.dataset?.registryRetry !== undefined) {
      void this.loadRegistries(true);
      return true;
    }
    if (button.dataset?.returnHome !== undefined) {
      navigateNikasShell(this._returnRoute);
      return true;
    }
    if (button.dataset?.command) {
      this.openConfirmation(button.dataset.command);
      return true;
    }
    if (button.dataset?.confirmCancel !== undefined) {
      this.closeConfirmation();
      return true;
    }
    if (button.dataset?.confirmAccept !== undefined) {
      void this.executePendingCommand();
      return true;
    }
    if (button.dataset?.dismissError !== undefined) {
      this.dismissError();
      return true;
    }
    return false;
  }

  activateView(viewId) {
    const view = INTERNAL_VIEWS[viewId];
    if (!view) return;
    this._activeView = view.id;
    for (const panel of this.shadowRoot.querySelectorAll("[data-view-panel]")) {
      const active = panel.dataset.viewPanel === view.id;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    }
    for (const button of this.shadowRoot.querySelectorAll("[data-view-target]")) {
      if (!button.closest(".tabs")) continue;
      const active = button.dataset.viewTarget === view.id;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
    this._viewport?.scrollTo({ left: 0, top: 0 });
    if (this._zoom.scale > 1.03) {
      this._zoom.x = 0;
      this._zoom.y = 0;
    }
    window.requestAnimationFrame(() => this.applyTransform());
    this.scheduleStatePatch();
  }

  controlClick(event) {
    const button = this.actionButton(event);
    if (!button) return;
    if (button === this._manualActivationTarget && Date.now() < this._manualActivationUntil) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      return;
    }
    if (Date.now() < this._suppressClicksUntil) return;
    if (this.activateControl(button)) event.preventDefault();
  }

  tapPointerDown(event) {
    if (event.pointerType !== "touch") return;
    this._touchPointers.add(event.pointerId);
    if (this._touchPointers.size > 1) {
      if (this._tapSession) this._tapSession.cancelled = true;
      return;
    }
    const button = this.actionButton(event);
    this._tapSession = button ? {
      pointerId: event.pointerId,
      button,
      startX: Number(event.clientX) || 0,
      startY: Number(event.clientY) || 0,
      cancelled: false,
    } : null;
  }

  tapPointerMove(event) {
    const session = this._tapSession;
    if (event.pointerType !== "touch" || !session || session.pointerId !== event.pointerId) return;
    const distance = Math.hypot(
      (Number(event.clientX) || 0) - session.startX,
      (Number(event.clientY) || 0) - session.startY,
    );
    if (distance >= TAP_MOVE_THRESHOLD_PX) session.cancelled = true;
  }

  tapPointerUp(event) {
    if (event.pointerType !== "touch") return;
    const session = this._tapSession;
    const isCandidate = session
      && session.pointerId === event.pointerId
      && !session.cancelled
      && this._touchPointers.size === 1
      && !this._gesture?.moved
      && this._gesture?.kind !== "pinch"
      && Date.now() >= this._suppressClicksUntil;
    this._touchPointers.delete(event.pointerId);
    this._tapSession = null;
    if (!isCandidate || !this.activateControl(session.button)) return;
    this._manualActivationTarget = session.button;
    this._manualActivationUntil = Date.now() + TAP_CLICK_GUARD_MS;
    if (event.cancelable) event.preventDefault();
  }

  tapPointerCancel(event) {
    if (event.pointerType !== "touch") return;
    this._touchPointers.delete(event.pointerId);
    if (this._tapSession?.pointerId === event.pointerId) this._tapSession = null;
  }

  registryTransport() {
    if (typeof this._hass?.callWS === "function") {
      return (message) => this._hass.callWS(message);
    }
    if (typeof this._hass?.connection?.sendMessagePromise === "function") {
      return (message) => this._hass.connection.sendMessagePromise(message);
    }
    return null;
  }

  registryValues(value) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") return Object.values(value);
    return null;
  }

  hassRegistrySnapshot() {
    const devices = this.registryValues(this._hass?.devices);
    const entities = this.registryValues(this._hass?.entities);
    if (!devices || !entities) return null;
    return {
      devices,
      entities,
      labels: this.registryValues(this._hass?.labels) || [],
    };
  }

  async registryRequest(type) {
    const transport = this.registryTransport();
    if (!transport) throw new Error("Соединение Home Assistant ещё не готово");
    return transport({ type });
  }

  applyRegistries(registries) {
    this._registries = registries;
    this._accessSources = discoverAccessSources(registries);
    this._accessDevices = discoverAccessDevices(registries, this._accessSources);
    this._registryError = "";
    this.renderAccessDevices();
    this.scheduleStatePatch();
  }

  renderAccessDevices() {
    for (const definition of Object.values(ACCESS_DEFINITIONS)) {
      const groups = this._accessDevices[definition.key] || [];
      const list = this.shadowRoot.querySelector(`[data-perimeter-device-list="${definition.key}"]`);
      const count = this.shadowRoot.querySelector(`[data-perimeter-device-count="${definition.key}"]`);
      const sensorCount = groups.reduce((total, group) => total + group.entities.length, 0);
      if (count) count.textContent = `Устройств: ${groups.length} · датчиков: ${sensorCount}`;
      if (!list) continue;
      if (groups.length === 0) {
        list.innerHTML = `<p class="empty-diagnostic">Действующие устройства с ярлыком «${escapeHtml(definition.label)}» не найдены</p>`;
        continue;
      }

      list.innerHTML = groups.map((group) => `
        <article class="perimeter-device">
          <div class="perimeter-device-heading">
            <ha-icon icon="mdi:devices"></ha-icon>
            <span>
              <strong>${escapeHtml(group.name)}</strong>
              <small>${group.deviceId ? "Устройство Home Assistant" : "Сущность без устройства"}</small>
            </span>
          </div>
          <div class="perimeter-source-list">
            ${group.entities.map((entity) => {
              const state = accessSourceStateModel(this._hass, entity.entityId, definition);
              const friendlyName = stateObject(this._hass, entity.entityId)?.attributes?.friendly_name || entity.name;
              return `
                <button class="perimeter-source tone-${state.tone}" type="button"
                  data-entity="${escapeHtml(entity.entityId)}" data-access-source="${escapeHtml(entity.entityId)}"
                  data-access-group="${escapeHtml(definition.key)}">
                  <ha-icon icon="${escapeHtml(state.icon)}"></ha-icon>
                  <span>
                    <strong>${escapeHtml(friendlyName)}</strong>
                    <code>${escapeHtml(entity.entityId)}</code>
                  </span>
                  <em data-source-state>${escapeHtml(state.text)}</em>
                </button>`;
            }).join("")}
          </div>
        </article>`).join("");
    }
  }

  async loadRegistries(force = false) {
    if (this._registryLoading) return;
    if (this._registries && !force) return;
    const loadId = ++this._registryLoadId;
    this._registryLoading = true;
    this._registryError = "";
    this.scheduleStatePatch();

    try {
      let snapshot = this.hassRegistrySnapshot();
      if (!snapshot) {
        const [devices, entities] = await Promise.all([
          this.registryRequest("config/device_registry/list"),
          this.registryRequest("config/entity_registry/list"),
        ]);
        if (!Array.isArray(devices) || !Array.isArray(entities)) {
          throw new Error("Home Assistant вернул некорректные реестры");
        }
        snapshot = { devices, entities, labels: [] };
      }

      if (snapshot.labels.length === 0 && this.registryTransport()) {
        try {
          const labels = await this.registryRequest("config/label_registry/list");
          if (Array.isArray(labels)) snapshot.labels = labels;
        } catch (_error) {
          // Stable label ids remain sufficient when names are unavailable.
        }
      }

      if (loadId !== this._registryLoadId) return;
      this.applyRegistries(snapshot);
    } catch (error) {
      if (loadId !== this._registryLoadId) return;
      this._registryError = errorText(error);
      this.scheduleStatePatch();
    } finally {
      if (loadId === this._registryLoadId) {
        this._registryLoading = false;
        this.scheduleStatePatch();
      }
    }
  }

  openConfirmation(commandKey) {
    const command = COMMANDS[commandKey];
    const now = Date.now();
    if (!command || this._commandLock || now - this._lastCommandAt < COMMAND_COOLDOWN_MS) return;
    if (!commandAvailable(this._hass, command)) {
      this.showPersistentError(`${command.objectLabel} · ${command.actionLabel}: нет данных канала управления.`);
      return;
    }
    if (this._pendingCommand?.key === command.key) return;
    this._pendingCommand = command;
    this._confirmMessage.textContent = `Объект: «${command.objectLabel}». Действие: «${command.actionLabel}». Выполнить команду?`;
    this._confirmButton.textContent = command.actionLabel;
    this._modal.hidden = false;
    this._modal.setAttribute("aria-hidden", "false");
    this._confirmButton.focus({ preventScroll: true });
  }

  closeConfirmation() {
    if (this._commandLock) return;
    this._pendingCommand = null;
    this._modal.hidden = true;
    this._modal.setAttribute("aria-hidden", "true");
  }

  async executePendingCommand() {
    const command = this._pendingCommand;
    const now = Date.now();
    if (!command || this._commandLock || now - this._lastCommandAt < COMMAND_COOLDOWN_MS) return;
    if (!commandAvailable(this._hass, command)) {
      this.closeConfirmation();
      this.showPersistentError(`${command.objectLabel} · ${command.actionLabel}: нет данных канала управления.`);
      return;
    }

    this._commandLock = true;
    this._lastCommandAt = now;
    this._pendingCommand = null;
    this._confirmButton.disabled = true;
    this._modal.hidden = true;
    this._modal.setAttribute("aria-hidden", "true");
    this.patchCommandLocks();

    try {
      await this._hass.callService("cover", command.service, { entity_id: command.entityId });
      this.showCommandToast(`Команда отправлена: ${command.objectLabel} — ${command.actionLabel.toLowerCase()}.`);
    } catch (error) {
      this.showPersistentError(`${command.objectLabel} · ${command.actionLabel}: ${errorText(error)}`);
    } finally {
      const elapsed = Date.now() - this._lastCommandAt;
      const delay = Math.max(0, COMMAND_COOLDOWN_MS - elapsed);
      window.clearTimeout(this._unlockTimer);
      this._unlockTimer = window.setTimeout(() => {
        this._commandLock = false;
        this._confirmButton.disabled = false;
        this.patchCommandLocks();
      }, delay);
    }
  }

  showPersistentError(message) {
    if (!this._errorBanner || !this._errorText) return;
    const timestamp = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    this._errorText.textContent = `${message} · ${timestamp}`;
    this._errorBanner.hidden = false;
  }

  dismissError() {
    if (!this._errorBanner || !this._errorText) return;
    this._errorText.textContent = "";
    this._errorBanner.hidden = true;
  }

  showCommandToast(message) {
    if (!this._commandToast) return;
    this._commandToast.textContent = message;
    this._commandToast.classList.add("show");
    window.clearTimeout(this._toastTimer);
    this._toastTimer = window.setTimeout(() => this._commandToast?.classList.remove("show"), 3000);
  }

  scheduleStatePatch() {
    if (this._stateFrame !== null) return;
    this._stateFrame = window.requestAnimationFrame(() => {
      this._stateFrame = null;
      this.patchStates();
    });
  }

  patchStates() {
    if (!this._mounted || !this.isConnected) return;
    const internal = perimeterModel(
      this._hass,
      this._accessSources.internal,
      PERIMETER_DEFINITIONS.internal,
    );
    const external = perimeterModel(
      this._hass,
      this._accessSources.external,
      PERIMETER_DEFINITIONS.external,
    );
    const safety = safetyModel(this._hass, this._accessSources.safety);
    const sectionalPosition = sectionalPositionModel(this._hass);
    const sectionalControl = gateControlModel(this._hass, GATES.sectional);
    const swingControl = gateControlModel(this._hass, GATES.swing);

    this.patchStatus("access-summary", accessSummaryModel(internal, external, safety));
    this.patchStatus("perimeter-internal", internal);
    this.patchStatus("perimeter-external", external);
    this.patchStatus("safety", safety);
    this.patchStatus("sectional-position", sectionalPosition);
    this.patchStatus("sectional-control", sectionalControl);
    this.patchStatus("swing-control", swingControl);
    this.patchStatus("registry-status", this.registryStatusModel());
    this.patchStatus("diagnostic-internal", this.accessGroupDiagnosticModel(internal));
    this.patchStatus("diagnostic-external", this.accessGroupDiagnosticModel(external));
    this.patchStatus("diagnostic-safety", this.accessGroupDiagnosticModel(safety));
    this.patchStatus("diagnostic-sectional-position", sectionalPosition);
    this.patchStatus("diagnostic-sectional-control", sectionalControl);
    this.patchStatus("diagnostic-swing-control", swingControl);
    this.patchAccessDeviceStates();
    this.patchRegistryRefresh();
    this.patchCommandLocks();
  }

  patchAccessDeviceStates() {
    for (const node of this.shadowRoot.querySelectorAll("[data-access-source]")) {
      const definition = ACCESS_DEFINITIONS[node.dataset.accessGroup];
      const model = accessSourceStateModel(this._hass, node.dataset.accessSource, definition);
      const text = node.querySelector("[data-source-state]");
      const icon = node.querySelector("ha-icon");
      if (text?.textContent !== model.text) text.textContent = model.text;
      if (icon?.getAttribute("icon") !== model.icon) icon.setAttribute("icon", model.icon);
      for (const tone of STATUS_TONES) node.classList.toggle(`tone-${tone}`, tone === model.tone);
    }
  }

  patchRegistryRefresh() {
    for (const button of this.shadowRoot.querySelectorAll("[data-registry-retry]")) {
      if (button.disabled !== this._registryLoading) button.disabled = this._registryLoading;
      const busy = String(this._registryLoading);
      const title = this._registryLoading ? "Реестры обновляются" : "Обновить реестры Home Assistant";
      if (button.getAttribute("aria-busy") !== busy) button.setAttribute("aria-busy", busy);
      if (button.title !== title) button.title = title;
    }
  }

  registryStatusModel() {
    if (this._registryLoading) {
      return { text: "Загрузка реестров", tone: "blue", icon: "mdi:database-sync-outline" };
    }
    if (this._registryError) {
      return { text: `Ошибка: ${this._registryError}`, tone: "red", icon: "mdi:database-alert-outline" };
    }
    if (this._registries) {
      return { text: "Реестры загружены", tone: "green", icon: "mdi:database-check-outline" };
    }
    return { text: "Ожидание соединения", tone: "red", icon: "mdi:database-alert-outline" };
  }

  accessGroupDiagnosticModel(model) {
    if (model.total === 0) {
      return { text: "Действующие датчики не найдены", tone: "red", icon: "mdi:shield-alert-outline" };
    }
    if (model.status === "alarm") {
      const missing = model.unavailable > 0 ? ` · без данных: ${model.unavailable}` : "";
      return {
        text: `${model.total} датч. · тревога: ${model.open}${missing}`,
        tone: "red",
        icon: "mdi:alert-octagon-outline",
      };
    }
    if (model.unavailable > 0) {
      return {
        text: `${model.total} датч. · без данных: ${model.unavailable}`,
        tone: "red",
        icon: "mdi:shield-alert-outline",
      };
    }
    return {
      text: `${model.total} датч. · данные доступны`,
      tone: model.status === "violated" ? "yellow" : "green",
      icon: model.status === "violated" ? "mdi:shield-off-outline" : "mdi:shield-check-outline",
    };
  }

  patchStatus(name, model) {
    const node = this.shadowRoot.querySelector(`[data-status="${name}"]`);
    if (!node) return;
    const text = node.querySelector("[data-status-text]");
    const detail = node.querySelector("[data-status-detail]");
    const icon = node.querySelector("ha-icon");
    const nextText = model.title || model.text || "";
    if (text && text.textContent !== nextText) text.textContent = nextText;
    if (detail && detail.textContent !== model.detail) detail.textContent = model.detail || "";
    if (icon && icon.getAttribute("icon") !== model.icon) icon.setAttribute("icon", model.icon);
    for (const tone of STATUS_TONES) node.classList.toggle(`tone-${tone}`, tone === model.tone);
  }

  patchCommandLocks() {
    for (const button of this.shadowRoot.querySelectorAll("[data-command]")) {
      const command = COMMANDS[button.dataset.command];
      const available = Boolean(command) && commandAvailable(this._hass, command);
      const disabled = this._commandLock || !available;
      if (button.disabled !== disabled) button.disabled = disabled;
      const title = this._commandLock
        ? "Дождитесь завершения предыдущей команды"
        : available
          ? `${command.objectLabel}: ${command.actionLabel}. Потребуется подтверждение.`
          : "Нет данных канала управления";
      if (button.title !== title) button.title = title;
    }
  }

  loadZoom() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ZOOM_KEY) || "{}");
      const scale = this.clamp(Number(parsed.scale) || 1, 0.75, 2);
      if (scale >= 0.97 && scale <= 1.03) return { scale: 1, x: 0, y: 0 };
      return { scale, x: Number(parsed.x) || 0, y: Number(parsed.y) || 0 };
    } catch (_error) {
      return { scale: 1, x: 0, y: 0 };
    }
  }

  touchStart(event) {
    const touches = event.touches;
    if (touches.length === 2) {
      event.preventDefault();
      this._suppressClicksUntil = Date.now() + 500;
      if (this._zoom.scale <= 1.03) {
        this._zoom.x = 0;
        this._zoom.y = -this._viewport.scrollTop;
        this._viewport.scrollTo({ left: 0, top: 0 });
      }
      const center = this.touchCenter(touches);
      this._gesture = {
        kind: "pinch",
        distance: this.touchDistance(touches),
        scale: this._zoom.scale,
        worldX: (center.x - this._zoom.x) / this._zoom.scale,
        worldY: (center.y - this._zoom.y) / this._zoom.scale,
        moved: false,
        started: performance.now(),
      };
    } else if (touches.length === 1 && this._zoom.scale > 1.03 && this.canPan()) {
      this._gesture = {
        kind: "pan",
        startX: touches[0].clientX,
        startY: touches[0].clientY,
        x: this._zoom.x,
        y: this._zoom.y,
        moved: false,
      };
    } else {
      this._gesture = null;
    }
  }

  touchMove(event) {
    if (!this._gesture) return;
    if (event.touches.length === 2 && this._gesture.kind === "pinch") {
      event.preventDefault();
      const center = this.touchCenter(event.touches);
      const ratio = this.touchDistance(event.touches) / Math.max(this._gesture.distance, 1);
      this._zoom.scale = this.clamp(this._gesture.scale * ratio, 0.75, 2);
      this._zoom.x = center.x - this._gesture.worldX * this._zoom.scale;
      this._zoom.y = center.y - this._gesture.worldY * this._zoom.scale;
      this._gesture.moved = Math.abs(ratio - 1) > 0.02;
      this.applyTransform();
    } else if (event.touches.length === 1 && this._gesture.kind === "pan") {
      event.preventDefault();
      const dx = event.touches[0].clientX - this._gesture.startX;
      const dy = event.touches[0].clientY - this._gesture.startY;
      this._zoom.x = this._gesture.x + dx;
      this._zoom.y = this._gesture.y + dy;
      this._gesture.moved = Math.abs(dx) + Math.abs(dy) > 6;
      this.applyTransform();
    }
  }

  touchEnd(event) {
    if (event.touches.length > 0) return;
    const gesture = this._gesture;
    if (!gesture) return;
    if (gesture.kind === "pinch") {
      const now = performance.now();
      if (!gesture.moved && now - gesture.started < 280) {
        if (now - this._lastTwoTap < 380) {
          this.resetZoom();
          this._lastTwoTap = 0;
        } else {
          this._lastTwoTap = now;
        }
      } else if (this._zoom.scale >= 0.97 && this._zoom.scale <= 1.03) {
        this._lastTwoTap = 0;
        this.resetZoom();
      } else {
        this._lastTwoTap = 0;
        this.saveZoom();
      }
      this._suppressClicksUntil = Date.now() + 500;
    } else {
      this.saveZoom();
      if (gesture.moved) this._suppressClicksUntil = Date.now() + 350;
    }
    this._gesture = null;
  }

  resetZoom() {
    this._zoom = { scale: 1, x: 0, y: 0 };
    this._viewport?.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    this.applyTransform();
    this.saveZoom();
    this._zoomToast?.classList.add("show");
    window.clearTimeout(this._zoomToastTimer);
    this._zoomToastTimer = window.setTimeout(() => this._zoomToast?.classList.remove("show"), 1100);
  }

  saveZoom() {
    try {
      localStorage.setItem(ZOOM_KEY, JSON.stringify(this._zoom));
    } catch (_error) {
      // The active transform still works when storage is unavailable.
    }
  }

  applyTransform() {
    if (!this._viewport || !this._canvas) return;
    const scale = this._zoom.scale;
    const viewportWidth = Math.max(1, this._viewport.clientWidth);
    const viewportHeight = Math.max(1, this._viewport.clientHeight);
    const contentWidth = Math.max(1, this._canvas.offsetWidth);
    const contentHeight = Math.max(1, this._canvas.scrollHeight);
    const scaledWidth = contentWidth * scale;
    const scaledHeight = contentHeight * scale;

    if (Math.abs(scale - 1) < 0.001) {
      this._zoom = { scale: 1, x: 0, y: 0 };
    } else {
      this._zoom.x = scaledWidth <= viewportWidth
        ? (viewportWidth - scaledWidth) / 2
        : Math.min(0, Math.max(viewportWidth - scaledWidth, this._zoom.x));
      this._zoom.y = scaledHeight <= viewportHeight
        ? 0
        : Math.min(0, Math.max(viewportHeight - scaledHeight, this._zoom.y));
    }

    this._viewport.classList.toggle("zoomed", this._zoom.scale > 1.03);
    this._canvas.style.transform = `translate3d(${this._zoom.x}px,${this._zoom.y}px,0) scale(${this._zoom.scale})`;
  }

  canPan() {
    if (!this._viewport || !this._canvas || this._zoom.scale <= 1.03) return false;
    return this._canvas.offsetWidth * this._zoom.scale > this._viewport.clientWidth + 1
      || this._canvas.scrollHeight * this._zoom.scale > this._viewport.clientHeight + 1;
  }

  touchCenter(touches) {
    const rect = this._viewport.getBoundingClientRect();
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2 - rect.left,
      y: (touches[0].clientY + touches[1].clientY) / 2 - rect.top,
    };
  }

  touchDistance(touches) {
    return Math.hypot(
      touches[1].clientX - touches[0].clientX,
      touches[1].clientY - touches[0].clientY,
    );
  }

  clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }
}

if (!customElements.get(ELEMENT_NAME)) customElements.define(ELEMENT_NAME, NikasAccessPanel);
