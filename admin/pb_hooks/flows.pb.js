// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

/// <reference path="../pb_data/types.d.ts" />
/** @typedef {import('./utils.js')} Utils */
/** @typedef {import('./auditLogger.js')} AuditLogger */

/* Verification flow emails */

onRecordAfterCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const flow = e.record;
    const editor = utils.getUserFromContext(e.httpContext);
    if (!flow || !editor)
        throw utils.createMissingDataError(
            "verification flow",
            "user (editor)"
        );

    const organization = utils.getExpanded(flow, "organization");
    if (!organization) throw utils.createMissingDataError("organization");
    const organizationId = organization.getId();

    $app.dao().runInTransaction((txDao) => {
        const flowLink =
            utils.getOrganizationPageUrl(organizationId) +
            `/verification-flows/` +
            flow.getId();
        const admins = utils.getOrganizationAdminsAddresses(
            organizationId,
            txDao
        );

        for (const admin of admins) {
            const email = utils.renderEmail("new-verification-flow", {
                viewInBrowserLink: "",
                unsubscribeLink: "",
                OrganizationName: organization?.get("name") ?? "Organization",
                Editor: editor.get("name") ?? "Editor",
                DashboardLink: flowLink,
                UserName: admin.name,
                VerificationFlowName: flow.get("name") ?? "Verification Flow",
                VerificationFlowDescription:
                    flow.get("description") ?? "Description",
            });

            utils.sendEmail({
                to: admin,
                ...email,
            });
        }
    });
}, "verification_flows");

onRecordAfterUpdateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const flow = e.record;
    const editor = utils.getUserFromContext(e.httpContext);
    if (!flow || !editor)
        throw utils.createMissingDataError(
            "verification flow",
            "user (editor)"
        );

    const organization = utils.getExpanded(flow, "organization");
    if (!organization) throw utils.createMissingDataError("organization");
    const organizationId = organization.getId();

    $app.dao().runInTransaction((txDao) => {
        const diff = utils.getRecordUpdateEventDiff(e, [
            "name",
            "description",
            "template",
            "relying_party",
            "public",
        ]);
        const editedFields = diff.map((d) => d.field).join(", ");

        const flowLink =
            utils.getOrganizationPageUrl(organizationId) +
            `/verification-flows/` +
            flow.getId();
        const admins = utils.getOrganizationAdminsAddresses(
            organizationId,
            txDao
        );

        for (const admin of admins) {
            const email = utils.renderEmail(
                "verification-flow_generic-update",
                {
                    viewInBrowserLink: "",
                    unsubscribeLink: "",
                    DashboardLink: flowLink,
                    VerificationFlowName:
                        flow.get("name") ?? "Verification flow",
                    OrganizationName:
                        organization.get("name") ?? "organization",
                    Editor: editor.get("name") ?? "Editor",
                    UserName: admin.name,
                    EditedFields: editedFields,
                }
            );

            utils.sendEmail({
                to: admin,
                ...email,
            });
        }
    });
}, "verification_flows");
