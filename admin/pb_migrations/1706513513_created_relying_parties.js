/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "3heyih6ln5gqi2l",
    "created": "2024-01-29 07:31:53.438Z",
    "updated": "2024-01-29 07:31:53.438Z",
    "name": "relying_parties",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "awr9octk",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "dvovf4rl",
        "name": "endpoint",
        "type": "url",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": []
        }
      },
      {
        "system": false,
        "id": "tigmzqog",
        "name": "organization",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "aako88kt3br4npt",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n@collection.orgAuthorizations.organization.id ?= organization.id &&\n(@collection.orgAuthorizations.role.name ?= \"admin\" || \n @collection.orgAuthorizations.role.name ?= \"owner\")",
    "updateRule": "@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n@collection.orgAuthorizations.organization.id ?= organization.id &&\n(@collection.orgAuthorizations.role.name ?= \"admin\" || \n @collection.orgAuthorizations.role.name ?= \"owner\")",
    "deleteRule": "@collection.orgAuthorizations.user.id ?= @request.auth.id &&\n@collection.orgAuthorizations.organization.id ?= organization.id &&\n(@collection.orgAuthorizations.role.name ?= \"admin\" || \n @collection.orgAuthorizations.role.name ?= \"owner\")",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("3heyih6ln5gqi2l");

  return dao.deleteCollection(collection);
})
