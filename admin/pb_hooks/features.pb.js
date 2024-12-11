// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

/// <reference path="../pb_data/types.d.ts" />
/** @typedef {import('./utils.js')} Utils */

onRecordViewRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (utils.isAdminContext(e.httpContext)) return;

    e.record?.set("envVariables", null);
}, "features");

onRecordsListRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (utils.isAdminContext(e.httpContext)) return;

    e.records.forEach((r) => {
        r?.set("envVariables", null);
    });
}, "features");
