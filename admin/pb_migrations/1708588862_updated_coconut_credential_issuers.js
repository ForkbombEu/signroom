/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("olbm46mtc61vy25")

  collection.listRule = "public = true ||\n(\n  @collection.orgAuthorizations.user.id ?= @request.auth.id &&\n  @collection.orgAuthorizations.organization.id ?= organization.id\n)"
  collection.viewRule = "public = true ||\n(\n  @collection.orgAuthorizations.user.id ?= @request.auth.id &&\n  @collection.orgAuthorizations.organization.id ?= organization.id\n)"
  collection.createRule = "@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n@collection.orgAuthorizations.organization.id ?= organization.id &&\n(\n  @collection.orgAuthorizations.role.name ?= \"admin\" ||\n  @collection.orgAuthorizations.role.name ?= \"owner\"\n)"
  collection.updateRule = "@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n@collection.orgAuthorizations.organization.id ?= organization.id &&\n(\n  @collection.orgAuthorizations.role.name ?= \"admin\" ||\n  @collection.orgAuthorizations.role.name ?= \"owner\"\n)"
  collection.deleteRule = "@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n@collection.orgAuthorizations.organization.id ?= organization.id &&\n(\n  @collection.orgAuthorizations.role.name ?= \"admin\" ||\n  @collection.orgAuthorizations.role.name ?= \"owner\"\n)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("olbm46mtc61vy25")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
