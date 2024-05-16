/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.listRule = "@request.auth.id = recipient.id ||\n@request.auth.id = multisignature.owner.id"
  collection.viewRule = "@request.auth.id = recipient.id ||\n@request.auth.id = multisignature.owner.id"
  collection.createRule = "@request.auth.id = multisignature.owner.id"
  collection.updateRule = "@request.auth.id = recipient.id"
  collection.deleteRule = "@request.auth.id = multisignature.owner.id"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uk8ai5og",
    "name": "multisignature",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "qdxfnllz52i1z1i",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  // remove
  collection.schema.removeField("uk8ai5og")

  return dao.saveCollection(collection)
})
