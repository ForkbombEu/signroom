migrate((db) => {
  const collection = new Collection({
    "id": "emxj2n3xn09wem0",
    "created": "2023-07-11 12:34:41.124Z",
    "updated": "2023-07-11 12:34:41.124Z",
    "name": "quick_actions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zkg3o9en",
        "name": "title",
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
        "id": "sq9hcwot",
        "name": "field",
        "type": "url",
        "required": true,
        "unique": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": []
        }
      },
      {
        "system": false,
        "id": "lzvq8h3e",
        "name": "description",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("emxj2n3xn09wem0");

  return dao.deleteCollection(collection);
})
