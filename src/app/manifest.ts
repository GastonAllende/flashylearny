import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FlashyLearny",
    short_name: "FlashyLearny",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0ea5e9",
    description: "Study decks and flashcards offline-first.",
    icons: []
  };
}


