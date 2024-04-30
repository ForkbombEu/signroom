<script lang="ts">
	import { Heading, P } from 'flowbite-svelte';
	import { m } from '$lib/i18n';
</script>

<div class="space-y-4">
	<Heading tag="h4">{m.Reset_email_sent_successfully()}</Heading>
	<P>{m.Please_click_the_link_in_the_email_to_reset_your_password_()}</P>
	<P>{m.You_can_now_close_this_page()}</P>
</div>
