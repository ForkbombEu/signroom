/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gn37nyhp1aif6")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.id = template.organization.user.id && template.organization.role.name = \"owner\""
  collection.updateRule = "@request.auth.id = template.organization.user.id && template.organization.role.name = \"owner\""
  collection.deleteRule = "@request.auth.id = template.organization.user.id && template.organization.role.name = \"owner\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gn37nyhp1aif6")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
