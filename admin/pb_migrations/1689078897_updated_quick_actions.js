migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("emxj2n3xn09wem0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "upvs5smg",
    "name": "published",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("emxj2n3xn09wem0")

  // remove
  collection.schema.removeField("upvs5smg")

  return dao.saveCollection(collection)
})
