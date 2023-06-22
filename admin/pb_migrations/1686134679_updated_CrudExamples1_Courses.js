migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  collection.name = "CrudExample_Courses"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "urpvpogd",
    "name": "date",
    "type": "text",
    "required": false,
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
    "id": "gj51kecf",
    "name": "teacher",
    "type": "text",
    "required": false,
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
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  collection.name = "CrudExamples1_Courses"

  // remove
  collection.schema.removeField("urpvpogd")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gj51kecf",
    "name": "field",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
