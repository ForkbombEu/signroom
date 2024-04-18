/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "pnlj0s6ft78lewd",
    "created": "2024-04-18 13:45:27.459Z",
    "updated": "2024-04-18 13:45:27.459Z",
    "name": "templates_public",
    "type": "view",
    "system": false,
    "schema": [],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT id FROM templates"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("pnlj0s6ft78lewd");

  return dao.deleteCollection(collection);
})
