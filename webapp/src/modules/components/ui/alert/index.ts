import { type VariantProps, tv } from 'tailwind-variants';

import Root from './alert.svelte';
import Description from './alert-description.svelte';
import Title from './alert-title.svelte';

export const alertVariants = tv({
	base: '[&>svg]:text-foreground relative w-full rounded-lg border p-4 [&:has(svg)]:pl-11 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',

	variants: {
		variant: {
			default: 'bg-background text-foreground',
			destructive:
				'border-destructive/50 text-destructive text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10',
			warning:
				'border-yellow-600/50 text-yellow-600 text-yellow-600 dark:border-yellow-600 [&>svg]:text-yellow-600 bg-yellow-600/10',
			success:
				'border-green-600/50 text-green-600 text-green-600 dark:border-green-600 [&>svg]:text-green-600 bg-green-600/10',
			blue: 'border-blue-600/50 text-blue-600 text-blue-600 dark:border-blue-600 [&>svg]:text-blue-600 bg-blue-600/10'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
});

export type Variant = VariantProps<typeof alertVariants>['variant'];
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export {
	Root,
	Description,
	Title,
	//
	Root as Alert,
	Description as AlertDescription,
	Title as AlertTitle
};
