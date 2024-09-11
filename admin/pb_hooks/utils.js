// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

/// <reference path="../pb_data/types.d.ts" />

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
};

/* -- RBAC Utils -- */

/**
 * @param {string} name
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
    console.log(JSON.stringify(ownerAuthorizations));

    return ownerAuthorizations.length == 1;
}

/**
 * @param {string} userId
 * @param {string} organizationId
 */
function getUserRole(userId, organizationId) {
    const authorization = findFirstRecordByFilter(
        "orgAuthorizations",
        `user = "${userId}" && organization = "${organizationId}"`
    );
    if (!authorization) return undefined;
    return getExpanded(authorization, "role");
}

/* -- Pocketbase utils -- */

/**
 * @param {echo.Context} c
 * @returns {models.Record | undefined}
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
 * @param {string} text
 */
function createMissingDataError(text) {
    return new BadRequestError("Missing data: " + text);
}
