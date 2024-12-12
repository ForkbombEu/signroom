/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "0fg9n15rb903u1q",
    "created": "2024-12-12 12:20:29.110Z",
    "updated": "2024-12-12 12:20:29.110Z",
    "name": "issuance_flow_public_data",
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
      "query": "SELECT id FROM services"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("0fg9n15rb903u1q");

  return dao.deleteCollection(collection);
})
