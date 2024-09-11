// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

/// <reference path="../pb_data/types.d.ts" />

module.exports = {
    /**
     * @param {echo.Context} c
     * @returns {models.Record | undefined}
     */
    getUserFromContext: (c) => {
        return $apis.requestInfo(c).authRecord;
    },

    /**
     * @param {string} name
     */
    getRoleByName: (name) => {
        try {
            return $app.dao().findFirstRecordByData("orgRoles", "name", name);
        } catch {
            return undefined;
        }
    },

    /**
     *
     * @param {string} collection
     * @param {string} filter
     * @returns {Array<models.Record>}
     */
    findRecordsByFilter: (collection, filter) => {
        return $app
            .dao()
            .findRecordsByFilter(collection, filter, "", 0, 0)
            .filter((v) => v != undefined);
    },

    /**
     *
     * @param {models.Record} orgAuthorization
     * @returns
     */
    isLastOwnerAuthorization: (orgAuthorization) => {
        const organizationId = orgAuthorization.get("organization");
        const roleId = orgAuthorization.get("role");
        const ownerRoleId = this.getRoleByName("owner")?.getId();

        if (roleId !== ownerRoleId) return false;

        const ownerAuthorizations = this.findRecordsByFilter(
            "orgAuthorizations",
            `organization="${organizationId}" && role="${ownerRoleId}"`
        );

        return ownerAuthorizations.length == 1;
    },
};
