/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gn37nyhp1aif6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mdtn0jqp",
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
        "BBS",
        "sd-jwt"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gn37nyhp1aif6")

  // remove
  collection.schema.removeField("mdtn0jqp")

  return dao.saveCollection(collection)
})
