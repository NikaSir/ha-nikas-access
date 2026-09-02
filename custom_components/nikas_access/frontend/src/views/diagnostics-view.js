function renderDiagnosticsView() {
  return `
    <section class="panel-view" data-view-panel="diagnostics" aria-labelledby="diagnostics-title" hidden>
      <div class="view-heading">
        <span><small>Источники и готовность</small><h1 id="diagnostics-title">Диагностика</h1></span>
        <button class="inline-refresh" type="button" data-registry-retry aria-label="Обновить реестры Home Assistant">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </button>
      </div>

      <section class="diagnostic-card">
        <h2>Периметры</h2>
        <div class="status-list">
          <div class="status-row tone-red" data-status="registry-status">
            <ha-icon icon="mdi:database-alert-outline"></ha-icon>
            <span><small>Реестры Home Assistant</small><strong data-status-text>Ожидание соединения</strong></span>
          </div>
          <div class="status-row tone-red" data-status="diagnostic-internal">
            <ha-icon icon="mdi:shield-alert-outline"></ha-icon>
            <span><small>Внутренний периметр</small><strong data-status-text>Нет данных</strong></span>
          </div>
          <div class="status-row tone-red" data-status="diagnostic-external">
            <ha-icon icon="mdi:shield-alert-outline"></ha-icon>
            <span><small>Внешний периметр</small><strong data-status-text>Нет данных</strong></span>
          </div>
        </div>
      </section>

      <section class="diagnostic-card">
        <h2>Ворота</h2>
        <div class="status-list">
          <button class="status-row tone-red" type="button" data-status="diagnostic-sectional-position" data-entity="${SECTIONAL_POSITION_ENTITY}">
            <ha-icon icon="mdi:garage-alert-variant"></ha-icon>
            <span><small>Датчик секционных ворот</small><strong data-status-text>Нет данных</strong></span>
          </button>
          <button class="status-row tone-red" type="button" data-status="diagnostic-sectional-control" data-entity="${SECTIONAL_CONTROL_ENTITY}">
            <ha-icon icon="mdi:lan-disconnect"></ha-icon>
            <span><small>Управление секционными воротами</small><strong data-status-text>Нет данных управления</strong></span>
          </button>
          <button class="status-row tone-red" type="button" data-status="diagnostic-swing-control" data-entity="${SWING_CONTROL_ENTITY}">
            <ha-icon icon="mdi:lan-disconnect"></ha-icon>
            <span><small>Управление распашными воротами</small><strong data-status-text>Нет данных управления</strong></span>
          </button>
        </div>
      </section>

      <section class="diagnostic-meta">
        <span><small>Версия</small><strong>${UI_VERSION}</strong></span>
        <span><small>Маршрут</small><strong>${ROOT_PATH}</strong></span>
        <span><small>Команды</small><strong>Подтверждение + блокировка</strong></span>
        <span><small>Домофон</small><strong>Ожидает сущности</strong></span>
      </section>
    </section>`;
}
