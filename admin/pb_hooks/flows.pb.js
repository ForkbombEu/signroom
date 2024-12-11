// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

/// <reference path="../pb_data/types.d.ts" />
/** @typedef {import('./utils.js')} Utils */

//

onRecordBeforeCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!utils.isAdminContext(e.httpContext)) {
        e.record?.set("api_available", true);
        e.record?.set("public", false);
    }
}, "services");

onRecordBeforeUpdateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!utils.isAdminContext(e.httpContext)) {
        e.record?.set("api_available", true);
        e.record?.set("public", false);
    }
}, "services");

//

onRecordBeforeCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!utils.isAdminContext(e.httpContext)) {
        e.record?.set("public", false);
    }
}, "verification_flows");

onRecordBeforeUpdateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!utils.isAdminContext(e.httpContext)) {
        e.record?.set("public", false);
    }
}, "verification_flows");
