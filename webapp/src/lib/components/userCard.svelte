<script lang="ts">
	import { Card, Modal, Avatar, Button, Dropzone, Fileupload } from 'flowbite-svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import { CloudArrowUp, Pencil, ArrowLeft } from 'svelte-heros-v2';
	let open: boolean = false;
	let files: FileList | undefined;

	let name: string = $currentUser?.name;
	let isInputNameOpen: boolean = false;

	async function handleImageChange() {
		const formData = new FormData();
		formData.append('avatar', files![0]);
		pb.collection('users').update($currentUser!.id, formData);
		open = false;
	}

	async function handleNameChange() {
		const formData = new FormData();
		formData.append('name', name);
		await pb.collection('users').update($currentUser!.id, formData);
		isInputNameOpen = false;
	}

	const handleOnClick = () => (open = true);

	const dropHandle = (event: DragEvent) => {
		event.preventDefault();
		if (files!.length > 0) {
			const fileName = files![0].name;
			alert('You dropped ' + fileName);
		}
	};
	//

	console.log($currentUser);
</script>

<Card padding="sm">
	<div class="flex flex-col">
		<Avatar
			size="xl"
			src={PUBLIC_POCKETBASE_URL +
				'api/files/_pb_users_auth_/ikazq48963mn9c9/' +
				$currentUser?.avatar}
		/>
		<div class="flex flex-row space-x-0 items-center mt-8">
			{#if !isInputNameOpen}
				<h5 class="text-xl font-bold text-gray-900 dark:text-white">
					{$currentUser?.name}
				</h5>
				<Button on:click={() => (isInputNameOpen = true)} outline size="sm" class="w-14">
					<Pencil />
				</Button>
			{/if}

			{#if isInputNameOpen}
				<Button on:click={() => (isInputNameOpen = false)} outline size="sm" class="pl-0 text-bold">
					<div class="flex flex-col">
						<ArrowLeft />
						<span class=" font-bold">Back</span>
					</div>
				</Button>
				<input
					type="text"
					bind:value={name}
					class="border border-gray-300 dark:border-gray-700 rounded-md w-full px-3 py-2 mr-2 text-sm text-gray-900 dark:text-white"
				/>
				<Button on:click={handleNameChange} outline size="sm" class="w-15 text-red-500">
					<div class="flex flex-col">
						<Pencil />
						<span class=" font-bold">Save</span>
					</div>
				</Button>
			{/if}
		</div>
		<span class="mb-4 text-md text-gray-400 dark:text-gray-400 font-semibold"
			>{$currentUser?.email}</span
		>
		<div class="flex mt-4 space-x-3 lg:mt-6 gap-2">
			<Button on:click={handleOnClick} color="primary">
				<CloudArrowUp />
				<span class="ml-2">Change Image</span></Button
			>
			<Modal {open} title="Upload Image" class="!min-w-md">
				<Card class="flex flex-col gap-4 !min-w-md">
					{#if !files?.[0]}
						<Fileupload bind:files />
						<Dropzone
							id="dropzone"
							on:drop={dropHandle}
							class="!relative"
							inputClass="!absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
						>
							<CloudArrowUp />
							<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
								<span class="font-semibold">Click to upload</span> or drag and drop
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								SVG, PNG, JPG or GIF (MAX. 800x400px)
							</p>
						</Dropzone>
					{:else}
						<Avatar size="xl" src={URL.createObjectURL(files[0])} />
						<Button on:click={handleImageChange} color="primary">Upload</Button>
					{/if}
				</Card>
			</Modal>
		</div>
	</div>
</Card>
