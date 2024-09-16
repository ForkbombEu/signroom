/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3heyih6ln5gqi2l")

  collection.indexes = [
    "CREATE INDEX `idx_hHUjXx7` ON `relying_parties` (\n  `name`,\n  `organization`\n)",
    "CREATE UNIQUE INDEX `idx_QPSpOnT` ON `relying_parties` (\n  `organization`,\n  `endpoint`,\n  `port`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3heyih6ln5gqi2l")

  collection.indexes = []

  return dao.saveCollection(collection)
})
