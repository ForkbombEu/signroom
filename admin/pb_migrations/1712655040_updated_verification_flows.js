/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("paa7qypc1bwaq0i")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "glrjc4ni",
    "name": "organization",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "aako88kt3br4npt",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("paa7qypc1bwaq0i")

  // remove
  collection.schema.removeField("glrjc4ni")

  return dao.saveCollection(collection)
})
