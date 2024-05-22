/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "3pej2z0nhrcyiti",
    "created": "2024-02-22 08:36:54.400Z",
    "updated": "2024-02-22 08:36:54.400Z",
    "name": "multisignature_requests",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zl9dehif",
        "name": "recipient",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "cvjelrfm",
        "name": "status",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "accepted",
            "rejected",
            "pending"
          ]
        }
      },
      {
        "system": false,
        "id": "gvmpvjdt",
        "name": "signature",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti");

  return dao.deleteCollection(collection);
})
