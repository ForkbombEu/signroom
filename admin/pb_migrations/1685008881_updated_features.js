migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z4cc0g76ciqx13v")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_T3xOIQy` ON `features` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z4cc0g76ciqx13v")

  collection.indexes = []

  return dao.saveCollection(collection)
})
