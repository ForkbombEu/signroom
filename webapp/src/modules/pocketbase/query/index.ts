import { getCollectionModel, type CollectionName } from '@/pocketbase/collections-models';
import type { CollectionExpands, CollectionResponses, RecordIdString } from '@/pocketbase/types';
import type { KeyOf } from '@/utils/types';
import PocketBase, {
	type ListResult,
	type RecordFullListOptions,
	type RecordListOptions
} from 'pocketbase';
import { pb } from '@/pocketbase';
import type { Simplify } from 'type-fest';
import { Option, String } from 'effect';

//

export type ExpandQueryOption<C extends CollectionName> = KeyOf<CollectionExpands[C]>[];

type ResolveExpandOption<C extends CollectionName, E extends ExpandQueryOption<C>> = Partial<
	Pick<CollectionExpands[C], E[number]>
>;

export type QueryResponse<
	C extends CollectionName,
	Expand extends ExpandQueryOption<C> = never
> = CollectionResponses[C] &
	Simplify<{
		expand?: ResolveExpandOption<C, Expand>;
	}>;

type PocketbaseListOptions = Simplify<
	Omit<RecordFullListOptions | RecordListOptions, 'perPage' | 'page'>
>;

export type PocketbaseQueryOptions<C extends CollectionName, E extends ExpandQueryOption<C>> = {
	expand: E;
	filter: string;
	exclude: RecordIdString[];
	search: string;
	sort: string;
	perPage: number;
	requestKey: string | null;
	fetch: typeof fetch;
	pocketbase: PocketBase;
};

export class PocketbaseQuery<C extends CollectionName, E extends ExpandQueryOption<C>> {
	constructor(
		public collection: C,
		public options: Partial<PocketbaseQueryOptions<C, E>> = {}
	) {}

	get pocketbase(): PocketBase {
		return this.options.pocketbase ?? pb;
	}

	// Filters

	get baseFilter(): Option.Option<string> {
		return Option.fromNullable(this.options.filter);
	}

	get excludeFilter(): Option.Option<string> {
		return Option.fromNullable(this.options.exclude).pipe(
			Option.map((ids) => ids.map((id) => `id != '${id}'`).join(' && '))
		);
	}

	get searchFilter(): Option.Option<string> {
		return Option.fromNullable(this.options.search).pipe(
			Option.map((searchText) => {
				const fieldNames = getCollectionModel(this.collection).schema.map((field) => field.name);
				if (this.collection == 'users') fieldNames.push('email');
				return fieldNames.map((f) => `${f} ~ "${searchText}"`).join(' || ');
			})
		);
	}

	// Options

	get filterOption(): Option.Option<string> {
		const filters = [this.baseFilter, this.excludeFilter, this.searchFilter]
			.filter(Option.isSome)
			.map(Option.getOrThrow)
			.filter(String.isNonEmpty);
		if (filters.length == 0) return Option.none();

		const filter = filters.map((filter) => `( ${filter} )`).join(' && ');
		return Option.some(filter);
	}

	get expandOption(): Option.Option<string> {
		return Option.fromNullable(this.options.expand).pipe(Option.map((expand) => expand.join(', ')));
	}

	get pocketbaseListOptions(): PocketbaseListOptions {
		const {
			sort = '-created',
			fetch: fetchFn = fetch,
			requestKey = null,
			perPage = null
		} = this.options;
		// Important! Pocketbase wants `null`, not `undefined`!

		return {
			requestKey,
			sort,
			expand: this.expandOption.pipe(Option.getOrNull),
			filter: this.filterOption.pipe(Option.getOrNull),
			fetch: fetchFn,
			perPage
		};
	}

	//

	getFullList(): Promise<QueryResponse<C, E>[]> {
		return pb.collection(this.collection).getFullList(this.pocketbaseListOptions);
	}

	getList(currentPage: number): Promise<ListResult<QueryResponse<C, E>>> {
		const { perPage } = this.options;
		return pb.collection(this.collection).getList(currentPage, perPage, this.pocketbaseListOptions);
	}
}
