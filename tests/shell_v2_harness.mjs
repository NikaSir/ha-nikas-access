import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { runInNewContext } from "node:vm";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(
  join(root, "custom_components", "nikas_access", "frontend", "src", "shell-v2.js"),
  "utf8",
);

class MemoryStorage {
  constructor() {
    this.values = new Map();
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

function shellContext(path = "/dashboard-access-v1/home", search = "") {
  const sessionStorage = new MemoryStorage();
  const localStorage = new MemoryStorage();
  const pushes = [];
  const events = [];
  const context = {
    URL,
    URLSearchParams,
    Date,
    Event: class Event {
      constructor(type) {
        this.type = type;
      }
    },
    document: { referrer: "" },
    window: {
      location: {
        origin: "https://ha.local",
        pathname: path,
        search,
        hash: "",
      },
      sessionStorage,
      localStorage,
      history: { pushState: (_state, _title, value) => pushes.push(value) },
      dispatchEvent: (event) => events.push(event.type),
    },
  };
  runInNewContext(`${source}\n;globalThis.shellApi = {
    normalizeNikasBaseRoute,
    consumeNikasSourceHandoff,
    captureNikasShellReturnRoute,
    rememberNikasSpecializedSourceRoute,
    navigateNikasShell,
  };`, context);
  return { ...context, api: context.shellApi, sessionStorage, localStorage, pushes, events };
}

{
  const { api } = shellContext();
  assert.equal(api.normalizeNikasBaseRoute("/dashboard-house-v13/detail"), "/dashboard-house-v13/home");
  assert.equal(api.normalizeNikasBaseRoute("/dashboard-rooms-v11/greenhouse"), "/dashboard-rooms-v11/rooms");
  assert.equal(api.normalizeNikasBaseRoute("https://ha.local/dashboard-actions/lights"), "/dashboard-actions/home");
  assert.equal(api.normalizeNikasBaseRoute("https://example.com/dashboard-actions/home"), null);
  assert.equal(api.normalizeNikasBaseRoute("/dashboard-house-v12/home"), null);
}

{
  const { api, sessionStorage } = shellContext();
  const now = Date.now();
  sessionStorage.setItem("nikas.specialized.source_route.v1", "/dashboard-rooms-v11/greenhouse");
  sessionStorage.setItem("nikas.specialized.source_route_at.v1", String(now));
  assert.equal(api.consumeNikasSourceHandoff(now), "/dashboard-rooms-v11/rooms");
  assert.equal(sessionStorage.getItem("nikas.specialized.source_route.v1"), null);
  assert.equal(sessionStorage.getItem("nikas.specialized.source_route_at.v1"), null);
}

{
  const { api, sessionStorage } = shellContext();
  const now = Date.now();
  sessionStorage.setItem("nikas.specialized.source_route.v1", "/dashboard-house-v13/home");
  sessionStorage.setItem("nikas.specialized.source_route_at.v1", String(now + 1));
  assert.equal(api.consumeNikasSourceHandoff(now), null);
}

{
  const { api, localStorage } = shellContext(
    "/dashboard-access-v1/home",
    "?return_to=https%3A%2F%2Fexample.com%2Fbad&from=%2Fdashboard-actions%2Flight",
  );
  const route = api.captureNikasShellReturnRoute({
    panelId: "access",
    parentRoute: "/dashboard-house-v13/home",
    safeReturnRoute: "/dashboard-house-v13/home",
  });
  assert.equal(route, "/dashboard-actions/home");
  assert.equal(localStorage.getItem("nikas.access.return_route.v1"), "/dashboard-actions/home");
}

{
  const { api, sessionStorage, pushes, events } = shellContext("/dashboard-rooms-v11/greenhouse");
  assert.equal(api.navigateNikasShell("/dashboard-access-v1/home", { captureSource: true }), true);
  assert.equal(sessionStorage.getItem("nikas.specialized.source_route.v1"), "/dashboard-rooms-v11/rooms");
  assert.equal(pushes.at(-1), "/dashboard-access-v1/home");
  assert.equal(events.at(-1), "location-changed");
}

console.log("Shell v2 navigation harness passed");
