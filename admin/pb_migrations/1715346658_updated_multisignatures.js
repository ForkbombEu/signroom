/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qdxfnllz52i1z1i")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vbrf7gov",
    "name": "reflow_seal",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qdxfnllz52i1z1i")

  // remove
  collection.schema.removeField("vbrf7gov")

  return dao.saveCollection(collection)
})
