"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed"; }>;
};

export default function InstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
	const [installed, setInstalled] = useState(false);

	useEffect(() => {
		const onBeforeInstall = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		};
		const onAppInstalled = () => setInstalled(true);
		window.addEventListener("beforeinstallprompt", onBeforeInstall);
		window.addEventListener("appinstalled", onAppInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", onBeforeInstall);
			window.removeEventListener("appinstalled", onAppInstalled);
		};
	}, []);

	if (installed || !deferredPrompt) return null;

	return (
		<button
			className="rounded-full border px-4 py-2 text-sm hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
			onClick={async () => {
				await deferredPrompt.prompt();
				await deferredPrompt.userChoice;
				setDeferredPrompt(null);
			}}
		>
			Install app
		</button>
	);
}


