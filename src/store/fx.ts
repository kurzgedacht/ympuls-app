import { create } from "zustand";

/** Transient reward effects (not persisted): overlay queue, toasts and the flying Puls counter. */
export type Overlay =
  | { kind: "levelup"; level: number }
  | { kind: "milestone"; days: number }
  | { kind: "badge"; id: string }
  | { kind: "goal" };

interface Fx {
  queue: Overlay[];
  toast: { id: number; text: string } | null;
  ping: { id: number; amount: number } | null;
  savedPing: number;
  shift: () => void;
}
export const useFx = create<Fx>()((set) => ({ queue: [], toast: null, ping: null, savedPing: 0, shift: () => set((s) => ({ queue: s.queue.slice(1) })) }));

let n = 0;
export const fx = {
  push: (o: Overlay) => useFx.setState((s) => ({ queue: [...s.queue, o] })),
  toast: (text: string) => useFx.setState({ toast: { id: ++n, text } }),
  puls: (amount: number) => useFx.setState({ ping: { id: ++n, amount } }),
  saved: () => useFx.setState({ savedPing: ++n }),
};
