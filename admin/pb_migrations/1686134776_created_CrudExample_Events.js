migrate((db) => {
  const collection = new Collection({
    "id": "2hkhhnkiep3qbyw",
    "created": "2023-06-07 10:46:16.075Z",
    "updated": "2023-06-07 10:46:16.075Z",
    "name": "CrudExample_Events",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "g5beywq8",
        "name": "title",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "jusggpun",
        "name": "artist",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "lczz1szr",
        "name": "location",
        "type": "text",
        "required": false,
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
  const collection = dao.findCollectionByNameOrId("2hkhhnkiep3qbyw");

  return dao.deleteCollection(collection);
})
