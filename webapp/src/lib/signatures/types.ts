// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { SignaturesResponse } from '$lib/pocketbase/types';

export type SignedFile = {
	name: string;
	bytes: string;
	digestAlgorithm: string | null;
};

export type Signature<Texpand extends unknown = unknown> = SignaturesResponse<SignedFile, Texpand>;
