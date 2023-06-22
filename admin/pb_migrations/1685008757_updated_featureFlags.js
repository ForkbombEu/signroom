migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z4cc0g76ciqx13v")

  collection.name = "features"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z4cc0g76ciqx13v")

  collection.name = "featureFlags"

  return dao.saveCollection(collection)
})
