/// <reference path="../pb_data/types.d.ts" />

interface RecordModel<R extends Record<string, unknown>> extends models.Record {
    get: <K extends keyof R & string>(key: K) => R[K];
}
