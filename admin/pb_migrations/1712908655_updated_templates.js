/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7amth7pix3i8k5p")

  collection.listRule = "(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n @collection.orgAuthorizations.organization.id ?= organization.id) ||\npublic = true"
  collection.viewRule = "(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n @collection.orgAuthorizations.organization.id ?= organization.id) ||\npublic = true"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ua9rumim",
    "name": "public",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7amth7pix3i8k5p")

  collection.listRule = ""
  collection.viewRule = ""

  // remove
  collection.schema.removeField("ua9rumim")

  return dao.saveCollection(collection)
})
