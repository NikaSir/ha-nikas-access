function renderDiagnosticsView() {
  return `
    <section class="panel-view" data-view-panel="diagnostics" aria-labelledby="diagnostics-title" hidden>
      <div class="view-heading">
        <span><small>Источники и готовность</small><h1 id="diagnostics-title">Диагностика</h1></span>
        <ha-icon icon="mdi:stethoscope"></ha-icon>
      </div>

      <section class="diagnostic-card">
        <h2>Контрольные группы</h2>
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
          <div class="status-row tone-red" data-status="diagnostic-safety">
            <ha-icon icon="mdi:shield-alert-outline"></ha-icon>
            <span><small>Безопасность</small><strong data-status-text>Нет данных</strong></span>
          </div>
        </div>
      </section>

      <section class="diagnostic-card perimeter-inventory-card">
        <h2>Устройства контроля</h2>
        <p class="diagnostic-note">Показаны устройства и датчики, которые фактически входят в расчёт статусов.</p>
        <section class="perimeter-device-group" aria-labelledby="diagnostic-internal-devices-title">
          <div class="perimeter-device-group-heading">
            <ha-icon icon="mdi:shield-home-outline"></ha-icon>
            <span>
              <strong id="diagnostic-internal-devices-title">Внутренний периметр</strong>
              <small data-perimeter-device-count="internal">Устройств: 0 · датчиков: 0</small>
            </span>
          </div>
          <div class="perimeter-device-list" data-perimeter-device-list="internal">
            <p class="empty-diagnostic">Ожидание реестров Home Assistant</p>
          </div>
        </section>
        <section class="perimeter-device-group" aria-labelledby="diagnostic-external-devices-title">
          <div class="perimeter-device-group-heading">
            <ha-icon icon="mdi:shield-lock-outline"></ha-icon>
            <span>
              <strong id="diagnostic-external-devices-title">Внешний периметр</strong>
              <small data-perimeter-device-count="external">Устройств: 0 · датчиков: 0</small>
            </span>
          </div>
          <div class="perimeter-device-list" data-perimeter-device-list="external">
            <p class="empty-diagnostic">Ожидание реестров Home Assistant</p>
          </div>
        </section>
        <section class="perimeter-device-group" aria-labelledby="diagnostic-safety-devices-title">
          <div class="perimeter-device-group-heading">
            <ha-icon icon="mdi:shield-alert-outline"></ha-icon>
            <span>
              <strong id="diagnostic-safety-devices-title">Безопасность</strong>
              <small data-perimeter-device-count="safety">Устройств: 0 · датчиков: 0</small>
            </span>
          </div>
          <div class="perimeter-device-list" data-perimeter-device-list="safety">
            <p class="empty-diagnostic">Ожидание реестров Home Assistant</p>
          </div>
        </section>
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
