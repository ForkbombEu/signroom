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
    if (!flow) throw utils.createMissingDataError("flow");

    const agent = utils.getRequestAgentName(e.httpContext);
    if (!agent) throw utils.createMissingDataError("agent");

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
            const email = utils.renderEmail("verification-flow-new", {
                OrganizationName: organization?.get("name") ?? "Organization",
                Editor: agent,
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
    if (!flow) throw utils.createMissingDataError("flow");

    const agent = utils.getRequestAgentName(e.httpContext);
    if (!agent) throw utils.createMissingDataError("agent");

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
                    DashboardLink: flowLink,
                    VerificationFlowName:
                        flow.get("name") ?? "Verification flow",
                    OrganizationName:
                        organization.get("name") ?? "organization",
                    Editor: agent,
                    UserName: admin.name,
                    FlowName: flow.get("name"),
                    ChangesList: editedFields,
                }
            );

            utils.sendEmail({
                to: admin,
                ...email,
            });
        }
    });
}, "verification_flows");

/* Issuance flow emails */

onRecordAfterCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const flow = e.record;
    if (!flow) throw utils.createMissingDataError("flow");

    const agent = utils.getRequestAgentName(e.httpContext);
    if (!agent) throw utils.createMissingDataError("agent");

    const organization = utils.getExpanded(flow, "organization");
    const credential_template = utils.getExpanded(flow, "credential_template");
    const credential_issuer = utils.getExpanded(flow, "credential_issuer");
    const authorization_server = utils.getExpanded(
        flow,
        "authorization_server"
    );
    const authorization_template = utils.getExpanded(
        flow,
        "authorization_template"
    );

    if (
        !organization ||
        !credential_template ||
        !credential_issuer ||
        !authorization_server ||
        !authorization_template
    )
        throw utils.createMissingDataError(
            "organization",
            "credential_template",
            "credential_issuer",
            "authorization_server",
            "authorization_template"
        );

    const organizationId = organization.getId();

    $app.dao().runInTransaction((txDao) => {
        const flowLink =
            utils.getOrganizationPageUrl(organizationId) +
            `/credential-issuances/` +
            flow.getId();
        const admins = utils.getOrganizationAdminsAddresses(
            organizationId,
            txDao
        );

        for (const admin of admins) {
            const email = utils.renderEmail("flow-new", {
                OrganizationName: organization?.getString("name"),
                Editor: agent,
                DashboardLink: flowLink,
                UserName: admin.name,
                FlowName: flow.getString("display_name"),
                FlowImage: flow.getString("logo"),
                cryptography: flow.getString("cryptography"),
                AuthServer: authorization_server.getString("endpoint"),
                IsPublic: flow.getString("public"),
                AuthTemplateName: authorization_template.getString("name"),
                FlowDescription: flow.getString("description"),
                CredentialIssuer: credential_issuer.getString("name"),
                expiration: flow.getString("expiration"),
                CredentialTemplateName: credential_template.getString("name"),
                CredentialTemplateDescription:
                    credential_template.getString("description"),
                API: flow.getString("api_available"),
            });

            utils.sendEmail({
                to: admin,
                ...email,
            });
        }
    });
}, "services");

onRecordAfterUpdateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const flow = e.record;
    if (!flow) throw utils.createMissingDataError("flow");

    const agent = utils.getRequestAgentName(e.httpContext);
    if (!agent) throw utils.createMissingDataError("agent");

    const organization = utils.getExpanded(flow, "organization");
    const credential_template = utils.getExpanded(flow, "credential_template");
    const credential_issuer = utils.getExpanded(flow, "credential_issuer");
    const authorization_server = utils.getExpanded(
        flow,
        "authorization_server"
    );
    const authorization_template = utils.getExpanded(
        flow,
        "authorization_template"
    );

    if (
        !organization ||
        !credential_template ||
        !credential_issuer ||
        !authorization_server ||
        !authorization_template
    )
        throw utils.createMissingDataError(
            "organization",
            "credential_template",
            "credential_issuer",
            "authorization_server",
            "authorization_template"
        );

    const organizationId = organization.getId();

    $app.dao().runInTransaction((txDao) => {
        const flowLink =
            utils.getOrganizationPageUrl(organizationId) +
            `/credential-issuances/` +
            flow.getId();
        const admins = utils.getOrganizationAdminsAddresses(
            organizationId,
            txDao
        );

        const diff = utils
            .getRecordUpdateEventDiff(e)
            .map((change) => change.field)
            .join(", ");

        for (const admin of admins) {
            const email = utils.renderEmail("flow-update_generic-update", {
                OrganizationName: organization?.getString("name"),
                Editor: agent,
                DashboardLink: flowLink,
                FlowName: flow.getString("display_name"),
                UserName: admin.name,
                ChangesList: diff,
            });

            utils.sendEmail({
                to: admin,
                ...email,
            });
        }
    });
}, "services");

/* Microservices */

onRecordAfterCreateRequest(
    (e) => {
        /** @type {Utils} */
        const utils = require(`${__hooks}/utils.js`);

        const microservice = e.record;
        if (!microservice) throw utils.createMissingDataError("microservice");

        const editor = utils.getRequestAgentName(e.httpContext);
        if (!editor) throw utils.createMissingDataError("agent");

        const organization = utils.getExpanded(microservice, "organization");
        if (!organization) throw utils.createMissingDataError("organization");
        const organizationId = organization.getId();

        $app.dao().runInTransaction((txDao) => {
            const microservicesLink =
                utils.getOrganizationPageUrl(organizationId) + `/microservices`;
            const admins = utils.getOrganizationAdminsAddresses(
                organizationId,
                txDao
            );

            for (const admin of admins) {
                const email = utils.renderEmail("microservice-new", {
                    OrganizationName: organization.getString("name"),
                    Editor: editor,
                    DashboardLink: microservicesLink,
                    UserName: admin.name,
                    MicroserviceName: microservice.getString("name"),
                    Functionality: microservice.collection().name,
                    ConfigurationOptions: `Endpoint: ${microservice.getString(
                        "endpoint"
                    )} | Port: ${microservice.getString("port")}`,
                });

                utils.sendEmail({
                    to: admin,
                    ...email,
                });
            }
        });
    },
    "authorization_servers",
    "issuers",
    "relying_parties"
);

onRecordAfterUpdateRequest(
    (e) => {
        /** @type {Utils} */
        const utils = require(`${__hooks}/utils.js`);

        const microservice = e.record;
        if (!microservice) throw utils.createMissingDataError("microservice");

        const editor = utils.getRequestAgentName(e.httpContext);
        if (!editor) throw utils.createMissingDataError("agent");

        const organization = utils.getExpanded(microservice, "organization");
        if (!organization) throw utils.createMissingDataError("organization");
        const organizationId = organization.getId();

        $app.dao().runInTransaction((txDao) => {
            const microservicesLink =
                utils.getOrganizationPageUrl(organizationId) + `/microservices`;
            const admins = utils.getOrganizationAdminsAddresses(
                organizationId,
                txDao
            );

            const diff = utils
                .getRecordUpdateEventDiff(e)
                .map((d) => d.field)
                .join(", ");

            for (const admin of admins) {
                const email = utils.renderEmail("microservice-update", {
                    OrganizationName: organization.getString("name"),
                    Editor: editor,
                    DashboardLink: microservicesLink,
                    UserName: admin.name,
                    MicroserviceName: microservice.getString("name"),
                    UpdatedFields: diff,
                });

                utils.sendEmail({
                    to: admin,
                    ...email,
                });
            }
        });
    },
    "authorization_servers",
    "issuers",
    "relying_parties"
);
