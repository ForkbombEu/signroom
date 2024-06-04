/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dldsoanel7liuto")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "u29konfv",
    "name": "locale",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dldsoanel7liuto")

  // remove
  collection.schema.removeField("u29konfv")

  return dao.saveCollection(collection)
})
