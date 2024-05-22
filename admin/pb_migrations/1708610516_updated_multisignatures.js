/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qdxfnllz52i1z1i")

  collection.listRule = "owner.id = @request.auth.id || seals.owner.id ?= @request.auth.id"
  collection.viewRule = "owner.id = @request.auth.id || seals.owner.id ?= @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qdxfnllz52i1z1i")

  collection.listRule = "owner.id = @request.auth.id || seals.recipient.id ?= @request.auth.id"
  collection.viewRule = "owner.id = @request.auth.id || seals.recipient.id ?= @request.auth.id"

  return dao.saveCollection(collection)
})
