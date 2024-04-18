/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pnlj0s6ft78lewd")

  collection.options = {
    "query": "SELECT id, name, schema, description, organization, type, public, schema_secondary FROM templates"
  }

  // remove
  collection.schema.removeField("zqnnasoq")

  // remove
  collection.schema.removeField("1kpkkffl")

  // remove
  collection.schema.removeField("su7foecc")

  // remove
  collection.schema.removeField("d85vsaet")

  // remove
  collection.schema.removeField("b6d05hhy")

  // remove
  collection.schema.removeField("ur6ijazj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "unfppjn3",
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
    "id": "sgiougcv",
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
    "id": "vqfaja35",
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
    "id": "xdcncnu9",
    "name": "organization",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "aako88kt3br4npt",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gcdwdiuo",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qo2swy61",
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
    "id": "h6uk0hgl",
    "name": "schema_secondary",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pnlj0s6ft78lewd")

  collection.options = {
    "query": "SELECT id, name, schema, description, organization, type, public FROM templates"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zqnnasoq",
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
    "id": "1kpkkffl",
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
    "id": "su7foecc",
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
    "id": "d85vsaet",
    "name": "organization",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "aako88kt3br4npt",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "b6d05hhy",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ur6ijazj",
    "name": "public",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("unfppjn3")

  // remove
  collection.schema.removeField("sgiougcv")

  // remove
  collection.schema.removeField("vqfaja35")

  // remove
  collection.schema.removeField("xdcncnu9")

  // remove
  collection.schema.removeField("gcdwdiuo")

  // remove
  collection.schema.removeField("qo2swy61")

  // remove
  collection.schema.removeField("h6uk0hgl")

  return dao.saveCollection(collection)
})
