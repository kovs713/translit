type TextControl = HTMLInputElement | HTMLTextAreaElement;
type EditableTarget = TextControl | HTMLElement;

type InputRewriterOptions = {
  isActive: () => boolean;
  isIgnoredElement: (element: Element) => boolean;
  isIgnoredEvent: (event: Event) => boolean;
  transliterate: (text: string) => string;
};

const TEXT_INPUT_TYPES = new Set(['', 'search', 'tel', 'text', 'url']);

export function createInputRewriter(options: InputRewriterOptions) {
  function install() {
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('beforeinput', handleBeforeInput, true);
    document.addEventListener('paste', handlePaste, true);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!options.isActive() || event.defaultPrevented || event.isComposing) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (options.isIgnoredEvent(event)) return;
    if (event.key.length !== 1) return;

    const target = getEditableTarget(event.target, options.isIgnoredElement);
    if (!target) return;

    const nextText = options.transliterate(event.key);
    if (nextText === event.key) return;

    event.preventDefault();
    insertText(target, nextText);
  }

  function handleBeforeInput(event: Event) {
    const inputEvent = event as InputEvent;

    if (!options.isActive() || inputEvent.defaultPrevented || inputEvent.isComposing) return;
    if (!inputEvent.cancelable) return;
    if (options.isIgnoredEvent(inputEvent)) return;
    if (!inputEvent.inputType?.startsWith('insert')) return;
    if (inputEvent.inputType === 'insertCompositionText') return;

    const target = getEditableTarget(inputEvent.target, options.isIgnoredElement);
    if (!target || typeof inputEvent.data !== 'string' || inputEvent.data.length === 0) return;

    const nextText = options.transliterate(inputEvent.data);
    if (nextText === inputEvent.data) return;

    inputEvent.preventDefault();
    insertText(target, nextText);
  }

  function handlePaste(event: Event) {
    const clipboardEvent = event as ClipboardEvent;

    if (!options.isActive() || clipboardEvent.defaultPrevented || options.isIgnoredEvent(clipboardEvent)) return;

    const target = getEditableTarget(clipboardEvent.target, options.isIgnoredElement);
    const text = clipboardEvent.clipboardData?.getData('text');
    if (!target || !text) return;

    const nextText = options.transliterate(text);
    if (nextText === text) return;

    clipboardEvent.preventDefault();
    insertText(target, nextText);
  }

  return { install };
}

function getEditableTarget(
  rawTarget: EventTarget | null,
  isIgnoredElement: (element: Element) => boolean,
): EditableTarget | null {
  const element = rawTarget instanceof Element ? rawTarget : rawTarget instanceof Node ? rawTarget.parentElement : null;
  if (!element || isIgnoredElement(element)) return null;

  const target = element.closest('input, textarea, [contenteditable]');
  if (!target || isIgnoredElement(target)) return null;

  if (target instanceof HTMLTextAreaElement) {
    return target.disabled || target.readOnly ? null : target;
  }

  if (target instanceof HTMLInputElement) {
    const type = (target.getAttribute('type') || 'text').toLowerCase();
    if (!TEXT_INPUT_TYPES.has(type)) return null;

    return target.disabled || target.readOnly ? null : target;
  }

  if (target instanceof HTMLElement && target.isContentEditable) return target;

  return null;
}

function insertText(target: EditableTarget, text: string) {
  if (isTextControl(target)) {
    insertIntoTextControl(target, text);
    return;
  }

  insertIntoContentEditable(target, text);
}

function isTextControl(target: EditableTarget): target is TextControl {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

function insertIntoTextControl(target: TextControl, text: string) {
  try {
    target.focus({ preventScroll: true });
  } catch {
    target.focus();
  }

  try {
    const start = typeof target.selectionStart === 'number' ? target.selectionStart : target.value.length;
    const end = typeof target.selectionEnd === 'number' ? target.selectionEnd : start;
    target.setRangeText(text, start, end, 'end');
    emitInput(target, text);
    return;
  } catch {
    insertWithExecCommand(text);
  }
}

function insertIntoContentEditable(target: HTMLElement, text: string) {
  try {
    target.focus({ preventScroll: true });
  } catch {
    target.focus();
  }

  if (insertWithExecCommand(text)) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (!target.contains(range.commonAncestorContainer)) return;

  range.deleteContents();

  if (text) {
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
  }

  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  emitInput(target, text);
}

function insertWithExecCommand(text: string) {
  try {
    if (!document.queryCommandSupported?.('insertText')) return false;
    return document.execCommand('insertText', false, text);
  } catch {
    return false;
  }
}

function emitInput(target: EditableTarget, text: string) {
  let event: Event;

  try {
    event = new InputEvent('input', {
      bubbles: true,
      composed: true,
      data: text,
      inputType: 'insertText',
    });
  } catch {
    event = new Event('input', { bubbles: true, composed: true });
  }

  target.dispatchEvent(event);
}
