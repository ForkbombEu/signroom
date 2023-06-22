migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lybqqrme",
    "name": "text_with_regex",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^w+S"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  // remove
  collection.schema.removeField("lybqqrme")

  return dao.saveCollection(collection)
})
