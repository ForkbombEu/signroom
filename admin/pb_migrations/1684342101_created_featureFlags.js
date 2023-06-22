migrate((db) => {
  const collection = new Collection({
    "id": "z4cc0g76ciqx13v",
    "created": "2023-05-17 16:48:21.255Z",
    "updated": "2023-05-17 16:48:21.255Z",
    "name": "featureFlags",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "lj04bczn",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "yctafkxl",
        "name": "active",
        "type": "bool",
        "required": false,
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
  const collection = dao.findCollectionByNameOrId("z4cc0g76ciqx13v");

  return dao.deleteCollection(collection);
})
