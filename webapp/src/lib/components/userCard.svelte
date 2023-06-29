<script lang="ts">
	import { Card, Modal, Avatar, Button, Dropzone, Fileupload, Toggle } from 'flowbite-svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import { CloudArrowUp, Pencil, ArrowLeft } from 'svelte-heros-v2';
	import EditableLabel from './editableLabel.svelte';
	let open: boolean = false;
	let files: FileList | undefined;

	async function handleImageChange() {
		const formData = new FormData();
		formData.append('avatar', files![0]);
		pb.collection('users').update($currentUser!.id, formData);
		open = false;
	}

	async function handleNameChange(value: string) {
		const formData = new FormData();
		formData.append('name', value);
		await pb.collection('users').update($currentUser!.id, formData);
	}

	async function handleEmailChange(value: string) {
		const formData = new FormData();
		formData.append('email', value);
		await pb.collection('users').update($currentUser!.id, formData);
	}

	async function handleEmailVisible() {
		const formData = new FormData();
		formData.append('emailVisibility', $currentUser!.emailVisibility ? '0' : '1');
		await pb.collection('users').update($currentUser!.id, formData);
	}

	const handleOnClick = () => (open = true);

	const dropHandle = (event: DragEvent) => {
		event.preventDefault();
		if (files!.length > 0) {
			const fileName = files![0].name;
			alert('You dropped ' + fileName);
		}
	};

	const handleResetPassword = async () => {
		await pb.admins.requestPasswordReset($currentUser!.email);
	};
	//

	console.log($currentUser);
</script>

<Card padding="sm">
	<div class="flex flex-col gap-2">
		<Avatar
			size="xl"
			src={`${PUBLIC_POCKETBASE_URL}api/files/_pb_users_auth_/${$currentUser?.id}/${$currentUser?.avatar}`}
		/>
		<div class="flex flex-col gap-2">
			<Button on:click={handleResetPassword} size="sm" color="alternative" class="w-fit">password reset</Button>
			<div class="flex mb-4 space-x-3 ">
				<Button on:click={handleOnClick} color="primary" size="sm">
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
		<EditableLabel
			value={$currentUser?.name}
			handleChange={handleNameChange}
			valueClass="text-xl font-bold text-gray-900"
		/>
		<EditableLabel
			value={$currentUser?.email}
			handleChange={handleEmailChange}
			valueClass="text-md text-gray-400  font-semibold"
		/>
		<div class="flex flex-row justify-between w-full">
			<p class="text-md text-gray-400 font-semibold">Email visible:</p>
			<Toggle
				checked={$currentUser?.emailVisibility}
				color="red"
				class="text-md font-semibold"
				on:change={handleEmailVisible}
			/>
		</div>
	</div>
</Card>
