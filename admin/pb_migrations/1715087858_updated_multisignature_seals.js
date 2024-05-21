/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.createRule = "@request.auth.id = multisignature.owner.id &&\n@request.data.status = \"pending\" &&\n@request.data.signature = null &&\n@request.data.signature_deadline > @now"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.createRule = "@request.auth.id = multisignature.owner.id &&\n@request.data.status = \"pending\" &&\n@request.data.signature = null"

  return dao.saveCollection(collection)
})
