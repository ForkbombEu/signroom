/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pnlj0s6ft78lewd")

  collection.options = {
    "query": "SELECT id, name, description, schema, schema_secondary, public FROM templates"
  }

  // remove
  collection.schema.removeField("xoucelmh")

  // remove
  collection.schema.removeField("lnonwrwh")

  // remove
  collection.schema.removeField("aszrozae")

  // remove
  collection.schema.removeField("jmep2fzr")

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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pnlj0s6ft78lewd")

  collection.options = {
    "query": "SELECT id, name, description, schema, schema_secondary FROM templates"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xoucelmh",
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
    "id": "lnonwrwh",
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
    "id": "aszrozae",
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
    "id": "jmep2fzr",
    "name": "schema_secondary",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

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

  return dao.saveCollection(collection)
})
