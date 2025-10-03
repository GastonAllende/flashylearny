"use client";

import { useEffect } from "react";

export default function RegisterSW() {
	useEffect(() => {
		if (typeof window === "undefined") return;
		if ("serviceWorker" in navigator) {
			const register = async () => {
				try {
					await navigator.serviceWorker.register("/sw.js");
				} catch (err) {
					console.error("SW registration failed", err);
				}
			};
			register();
		}
	}, []);
	return null;
}


