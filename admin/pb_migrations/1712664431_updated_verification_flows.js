/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("paa7qypc1bwaq0i")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("paa7qypc1bwaq0i")

  collection.listRule = "public = true"
  collection.viewRule = "public = true"

  return dao.saveCollection(collection)
})
