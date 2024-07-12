<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { CodeJar } from 'codejar';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/atom-one-dark.min.css';

	hljs.configure({
		ignoreUnescapedHTML: true
	});

	//

	export let code: string;
	export let lang: 'json' | 'gherkin';

	/* Editor setup */

	let editor: CodeJar;
	let editorCode = code;

	function setupCodeEditor(node: HTMLElement) {
		editor = CodeJar(node, highlightCode);
		editor.updateCode(editorCode);
		editor.onUpdate(handleEditorUpdate);
		return {
			destroy() {
				editor.destroy();
			}
		};
	}

	function highlightCode(el: HTMLElement) {
		el.removeAttribute('data-highlighted');
		hljs.highlightElement(el);
	}

	function handleEditorUpdate(code: string) {
		editorCode = code;
	}

	/* Reactivity handling */

	$: if (editor) updateEditorCode(code);
	$: updatePropCode(editorCode);

	function updateEditorCode(code: string) {
		editor.updateCode(code);
	}

	function updatePropCode(string: string) {
		code = string;
	}
</script>

<div class="min-h-[100px] p-4 font-mono language-{lang}" use:setupCodeEditor></div>
