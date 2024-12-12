/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0fg9n15rb903u1q")

  collection.options = {
    "query": "SELECT\n  services.id, services.type_name, authorization_servers.port\nFROM\n  services\nLEFT JOIN\n  authorization_servers on services.authorization_server = authorization_servers.id"
  }

  // remove
  collection.schema.removeField("fiuswufu")

  // remove
  collection.schema.removeField("lhkqutbq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hu9chzdv",
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
    "id": "cnmtsimb",
    "name": "port",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0fg9n15rb903u1q")

  collection.options = {
    "query": "SELECT\n  services.id, services.type_name, authorization_servers.name\nFROM\n  services\nLEFT JOIN\n  authorization_servers on services.authorization_server = authorization_servers.id"
  }

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

  // remove
  collection.schema.removeField("hu9chzdv")

  // remove
  collection.schema.removeField("cnmtsimb")

  return dao.saveCollection(collection)
})
