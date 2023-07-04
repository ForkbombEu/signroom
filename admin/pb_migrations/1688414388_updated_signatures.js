migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xl2wr8ij9rnkug6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bgvnnwy7",
    "name": "signed_file",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xl2wr8ij9rnkug6")

  // remove
  collection.schema.removeField("bgvnnwy7")

  return dao.saveCollection(collection)
})
