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

        const appUrl = $app.settings().meta.appUrl
        const joinRequestId = e.record.id
        const getUrls = (recipient)=>({
            accept:`${appUrl}/api/organization/join/accept/${joinRequestId}/${$tokens.recordAuthToken($app, recipient.expand().user)}/${recipient.id}`,
            reject:`${appUrl}/api/organization/join/reject/${joinRequestId}/${$tokens.recordAuthToken($app, recipient.expand().user)}/${recipient.id}`,
        })

        /**
         * @type {mail.Address[]}
         */
        
        const recipientsAddresses = recipients
            .map((r) => r.expandedOne("user").get("email"))
            .map((e) => ({ address: e }));

        const mailClient = $app.newMailClient()

        recipients.forEach((recipient, i) =>{
            const urls = getUrls(recipient)
            const message = new MailerMessage({
                from: {
                    address: $app.settings().meta.senderAddress,
                    name: $app.settings().meta.senderName,
                },
                to: recipientsAddresses,
                subject: `${organizationName} | New join request`,
                html: `Your organization receved a new join request from ${e.record.user}
                <br />
                <a href="${urls.accept}">accept</a> | <a href="${urls.reject}">reject</a>`,
            });

            mailClient.send(message);
        })
    } catch (e) {
        console.log(e);
        console.log(JSON.stringify(e));
    }
}, "orgJoinRequests");

onRecordAfterUpdateRequest((e) => {
    try {
        console.log("Hook - orgJoinRequests - Sending email to user");

        const USER_KEY = "user";
        const ORGANIZATION_KEY = "organization";

        const status = e.record.get("status");
        if (status == "pending") return;

        $app.dao().expandRecord(e.record, [USER_KEY, ORGANIZATION_KEY]);

        const userEmail = e.record.expandedOne(USER_KEY).get("email");
        /** @type {mail.Address} */
        const userAddress = { address: userEmail };

        const organizationName = e.record
            .expandedOne(ORGANIZATION_KEY)
            .get("name");

        /**
         * @typedef {Object} EmailContent
         * @property {string} subject
         * @property {string} html
         */

        /** @type {EmailContent} */
        const successEmail = {
            subject: `${organizationName} | Request accepted`,
            html: `Welcome to ${organizationName}! Your request has been accepted!`,
        };
        /** @type {EmailContent} */
        const rejectEmail = {
            subject: `${organizationName} | Request declined`,
            html: "Your join request has been declined.",
        };

        const message = new MailerMessage({
            from: {
                address: $app.settings().meta.senderAddress,
                name: $app.settings().meta.senderName,
            },
            to: [userAddress],
            ...(status == "accepted" ? successEmail : rejectEmail),
        });

        $app.newMailClient().send(message);
    } catch (e) {
        console.log(e);
        console.log(JSON.stringify(e));
    }
}, "orgJoinRequests");
