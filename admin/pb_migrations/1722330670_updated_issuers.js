/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ffk93r2b2r1fqjo")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xfmfrfjg",
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
  const collection = dao.findCollectionByNameOrId("ffk93r2b2r1fqjo")

  // remove
  collection.schema.removeField("xfmfrfjg")

  return dao.saveCollection(collection)
})
