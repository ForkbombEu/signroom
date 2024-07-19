/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xl2wr8ij9rnkug6")

  collection.listRule = "owner.id = @request.auth.id ||\n(@collection.authorizations.users.id ?= @request.auth.id && \n @collection.authorizations.record_id ?= id)"
  collection.viewRule = "owner.id = @request.auth.id ||\n(@collection.authorizations.users.id ?= @request.auth.id && \n @collection.authorizations.record_id ?= id)"
  collection.updateRule = "@request.auth.id = owner.id &&\n(\n  file = null &&\n  certificate = null &&\n  type = null &&\n  owner = null\n)"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d4pzzv7g",
    "name": "title",
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dkt0zpbh",
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
      "displayFields": []
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "opfbw36v",
    "name": "file",
    "type": "file",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d6kcatzl",
    "name": "type",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "xades",
        "pades",
        "cades",
        "jades"
      ]
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bgvnnwy7",
    "name": "signed_file",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // update
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xl2wr8ij9rnkug6")

  collection.listRule = "owner.id = @request.auth.id || (@collection.authorizations.users.id ?= @request.auth.id && @collection.authorizations.record_id ?= id)"
  collection.viewRule = "owner.id = @request.auth.id || (@collection.authorizations.users.id ?= @request.auth.id && @collection.authorizations.record_id ?= id)"
  collection.updateRule = "@request.auth.id = owner.id"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d4pzzv7g",
    "name": "title",
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dkt0zpbh",
    "name": "owner",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "opfbw36v",
    "name": "file",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d6kcatzl",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "xades",
        "pades",
        "cades",
        "jades"
      ]
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bgvnnwy7",
    "name": "signed_file",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kwtjgjcf",
    "name": "certificate",
    "type": "relation",
    "required": false,
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

  return dao.saveCollection(collection)
})
