/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7amth7pix3i8k5p")

  // remove
  collection.schema.removeField("w0loktpf")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7amth7pix3i8k5p")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "w0loktpf",
    "name": "credential_type",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "W3C-VC",
        "Coconut",
        "BBS"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
