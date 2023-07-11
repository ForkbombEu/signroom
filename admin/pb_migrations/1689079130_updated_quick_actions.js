migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("emxj2n3xn09wem0")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sq9hcwot",
    "name": "href",
    "type": "url",
    "required": true,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("emxj2n3xn09wem0")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sq9hcwot",
    "name": "field",
    "type": "url",
    "required": true,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  return dao.saveCollection(collection)
})
