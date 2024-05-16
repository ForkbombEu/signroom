/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.updateRule = "@request.auth.id = recipient.id && \n(\n  @request.data.multisignature = null &&\n  @request.data.recipient = null &&\n  (\n    @request.data.status = \"rejected\" ||\n    (\n    @request.data.status = \"accepted\" &&\n    @request.data.signature != null\n    )\n  )\n)"
  collection.deleteRule = null

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.updateRule = "@request.auth.id = recipient.id"
  collection.deleteRule = "@request.auth.id = multisignature.owner.id"

  return dao.saveCollection(collection)
})
