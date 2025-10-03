import Link from "next/link";
import InstallPrompt from "@/components/InstallPrompt";
import { Brain, Smartphone, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          FlashyLearny
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Study decks and flashcards offline-first. Master any subject with spaced repetition and progress tracking.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link
          href="/decks"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
        >
          Get Started
        </Link>
        <InstallPrompt />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
        <div className="text-center p-6">
          <div className="flex justify-center mb-3"><Brain className="w-12 h-12 text-blue-600" /></div>
          <h3 className="font-semibold text-lg mb-2">Smart Learning</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Adaptive spaced repetition helps you learn efficiently
          </p>
        </div>
        <div className="text-center p-6">
          <div className="flex justify-center mb-3"><Smartphone className="w-12 h-12 text-green-600" /></div>
          <h3 className="font-semibold text-lg mb-2">Offline First</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Study anywhere, anytime - no internet required
          </p>
        </div>
        <div className="text-center p-6">
          <div className="flex justify-center mb-3"><BarChart3 className="w-12 h-12 text-purple-600" /></div>
          <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
          <p className="text-gray-600 dark:text-gray-400">
            See your learning progress and mastery statistics
          </p>
        </div>
      </div>
    </div>
  );
}
