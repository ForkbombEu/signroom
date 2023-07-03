import { writable } from 'svelte/store';
import { Collections, type FeaturesResponse } from './pocketbase-types';
import { pb } from './pocketbase';

//

export const features = writable<Array<FeaturesResponse>>([]);

export async function loadFeatures() {
	const feats = await pb
		.collection(Collections.Features)
		.getFullList<FeaturesResponse>({ $autoCancel: false });
	features.set(feats);
	return feats;
}
// "$autoCancel: false" is needed to avoid canceling the request
// in case multiple layouts need to load the features

export function getFeatureByName(features: FeaturesResponse[], name: string) {
	return features.find((f) => f.name === name);
}

export function isFeatureActive(features: FeaturesResponse[], name: string) {
	const feature = getFeatureByName(features, name);
	return Boolean(feature) && Boolean(feature?.active);
}

export function areFeaturesActive(features: FeaturesResponse[], names: string[]) {
	return names.every((name) => isFeatureActive(features, name));
}

export const featuresNames = {
	AUTH: 'auth',
	DID: 'DID',
	KEYPAIROOM: 'keypairoom'
} as const;
