/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ffk93r2b2r1fqjo")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "z1bfufyc",
    "name": "endpoint",
    "type": "url",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ffk93r2b2r1fqjo")

  // remove
  collection.schema.removeField("z1bfufyc")

  return dao.saveCollection(collection)
})
