/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xl2wr8ij9rnkug6")

  collection.updateRule = "@request.auth.id = owner.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xl2wr8ij9rnkug6")

  collection.updateRule = "@request.auth.id = owner.id &&\n(\n  file = null &&\n  certificate = null &&\n  type = null &&\n  owner = null\n)"

  return dao.saveCollection(collection)
})
