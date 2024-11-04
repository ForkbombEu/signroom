// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

/// <reference path="../pb_data/types.d.ts" />

onRecordViewRequest((e) => {
    e.record?.set("envVariables", null);
}, "features");

onRecordsListRequest((e) => {
    e.records.forEach((r) => r?.set("envVariables", null));
}, "features");
