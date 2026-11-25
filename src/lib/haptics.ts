/**
 * iOS Safari has no navigator.vibrate. Since iOS 18, toggling a native
 * <input type="checkbox" switch> via its <label> fires the system haptic.
 * Must run inside a user gesture. Silently no-ops elsewhere.
 */
let label: HTMLLabelElement | null = null;
let enabled = true;
export const setHapticsEnabled = (v: boolean) => (enabled = v);

function ensureSwitch() {
  if (label || typeof document === "undefined") return label;
  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", "");
  input.id = "ympuls-haptic";
  input.setAttribute("aria-hidden", "true");
  input.tabIndex = -1;
  label = document.createElement("label");
  label.htmlFor = input.id;
  label.setAttribute("aria-hidden", "true");
  const box = document.createElement("div");
  box.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none;";
  box.append(input, label);
  document.body.append(box);
  return label;
}

const patterns = { light: [8], medium: [15], heavy: [30], success: [10, 60, 18], error: [20, 40, 20] } as const;
export type HapticKind = keyof typeof patterns;

export function haptic(kind: HapticKind = "light") {
  if (!enabled) return;
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([...patterns[kind]]);
      return;
    }
    const l = ensureSwitch();
    if (!l) return;
    l.click();
    if (kind === "success" || kind === "heavy" || kind === "error") setTimeout(() => l.click(), 90);
  } catch {
    /* haptics are best effort */
  }
}
