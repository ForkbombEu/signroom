/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.updateRule = "@now < signature_deadline &&\n@request.auth.id = owner.id && \nstatus = \"pending\" &&\nsignature = null &&\n(\n  @request.data.multisignature = null &&\n  @request.data.owner = null &&\n  @request.data.signature_deadline = null &&\n  (\n    @request.data.status = \"declined\" ||\n    (\n    @request.data.status = \"signed\" &&\n    @request.data.signature != null\n    )\n  )\n)"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gvmpvjdt",
    "name": "signature",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.updateRule = "@now < signature_deadline &&\n@request.auth.id = owner.id && \nstatus = \"pending\" &&\n(\n  @request.data.multisignature = null &&\n  @request.data.owner = null &&\n  @request.data.signature_deadline = null &&\n  (\n    @request.data.status = \"declined\" ||\n    (\n    @request.data.status = \"signed\" &&\n    @request.data.signature != null\n    )\n  )\n)"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gvmpvjdt",
    "name": "signature",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 0
    }
  }))

  return dao.saveCollection(collection)
})
