function panelStyles() {
  return `
    .domain-content{width:min(760px,100%);min-height:100%;margin:0 auto;display:flex;flex-direction:column;gap:11px}
    .panel-view{display:flex;min-width:0;flex-direction:column;gap:11px}
    .panel-view.active{animation:view-in .16s ease-out}
    @keyframes view-in{from{opacity:.7;transform:translateY(3px)}to{opacity:1;transform:none}}
    .view-heading{min-height:45px;padding:0 4px;display:flex;align-items:center;justify-content:space-between;gap:12px}
    .view-heading>span{min-width:0}.view-heading small{display:block;color:var(--secondary-text-color,#68737d);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.055em}
    .view-heading h1{margin:1px 0 0;font-size:25px;line-height:1.1}.view-heading>ha-icon{--mdc-icon-size:31px;color:var(--primary-color,#2186d7)}
    .summary-card{
      min-height:72px;padding:11px 14px;border:1px solid var(--divider-color,#dce1e6);border-radius:20px;
      background:var(--card-background-color,#fff);box-shadow:0 7px 24px rgba(23,45,76,.07);
      display:grid;grid-template-columns:44px minmax(0,1fr);gap:11px;align-items:center
    }
    .summary-card>.summary-icon{
      width:44px;height:44px;border-radius:15px;display:grid;place-items:center;
      background:color-mix(in srgb,var(--summary-color,#87909a) 12%,transparent);
      color:var(--summary-color,#87909a)
    }
    .summary-card>.summary-icon ha-icon{--mdc-icon-size:27px}
    .summary-copy{min-width:0;display:grid;gap:2px}
    .summary-copy strong{font-size:18px;font-weight:800;line-height:1.15}
    .summary-copy small{color:var(--secondary-text-color,#68737d);font-size:13px;line-height:1.25}
    .tone-green{--summary-color:var(--success-color,#2e9f62)}
    .tone-yellow{--summary-color:#d49a00}
    .tone-red{--summary-color:var(--error-color,#d94141)}
    .tone-blue{--summary-color:var(--primary-color,#2186d7)}
    .tone-grey{--summary-color:#7b858f}
    .perimeter-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}
    .perimeter-card{
      min-width:0;min-height:150px;padding:16px;border:1px solid color-mix(in srgb,var(--summary-color,#7b858f) 26%,var(--divider-color,#ddd));
      border-radius:22px;background:color-mix(in srgb,var(--summary-color,#7b858f) 5%,var(--card-background-color,#fff));
      box-shadow:0 8px 25px rgba(23,45,76,.065);display:grid;grid-template-columns:50px minmax(0,1fr);gap:12px;align-items:center
    }
    .perimeter-card.safety-card{grid-column:1/-1;min-height:112px}
    .perimeter-icon{width:50px;height:50px;border-radius:17px;display:grid;place-items:center;background:color-mix(in srgb,var(--summary-color,#7b858f) 13%,transparent);color:var(--summary-color,#7b858f)}
    .perimeter-icon ha-icon{--mdc-icon-size:31px}.perimeter-copy{min-width:0;display:grid;gap:3px}
    .perimeter-copy small{font-size:12px;font-weight:700;color:var(--secondary-text-color,#68737d)}
    .perimeter-copy strong{font-size:23px;line-height:1.08}.perimeter-copy em{font-style:normal;font-size:12px;line-height:1.3;color:var(--secondary-text-color,#68737d)}
    .source-note{margin:0;padding:11px 13px;border-radius:16px;background:var(--secondary-background-color,#eef1f4);display:grid;grid-template-columns:24px minmax(0,1fr);gap:8px;align-items:start;color:var(--secondary-text-color,#68737d);font-size:12px;line-height:1.35}
    .source-note ha-icon{--mdc-icon-size:21px;color:var(--primary-color,#2186d7)}
    .error-banner{
      padding:11px 12px;border:1px solid color-mix(in srgb,var(--error-color,#d94141) 45%,var(--divider-color,#ddd));
      border-radius:16px;background:color-mix(in srgb,var(--error-color,#d94141) 9%,var(--card-background-color,#fff));
      display:grid;grid-template-columns:24px minmax(0,1fr) 34px;gap:8px;align-items:start;color:var(--error-color,#c93232)
    }
    .error-banner>ha-icon{--mdc-icon-size:22px;margin-top:1px}
    .error-banner strong,.error-banner small{display:block}
    .error-banner strong{font-size:14px}.error-banner small{margin-top:2px;font-size:12px;line-height:1.3}
    .error-banner button{width:34px;height:34px;padding:0;border:0;border-radius:11px;background:transparent;color:inherit}
    .gate-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;align-items:stretch}
    .gate-card{
      min-width:0;padding:14px;border:1px solid var(--divider-color,#dce1e6);border-radius:22px;
      background:var(--card-background-color,#fff);box-shadow:0 8px 25px rgba(23,45,76,.065);
      display:flex;flex-direction:column;gap:11px
    }
    .gate-heading{display:grid;grid-template-columns:48px minmax(0,1fr);gap:11px;align-items:center}
    .gate-visual{
      width:48px;height:48px;border-radius:16px;background:color-mix(in srgb,var(--primary-color,#2186d7) 10%,transparent);
      display:grid;place-items:center;color:var(--primary-color,#2186d7)
    }
    .gate-visual ha-icon{--mdc-icon-size:30px}
    .gate-heading h2{margin:0;font-size:20px;line-height:1.08}.gate-heading p{margin:3px 0 0;color:var(--secondary-text-color,#68737d);font-size:12px}
    .status-list{display:grid;gap:7px}
    .status-row{
      width:100%;min-height:49px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--summary-color,#7b858f) 25%,var(--divider-color,#ddd));
      border-radius:15px;background:color-mix(in srgb,var(--summary-color,#7b858f) 6%,var(--card-background-color,#fff));
      color:inherit;display:grid;grid-template-columns:28px minmax(0,1fr);gap:8px;align-items:center;text-align:left
    }
    .status-row>ha-icon{--mdc-icon-size:22px;color:var(--summary-color,#7b858f)}
    .status-row span{min-width:0;display:grid;gap:1px}.status-row small{font-size:11px;color:var(--secondary-text-color,#68737d)}
    .status-row strong{font-size:14px;line-height:1.15;overflow:hidden;text-overflow:ellipsis}
    .position-note{
      min-height:49px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--primary-color,#2186d7) 25%,var(--divider-color,#ddd));
      border-radius:15px;background:color-mix(in srgb,var(--primary-color,#2186d7) 6%,var(--card-background-color,#fff));
      display:grid;grid-template-columns:28px minmax(0,1fr);gap:8px;align-items:center
    }
    .position-note ha-icon{--mdc-icon-size:22px;color:var(--primary-color,#2186d7)}
    .position-note small,.position-note strong{display:block}.position-note small{font-size:11px;color:var(--secondary-text-color,#68737d)}
    .position-note strong{font-size:14px;line-height:1.15}
    .command-label{margin-top:auto;padding-top:1px;color:var(--secondary-text-color,#68737d);font-size:11px;text-align:center}
    .command-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
    .command{
      min-width:0;min-height:58px;padding:7px 3px;border:1px solid color-mix(in srgb,var(--primary-color,#2186d7) 30%,var(--divider-color,#ddd));
      border-radius:16px;background:color-mix(in srgb,var(--primary-color,#2186d7) 7%,var(--card-background-color,#fff));
      color:var(--primary-text-color,#15191d);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
      font-size:12px;font-weight:800;cursor:pointer
    }
    .command ha-icon{--mdc-icon-size:24px;color:var(--primary-color,#2186d7)}
    .command.stop{border-color:color-mix(in srgb,var(--warning-color,#ef8f22) 38%,var(--divider-color,#ddd));background:color-mix(in srgb,var(--warning-color,#ef8f22) 8%,var(--card-background-color,#fff))}
    .command.stop ha-icon{color:var(--warning-color,#ef8f22)}
    .command:disabled{opacity:.42;filter:grayscale(.35);cursor:not-allowed}
    .command:active:not(:disabled){transform:scale(.97)}
    .empty-state{padding:24px 18px;border:1px solid var(--divider-color,#dce1e6);border-radius:22px;background:var(--card-background-color,#fff);box-shadow:0 8px 25px rgba(23,45,76,.065);text-align:center}
    .empty-icon{width:64px;height:64px;margin:0 auto 12px;border-radius:22px;background:color-mix(in srgb,var(--primary-color,#2186d7) 10%,transparent);color:var(--primary-color,#2186d7);display:grid;place-items:center}
    .empty-icon ha-icon{--mdc-icon-size:37px}.empty-state h2{margin:0;font-size:21px}.empty-state p{max-width:520px;margin:7px auto 0;color:var(--secondary-text-color,#68737d);font-size:13px;line-height:1.4}
    .capability-card,.diagnostic-card{padding:14px;border:1px solid var(--divider-color,#dce1e6);border-radius:20px;background:var(--card-background-color,#fff);box-shadow:0 7px 22px rgba(23,45,76,.055)}
    .capability-card h2,.diagnostic-card h2{margin:0 0 10px;font-size:17px}
    .capability-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
    .capability-list span{min-height:43px;padding:8px 10px;border-radius:14px;background:var(--secondary-background-color,#eef1f4);display:grid;grid-template-columns:25px minmax(0,1fr);gap:7px;align-items:center;font-size:12px;font-weight:700}
    .capability-list ha-icon{--mdc-icon-size:21px;color:var(--primary-color,#2186d7)}
    .diagnostic-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    .diagnostic-meta span{min-width:0;padding:10px 12px;border:1px solid var(--divider-color,#dce1e6);border-radius:15px;background:var(--card-background-color,#fff);display:grid;gap:2px}
    .diagnostic-meta small{color:var(--secondary-text-color,#68737d);font-size:10px;text-transform:uppercase;letter-spacing:.04em}.diagnostic-meta strong{font-size:12px;overflow-wrap:anywhere}
    .diagnostic-note{margin:-3px 0 11px;color:var(--secondary-text-color,#68737d);font-size:12px;line-height:1.35}
    .perimeter-device-group{display:grid;gap:8px;padding-top:11px;border-top:1px solid var(--divider-color,#dce1e6)}
    .perimeter-device-group+.perimeter-device-group{margin-top:13px}
    .perimeter-device-group-heading{display:grid;grid-template-columns:34px minmax(0,1fr);gap:8px;align-items:center}
    .perimeter-device-group-heading>ha-icon{--mdc-icon-size:26px;color:var(--primary-color,#2186d7)}
    .perimeter-device-group-heading span{min-width:0;display:grid;gap:1px}.perimeter-device-group-heading strong{font-size:15px}.perimeter-device-group-heading small{font-size:12px;color:var(--secondary-text-color,#68737d)}
    .perimeter-device-list{display:grid;gap:8px}.empty-diagnostic{margin:0;padding:11px;border-radius:14px;background:var(--secondary-background-color,#eef1f4);color:var(--secondary-text-color,#68737d);font-size:12px;line-height:1.35}
    .perimeter-device{padding:10px;border:1px solid var(--divider-color,#dce1e6);border-radius:16px;background:color-mix(in srgb,var(--secondary-background-color,#eef1f4) 45%,var(--card-background-color,#fff));display:grid;gap:8px}
    .perimeter-device-heading{display:grid;grid-template-columns:30px minmax(0,1fr);gap:8px;align-items:center}
    .perimeter-device-heading>ha-icon{--mdc-icon-size:23px;color:var(--primary-color,#2186d7)}
    .perimeter-device-heading span{min-width:0;display:grid;gap:1px}.perimeter-device-heading strong{font-size:14px;line-height:1.2}.perimeter-device-heading small{font-size:12px;color:var(--secondary-text-color,#68737d)}
    .perimeter-source-list{display:grid;gap:6px}
    .perimeter-source{width:100%;min-width:0;min-height:54px;padding:8px;border:1px solid color-mix(in srgb,var(--summary-color,#7b858f) 25%,var(--divider-color,#ddd));border-radius:13px;background:color-mix(in srgb,var(--summary-color,#7b858f) 5%,var(--card-background-color,#fff));color:inherit;display:grid;grid-template-columns:26px minmax(0,1fr) auto;gap:7px;align-items:center;text-align:left;cursor:pointer}
    .perimeter-source>ha-icon{--mdc-icon-size:21px;color:var(--summary-color,#7b858f)}.perimeter-source>span{min-width:0;display:grid;gap:2px}.perimeter-source strong{font-size:13px;line-height:1.2}.perimeter-source code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:var(--secondary-text-color,#68737d);overflow-wrap:anywhere}.perimeter-source em{font-style:normal;font-size:12px;font-weight:800;color:var(--summary-color,#7b858f);white-space:nowrap}
    .modal{
      position:absolute;inset:0;z-index:60;padding:calc(18px + env(safe-area-inset-top,0px)) 16px calc(18px + env(safe-area-inset-bottom,0px));
      background:rgba(13,18,23,.48);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);
      display:grid;place-items:center
    }
    .dialog{
      width:min(390px,100%);padding:18px;border-radius:24px;background:var(--card-background-color,#fff);
      box-shadow:0 24px 70px rgba(0,0,0,.28);display:grid;gap:12px
    }
    .dialog-icon{width:50px;height:50px;border-radius:17px;display:grid;place-items:center;background:color-mix(in srgb,var(--warning-color,#ef8f22) 12%,transparent);color:var(--warning-color,#ef8f22);margin:0 auto}
    .dialog-icon ha-icon{--mdc-icon-size:30px}.dialog h2{margin:0;text-align:center;font-size:21px}.dialog p{margin:0;text-align:center;line-height:1.35}
    .dialog .safety{padding:9px;border-radius:13px;background:var(--secondary-background-color,#eef1f4);font-size:12px;color:var(--secondary-text-color,#68737d)}
    .dialog-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:2px}
    .dialog-actions button{min-height:48px;border-radius:15px;font-weight:800;cursor:pointer}
    .dialog-cancel{border:1px solid var(--divider-color,#ddd);background:transparent;color:inherit}
    .dialog-confirm{border:1px solid var(--primary-color,#2186d7);background:var(--primary-color,#2186d7);color:#fff}
    .dialog-confirm:disabled{opacity:.5;cursor:wait}
    .zoom-toast,.command-toast{
      position:absolute;z-index:70;left:50%;transform:translate(-50%,-12px);opacity:0;pointer-events:none;
      padding:8px 13px;border-radius:999px;background:rgba(30,34,38,.92);color:#fff;font-size:12px;
      transition:opacity .2s,transform .2s;max-width:calc(100% - 28px);text-align:center
    }
    .zoom-toast{top:calc(68px + env(safe-area-inset-top,0px))}.command-toast{bottom:calc(78px + env(safe-area-inset-bottom,0px))}
    .zoom-toast.show,.command-toast.show{opacity:1;transform:translate(-50%,0)}
    button:focus-visible{outline:2px solid var(--primary-color,#2186d7);outline-offset:2px}
    @media(max-width:640px){
      .gate-grid,.perimeter-grid{grid-template-columns:1fr}.gate-card{padding:12px}
    }
    @media(max-width:620px){.gate-grid{grid-template-columns:1fr}}
    @media(max-width:390px){
      .gate-heading h2{font-size:19px}.summary-copy strong{font-size:17px}.view-heading h1{font-size:23px}
      .capability-list,.diagnostic-meta{grid-template-columns:1fr}
    }
    @media(max-height:720px){.gate-card{gap:8px}.summary-card{min-height:64px}.status-row,.position-note{min-height:45px}.command{min-height:53px}}
  `;
}
