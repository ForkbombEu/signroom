/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gn37nyhp1aif6")

  collection.indexes = [
    "CREATE INDEX `idx_vzkqV6U` ON `services` (\n  `organization`,\n  `type_name`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gn37nyhp1aif6")

  collection.indexes = []

  return dao.saveCollection(collection)
})
