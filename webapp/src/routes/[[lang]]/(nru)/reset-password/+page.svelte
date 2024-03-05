<script lang="ts">
	import { enhance } from '$app/forms';
	import { Label, Input, Heading, P, Button } from 'flowbite-svelte';
	import { m } from '$lib/i18n'

	export let form: any;
</script>

{#if !form}
	<form method="post" use:enhance class="space-y-8">
		<div class="space-y-1">
			<Heading tag="h4">{m.Reset_password()}</Heading>
			<P>{m.Please_enter_here_a_new_password_()}</P>
		</div>
		<Label class="space-y-2">
			<span>{m.New_password()}</span>
			<Input type="password" name="password" id="password" placeholder="•••••••••••" required />
		</Label>
		<Label class="space-y-2">
			<span>{m.New_password()}</span>
			<Input
				type="password"
				name="passwordConfirmation"
				id="passwordConfirmation"
				placeholder="•••••••••••"
				required
			/>
		</Label>
		<Button type="submit" class="w-full">{m.Reset_password()}</Button>
	</form>
{:else if form.success}
	<div class="space-y-4">
		<Heading tag="h4">{m.Password_reset_successfully()}</Heading>
		<P>{m.Please_click_the_link_in_the_email_to_reset_your_password_()}</P>
	</div>
{/if}
