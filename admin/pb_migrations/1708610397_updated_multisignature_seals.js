/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.listRule = "@request.auth.id = owner.id ||\n@request.auth.id = multisignature.owner.id"
  collection.viewRule = "@request.auth.id = owner.id ||\n@request.auth.id = multisignature.owner.id"
  collection.updateRule = "@now < signature_deadline &&\n@request.auth.id = owner.id && \nstatus = \"pending\" &&\n(\n  @request.data.multisignature = null &&\n  @request.data.owner = null &&\n  (\n    @request.data.status = \"rejected\" ||\n    (\n    @request.data.status = \"accepted\" &&\n    @request.data.signature != null\n    )\n  )\n)"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zl9dehif",
    "name": "owner",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3pej2z0nhrcyiti")

  collection.listRule = "@request.auth.id = recipient.id ||\n@request.auth.id = multisignature.owner.id"
  collection.viewRule = "@request.auth.id = recipient.id ||\n@request.auth.id = multisignature.owner.id"
  collection.updateRule = "@now < signature_deadline &&\n@request.auth.id = recipient.id && \nstatus = \"pending\" &&\n(\n  @request.data.multisignature = null &&\n  @request.data.recipient = null &&\n  (\n    @request.data.status = \"rejected\" ||\n    (\n    @request.data.status = \"accepted\" &&\n    @request.data.signature != null\n    )\n  )\n)"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zl9dehif",
    "name": "recipient",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
