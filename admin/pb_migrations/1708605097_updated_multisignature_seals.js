/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.updateRule = "@now < multisignature.deadline &&\n@request.auth.id = recipient.id && \n(\n  @request.data.multisignature = null &&\n  @request.data.recipient = null &&\n  (\n    @request.data.status = \"rejected\" ||\n    (\n    @request.data.status = \"accepted\" &&\n    @request.data.signature != null\n    )\n  )\n)"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gvmpvjdt",
    "name": "signature",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.updateRule = "@now < multisignature.deadline &&\n@request.auth.id = recipient.id && \n(\n  @request.data.multisignature = null &&\n  @request.data.recipient = null &&\n  (\n    @request.data.status = \"rejected\" ||\n    (\n    @request.data.status = \"accepted\" &&\n    @request.data.content != null\n    )\n  )\n)"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gvmpvjdt",
    "name": "content",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
