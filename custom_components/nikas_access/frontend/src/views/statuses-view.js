function renderStatusesView() {
  return `
    <section class="panel-view active" data-view-panel="statuses" aria-labelledby="statuses-title">
      <div class="view-heading">
        <span><small>Главная</small><h1 id="statuses-title">Статусы</h1></span>
        <ha-icon icon="mdi:shield-home-outline"></ha-icon>
      </div>

      <section class="summary-card tone-red" data-status="access-summary" aria-live="polite">
        <span class="summary-icon"><ha-icon icon="mdi:shield-alert-outline"></ha-icon></span>
        <span class="summary-copy">
          <strong data-status-text>Есть точки без данных</strong>
          <small data-status-detail>Ожидание реестров Home Assistant</small>
        </span>
      </section>

      <div class="perimeter-grid">
        <article class="perimeter-card tone-red" data-status="perimeter-internal" aria-live="polite">
          <span class="perimeter-icon"><ha-icon icon="mdi:shield-alert-outline"></ha-icon></span>
          <span class="perimeter-copy">
            <small>Внутренний периметр</small>
            <strong data-status-text>Нет данных</strong>
            <em data-status-detail>Ожидание реестров Home Assistant</em>
          </span>
        </article>
        <article class="perimeter-card tone-red" data-status="perimeter-external" aria-live="polite">
          <span class="perimeter-icon"><ha-icon icon="mdi:shield-alert-outline"></ha-icon></span>
          <span class="perimeter-copy">
            <small>Внешний периметр</small>
            <strong data-status-text>Нет данных</strong>
            <em data-status-detail>Ожидание реестров Home Assistant</em>
          </span>
        </article>
        <article class="perimeter-card safety-card tone-red" data-status="safety" aria-live="assertive">
          <span class="perimeter-icon"><ha-icon icon="mdi:shield-alert-outline"></ha-icon></span>
          <span class="perimeter-copy">
            <small>Безопасность</small>
            <strong data-status-text>Нет данных</strong>
            <em data-status-detail>Ожидание реестров Home Assistant</em>
          </span>
        </article>
      </div>

      <p class="source-note">
        <ha-icon icon="mdi:label-outline"></ha-icon>
        Учитываются только действующие binary sensor с ярлыками периметров и безопасности. Unknown и unavailable всегда означают «Нет данных».
      </p>
    </section>`;
}
