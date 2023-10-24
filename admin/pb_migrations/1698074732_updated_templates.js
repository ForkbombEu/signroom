/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7amth7pix3i8k5p")

  // remove
  collection.schema.removeField("fzgyjqzb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xozvdofz",
    "name": "schema",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7amth7pix3i8k5p")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fzgyjqzb",
    "name": "schema",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("xozvdofz")

  return dao.saveCollection(collection)
})
