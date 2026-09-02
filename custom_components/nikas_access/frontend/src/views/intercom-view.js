function renderIntercomView() {
  return `
    <section class="panel-view" data-view-panel="intercom" aria-labelledby="intercom-title" hidden>
      <div class="view-heading">
        <span><small>Подготовленный модуль</small><h1 id="intercom-title">Домофон</h1></span>
        <ha-icon icon="mdi:doorbell-video"></ha-icon>
      </div>
      <article class="empty-state">
        <span class="empty-icon"><ha-icon icon="mdi:doorbell-video"></ha-icon></span>
        <h2>Оборудование ещё не подключено</h2>
        <p>Сущности домофона не назначены. Панель не отправляет команды и не подставляет предполагаемые entity ID.</p>
      </article>
      <section class="capability-card" aria-label="Возможности будущего домофона">
        <h2>Подготовленные возможности</h2>
        <div class="capability-list">
          <span><ha-icon icon="mdi:lan-connect"></ha-icon>Состояние связи</span>
          <span><ha-icon icon="mdi:phone-ring-outline"></ha-icon>Входящий вызов</span>
          <span><ha-icon icon="mdi:cctv"></ha-icon>Просмотр камеры</span>
          <span><ha-icon icon="mdi:door-open"></ha-icon>Открытие калитки или двери</span>
          <span><ha-icon icon="mdi:history"></ha-icon>История событий</span>
        </div>
      </section>
    </section>`;
}
