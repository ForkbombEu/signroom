/// <reference path="../pb_data/types.d.ts" />

onRecordBeforeCreateRequest((e) => {
    console.log("Hook - orgJoinRequests - Setting pending status");
    e.record.set("status", "pending");
    e.record.set("reminders", 0);
}, "orgJoinRequests");

onRecordAfterCreateRequest((e) => {
    try {
        console.log("Hook - orgJoinRequests - Sending email to admins");

        $app.dao().expandRecord(e.record, ["organization"]);
        const organization = e.record.expandedOne("organization");
        const organizationId = organization.getId();
        const organizationName = organization.get("name");

        const recipients = $app
            .dao()
            .findRecordsByFilter(
                "orgAuthorizations",
                `organization.id = "${organizationId}" && ( role.name = "admin" || role.name = "owner" )`
            );
        $app.dao().expandRecords(recipients, ["user"]);

        /**
         * @type {mail.Address[]}
         */
        const recipientsAddresses = recipients
            .map((r) => r.expandedOne("user").get("email"))
            .map((e) => ({ address: e }));

        const message = new MailerMessage({
            from: {
                address: $app.settings().meta.senderAddress,
                name: $app.settings().meta.senderName,
            },
            to: recipientsAddresses,
            subject: `${organizationName} | New join request`,
            html: "Your organization receved a new join request",
        });

        $app.newMailClient().send(message);
    } catch (e) {
        console.log(e);
        console.log(JSON.stringify(e));
    }
}, "orgJoinRequests");
