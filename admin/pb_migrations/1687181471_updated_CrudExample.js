migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  // add
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
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nfghsb83",
    "name": "image",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 99,
      "maxSize": 5242880,
      "mimeTypes": [
        "image/png",
        "image/jpeg"
      ],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  // remove
  collection.schema.removeField("kx4ozipk")

  // remove
  collection.schema.removeField("nfghsb83")

  return dao.saveCollection(collection)
})
