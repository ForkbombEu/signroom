/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("saqg69uxgxhzh44")

  // remove
  collection.schema.removeField("bgzw8gr7")

  // remove
  collection.schema.removeField("abcntktv")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("saqg69uxgxhzh44")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bgzw8gr7",
    "name": "value",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "abcntktv",
    "name": "algorithm",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
