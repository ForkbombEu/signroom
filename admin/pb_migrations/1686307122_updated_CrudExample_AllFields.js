migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

  // remove
  collection.schema.removeField("dtaeifmm")

  // remove
  collection.schema.removeField("mpwzq9xk")

  // remove
  collection.schema.removeField("w1cpmzlk")

  // remove
  collection.schema.removeField("xg2hnca6")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3hmes6kr",
    "name": "file_only_pdf_json",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 99,
      "maxSize": 5242880,
      "mimeTypes": [
        "application/json",
        "application/pdf"
      ],
      "thumbs": [],
      "protected": false
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dzneawfh",
    "name": "select",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "opt1",
        "opt2",
        "opt3",
        "opt4",
        "opt5"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

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
    "id": "3hmes6kr",
    "name": "file",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 99,
      "maxSize": 5242880,
      "mimeTypes": [
        "application/json",
        "application/pdf"
      ],
      "thumbs": [],
      "protected": false
    }
  }))

  // update
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

  return dao.saveCollection(collection)
})
