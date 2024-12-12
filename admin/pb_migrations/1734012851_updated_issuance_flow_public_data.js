/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0fg9n15rb903u1q")

  collection.options = {
    "query": "SELECT\n  services.id, services.type_name, authorization_servers.name\nFROM\n  services\nLEFT JOIN\n  authorization_servers on services.authorization_server = authorization_servers.id"
  }

  // remove
  collection.schema.removeField("ufxda78w")

  // remove
  collection.schema.removeField("ljltfduz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fiuswufu",
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
    "id": "lhkqutbq",
    "name": "name",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0fg9n15rb903u1q")

  collection.options = {
    "query": "SELECT\n  services.id, services.type_name, authorization_servers.endpoint\nFROM\n  services\nLEFT JOIN\n  authorization_servers on services.authorization_server = authorization_servers.id"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ufxda78w",
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
    "id": "ljltfduz",
    "name": "endpoint",
    "type": "url",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  // remove
  collection.schema.removeField("fiuswufu")

  // remove
  collection.schema.removeField("lhkqutbq")

  return dao.saveCollection(collection)
})
