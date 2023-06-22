migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vkmf5bzv",
    "name": "multiselect",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 2,
      "values": [
        "A",
        "B",
        "C",
        "D"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  // remove
  collection.schema.removeField("vkmf5bzv")

  return dao.saveCollection(collection)
})
