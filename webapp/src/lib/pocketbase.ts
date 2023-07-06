import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase, { Admin, Record } from 'pocketbase';
import { writable } from 'svelte/store';
import type { UsersRecord } from './pocketbase-types';

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
export const currentUser = writable<Admin | (Record & UsersRecord) | null>(pb.authStore.model);
