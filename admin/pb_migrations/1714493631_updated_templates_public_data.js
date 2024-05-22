/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pnlj0s6ft78lewd")

  collection.options = {
    "query": "SELECT id, name, description, schema, schema_secondary, public, type FROM templates"
  }

  // remove
  collection.schema.removeField("xnnpo4sh")

  // remove
  collection.schema.removeField("wghaw0sd")

  // remove
  collection.schema.removeField("7z2hb4cv")

  // remove
  collection.schema.removeField("dmgqvvwn")

  // remove
  collection.schema.removeField("fwv8d81b")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "23bba5uw",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "b3e3razt",
    "name": "description",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9o7t8mgw",
    "name": "schema",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "m2rox1r6",
    "name": "schema_secondary",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pma1er0e",
    "name": "public",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qcrqprzx",
    "name": "type",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "authorization",
        "verification",
        "issuance"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pnlj0s6ft78lewd")

  collection.options = {
    "query": "SELECT id, name, description, schema, schema_secondary, public FROM templates"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xnnpo4sh",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wghaw0sd",
    "name": "description",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7z2hb4cv",
    "name": "schema",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dmgqvvwn",
    "name": "schema_secondary",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fwv8d81b",
    "name": "public",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("23bba5uw")

  // remove
  collection.schema.removeField("b3e3razt")

  // remove
  collection.schema.removeField("9o7t8mgw")

  // remove
  collection.schema.removeField("m2rox1r6")

  // remove
  collection.schema.removeField("pma1er0e")

  // remove
  collection.schema.removeField("qcrqprzx")

  return dao.saveCollection(collection)
})
