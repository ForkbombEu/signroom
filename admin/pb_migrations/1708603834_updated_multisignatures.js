/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qdxfnllz52i1z1i")

  collection.createRule = "owner.id = @request.auth.id && (\n  @request.data.content_json != null ||\n  @request.data.content_text != null\n)"

  // remove
  collection.schema.removeField("wfqu4plg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wegn8hkm",
    "name": "content_json",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qdxfnllz52i1z1i")

  collection.createRule = "owner.id = @request.auth.id && (\n  @request.data.content_file != null ||\n  @request.data.content_text != null\n)"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wfqu4plg",
    "name": "content_text",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("wegn8hkm")

  return dao.saveCollection(collection)
})
