/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xl2wr8ij9rnkug6")

  collection.updateRule = "@request.auth.id = owner.id && (\n  @request.data.file:isset = false &&\n  @request.data.certificate_used:isset = false &&\n  @request.data.type:isset = false &&\n  @request.data.owner:isset = false &&\n  @request.data.signed_file:isset = false\n)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xl2wr8ij9rnkug6")

  collection.updateRule = "@request.auth.id = owner.id && (\n  @request.data.file:isset = false &&\n  @request.data.certificate:isset = false &&\n  @request.data.type:isset = false &&\n  @request.data.owner:isset = false &&\n  @request.data.signed_file:isset = false\n)"

  return dao.saveCollection(collection)
})
