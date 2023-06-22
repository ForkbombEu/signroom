migrate((db) => {
  const collection = new Collection({
    "id": "cclw4fma6duxm4g",
    "created": "2023-06-06 12:31:11.207Z",
    "updated": "2023-06-06 12:31:11.207Z",
    "name": "folder",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "eolpioqi",
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
        "id": "icum7bsb",
        "name": "description",
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
        "id": "yaf9ktff",
        "name": "maxFiles",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
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
  const collection = dao.findCollectionByNameOrId("cclw4fma6duxm4g");

  return dao.deleteCollection(collection);
})
