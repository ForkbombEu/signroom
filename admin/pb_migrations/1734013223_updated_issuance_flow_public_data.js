/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0fg9n15rb903u1q")

  collection.options = {
    "query": "SELECT\n  services.id,\n  services.display_name,\n  services.type_name,\n  services.description,\n  services.logo,\n  organizations.name as organization,\n  organizations.avatar as organization_logo,\n  organizations.description as organization_description,\n  authorization_servers.endpoint AS authorization_server,\n  issuers.endpoint as credential_issuer\nFROM\n  services\nLEFT JOIN\n  authorization_servers on services.authorization_server = authorization_servers.id\nLEFT JOIN\n  issuers on services.credential_issuer = issuers.id\nLEFT JOIN\n  organizations on services.organization = organizations.id"
  }

  // remove
  collection.schema.removeField("bllyksqp")

  // remove
  collection.schema.removeField("gkpev7pj")

  // remove
  collection.schema.removeField("lbyaam8i")

  // remove
  collection.schema.removeField("oxgxjnkl")

  // remove
  collection.schema.removeField("i15vwtek")

  // remove
  collection.schema.removeField("ia1q6j7c")

  // remove
  collection.schema.removeField("dn9too1p")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wgeowhkd",
    "name": "display_name",
    "type": "text",
    "required": true,
    "presentable": false,
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
    "id": "yvymtbdq",
    "name": "type_name",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^[a-zA-Z0-9_]+$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "i35mb4j8",
    "name": "description",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eb4a7j1v",
    "name": "logo",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wdz0etvt",
    "name": "organization",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 2,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3vefuykf",
    "name": "organization_logo",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/svg+xml"
      ],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1tbdk5re",
    "name": "organization_description",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bs686wrx",
    "name": "authorization_server",
    "type": "url",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "akp2ol5y",
    "name": "credential_issuer",
    "type": "url",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0fg9n15rb903u1q")

  collection.options = {
    "query": "SELECT\n  services.id,\n  services.display_name,\n  services.type_name,\n  services.logo,\n  authorization_servers.endpoint AS authorization_server,\n  issuers.endpoint as credential_issuer,\n  organizations.name as organization,\n  organizations.avatar as organization_logo\nFROM\n  services\nLEFT JOIN\n  authorization_servers on services.authorization_server = authorization_servers.id\nLEFT JOIN\n  issuers on services.credential_issuer = issuers.id\nLEFT JOIN\n  organizations on services.organization = organizations.id"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bllyksqp",
    "name": "display_name",
    "type": "text",
    "required": true,
    "presentable": false,
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
    "id": "gkpev7pj",
    "name": "type_name",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^[a-zA-Z0-9_]+$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lbyaam8i",
    "name": "logo",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oxgxjnkl",
    "name": "authorization_server",
    "type": "url",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "i15vwtek",
    "name": "credential_issuer",
    "type": "url",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ia1q6j7c",
    "name": "organization",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 2,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dn9too1p",
    "name": "organization_logo",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/svg+xml"
      ],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  // remove
  collection.schema.removeField("wgeowhkd")

  // remove
  collection.schema.removeField("yvymtbdq")

  // remove
  collection.schema.removeField("i35mb4j8")

  // remove
  collection.schema.removeField("eb4a7j1v")

  // remove
  collection.schema.removeField("wdz0etvt")

  // remove
  collection.schema.removeField("3vefuykf")

  // remove
  collection.schema.removeField("1tbdk5re")

  // remove
  collection.schema.removeField("bs686wrx")

  // remove
  collection.schema.removeField("akp2ol5y")

  return dao.saveCollection(collection)
})
