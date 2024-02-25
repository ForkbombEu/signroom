<script lang="ts">
	import { enhance } from '$app/forms';
	import { Label, Input, Heading, P, Button } from 'flowbite-svelte';
	import { m } from '$lib/i18n';

	export let form: any;
</script>

{#if !form}
	<form method="post" use:enhance class="space-y-8">
		<div class="space-y-1">
			<Heading tag="h4">{m.Forgot_password()}</Heading>
			<P>{m.Please_enter_here_your_email_to_recover_your_password_()}</P>
		</div>
		<Label class="space-y-2">
			<span>{m.Your_email()}</span>
			<Input type="email" name="email" id="email" placeholder="name@foundation.org" required />
		</Label>
		<Button type="submit" class="w-full">{m.Recover_password()}</Button>
	</form>
{:else if form.success}
	<div class="space-y-4">
		<Heading tag="h4">{m.Reset_email_sent_successfully()}</Heading>
		<P>{m.Please_click_the_link_in_the_email_to_reset_your_password_()}</P>
	</div>
{/if}
