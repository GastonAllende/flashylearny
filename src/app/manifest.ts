import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FlashyLearny",
    short_name: "FlashyLearny",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    description: "Study decks and flashcards offline-first. Create, manage, and study your flashcard collections with spaced repetition.",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["education", "productivity", "utilities"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icon-512.png", 
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180", 
        type: "image/png"
      }
    ],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "FlashyLearny Desktop View"
      },
      {
        src: "/screenshot-narrow.png", 
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: "FlashyLearny Mobile View"
      }
    ]
  };
}


