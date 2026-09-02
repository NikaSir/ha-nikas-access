function panelStyles() {
  return `
    :host{
      position:fixed;inset:0;z-index:1;display:block;min-width:0;min-height:0;
      overflow:hidden;overscroll-behavior:none;color:var(--primary-text-color,#15191d);
      background:var(--primary-background-color,#f4f6f8);
      font-family:var(--paper-font-body1_-_font-family,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif)
    }
    *{box-sizing:border-box}
    [hidden]{display:none!important}
    button{
      appearance:none;-webkit-appearance:none;font:inherit;touch-action:manipulation;
      -webkit-tap-highlight-color:transparent
    }
    .app{
      position:absolute;inset:0;display:grid;min-width:0;min-height:0;overflow:hidden;
      grid-template-rows:calc(62px + env(safe-area-inset-top,0px)) minmax(0,1fr)
        calc(70px + env(safe-area-inset-bottom,0px));
      background:var(--primary-background-color,#f4f6f8);overscroll-behavior:none
    }
    .navigation-proxy{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);pointer-events:none}
    .header{
      position:relative;z-index:20;min-width:0;padding:env(safe-area-inset-top,0px)
        max(12px,env(safe-area-inset-right,0px)) 0 max(12px,env(safe-area-inset-left,0px));
      display:grid;grid-template-columns:52px minmax(0,1fr) 52px;align-items:center;
      background:color-mix(in srgb,var(--primary-background-color,#f4f6f8) 97%,transparent);
      border-bottom:1px solid color-mix(in srgb,var(--divider-color,#dfe3e8) 70%,transparent);
      backdrop-filter:blur(18px) saturate(130%);-webkit-backdrop-filter:blur(18px) saturate(130%)
    }
    .shell-button{
      width:44px;height:44px;padding:0;border:1px solid color-mix(in srgb,var(--divider-color,#dfe3e8) 72%,transparent);
      border-radius:16px;background:var(--card-background-color,#fff);box-shadow:0 7px 20px rgba(23,45,76,.08);
      display:grid;place-items:center;color:var(--primary-text-color,#17191c);cursor:pointer
    }
    .shell-button.info{justify-self:end;color:var(--primary-color,#03a9d9)}
    .shell-button ha-icon{--mdc-icon-size:25px}
    .title-return{
      justify-self:center;min-width:min(294px,100%);max-width:100%;min-height:44px;padding:5px 14px;
      border:1px solid color-mix(in srgb,var(--primary-color,#03a9d9) 24%,var(--divider-color,#dfe3e8));
      border-radius:16px;background:color-mix(in srgb,var(--primary-color,#03a9d9) 5%,var(--card-background-color,#fff));
      box-shadow:0 5px 16px rgba(23,45,76,.06);color:inherit;display:grid;place-content:center;text-align:center;
      cursor:pointer;line-height:1.08
    }
    .title-return strong{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:22px;font-weight:800}
    .title-return small{display:block;font-size:13px;font-weight:600;color:var(--secondary-text-color,#68737d)}
    .title-return:active,.shell-button:active{transform:scale(.985)}
    .viewport{
      position:relative;z-index:1;min-width:0;min-height:0;overflow-y:auto;overflow-x:hidden;
      overscroll-behavior:none;touch-action:pan-y;background:var(--primary-background-color,#f4f6f8);
      -webkit-overflow-scrolling:touch;overflow-anchor:none
    }
    .viewport.zoomed{overflow:hidden;touch-action:none}
    .canvas{min-height:100%;padding:12px 10px 20px;transform-origin:0 0}
    .content{width:min(760px,100%);min-height:100%;margin:0 auto;display:flex;flex-direction:column;gap:11px}
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
    .return-home{
      width:100%;min-height:52px;padding:9px 14px;border:1px solid var(--divider-color,#dce1e6);border-radius:17px;
      background:var(--card-background-color,#fff);color:var(--primary-text-color,#15191d);display:flex;align-items:center;
      justify-content:center;gap:8px;font-size:16px;font-weight:800;cursor:pointer
    }
    .return-home ha-icon{--mdc-icon-size:23px;color:var(--primary-color,#2186d7)}
    .tabs{
      position:relative;z-index:20;min-width:0;min-height:0;padding:6px max(6px,env(safe-area-inset-right,0px))
        calc(6px + env(safe-area-inset-bottom,0px)) max(6px,env(safe-area-inset-left,0px));
      display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:2px;background:var(--card-background-color,#fff);
      border-top:1px solid var(--divider-color,#dfe3e8);box-shadow:0 -5px 22px rgba(23,45,76,.08)
    }
    .tabs button{
      min-width:0;min-height:52px;padding:5px 3px;border:0;border-radius:16px;background:transparent;
      color:var(--secondary-text-color,#68737d);display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:3px;font-weight:700;cursor:pointer
    }
    .tabs button ha-icon{--mdc-icon-size:28px}.tabs button small{font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
    .tabs button.active{color:var(--primary-color,#2186d7);background:color-mix(in srgb,var(--primary-color,#2186d7) 11%,transparent)}
    .tabs button:disabled{opacity:1;cursor:default}
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
    .intercom-card{border:1px solid var(--divider-color,#ddd);border-radius:20px;background:var(--card-background-color,#fff);padding:14px}
    .intercom-card h2{margin:0 0 4px}.intercom-card p{margin:0;color:var(--secondary-text-color,#68737d)}
    button:focus-visible{outline:2px solid var(--primary-color,#2186d7);outline-offset:2px}
    @media(max-width:640px){
      .gate-grid{grid-template-columns:1fr}.gate-card{padding:12px}.canvas{padding:10px 8px 18px}
    }
    @media(max-width:620px){.gate-grid{grid-template-columns:1fr}}
    @media(max-width:390px){
      .header{grid-template-columns:48px minmax(0,1fr) 48px;padding-inline:max(8px,env(safe-area-inset-left,0px))}
      .title-return{min-width:0;width:100%;padding-inline:7px}.title-return strong{font-size:20px}.title-return small{font-size:12px}
      .gate-heading h2{font-size:19px}.summary-copy strong{font-size:17px}
    }
    @media(max-height:720px){.canvas{padding-top:7px}.gate-card{gap:8px}.summary-card{min-height:64px}.status-row,.position-note{min-height:45px}.command{min-height:53px}}
  `;
}
