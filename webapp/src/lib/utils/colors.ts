// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { TemplatesTypeOptions } from '$lib/pocketbase/types';
import type { Badge } from 'flowbite-svelte';
import type { ComponentProps } from 'svelte';

type BadgeColor = ComponentProps<Badge>['color'];

export const templatesColors: Record<TemplatesTypeOptions, BadgeColor> = {
	issuance: 'green',
	authorization: 'blue',
	verification: 'yellow'
};
