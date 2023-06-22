migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p9dhra382rts3bg")

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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dzneawfh",
    "name": "select",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 5,
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
