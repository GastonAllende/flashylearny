import Link from "next/link";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import InstallPrompt from "@/components/InstallPrompt";
import { Brain, Smartphone, BarChart3 } from "lucide-react";

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">

      <Image className="mb-4" src="/icon.svg" alt="FlashyLearny" width={100} height={100} />


      <div className="space-y-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
          {t('title')}
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link
          href="/decks"
          className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
        >
          {t('getStarted')}
        </Link>
        <InstallPrompt />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
        <div className="text-center p-6">
          <div className="flex justify-center mb-3"><Brain className="w-12 h-12 text-blue-600" /></div>
          <h3 className="font-semibold text-lg mb-2">{t('features.smartLearning.title')}</h3>
          <p className="text-muted-foreground">
            {t('features.smartLearning.description')}
          </p>
        </div>
        <div className="text-center p-6">
          <div className="flex justify-center mb-3"><Smartphone className="w-12 h-12 text-green-600" /></div>
          <h3 className="font-semibold text-lg mb-2">{t('features.offlineFirst.title')}</h3>
          <p className="text-muted-foreground">
            {t('features.offlineFirst.description')}
          </p>
        </div>
        <div className="text-center p-6">
          <div className="flex justify-center mb-3"><BarChart3 className="w-12 h-12 text-purple-600" /></div>
          <h3 className="font-semibold text-lg mb-2">{t('features.trackProgress.title')}</h3>
          <p className="text-muted-foreground">
            {t('features.trackProgress.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
