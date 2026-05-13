export const TOGGLE_MESSAGE_TYPE = 'translit:toggle-panel' as const;

export const TOGGLE_PANEL_MESSAGE = { type: TOGGLE_MESSAGE_TYPE } as const;

export type TogglePanelMessage = typeof TOGGLE_PANEL_MESSAGE;

export function isTogglePanelMessage(message: unknown): message is TogglePanelMessage {
  return (
    typeof message === 'object' &&
    message != null &&
    'type' in message &&
    message.type === TOGGLE_MESSAGE_TYPE
  );
}
