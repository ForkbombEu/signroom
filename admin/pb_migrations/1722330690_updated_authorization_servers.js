/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("758huqg35n76ung")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5m3jqdgp",
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
  const collection = dao.findCollectionByNameOrId("758huqg35n76ung")

  // remove
  collection.schema.removeField("5m3jqdgp")

  return dao.saveCollection(collection)
})
