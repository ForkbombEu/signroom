/// <reference path="../pb_data/types.d.ts" />

onRecordBeforeCreateRequest((e) => {
    console.log("Hook - orgJoinRequests - Setting pending status");
    e.record.set("status", "pending");
}, "orgJoinRequests");