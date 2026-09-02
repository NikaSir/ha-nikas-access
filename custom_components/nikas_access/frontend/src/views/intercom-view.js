function renderIntercomView() {
  if (!INTERCOM_MODULE.enabled) return "";
  return `
    <section class="intercom-card" aria-label="Домофон">
      <h2>Домофон</h2>
      <p>Модуль ожидает подтверждённые сущности оборудования.</p>
    </section>`;
}
