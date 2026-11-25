import { Fragment } from "react";
/** Renders *emphasis* as <em>. */
export const rich = (t: string) => t.split(/\*(.+?)\*/g).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>));
