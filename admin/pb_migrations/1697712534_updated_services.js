/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gn37nyhp1aif6")

  collection.createRule = ""
  collection.updateRule = ""
  collection.deleteRule = ""

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "asvwmbzr",
    "name": "organization",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "aako88kt3br4npt",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gn37nyhp1aif6")

  collection.createRule = "@request.auth.id = template.organization.user.id && template.organization.role.name = \"owner\""
  collection.updateRule = "@request.auth.id = template.organization.user.id && template.organization.role.name = \"owner\""
  collection.deleteRule = "@request.auth.id = template.organization.user.id && template.organization.role.name = \"owner\""

  // remove
  collection.schema.removeField("asvwmbzr")

  return dao.saveCollection(collection)
})
