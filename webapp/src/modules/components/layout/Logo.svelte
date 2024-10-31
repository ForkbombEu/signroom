<script>
	import { appTitle } from '@/utils/strings';

	/*
	 * The url to navigate to when the logo is clicked.
	 */
	export let href = '/my';
</script>

<a {href}>
	<img src={'/logo.svg'} class="h-9" alt={appTitle} />
</a>

<!--  
    @component 
    Simple logo component. Change logo.svg to your logo.

    ### Props
    - `href` - The url to navigate to when the logo is clicked.
-->
