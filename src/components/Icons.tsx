// Small UI line icons (24×24, currentColor).
const P = (d: string) => (props: { className?: string; size?: number }) => (
  <svg width={props.size ?? 24} height={props.size ?? 24} viewBox="0 0 24 24" className={props.className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
export const IconHome = P("M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z");
export const IconFeed = P("M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zM10 9l5 3-5 3z");
export const IconCompass = P("M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z");
export const IconLibrary = P("M4 4h4v16H4zM10 4h4v16h-4zM16.5 4.5l3.5 1-4 15-3.5-1");
export const IconUser = P("M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0");
export const IconX = P("M6 6l12 12M18 6L6 18");
export const IconMore = P("M5 12h.01M12 12h.01M19 12h.01");
export const IconBack = P("M15 5l-7 7 7 7");
export const IconShare = P("M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6");
export const IconBookmark = P("M6 3h12v18l-6-4-6 4z");
export const IconSearch = P("M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4");
export const IconCheck = P("M5 12.5l4.5 4.5L19 7.5");
export const IconClock = P("M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2");
export const IconFlag = P("M5 21V4M5 4h11l-2 4 2 4H5");
