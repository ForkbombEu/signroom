/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "dldsoanel7liuto",
    "created": "2024-06-04 12:50:55.556Z",
    "updated": "2024-06-04 12:50:55.556Z",
    "name": "globals",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "pfzavuzg",
        "name": "pricing_content",
        "type": "editor",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("dldsoanel7liuto");

  return dao.deleteCollection(collection);
})
