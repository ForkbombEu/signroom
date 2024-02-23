/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qdxfnllz52i1z1i")

  collection.listRule = "owner.id = @request.auth.id"
  collection.viewRule = "owner.id = @request.auth.id"

  // remove
  collection.schema.removeField("jixpefeu")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qdxfnllz52i1z1i")

  collection.listRule = "owner.id = @request.auth.id || seals.owner.id ?= @request.auth.id"
  collection.viewRule = "owner.id = @request.auth.id || seals.owner.id ?= @request.auth.id"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jixpefeu",
    "name": "seals",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "3pej2z0nhrcyiti",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
