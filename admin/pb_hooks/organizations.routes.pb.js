/// <reference path="../pb_data/types.d.ts" />
/** @typedef {import('./utils.js')} Utils */
/** @typedef {import('./audit-logs.utils.js')} AuditLogsUtils */

routerAdd("POST", "/organizations/verify-user-membership", (c) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);
    /** @type {AuditLogsUtils} */
    const { auditLogger } = require(`${__hooks}/audit-logs.utils.js`);

    const userId = utils.getUserFromContext(c)?.getId();

    /** @type {{organizationId: string, roles: string[]}}*/
    const { organizationId } = $apis.requestInfo(c).data;
    if (!organizationId)
        throw utils.createMissingDataError("organizationId", "roles");

    try {
        $app.dao().findFirstRecordByFilter(
            "orgAuthorizations",
            `organization="${organizationId}" && user="${userId}"`
        );
        return c.json(200, { isMember: true });
    } catch {
        auditLogger(c).info(
            "request_from_user_not_member",
            "organizationId",
            organizationId
        );
        return c.json(200, { isMember: false });
    }
});

routerAdd("POST", "/organizations/verify-user-role", (c) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const userId = utils.getUserFromContext(c)?.getId();

    /** @type {{organizationId: string, roles: string[]}}*/
    // @ts-ignore
    const { organizationId, roles } = $apis.requestInfo(c).data;
    if (!organizationId || !roles || roles.length === 0)
        throw utils.createMissingDataError("organizationId", "roles");

    const roleFilter = `( ${roles
        .map((r) => `role.name="${r}"`)
        .join(" || ")} )`;

    try {
        $app.dao().findFirstRecordByFilter(
            "orgAuthorizations",
            `organization="${organizationId}" && user="${userId}" && ${roleFilter}`
        );
        return c.json(200, { hasRole: true });
    } catch {
        return c.json(200, { hasRole: false });
    }
});
