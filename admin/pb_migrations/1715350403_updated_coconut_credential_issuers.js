/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("olbm46mtc61vy25")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "x7siajyq",
    "name": "issuer_public_key",
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
  const collection = dao.findCollectionByNameOrId("olbm46mtc61vy25")

  // remove
  collection.schema.removeField("x7siajyq")

  return dao.saveCollection(collection)
})
