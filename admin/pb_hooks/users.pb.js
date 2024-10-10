// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

/// <reference path="../pb_data/types.d.ts" />
/** @typedef {import('./utils.js')} Utils */
/** @typedef {import('./auditLogger.js')} AuditLogger */

onMailerBeforeRecordResetPasswordSend((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!e.message) throw utils.createMissingDataError("email message");

    /** @type {string|undefined} */
    const token = e.meta["token"];
    if (!token) throw utils.createMissingDataError("token");

    const resetLink = $app.settings().meta.appUrl + `/reset-password-${token}`;

    const emailData = utils.renderEmail("reset-password", {
        username: e.record?.get("name") ?? "User",
        viewInBrowserLink: "",
        unsubscribeLink: "",
        resetLink: resetLink,
    });

    e.message.html = emailData.html;
    e.message.subject = emailData.subject;
}, "users");

onRecordAfterCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!e.record) throw utils.createMissingDataError("user");

    const emailData = utils.renderEmail("new-user", {
        viewInBrowserLink: "",
        unsubscribeLink: "",
        DashboardLink: utils.getAppUrl() + "/my",
        UserName: e.record.get("name") ?? "User",
    });

    const err = utils.sendEmail({
        to: utils.getUserEmailAddressData(e.record),
        ...emailData,
    });
    if (err instanceof Error) {
        console.log(err);
    }
}, "users");
