/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7amth7pix3i8k5p")

  collection.listRule = "@request.auth.id = organization.user.id"
  collection.viewRule = "@request.auth.id = organization.user.id"
  collection.createRule = "@request.auth.id = organization.user.id && organization.role.name = \"owner\""
  collection.updateRule = "@request.auth.id = organization.user.id && organization.role.name = \"owner\""
  collection.deleteRule = "@request.auth.id = organization.user.id && organization.role.name = \"owner\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7amth7pix3i8k5p")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
