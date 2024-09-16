// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

/// <reference path="../pb_data/types.d.ts" />
/// <reference path="./ambient.d.ts" />
/** @typedef {import("../../webapp/src/lib/pocketbase/types").OrgRolesRecord} OrgRole */
/** @typedef {import("../../webapp/src/lib/pocketbase/types").OrgAuthorizationsRecord} OrgAuthorization */
/** @typedef {import("../../webapp/src/lib/pocketbase/types").UsersRecord} User */

//

module.exports = {
    getUserFromContext,
    getRoleByName,
    findRecordsByFilter,
    isLastOwnerAuthorization,
    findFirstRecordByFilter,
    getUserRole,
    getExpanded,
    isAdminContext,
    getRoleLevel,
    createMissingDataError,
    getUserContextInOrgAuthorizationHookEvent,
};

/* -- RBAC Utils -- */

/**
 * @param {string} name
 * @returns {RecordModel<OrgRole> | undefined}
 */
function getRoleByName(name) {
    try {
        return $app.dao().findFirstRecordByData("orgRoles", "name", name);
    } catch {
        return undefined;
    }
}

/**
 * @param {models.Record} role
 * @returns {number}
 */
function getRoleLevel(role) {
    return role.get("level");
}

/**
 * @param {models.Record} orgAuthorization
 */
function isLastOwnerAuthorization(orgAuthorization) {
    const organizationId = orgAuthorization.get("organization");
    const roleId = orgAuthorization.get("role");
    const ownerRoleId = getRoleByName("owner")?.getId();

    if (roleId !== ownerRoleId) return false;

    const ownerAuthorizations = findRecordsByFilter(
        "orgAuthorizations",
        `organization="${organizationId}" && role="${ownerRoleId}"`
    );

    return ownerAuthorizations.length == 1;
}

/**
 * @param {string} userId
 * @param {string} organizationId
 * @returns {RecordModel<OrgRole> | undefined}
 */
function getUserRole(userId, organizationId) {
    const authorization = findFirstRecordByFilter(
        "orgAuthorizations",
        `user = "${userId}" && organization = "${organizationId}"`
    );
    if (!authorization) return undefined;
    return getExpanded(authorization, "role");
}

/**
 *
 * @param {core.RecordUpdateEvent|core.RecordDeleteEvent|core.RecordViewEvent|core.RecordCreateEvent} e
 */
function getUserContextInOrgAuthorizationHookEvent(e) {
    const userId = getUserFromContext(e.httpContext)?.getId();

    /** @type {string | undefined} */
    const organizationId = e.record?.get("organization");

    if (!userId || !organizationId)
        throw createMissingDataError("requestingUserId", "organizationId");

    const isSelf = userId === e.record?.get("user");

    const userRole = getUserRole(userId, organizationId);
    if (!userRole) throw createMissingDataError("requestingUserRole");

    const userRoleLevel = getRoleLevel(userRole);

    return { userId, userRole, isSelf, userRoleLevel };
}

/* -- Pocketbase utils -- */

/**
 * @param {echo.Context} c
 * @returns {RecordModel<User> | undefined}
 */
function getUserFromContext(c) {
    return $apis.requestInfo(c).authRecord;
}

/**
 * @param {string} collection
 * @param {string} filter
 * @returns {Array<models.Record>}
 */
function findRecordsByFilter(collection, filter) {
    return $app
        .dao()
        .findRecordsByFilter(collection, filter, "", 0, 0)
        .filter((v) => v != undefined);
}

/**
 * @param {string} collection
 * @param {string} filter
 */
function findFirstRecordByFilter(collection, filter) {
    try {
        return $app.dao().findFirstRecordByFilter(collection, filter);
    } catch {
        return undefined;
    }
}

/**
 * @param {models.Record} record
 * @param {string} key
 * @returns {models.Record | undefined}
 */
function getExpanded(record, key) {
    try {
        // @ts-ignore
        $app.dao().expandRecord(record, [key], null);
        return record.expandedOne(key);
    } catch (e) {
        return undefined;
    }
}

/**
 * @param {echo.Context} c
 */
function isAdminContext(c) {
    return $apis.requestInfo(c).admin;
}

/**
 * @param {string[]} args
 */
function createMissingDataError(...args) {
    return new BadRequestError("Missing data: " + args.join(", "));
}
