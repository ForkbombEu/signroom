const FEATURES_COLLECTION_NAME = "quick_actions";

/**
    type Feature = {
        name: string;
        envVariables: Record<string, unknown>;
    }
*/
const actions = [
  { title: "Create signature", href:"http://localhost:4173/my/signatures", description: "Sign documents superfast and share them with your buddies", published: true },
  { title: "Validate", href:"http://localhost:4173/my/validate", description: "Validate documents superfast and proof love", published: true }
];

migrate(
    (db) => {
        const dao = new Dao(db);
        const collection = dao.findCollectionByNameOrId(
            FEATURES_COLLECTION_NAME
        );

        for (const action of actions) {
            const record = new Record(collection, {...action});
            dao.saveRecord(record);
        }
    },
    (db) => {
        const dao = new Dao(db);

        // delete the previously created record (if exists)
        for (const action of actions) {
            try {
                const record = dao.findFirstRecordByData(
                    FEATURES_COLLECTION_NAME,
                    "title",
                    action.title
                );

                dao.deleteRecord(record);
            } catch {}
        }
    }
);
