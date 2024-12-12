/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3heyih6ln5gqi2l")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nvvgdfzc",
    "name": "port",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3heyih6ln5gqi2l")

  // remove
  collection.schema.removeField("nvvgdfzc")

  return dao.saveCollection(collection)
})
