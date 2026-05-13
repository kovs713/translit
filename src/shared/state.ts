export type StoredState = {
  active: boolean;
  panelVisible: boolean;
  panelX: number;
  panelY: number;
  mapText: string;
};

export const DEFAULT_MAP_TEXT = `а=a
б=6
в=B
г=r
д=g
е=e
ё=e
ж=}I{
з=3
и=u
й=ū
к=K
л=JI
м=M
н=H
о=o
п=n
р=p
с=c
т=m
у=y
ф=qp
х=x
ц=Lj
ч=4
ш=LLI
щ=LLj
ъ=b
ы=bI
ь=b
э=e
ю=IO
я=9I
А=A
Б=6
В=B
Г=r
Д=D
Е=e
Ё=e
Ж=}I{
З=3
И=U
Й=Ū
К=K
Л=JI
М=M
Н=H
О=O
П=TI
Р=P
С=C
Т=T
У=Y
Ф=qp
Х=X
Ц=Lj
Ч=4
Ш=LLI
Щ=LLj
Ъ=b
Ы=bI
Ь=b
Э=e
Ю=IO
Я=9I`;

export const DEFAULT_STATE: StoredState = {
  active: false,
  panelVisible: false,
  panelX: 24,
  panelY: 96,
  mapText: DEFAULT_MAP_TEXT,
};

export function normalizeState(
  storedState: Partial<StoredState> | undefined,
): StoredState {
  const source =
    storedState && typeof storedState === "object" ? storedState : {};

  return {
    active:
      typeof source.active === "boolean" ? source.active : DEFAULT_STATE.active,
    panelVisible:
      typeof source.panelVisible === "boolean"
        ? source.panelVisible
        : DEFAULT_STATE.panelVisible,
    panelX: Number.isFinite(Number(source.panelX))
      ? Number(source.panelX)
      : DEFAULT_STATE.panelX,
    panelY: Number.isFinite(Number(source.panelY))
      ? Number(source.panelY)
      : DEFAULT_STATE.panelY,
    mapText:
      typeof source.mapText === "string" ? source.mapText : DEFAULT_MAP_TEXT,
  };
}
