/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ffk93r2b2r1fqjo")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_vKIJ8Ru` ON `issuers` (\n  `name`,\n  `organization`\n)",
    "CREATE UNIQUE INDEX `idx_jJxvJeP` ON `issuers` (\n  `endpoint`,\n  `organization`,\n  `port`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ffk93r2b2r1fqjo")

  collection.indexes = []

  return dao.saveCollection(collection)
})
