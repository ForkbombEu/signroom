/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qdxfnllz52i1z1i")

  collection.createRule = "owner.id = @request.auth.id && (\n  @request.data.content_file != null ||\n  @request.data.content_text != null\n)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qdxfnllz52i1z1i")

  collection.createRule = "owner.id = @request.auth.id"

  return dao.saveCollection(collection)
})
