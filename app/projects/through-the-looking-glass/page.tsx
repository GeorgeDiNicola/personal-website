import type { Metadata } from "next";
import { Experience } from "./_story/Experience";
import { PlaybackProvider } from "./_story/PlaybackProvider";

export const metadata: Metadata = {
  title: "Through the Looking-Glass · An Interactive Chess Story",
  description: "Follow Alice from pawn to queen through Lewis Carroll’s original chess sequence, with an interactive board and illustrated story.",
};

export default function LookingGlassPage() {
  return (
    <PlaybackProvider>
      <Experience />
    </PlaybackProvider>
  );
}
