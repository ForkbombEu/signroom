/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7amth7pix3i8k5p")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""
  collection.updateRule = ""
  collection.deleteRule = ""

  // remove
  collection.schema.removeField("g9frrx8m")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "soqiitnl",
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
  const collection = dao.findCollectionByNameOrId("7amth7pix3i8k5p")

  collection.listRule = "@request.auth.id = organization.user.id"
  collection.viewRule = "@request.auth.id = organization.user.id"
  collection.createRule = "@request.auth.id = organization.user.id && organization.role.name = \"owner\""
  collection.updateRule = "@request.auth.id = organization.user.id && organization.role.name = \"owner\""
  collection.deleteRule = "@request.auth.id = organization.user.id && organization.role.name = \"owner\""

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "g9frrx8m",
    "name": "organization",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "k1vlx34o1x8tzno",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("soqiitnl")

  return dao.saveCollection(collection)
})
