function renderGatesView() {
  return `
    <section class="panel-view" data-view-panel="gates" aria-labelledby="gates-title" hidden>
      <div class="view-heading">
        <span><small>Управление доступом</small><h1 id="gates-title">Ворота</h1></span>
        <ha-icon icon="mdi:gate"></ha-icon>
      </div>

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
    </section>`;
}
