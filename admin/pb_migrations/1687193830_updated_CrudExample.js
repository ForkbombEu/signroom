migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kx4ozipk",
    "name": "relation",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "z4cc0g76ciqx13v",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kx4ozipk",
    "name": "relation",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "z4cc0g76ciqx13v",
      "cascadeDelete": false,
      "minSelect": 2,
      "maxSelect": 3,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
