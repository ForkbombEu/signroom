/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("paa7qypc1bwaq0i")

  collection.listRule = "(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n@collection.orgAuthorizations.organization.id ?= organization.id) || public = true"
  collection.viewRule = "(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n@collection.orgAuthorizations.organization.id ?= organization.id) || public = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("paa7qypc1bwaq0i")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
})
