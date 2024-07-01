/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xl2wr8ij9rnkug6")

  // remove
  collection.schema.removeField("kwtjgjcf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3sqf52y6",
    "name": "certificate_used",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xl2wr8ij9rnkug6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kwtjgjcf",
    "name": "certificate",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "saqg69uxgxhzh44",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("3sqf52y6")

  return dao.saveCollection(collection)
})
