migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "o0hwn3yh",
    "name": "text",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 6,
      "max": 10,
      "pattern": "^w+S"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "o0hwn3yh",
    "name": "text",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 6,
      "max": 68,
      "pattern": "^w+S"
    }
  }))

  return dao.saveCollection(collection)
})
