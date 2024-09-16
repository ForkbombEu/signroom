// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

/// <reference path="../pb_data/types.d.ts" />
/** @typedef {import('./utils.js')} Utils */
/** @typedef {import("../../webapp/src/lib/pocketbase/types").OrgAuthorizationsRecord} OrgAuthorization */
/** @typedef {import("../../webapp/src/lib/pocketbase/types").OrgRolesResponse} OrgRole */

//

routerAdd("POST", "/verify-org-authorization", (c) => {
    console.log("Route - Checking if user has the correct org authorization");

    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const userId = utils.getUserFromContext(c)?.getId();
    if (!userId) throw new BadRequestError(utils.errors.user_not_logged);

    /**  @type {{organizationId: string, url: string}} */
    // @ts-ignore
    const { organizationId, url } = $apis.requestInfo(c).data;
    if (!organizationId || !url)
        throw utils.createMissingDataError("organizationId", "url");

    const userAuthorization = $app
        .dao()
        .findFirstRecordByFilter(
            "orgAuthorizations",
            `organization="${organizationId}" && user="${userId}"`
        );
    // Here we assume that there is only one role for each organization
    // Also enforced by API rules
    if (!userAuthorization) throw new Error("Not authorized");
    const userRole = userAuthorization.get("role");

    const protectedPaths = utils.findRecordsByFilter(
        "orgProtectedPaths",
        "pathRegex != ''"
    );

    const matchingPaths = protectedPaths.filter((p) => {
        const regex = new RegExp(p?.get("pathRegex") ?? "");
        return regex.test(url);
    });

    const isAllowed = matchingPaths
        .map((p) => {
            /** @type {string[]} */
            const roles = p?.get("roles");
            return roles;
        })
        .every((roles) => roles.includes(userRole));

    if (!isAllowed) throw new ForbiddenError(utils.errors.not_authorized);
});

//

routerAdd("POST", "/verify-user-role", (c) => {
    console.log("Route - Checking if user has the required role");

    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const userId = utils.getUserFromContext(c)?.getId();

    /** @type {{organizationId: string, roles: string[]}}*/
    // @ts-ignore
    const { organizationId, roles } = $apis.requestInfo(c).data;
    if (!organizationId || !roles || roles.length === 0)
        throw utils.createMissingDataError();

    const roleFilter = `( ${roles
        .map((r) => `role.name="${r}"`)
        .join(" || ")} )`;

    const userAuthorization = $app
        .dao()
        .findFirstRecordByFilter(
            "orgAuthorizations",
            `organization="${organizationId}" && user="${userId}" && ${roleFilter}`
        );
    // Here we assume that there is only one role for each organization
    // Also enforced by API rules
    if (!userAuthorization)
        throw new ForbiddenError(utils.errors.not_authorized);
});

/* On Organization Create – Creating owner authorization */

onRecordAfterCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    // Don't create orgAuthorization if organization is created from admin panel
    if (utils.isAdminContext(e.httpContext)) return;

    const userId = utils.getUserFromContext(e.httpContext)?.getId();
    const organizationId = e.record?.getId();

    const ownerRole = utils.getRoleByName("owner");
    const ownerRoleId = ownerRole?.getId();

    const collection = $app.dao().findCollectionByNameOrId("orgAuthorizations");
    const record = new Record(collection, {
        organization: organizationId,
        role: ownerRoleId,
        user: userId,
    });
    $app.dao().saveRecord(record);
}, "organizations");

/* on OrgAuthorization Create - Cannot create an authorization with a level higher than or equal to your permissions */

onRecordBeforeCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (utils.isAdminContext(e.httpContext)) return;

    const { isSelf, userRoleLevel } =
        utils.getUserContextInOrgAuthorizationHookEvent(e);

    if (isSelf)
        throw new BadRequestError(
            utils.errors.cant_create_an_authorization_for_yourself
        );

    // Getting requested role level

    if (!e.record) throw utils.createMissingDataError("orgAuthorization");
    const requestedRole = utils.getExpanded(e.record, "role");
    if (!requestedRole) throw utils.createMissingDataError("requestedRole");
    const requestedRoleLevel = utils.getRoleLevel(requestedRole);

    // Matching

    if (requestedRoleLevel <= userRoleLevel) {
        throw new BadRequestError(
            utils.errors.cant_create_role_higher_than_or_equal_to_yours
        );
    }
}, "orgAuthorizations");

/* on OrgAuthorization Update */

onRecordBeforeUpdateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (utils.isAdminContext(e.httpContext)) return;

    const { isSelf, userRoleLevel: requestingUserRoleLevel } =
        utils.getUserContextInOrgAuthorizationHookEvent(e);

    // Getting role before edit (unmodified)

    const originalAuthorization = e.record?.originalCopy();
    if (!originalAuthorization)
        throw utils.createMissingDataError("originalAuthorization");

    const originalRole = utils.getExpanded(originalAuthorization, "role");
    if (!originalRole) throw utils.createMissingDataError("previousRole");

    const originalRoleLevel = utils.getRoleLevel(originalRole);

    // First check

    if (originalRoleLevel <= requestingUserRoleLevel && !isSelf)
        throw new ForbiddenError(
            utils.errors.cant_edit_role_higher_than_or_equal_to_yours
        );

    // Getting requested role

    /** @type {Partial<OrgAuthorization>} */
    const { role: newRoleId } = $apis.requestInfo(e.httpContext).data;

    if (!newRoleId) throw utils.createMissingDataError("newRoleId");
    const newRole = $app.dao().findRecordById("orgRoles", newRoleId);

    const newRoleLevel = utils.getRoleLevel(newRole);

    // Second check

    if (newRoleLevel <= requestingUserRoleLevel)
        throw new ForbiddenError(
            utils.errors.cant_edit_role_higher_than_or_equal_to_yours
        );
}, "orgAuthorizations");

/* on OrgAuthorization Delete - Cannot delete an authorization with a level higher than or equal to yours */

onRecordBeforeDeleteRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (utils.isAdminContext(e.httpContext)) return;

    const { isSelf, userRoleLevel: requestingUserRoleLevel } =
        utils.getUserContextInOrgAuthorizationHookEvent(e);

    // If user requests delete for itself, it's fine
    if (isSelf) return;

    // Getting role of authorization to delete

    if (!e.record) throw utils.createMissingDataError("originalAuthorization");

    const roleToDelete = utils.getExpanded(e.record, "role");
    if (!roleToDelete) throw utils.createMissingDataError("roleToDelete");

    const roleToDeleteLevel = utils.getRoleLevel(roleToDelete);

    // Comparing levels

    if (roleToDeleteLevel <= requestingUserRoleLevel)
        throw new ForbiddenError(
            utils.errors.cant_delete_role_higher_than_or_equal_to_yours
        );
}, "orgAuthorizations");

/* On OrgAuthorization Delete – Cannot delete last owner role */

onRecordBeforeDeleteRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (utils.isAdminContext(e.httpContext)) return;

    if (e.record && utils.isLastOwnerAuthorization(e.record)) {
        throw new BadRequestError(utils.errors.cant_edit_last_owner_role);
    }
}, "orgAuthorizations");

/* On OrgAuthorization Update – Cannot edit last owner role */

onRecordBeforeUpdateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (utils.isAdminContext(e.httpContext)) return;

    const originalRecord = e.record?.originalCopy();
    // e.record is already the "modified" version, so it is not a "owner" role anymore
    // to check if it's the last one, we need to get the "original" record

    if (originalRecord && utils.isLastOwnerAuthorization(originalRecord)) {
        throw new BadRequestError(utils.errors.cant_delete_last_owner_role);
    }
}, "orgAuthorizations");