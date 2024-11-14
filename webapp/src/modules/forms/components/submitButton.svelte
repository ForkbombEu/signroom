<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { getFormContext } from '@/forms';
	import { FORM_ERROR_PATH } from '../form';
	import type { ButtonProps } from '@/components/ui/button';

	type $$Props = ButtonProps;

	const { form } = getFormContext();
	const { allErrors } = form;

	$: formHasErrors = $allErrors.filter((e) => e.path != FORM_ERROR_PATH).length > 0;
</script>

<Form.Button {...$$props} disabled={formHasErrors}>
	<slot></slot>
</Form.Button>
