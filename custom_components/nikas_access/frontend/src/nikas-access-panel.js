class NikasAccessPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._panel = null;
    this._mounted = false;
    this._stateFrame = null;
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
    this._navigationProxy = null;
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
    if (this._mounted) this.scheduleStatePatch();
  }

  connectedCallback() {
    this.mountShell();
    if (window.location.pathname === PANEL_ROOT) {
      window.history.replaceState(null, "", ROOT_PATH);
    }
    window.addEventListener("resize", this._onResize, { passive: true });
    window.visualViewport?.addEventListener?.("resize", this._onResize, { passive: true });
    window.addEventListener("keydown", this._onKeyDown);
    this.scheduleStatePatch();
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this._onResize);
    window.visualViewport?.removeEventListener?.("resize", this._onResize);
    window.removeEventListener("keydown", this._onKeyDown);
    if (this._stateFrame !== null) window.cancelAnimationFrame(this._stateFrame);
    window.clearTimeout(this._unlockTimer);
    window.clearTimeout(this._toastTimer);
    window.clearTimeout(this._zoomToastTimer);
    this._stateFrame = null;
  }

  mountShell() {
    if (this._mounted) return;
    this._mounted = true;
    this.shadowRoot.innerHTML = `
      <style>${panelStyles()}</style>
      <div class="app">
        <header class="header">
          <button class="shell-button menu" type="button" aria-label="Меню Home Assistant">
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>
          <button class="title-return" type="button" data-path="${HOME_PATH}" aria-label="Контроль доступа — вернуться в панель Дом">
            <strong>Контроль доступа</strong>
            <small>v${UI_VERSION}</small>
          </button>
          <button class="shell-button info" type="button" data-entity="${SECTIONAL_POSITION_ENTITY}" aria-label="Открыть сведения о датчике секционных ворот">
            <ha-icon icon="mdi:information-outline"></ha-icon>
          </button>
        </header>

        <main class="viewport" id="viewport">
          <section class="canvas" id="canvas">
            <div class="content">
              <section class="summary-card tone-red" data-status="access-summary" aria-live="polite">
                <span class="summary-icon"><ha-icon icon="mdi:shield-alert-outline"></ha-icon></span>
                <span class="summary-copy">
                  <strong data-status-text>Есть точки без данных</strong>
                  <small data-status-detail>Ожидание данных Home Assistant</small>
                </span>
              </section>

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

              <div class="gate-grid">
                <article class="gate-card" data-gate="sectional">
                  <div class="gate-heading">
                    <span class="gate-visual"><ha-icon icon="mdi:garage-variant"></ha-icon></span>
                    <span><h2>Секционные ворота</h2><p>Положение — только по датчику</p></span>
                  </div>
                  <div class="status-list">
                    <button class="status-row tone-red" type="button" data-status="sectional-position" data-entity="${SECTIONAL_POSITION_ENTITY}">
                      <ha-icon icon="mdi:garage-alert-variant"></ha-icon>
                      <span><small>Физическое положение</small><strong data-status-text>Нет данных</strong></span>
                    </button>
                    <button class="status-row tone-red" type="button" data-status="sectional-control" data-entity="${SECTIONAL_CONTROL_ENTITY}">
                      <ha-icon icon="mdi:lan-disconnect"></ha-icon>
                      <span><small>Канал управления</small><strong data-status-text>Нет данных управления</strong></span>
                    </button>
                  </div>
                  <div class="command-label">Каждая команда требует подтверждения</div>
                  <div class="command-grid" aria-label="Команды секционных ворот">
                    <button class="command" type="button" data-command="sectional:open" disabled>
                      <ha-icon icon="mdi:arrow-up-bold"></ha-icon><span>Открыть</span>
                    </button>
                    <button class="command stop" type="button" data-command="sectional:stop" disabled>
                      <ha-icon icon="mdi:stop-circle-outline"></ha-icon><span>Стоп</span>
                    </button>
                    <button class="command" type="button" data-command="sectional:close" disabled>
                      <ha-icon icon="mdi:arrow-down-bold"></ha-icon><span>Закрыть</span>
                    </button>
                  </div>
                </article>

                <article class="gate-card" data-gate="swing">
                  <div class="gate-heading">
                    <span class="gate-visual"><ha-icon icon="mdi:gate"></ha-icon></span>
                    <span><h2>Распашные ворота</h2><p>Физического датчика нет</p></span>
                  </div>
                  <div class="status-list">
                    <div class="position-note">
                      <ha-icon icon="mdi:eye-off-outline"></ha-icon>
                      <span><small>Физическое положение</small><strong>Положение не контролируется</strong></span>
                    </div>
                    <button class="status-row tone-red" type="button" data-status="swing-control" data-entity="${SWING_CONTROL_ENTITY}">
                      <ha-icon icon="mdi:lan-disconnect"></ha-icon>
                      <span><small>Канал управления</small><strong data-status-text>Нет данных управления</strong></span>
                    </button>
                  </div>
                  <div class="command-label">Каждая команда требует подтверждения</div>
                  <div class="command-grid" aria-label="Команды распашных ворот">
                    <button class="command" type="button" data-command="swing:open" disabled>
                      <ha-icon icon="mdi:gate-arrow-right"></ha-icon><span>Открыть</span>
                    </button>
                    <button class="command stop" type="button" data-command="swing:stop" disabled>
                      <ha-icon icon="mdi:stop-circle-outline"></ha-icon><span>Стоп</span>
                    </button>
                    <button class="command" type="button" data-command="swing:close" disabled>
                      <ha-icon icon="mdi:gate-arrow-left"></ha-icon><span>Закрыть</span>
                    </button>
                  </div>
                </article>
              </div>

              ${INTERCOM_MODULE.enabled ? renderIntercomView() : ""}

              <button class="return-home" type="button" data-path="${HOME_PATH}">
                <ha-icon icon="mdi:home-import-outline"></ha-icon>
                <span>Вернуться в панель «Дом»</span>
              </button>
            </div>
          </section>
        </main>

        <nav class="tabs" aria-label="Основные панели NikaS">
          <button type="button" data-path="${HOME_PATH}" aria-label="Дом">
            <ha-icon icon="mdi:home-outline"></ha-icon><small>Дом</small>
          </button>
          <button type="button" class="active" aria-current="page" aria-label="Доступ" disabled>
            <ha-icon icon="mdi:gate"></ha-icon><small>Доступ</small>
          </button>
          <button type="button" data-path="/dashboard-actions/home" aria-label="Действия">
            <ha-icon icon="mdi:lightning-bolt-outline"></ha-icon><small>Действия</small>
          </button>
          <button type="button" data-path="/dashboard-infrastructure/overview" aria-label="Инфраструктура">
            <ha-icon icon="mdi:server-network"></ha-icon><small>Инфра</small>
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

        <a class="navigation-proxy" id="navigation-proxy" href="${ROOT_PATH}" tabindex="-1" aria-hidden="true"></a>
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
    this._navigationProxy = this.shadowRoot.getElementById("navigation-proxy");

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
    if (button.dataset?.path) {
      this.navigate(button.dataset.path);
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
    this.patchStatus("access-summary", accessSummaryModel(this._hass));
    this.patchStatus("sectional-position", sectionalPositionModel(this._hass));
    this.patchStatus("sectional-control", gateControlModel(this._hass, GATES.sectional));
    this.patchStatus("swing-control", gateControlModel(this._hass, GATES.swing));
    this.patchCommandLocks();
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

  navigate(path) {
    if (!path || !path.startsWith("/")) return;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (current === path) return;
    const anchor = this._navigationProxy || this.shadowRoot?.getElementById("navigation-proxy");
    if (!anchor) {
      window.location.assign(path);
      return;
    }
    anchor.href = path;
    anchor.click();
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
