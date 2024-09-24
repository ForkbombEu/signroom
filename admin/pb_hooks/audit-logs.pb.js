// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

/// <reference path="../pb_data/types.d.ts" />
/** @typedef {import('./audit-logs.utils.js')} AuditLogUtils */
/** @typedef {import('./utils.js')} Utils */

onRecordAfterCreateRequest((e) => {
    /** @type {AuditLogUtils} */
    const auditLogUtils = require(`${__hooks}/audit-logs.utils.js`);
    const { auditLogger } = auditLogUtils;

    auditLogger(e.httpContext).info(
        "Created organization",
        "organizationId",
        e.record?.getId(),
        "organizationName",
        e.record?.get("name")
    );
}, "organizations");

/* Org Authorizations */

onRecordAfterCreateRequest((e) => {
    /** @type {AuditLogUtils} */
    const auditLogUtils = require(`${__hooks}/audit-logs.utils.js`);
    const { auditLogger } = auditLogUtils;

    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    console.log("ok");

    if (!e.record) return;
    console.log("nup");

    const organization = utils.getExpanded(e.record, "organization");
    const user = utils.getExpanded(e.record, "user");
    const role = utils.getExpanded(e.record, "role");

    auditLogger(e.httpContext).info(
        "Created organization authorization",
        "organizationId",
        organization?.getId(),
        "organizationName",
        organization?.get("name"),
        "userId",
        user?.getId(),
        "userName",
        user?.get("name"),
        "roleId",
        role?.getId(),
        "roleName",
        role?.get("name")
    );
}, "orgAuthorizations");

onRecordAfterUpdateRequest((e) => {
    /** @type {AuditLogUtils} */
    const auditLogUtils = require(`${__hooks}/audit-logs.utils.js`);
    const { auditLogger } = auditLogUtils;

    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!e.record) return;

    const organization = utils.getExpanded(e.record, "organization");
    const user = utils.getExpanded(e.record, "user");

    const previousRole = utils.getExpanded(e.record.originalCopy(), "role");
    const role = utils.getExpanded(e.record, "role");

    auditLogger(e.httpContext).info(
        "Updated organization authorization",
        "organizationId",
        organization?.getId(),
        "organizationName",
        organization?.get("name"),
        "userId",
        user?.getId(),
        "userName",
        user?.get("name"),
        "previousRoleId",
        previousRole?.getId(),
        "previousRoleName",
        previousRole?.get("name"),
        "newRoleId",
        role?.getId(),
        "newRoleName",
        role?.get("name")
    );
}, "orgAuthorizations");

onRecordAfterDeleteRequest((e) => {
    /** @type {AuditLogUtils} */
    const auditLogUtils = require(`${__hooks}/audit-logs.utils.js`);
    const { auditLogger } = auditLogUtils;

    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!e.record) return;

    const record = e.record.originalCopy();

    const organization = utils.getExpanded(record, "organization");
    const user = utils.getExpanded(record, "user");
    const role = utils.getExpanded(record, "role");

    auditLogger(e.httpContext).info(
        "Deleted organization authorization",
        "organizationId",
        organization?.getId(),
        "organizationName",
        organization?.get("name"),
        "userId",
        user?.getId(),
        "userName",
        user?.get("name"),
        "roleId",
        role?.getId(),
        "roleName",
        role?.get("name")
    );
}, "orgAuthorizations");
