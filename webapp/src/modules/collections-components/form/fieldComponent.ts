import type { FieldOptions } from '@/forms/fields/types';
import type { GenericRecord } from '@/utils/types';
import type { SvelteComponent, ComponentEvents, ComponentProps, ComponentType } from 'svelte';
import type { SuperForm } from 'sveltekit-superforms';

//

type BaseFieldComponent = SvelteComponent<{
	field: string;
	superform: SuperForm<GenericRecord>;
	options: FieldOptions;
}>;

export function createFieldComponent<C extends BaseFieldComponent>(
	component: ComponentType<C>,
	props?: Omit<ComponentProps<C>, 'field' | 'superform'>,
	events?: ComponentEvents<C>
) {
	return { component, props, events };
}

export type FieldComponentProp<C extends BaseFieldComponent = BaseFieldComponent> = ReturnType<
	typeof createFieldComponent<C>
>;
