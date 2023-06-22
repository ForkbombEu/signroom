migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  collection.name = "CrudExample_AllFields"

  // remove
  collection.schema.removeField("9mr9c6qx")

  // remove
  collection.schema.removeField("gj51kecf")

  // remove
  collection.schema.removeField("urpvpogd")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dtaeifmm",
    "name": "data",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3hmes6kr",
    "name": "file",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [
        "application/json",
        "application/pdf"
      ],
      "thumbs": [],
      "protected": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "o72s557k",
    "name": "boolean",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mpwzq9xk",
    "name": "number",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dzneawfh",
    "name": "select",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 2,
      "values": [
        "opt1",
        "opt2",
        "opt3",
        "opt4",
        "opt5"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "t1i6phfc",
    "name": "textarea",
    "type": "editor",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "w1cpmzlk",
    "name": "json",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xg2hnca6",
    "name": "url",
    "type": "url",
    "required": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "o0hwn3yh",
    "name": "text",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 6,
      "max": 68,
      "pattern": "^w+S"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  collection.name = "CrudExample_Courses"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9mr9c6qx",
    "name": "organization",
    "type": "text",
    "required": false,
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

  // remove
  collection.schema.removeField("dtaeifmm")

  // remove
  collection.schema.removeField("3hmes6kr")

  // remove
  collection.schema.removeField("o72s557k")

  // remove
  collection.schema.removeField("mpwzq9xk")

  // remove
  collection.schema.removeField("dzneawfh")

  // remove
  collection.schema.removeField("t1i6phfc")

  // remove
  collection.schema.removeField("w1cpmzlk")

  // remove
  collection.schema.removeField("xg2hnca6")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "o0hwn3yh",
    "name": "name",
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
