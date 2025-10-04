'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, X, AlertTriangle, Info } from 'lucide-react';

export interface ToastProps {
	id: string;
	message: string;
	type?: 'success' | 'error' | 'warning' | 'info';
	duration?: number; // milliseconds, 0 for persistent
	onDismiss: (id: string) => void;
}

export default function Toast({
	id,
	message,
	type = 'info',
	duration = 5000,
	onDismiss
}: ToastProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [isExiting, setIsExiting] = useState(false);

	// Animation sequence
	useEffect(() => {
		// Enter animation
		const enterTimer = setTimeout(() => setIsVisible(true), 50);

		// Auto-dismiss
		let exitTimer: NodeJS.Timeout;
		if (duration > 0) {
			exitTimer = setTimeout(() => {
				setIsExiting(true);
				setTimeout(() => onDismiss(id), 300);
			}, duration);
		}

		return () => {
			clearTimeout(enterTimer);
			if (exitTimer) clearTimeout(exitTimer);
		};
	}, [id, duration, onDismiss]);

	const handleDismiss = () => {
		setIsExiting(true);
		setTimeout(() => onDismiss(id), 300);
	};

	// Type styles
	const typeStyles = {
		success: {
			icon: <CheckCircle className="w-5 h-5" />,
			bg: 'bg-green-50 dark:bg-green-900/20',
			border: 'border-green-200 dark:border-green-800',
			text: 'text-green-800 dark:text-green-200',
			button: 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200'
		},
		error: {
			icon: <X className="w-5 h-5" />,
			bg: 'bg-red-50 dark:bg-red-900/20',
			border: 'border-red-200 dark:border-red-800',
			text: 'text-red-800 dark:text-red-200',
			button: 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200'
		},
		warning: {
			icon: <AlertTriangle className="w-5 h-5" />,
			bg: 'bg-amber-50 dark:bg-amber-900/20',
			border: 'border-amber-200 dark:border-amber-800',
			text: 'text-amber-800 dark:text-amber-200',
			button: 'text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200'
		},
		info: {
			icon: <Info className="w-5 h-5" />,
			bg: 'bg-blue-50 dark:bg-blue-900/20',
			border: 'border-blue-200 dark:border-blue-800',
			text: 'text-blue-800 dark:text-blue-200',
			button: 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200'
		}
	};

	const styles = typeStyles[type];

	return (
		<div
			className={`
        ${styles.bg} ${styles.border} ${styles.text}
        border rounded-lg p-4 shadow-lg max-w-sm w-full
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting
					? 'translate-x-0 opacity-100'
					: 'translate-x-full opacity-0'
				}
      `}
			role="alert"
			aria-live="polite"
		>
			<div className="flex items-start gap-3">
				{/* Icon */}
				<div className="flex-shrink-0 mt-0.5">{styles.icon}</div>

				{/* Message */}
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium leading-relaxed">{message}</p>
				</div>

				{/* Dismiss Button */}
				<button
					onClick={handleDismiss}
					className={`
            ${styles.button} flex-shrink-0 p-1 rounded
            hover:bg-foreground/10
            focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-20
            transition-colors duration-150
          `}
					aria-label="Dismiss notification"
				>
					<svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
					</svg>
				</button>
			</div>

			{/* Progress bar for auto-dismiss */}
			{duration > 0 && (
				<div className="mt-3 w-full bg-foreground/10 rounded-full h-1 overflow-hidden">
					<div
						className="h-full bg-current opacity-50 rounded-full transition-all ease-linear"
						style={{
							animation: `toast-progress ${duration}ms linear forwards`,
							animationDelay: '50ms'
						}}
					/>
				</div>
			)}
		</div>
	);
}

// Toast Container Component
interface ToastContainerProps {
	toasts: ToastProps[];
	onDismiss: (id: string) => void;
	position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastContainer({
	toasts,
	onDismiss,
	position = 'top-right'
}: ToastContainerProps) {
	const positionClasses = {
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4',
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
		'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
	};

	if (toasts.length === 0) return null;

	return (
		<div
			className={`fixed ${positionClasses[position]} z-50 space-y-2`}
			aria-label="Notifications"
		>
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					{...toast}
					onDismiss={onDismiss}
				/>
			))}
		</div>
	);
}

// Hook for managing toasts
export function useToast() {
	const [toasts, setToasts] = useState<ToastProps[]>([]);

	const addToast = (toast: Omit<ToastProps, 'id' | 'onDismiss'>) => {
		const id = `toast-${Date.now()}-${Math.random()}`;
		const newToast: ToastProps = {
			...toast,
			id,
			onDismiss: dismissToast
		};

		setToasts(prev => [...prev, newToast]);
		return id;
	};

	const dismissToast = (id: string) => {
		setToasts(prev => prev.filter(toast => toast.id !== id));
	};

	const dismissAll = () => {
		setToasts([]);
	};

	// Convenience methods
	const success = (message: string, duration?: number) =>
		addToast({ message, type: 'success', duration });

	const error = (message: string, duration?: number) =>
		addToast({ message, type: 'error', duration });

	const warning = (message: string, duration?: number) =>
		addToast({ message, type: 'warning', duration });

	const info = (message: string, duration?: number) =>
		addToast({ message, type: 'info', duration });

	return {
		toasts,
		addToast,
		dismissToast,
		dismissAll,
		success,
		error,
		warning,
		info
	};
}