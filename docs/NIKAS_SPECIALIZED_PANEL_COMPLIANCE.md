# NikaS Access — Shell v2.1 compliance

Runtime: `/dashboard-access-v1/home`  
Production bundle: `custom_components/nikas_access/frontend/nikas-access-panel.js`

| Requirement | Status |
| --- | --- |
| Host-bound root; no browser-window fixed shell | PASS |
| Header `60px` plus effective top safe area | PASS |
| One `minmax(0,1fr)` work viewport | PASS |
| Bottom Tab Bar `64px` plus effective bottom safe area | PASS |
| Work frame `1280px`; gutters `12 / 16 / 24px` | PASS |
| Four internal destinations only | PASS |
| Source-aware return; safe fallback House v13 | PASS |
| One-shot hand-off rejects missing, expired and future timestamps | PASS |
| Autonomous deterministic production bundle | PASS |
| Domain entities, state truth and command safeguards preserved | PASS |
| Phone portrait and landscape in a live Home Assistant host | PENDING USER ACCEPTANCE |
| Laptop with Home Assistant sidebar expanded and collapsed | PENDING USER ACCEPTANCE |

The pending rows are release observations, not assumed passes. They are completed
only after the merged HACS version is checked on the user's actual clients.
