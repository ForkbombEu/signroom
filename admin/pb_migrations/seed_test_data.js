const USERS_COLLECTION_NAME = "users";

const users = {
    A: {
        email: "userA@example.org",
        password: "userAuserA",
    },
    B: {
        email: "userB@example.org",
        password: "userBuserB",
    },
    C: {
        email: "userC@example.org",
        password: "userCuserC",
    },
};

function addUser(dao, email, password) {
    const collection = dao.findCollectionByNameOrId(USERS_COLLECTION_NAME);

    const record = new Record(collection);
    record.setUsername(email);
    record.setEmail(email);
    record.setPassword(password);
    record.setVerified(true);

    dao.saveRecord(record);

    return record;
}

function removeUser(dao, email) {
    const record = dao.findAuthRecordByEmail(USERS_COLLECTION_NAME, email);
    dao.deleteRecord(record);
}

migrate(
    (db) => {
        const dao = new Dao(db);

        /* Users */
        const userA = addUser(dao, users.A.email, users.A.password);
        const userB = addUser(dao, users.B.email, users.B.password);
        const userC = addUser(dao, users.C.email, users.C.password);

        /* AuthorizationExample */
        const authorizationsExamples = dao.findCollectionByNameOrId(
            "authorizationsExamples"
        );
        const authorizationExample = new Record(authorizationsExamples);
        authorizationExample.set("name", "authorizationExample");
        dao.saveRecord(authorizationExample);

        /* Authorization */
        const authorizations = dao.findCollectionByNameOrId("authorizations");
        const authorization = new Record(authorizations);
        authorization.set("owner", userA.id);
        authorization.set("users", [userB.id]);
        authorization.set("collection_id", authorizationsExamples.id);
        authorization.set("record_id", authorizationExample.id);
        dao.saveRecord(authorization);

        return;
    },
    (db) => {
        return;
    }
);
