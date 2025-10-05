import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: 'text' | 'textarea' | 'email' | 'password';
	placeholder?: string;
	helpText?: string;
	error?: string;
	required?: boolean;
	disabled?: boolean;
	rows?: number;
	className?: string;
	id?: string;
}

export function FormField({
	label,
	value,
	onChange,
	type = 'text',
	placeholder,
	helpText,
	error,
	required = false,
	disabled = false,
	rows = 4,
	className,
	id
}: FormFieldProps) {
	const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');

	return (
		<div className={cn('space-y-2', className)}>
			<Label htmlFor={fieldId} className="text-sm font-medium">
				{label}
				{required && <span className="text-destructive ml-1">*</span>}
			</Label>

			{type === 'textarea' ? (
				<Textarea
					id={fieldId}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					disabled={disabled}
					rows={rows}
					className={cn(
						error && 'border-destructive focus-visible:ring-destructive'
					)}
				/>
			) : (
				<Input
					id={fieldId}
					type={type}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					disabled={disabled}
					className={cn(
						error && 'border-destructive focus-visible:ring-destructive'
					)}
				/>
			)}

			{helpText && !error && (
				<p className="text-xs text-muted-foreground">{helpText}</p>
			)}

			{error && (
				<p className="text-xs text-destructive">{error}</p>
			)}
		</div>
	);
}
