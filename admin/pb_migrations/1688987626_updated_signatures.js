migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xl2wr8ij9rnkug6")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d6kcatzl",
    "name": "type",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "xades",
        "pades",
        "cades",
        "jades"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xl2wr8ij9rnkug6")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d6kcatzl",
    "name": "type",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "json",
        "pdf",
        "xml"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
