/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7amth7pix3i8k5p")

  collection.listRule = "is_preset = true ||\n(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n @collection.orgAuthorizations.organization.id ?= organization.id &&\n (@collection.orgAuthorizations.role.name ?= \"admin\" || \n  @collection.orgAuthorizations.role.name ?= \"owner\"))"
  collection.viewRule = "is_preset = true ||\n(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n @collection.orgAuthorizations.organization.id ?= organization.id &&\n (@collection.orgAuthorizations.role.name ?= \"admin\" || \n  @collection.orgAuthorizations.role.name ?= \"owner\"))"
  collection.createRule = "is_preset:isset = false &&\n(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n @collection.orgAuthorizations.organization.id ?= organization.id &&\n (@collection.orgAuthorizations.role.name ?= \"admin\" || \n  @collection.orgAuthorizations.role.name ?= \"owner\"))"
  collection.updateRule = "@request.data.is_preset:isset = false &&\n@request.data.organization:isset = false &&\n@request.data.type:isset = false &&\n(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n @collection.orgAuthorizations.organization.id ?= organization.id &&\n (@collection.orgAuthorizations.role.name ?= \"admin\" || \n  @collection.orgAuthorizations.role.name ?= \"owner\"))"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7amth7pix3i8k5p")

  collection.listRule = "is_preset:isset = true ||\n(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n @collection.orgAuthorizations.organization.id ?= organization.id &&\n (@collection.orgAuthorizations.role.name ?= \"admin\" || \n  @collection.orgAuthorizations.role.name ?= \"owner\"))"
  collection.viewRule = "is_preset:isset = true ||\n(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n @collection.orgAuthorizations.organization.id ?= organization.id &&\n (@collection.orgAuthorizations.role.name ?= \"admin\" || \n  @collection.orgAuthorizations.role.name ?= \"owner\"))"
  collection.createRule = "\n(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n @collection.orgAuthorizations.organization.id ?= organization.id &&\n (@collection.orgAuthorizations.role.name ?= \"admin\" || \n  @collection.orgAuthorizations.role.name ?= \"owner\"))"
  collection.updateRule = "@request.data.is_preset:isset = null &&\n@request.data.organization:isset = null &&\n@request.data.type:isset = null &&\n(@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n @collection.orgAuthorizations.organization.id ?= organization.id &&\n (@collection.orgAuthorizations.role.name ?= \"admin\" || \n  @collection.orgAuthorizations.role.name ?= \"owner\"))"

  return dao.saveCollection(collection)
})
