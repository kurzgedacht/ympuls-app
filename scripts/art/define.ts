import type { Card, Course, Snack } from "../../src/content/schema";
import type { Art } from "./templates";

type ArtRef = Art | { file: string };
type WithArt<C> = C extends { art: string } ? Omit<C, "art"> & { art: ArtRef } : C extends { art?: string } ? Omit<C, "art"> & { art?: ArtRef } : C;
export type SrcCard = WithArt<Card>;
export type SrcLesson = { slug: string; title: string; cards: SrcCard[] };
export type SrcSnack = Omit<Snack, "card" | "category" | "courseRef"> & { card: SrcCard; category?: Snack["category"] };
export type SrcCourse = Omit<Course, "units"> & { cover: string; units: { id: string; title: string; lessons: SrcLesson[] }[]; snacks?: SrcSnack[] };
export const defineCourse = (c: SrcCourse) => c;
export const defineSnacks = (s: (SrcSnack & { category: Snack["category"] })[]) => s;
