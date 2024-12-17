/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0fg9n15rb903u1q")

  collection.options = {
    "query": "SELECT\n  services.id, services.type_name, services.authorization_server\nFROM\n  services\nLEFT JOIN\n  authorization_servers on services.authorization_server = authorization_servers.id"
  }

  // remove
  collection.schema.removeField("oxaafjqf")

  // remove
  collection.schema.removeField("dfz4oxyb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jinbd355",
    "name": "type_name",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^[a-zA-Z0-9_]+$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "aibxjmse",
    "name": "authorization_server",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "758huqg35n76ung",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0fg9n15rb903u1q")

  collection.options = {
    "query": "SELECT\n  id, type_name, authorization_server\nFROM\n  services"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oxaafjqf",
    "name": "type_name",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^[a-zA-Z0-9_]+$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dfz4oxyb",
    "name": "authorization_server",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "758huqg35n76ung",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("jinbd355")

  // remove
  collection.schema.removeField("aibxjmse")

  return dao.saveCollection(collection)
})
