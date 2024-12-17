/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0fg9n15rb903u1q")

  collection.options = {
    "query": "SELECT\n  services.id,\n  services.type_name,\n  authorization_servers.endpoint AS authorization_server_endpoint,\n  issuers.endpoint as credential_issuer_endpoint\nFROM\n  services\nLEFT JOIN\n  authorization_servers on services.authorization_server = authorization_servers.id\nLEFT JOIN\n  issuers on services.credential_issuer = issuers.id"
  }

  // remove
  collection.schema.removeField("4otws9is")

  // remove
  collection.schema.removeField("t2dbqhib")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l0jbarbu",
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
    "id": "bwavfls9",
    "name": "authorization_server_endpoint",
    "type": "url",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cag9mxqn",
    "name": "credential_issuer_endpoint",
    "type": "url",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
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
    "id": "4otws9is",
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
    "id": "t2dbqhib",
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
  collection.schema.removeField("l0jbarbu")

  // remove
  collection.schema.removeField("bwavfls9")

  // remove
  collection.schema.removeField("cag9mxqn")

  return dao.saveCollection(collection)
})
