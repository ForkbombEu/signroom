/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	CrudExample = "CrudExample",
	Features = "features",
	Folders = "folders",
	Hooks = "hooks",
	Signatures = "signatures",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export enum CrudExampleSelectOptions {
	"opt1" = "opt1",
	"opt2" = "opt2",
	"opt3" = "opt3",
	"opt4" = "opt4",
	"opt5" = "opt5",
}

export enum CrudExampleMultiselectOptions {
	"A" = "A",
	"B" = "B",
	"C" = "C",
	"D" = "D",
}
export type CrudExampleRecord = {
	text: string
	file_only_pdf_json: string[]
	boolean?: boolean
	select: CrudExampleSelectOptions
	textarea?: HTMLString
	text_with_regex?: string
	multiselect?: CrudExampleMultiselectOptions[]
	relation?: RecordIdString[]
	image?: string
	relation_single: RecordIdString
	owner?: RecordIdString
}

export type FeaturesRecord<TenvVariables = unknown> = {
	name: string
	active?: boolean
	envVariables?: null | TenvVariables
}

export type FoldersRecord = {
	name?: string
	owner?: RecordIdString
}

export enum HooksEventOptions {
	"insert" = "insert",
	"update" = "update",
	"delete" = "delete",
}

export enum HooksActionTypeOptions {
	"command" = "command",
	"post" = "post",
}
export type HooksRecord = {
	collection: string
	event: HooksEventOptions
	action_type: HooksActionTypeOptions
	action: string
	action_params?: string
	expands?: string
	disabled?: boolean
}

export enum SignaturesTypeOptions {
	"json" = "json",
	"pdf" = "pdf",
	"xml" = "xml",
}
export type SignaturesRecord<Tsigned_file = unknown> = {
	title?: string
	description?: HTMLString
	owner?: RecordIdString
	folder?: RecordIdString
	file?: string
	type?: SignaturesTypeOptions
	signed_file?: null | Tsigned_file
}

export type UsersRecord = {
	name?: string
	avatar?: string
	bitcoin_public_key?: string
	ecdh_public_key?: string
	eddsa_public_key?: string
	ethereum_address?: string
	reflow_public_key?: string
}

// Response types include system fields and match responses from the PocketBase API
export type CrudExampleResponse<Texpand = unknown> = Required<CrudExampleRecord> & BaseSystemFields<Texpand>
export type FeaturesResponse<TenvVariables = unknown, Texpand = unknown> = Required<FeaturesRecord<TenvVariables>> & BaseSystemFields<Texpand>
export type FoldersResponse<Texpand = unknown> = Required<FoldersRecord> & BaseSystemFields<Texpand>
export type HooksResponse<Texpand = unknown> = Required<HooksRecord> & BaseSystemFields<Texpand>
export type SignaturesResponse<Tsigned_file = unknown, Texpand = unknown> = Required<SignaturesRecord<Tsigned_file>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	CrudExample: CrudExampleRecord
	features: FeaturesRecord
	folders: FoldersRecord
	hooks: HooksRecord
	signatures: SignaturesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	CrudExample: CrudExampleResponse
	features: FeaturesResponse
	folders: FoldersResponse
	hooks: HooksResponse
	signatures: SignaturesResponse
	users: UsersResponse
}