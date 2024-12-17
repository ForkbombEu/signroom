/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0fg9n15rb903u1q")

  collection.options = {
    "query": "SELECT id, type_name, authorization_server FROM services"
  }

  // remove
  collection.schema.removeField("o7vznjsj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ox7ccxxg",
    "name": "type_name",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^[a-zA-Z0-9_]+$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dqi80nkj",
    "name": "authorization_server",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "758huqg35n76ung",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0fg9n15rb903u1q")

  collection.options = {
    "query": "SELECT id, type_name FROM services"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "o7vznjsj",
    "name": "type_name",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^[a-zA-Z0-9_]+$"
    }
  }))

  // remove
  collection.schema.removeField("ox7ccxxg")

  // remove
  collection.schema.removeField("dqi80nkj")

  return dao.saveCollection(collection)
})
