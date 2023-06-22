migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("cclw4fma6duxm4g");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "cclw4fma6duxm4g",
    "created": "2023-06-06 12:31:11.207Z",
    "updated": "2023-06-07 10:30:49.474Z",
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
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
