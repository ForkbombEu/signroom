<script lang="ts">
	import { CodeJar } from 'codejar';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/atom-one-dark.min.css';
	import type { Action } from 'svelte/action';

	//

	export let code: string;
	export let lang: 'json' | 'gherkin';

	//

	type Props = {
		code: string;
	};

	const codedit: Action<HTMLElement, Props, { 'on:update': (e: CustomEvent<string>) => void }> = (
		node: HTMLElement,
		props: Props
	) => {
		function highlight(el: HTMLElement) {
			el.removeAttribute('data-highlighted');
			hljs.highlightElement(el);
		}

		const editor = CodeJar(node, highlight);

		function update(props: Props) {
			// editor.updateOptions(options);
			editor.updateCode(props.code);
		}
		update(props);

		editor.onUpdate((code) => {
			fire(node, 'update', code);
		});

		return {
			update,
			destroy() {
				editor.destroy();
			}
		};
	};

	function fire(el: HTMLElement, name: string, detail: unknown) {
		const e = new CustomEvent(name, { detail });
		el.dispatchEvent(e);
	}
</script>

<div
	class="rounded-lg p-4 font-mono language-{lang}"
	use:codedit={{ code }}
	on:update={(e) => {
		code = e.detail;
	}}
></div>
