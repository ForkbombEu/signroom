migrate((db) => {
  const collection = new Collection({
    "id": "p9dhra382rts3bg",
    "created": "2023-06-07 10:44:19.476Z",
    "updated": "2023-06-07 10:44:19.476Z",
    "name": "CrudExamples1_Courses",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "o0hwn3yh",
        "name": "name",
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
        "id": "9mr9c6qx",
        "name": "organization",
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
        "id": "gj51kecf",
        "name": "field",
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
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg");

  return dao.deleteCollection(collection);
})
