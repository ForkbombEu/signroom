migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cclw4fma6duxm4g")

  // remove
  collection.schema.removeField("yaf9ktff")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cclw4fma6duxm4g")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yaf9ktff",
    "name": "maxFiles",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
})
