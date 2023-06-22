migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "61lxlzl2",
    "name": "owner",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  // remove
  collection.schema.removeField("61lxlzl2")

  return dao.saveCollection(collection)
})
