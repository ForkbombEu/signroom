migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tim1ufq5oqvq1he")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "f3ekhwa4",
    "name": "cover",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/gif",
        "image/webp"
      ],
      "thumbs": [
        "0x180"
      ],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tim1ufq5oqvq1he")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "f3ekhwa4",
    "name": "cover",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
})
