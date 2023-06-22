migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z4cc0g76ciqx13v")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yo3lch0p",
    "name": "envVariables",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z4cc0g76ciqx13v")

  // remove
  collection.schema.removeField("yo3lch0p")

  return dao.saveCollection(collection)
})
