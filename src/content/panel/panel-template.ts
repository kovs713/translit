export const PANEL_TEMPLATE = `
  <style>
    :host { all: initial; }
    * { box-sizing: border-box; }
    .panel {
      width: 100%;
      overflow: hidden;
      color: #f8edd2;
      background:
        radial-gradient(circle at 0 0, rgba(255, 184, 77, 0.28), transparent 34%),
        linear-gradient(145deg, rgba(27, 25, 20, 0.98), rgba(7, 8, 8, 0.98));
      border: 1px solid rgba(255, 190, 89, 0.72);
      border-radius: 18px;
      box-shadow: 0 22px 70px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      font-family: ui-monospace, "Cascadia Code", "JetBrains Mono", "SFMono-Regular", monospace;
      letter-spacing: -0.02em;
    }
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 12px 10px 14px;
      cursor: grab;
      user-select: none;
      background: repeating-linear-gradient(135deg, rgba(255, 184, 77, 0.12) 0 8px, transparent 8px 16px);
    }
    .bar:active { cursor: grabbing; }
    .kicker {
      color: #ffbf5f;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .title {
      margin-top: 2px;
      color: #fff9e8;
      font-size: 18px;
      font-weight: 900;
      line-height: 1;
    }
    .body {
      display: grid;
      gap: 12px;
      padding: 12px 14px 14px;
    }
    button {
      appearance: none;
      border: 1px solid rgba(255, 218, 151, 0.34);
      border-radius: 999px;
      color: #f8edd2;
      background: rgba(255, 255, 255, 0.08);
      cursor: pointer;
      font: inherit;
      font-size: 11px;
      font-weight: 800;
      padding: 7px 10px;
    }
    button:hover { background: rgba(255, 190, 89, 0.18); }
    .switch {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 14px;
      background: rgba(0, 0, 0, 0.18);
    }
    .switch strong {
      display: block;
      color: #fff9e8;
      font-size: 13px;
    }
    .switch span {
      color: rgba(248, 237, 210, 0.62);
      font-size: 11px;
    }
    .toggle {
      position: relative;
      width: 48px;
      height: 28px;
      flex: 0 0 auto;
    }
    .toggle input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }
    .track {
      position: absolute;
      inset: 0;
      border-radius: 999px;
      background: #3c362b;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
      transition: background 140ms ease;
    }
    .track::after {
      content: "";
      position: absolute;
      top: 4px;
      left: 4px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #f8edd2;
      box-shadow: 0 5px 14px rgba(0, 0, 0, 0.35);
      transition: transform 140ms ease;
    }
    .toggle input:checked + .track { background: #d98517; }
    .toggle input:checked + .track::after { transform: translateX(20px); }
    .map-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .label {
      color: rgba(248, 237, 210, 0.72);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }
    textarea {
      width: 100%;
      min-height: 192px;
      resize: vertical;
      border: 1px solid rgba(255, 218, 151, 0.2);
      border-radius: 14px;
      outline: none;
      color: #fff9e8;
      background: rgba(0, 0, 0, 0.32);
      font: 12px/1.48 ui-monospace, "Cascadia Code", "JetBrains Mono", "SFMono-Regular", monospace;
      padding: 10px;
    }
    textarea:focus {
      border-color: rgba(255, 190, 89, 0.78);
      box-shadow: 0 0 0 3px rgba(217, 133, 23, 0.18);
    }
    .hint {
      color: rgba(248, 237, 210, 0.58);
      font-size: 11px;
      line-height: 1.35;
    }
    .status {
      color: #ffbf5f;
      font-size: 11px;
      font-weight: 900;
    }
  </style>
  <section class="panel" aria-label="Cyrillic input translit panel">
    <header class="bar" data-drag-handle>
      <div>
        <div class="kicker">input rewrite</div>
        <div class="title">translit deck</div>
      </div>
      <button type="button" data-hide>hide</button>
    </header>
    <div class="body">
      <label class="switch">
        <span>
          <strong>Active</strong>
          <span>rewrite typed Cyrillic</span>
        </span>
        <span class="toggle">
          <input type="checkbox" data-active>
          <span class="track"></span>
        </span>
      </label>
      <div class="map-head">
        <div class="label">map</div>
        <button type="button" data-reset>reset</button>
      </div>
      <textarea data-map spellcheck="false" aria-label="Translit map"></textarea>
      <div class="hint">One rule per line: <strong>а=a</strong>. Empty right side deletes char, e.g. <strong>ь=</strong>.</div>
      <div class="status" data-status></div>
    </div>
  </section>
`;
