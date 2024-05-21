/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.updateRule = "@now < signature_deadline &&\n@request.auth.id = recipient.id && \nstatus = \"pending\" &&\n(\n  @request.data.multisignature = null &&\n  @request.data.recipient = null &&\n  (\n    @request.data.status = \"rejected\" ||\n    (\n    @request.data.status = \"accepted\" &&\n    @request.data.signature != null\n    )\n  )\n)"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9xa3pi2r",
    "name": "signature_deadline",
    "type": "date",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.updateRule = "@now < multisignature.deadline &&\n@request.auth.id = recipient.id && \n(\n  @request.data.multisignature = null &&\n  @request.data.recipient = null &&\n  (\n    @request.data.status = \"rejected\" ||\n    (\n    @request.data.status = \"accepted\" &&\n    @request.data.signature != null\n    )\n  )\n)"

  // remove
  collection.schema.removeField("9xa3pi2r")

  return dao.saveCollection(collection)
})
