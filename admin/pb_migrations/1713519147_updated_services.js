/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gn37nyhp1aif6")

  collection.viewRule = "(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n @collection.orgAuthorizations.organization.id ?= organization.id) || public = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gn37nyhp1aif6")

  collection.viewRule = "(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n@collection.orgAuthorizations.organization.id ?= organization.id) || public = true"

  return dao.saveCollection(collection)
})
