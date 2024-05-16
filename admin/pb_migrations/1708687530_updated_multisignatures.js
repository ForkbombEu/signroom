/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qdxfnllz52i1z1i")

  collection.listRule = "owner.id = @request.auth.id ||\n(\n  @collection.multisignature_seals.multisignature.id ?= id &&\n  @collection.multisignature_seals.owner ?= @request.auth.id\n)"
  collection.viewRule = "owner.id = @request.auth.id ||\n(\n  @collection.multisignature_seals.multisignature.id ?= id &&\n  @collection.multisignature_seals.owner ?= @request.auth.id\n)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qdxfnllz52i1z1i")

  collection.listRule = "owner.id = @request.auth.id"
  collection.viewRule = "owner.id = @request.auth.id"

  return dao.saveCollection(collection)
})
