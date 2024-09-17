// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { BadgeColor } from '$lib/components/utils/badge';
import { type TemplatesTypeOptions } from '$lib/pocketbase/types';

export const templatesColors: Record<TemplatesTypeOptions, BadgeColor> = {
	issuance: 'green',
	authorization: 'blue',
	verification: 'yellow'
};
