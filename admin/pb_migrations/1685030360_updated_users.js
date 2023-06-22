migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.indexes = [
    "CREATE INDEX `__pb_users_auth__created_idx` ON `users` (`created`)",
    "CREATE UNIQUE INDEX `idx_C7SFIV3` ON `users` (\n  `bitcoin_public_key`,\n  `ecdh_public_key`,\n  `reflow_public_key`,\n  `ethereum_address`,\n  `eddsa_public_key`\n)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nf3jan6h",
    "name": "bitcoin_public_key",
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
    "id": "zjvzw9wa",
    "name": "ecdh_public_key",
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
    "id": "yg9yz2sc",
    "name": "eddsa_public_key",
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
    "id": "ouslgk2m",
    "name": "ethereum_address",
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
    "id": "vqu3zutd",
    "name": "reflow_public_key",
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
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.indexes = [
    "CREATE INDEX `__pb_users_auth__created_idx` ON `users` (`created`)"
  ]

  // remove
  collection.schema.removeField("nf3jan6h")

  // remove
  collection.schema.removeField("zjvzw9wa")

  // remove
  collection.schema.removeField("yg9yz2sc")

  // remove
  collection.schema.removeField("ouslgk2m")

  // remove
  collection.schema.removeField("vqu3zutd")

  return dao.saveCollection(collection)
})
