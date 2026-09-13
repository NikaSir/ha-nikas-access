import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const classes = new Map();
const targets = [];
const node = {
  addEventListener() {},
  setAttribute() {},
  removeAttribute() {},
  querySelector() { return null; },
  style: { setProperty() {}, removeProperty() {} },
  dataset: {},
  classList: { toggle() {} },
};
const nodes = new Map();
const shadow = {
  innerHTML: "",
  append() {},
  appendChild() {},
  getElementById(id) {
    if (!nodes.has(id)) nodes.set(id, {...node});
    return nodes.get(id);
  },
  querySelector() { return node; },
  querySelectorAll() { return []; },
  addEventListener() {},
};
// Every historical source conflicts with the panel's hierarchical parent.
const storage = {
  getItem() { return "/dashboard-actions/home"; },
  setItem() {},
  removeItem() {},
};
const location = {
  origin: "https://ha.test",
  pathname: "/dashboard-access-v1/home",
  search: "?return_to=/dashboard-actions/home&from=/dashboard-infrastructure/overview",
  hash: "",
};
const history = {
  pushState(_state, _title, path) { targets.push(path); },
  back() { throw Error("History must not determine parent"); },
};
const context = vm.createContext({
  console, URL, URLSearchParams, history,
  HTMLElement: class { attachShadow() { this.shadowRoot = shadow; } },
  customElements: {
    get: name => classes.get(name),
    define: (name, constructor) => classes.set(name, constructor),
  },
  localStorage: storage,
  window: {
    location, history, localStorage: storage, sessionStorage: storage,
    dispatchEvent() {}, customCards: [],
  },
  document: {
    createElement() { return {...node}; },
    referrer: "https://ha.test/dashboard-infrastructure/overview",
  },
  CustomEvent: class {},
  Event: class {},
  // Rendering decoration may schedule work; telemetry is outside this fixture.
  fetch: () => new Promise(() => {}),
  requestAnimationFrame() {},
  setTimeout() {},
  clearTimeout() {},
  getComputedStyle: () => ({paddingTop: "0", paddingBottom: "0"}),
});
const source = new URL(
  "../custom_components/nikas_access/frontend/nikas-access-panel.js",
  import.meta.url,
);
vm.runInContext(fs.readFileSync(source, "utf8"), context);
const Panel = classes.get("nikas-access-panel");
const panel = new Panel();
panel.applyTransform = () => {};
panel.mountShell();
panel.activateControl({dataset: {returnHome: ""}, matches() { return false; }});
assert.deepEqual(
  targets,
  ["/home/overview"],
  "title must ignore query, stored routes, referrer and history",
);
console.log("title navigates exactly once to /home/overview");
