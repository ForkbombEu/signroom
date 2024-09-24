// @ts-check

/// <reference path="../pb_data/types.d.ts" />

/** @typedef {{type: "object", required: string[], properties: Record<string,unknown>}} ObjectSchema */

migrate(
    (db) => {
        const dao = new Dao(db);
        const templates = dao.findRecordsByFilter(
            "templates",
            "id != null",
            "",
            0,
            0
        );

        for (const template of templates) {
            if (!template) continue;

            /** @type {ObjectSchema | null | undefined} */
            const schema = parseUnknown(template.get("schema"));
            /** @type {ObjectSchema | null | undefined} */
            const schema_secondary = parseUnknown(
                template.get("schema_secondary")
            );

            const schemas = [schema, schema_secondary].filter(
                (schema) => schema != null && schema != undefined
            );

            const mergedSchema = mergeObjectSchemas(schemas);
            template.set("schema", JSON.stringify(mergedSchema, null, 2));
            template.set("schema_secondary", null);
            dao.saveRecord(template);
        }
    },
    (db) => {
        // add down queries...
    }
);

//

/**
 * @param  {ObjectSchema[]} schemas
 * @returns {ObjectSchema}
 */
function mergeObjectSchemas(schemas) {
    const required = schemas.flatMap((s) => s.required ?? []);
    const properties = schemas.flatMap((s) =>
        Object.entries(s.properties ?? {})
    );

    /** @type {ObjectSchema} */
    return {
        type: "object",
        required,
        properties: Object.fromEntries(properties),
    };
}

/** @param {any} data */
function parseUnknown(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        console.log("Couldn't parse: ", data);
        return undefined;
    }
}
