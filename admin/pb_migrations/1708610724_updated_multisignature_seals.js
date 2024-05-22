/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.updateRule = "@now < signature_deadline &&\n@request.auth.id = owner.id && \nstatus = \"pending\" &&\n(\n  @request.data.multisignature = null &&\n  @request.data.owner = null &&\n  @request.data.signature_deadline = null &&\n  (\n    @request.data.status = \"declined\" ||\n    (\n    @request.data.status = \"signed\" &&\n    @request.data.signature != null\n    )\n  )\n)"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cvjelrfm",
    "name": "status",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "signed",
        "pending",
        "declined"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.updateRule = "@now < signature_deadline &&\n@request.auth.id = owner.id && \nstatus = \"pending\" &&\n(\n  @request.data.multisignature = null &&\n  @request.data.owner = null &&\n  (\n    @request.data.status = \"rejected\" ||\n    (\n    @request.data.status = \"accepted\" &&\n    @request.data.signature != null\n    )\n  )\n)"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cvjelrfm",
    "name": "status",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "accepted",
        "rejected",
        "pending"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
