/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ffk93r2b2r1fqjo",
    "created": "2023-10-13 10:46:54.139Z",
    "updated": "2023-10-13 10:46:54.139Z",
    "name": "issuers",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "aflkujtx",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ffk93r2b2r1fqjo");

  return dao.deleteCollection(collection);
})
