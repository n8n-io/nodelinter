export const properties = [
  // NON_ALPHABETIZED_OPTIONS_IN_OPTIONS_TYPE_PARAM
  {
    displayName: 'Choices',
    name: 'choices',
    type: 'options',
    options: [
			{
				name: 'b',
				value: 'b',
			},
			{
				name: 'a',
				value: 'a',
			},
			{
				name: 'ccc',
				value: 'ccc',
			},
			{
				name: 'd',
				value: 'd',
			},
			{
				name: 'e',
				value: 'e',
			},
			{
				name: 'f',
				value: 'f',
			},
    ],
    default: 'public',
  },

	// NON_ALPHABETIZED_OPTIONS_IN_MULTIOPTIONS_TYPE_PARAM
	{
		displayName: 'Include',
		name: 'include',
		type: 'multiOptions',
		options: [
			{
				name: 'b',
				value: 'b',
			},
			{
				name: 'a',
				value: 'a',
			},
			{
				name: 'ccc',
				value: 'ccc',
			},
			{
				name: 'd',
				value: 'd',
			},
			{
				name: 'e',
				value: 'e',
			},
			{
				name: 'f',
				value: 'f',
			},
		],
		default: [],
		description: 'You may specify relations to include with your response.',
	},
];


// NON_STANDARD_NAME_FOR_UPSERT_OPTION
// NON_STANDARD_DESCRIPTION_FOR_UPSERT_OPTION
export const contactOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'contact',
				],
			},
		},
		options: [
			{
				name: 'Create/Update',
				value: 'upsert',
				description: 'Create/Update a contact',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a contact',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all contacts',
			},
		],
		default: 'upsert',
		description: 'The operation to perform.',
	},
] as INodeProperties[];

// NON_ALPHABETIZED_VALUES_IN_FIXED_COLLECTION_TYPE_PARAM
export const otherProperties = [
	{
		displayName: 'Template Data',
		name: 'templateDataUi',
		type: 'fixedCollection',
		placeholder: 'Add Data',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		options: [
			{
				displayName: 'Data',
				name: 'templateDataValues',
				values: [
					{
						displayName: 'b',
						name: 'b',
						type: 'string',
						default: '',
					},
					{
						displayName: 'a',
						name: 'a',
						type: 'string',
						default: '',
					},
					{
						displayName: 'c',
						name: 'c',
						type: 'string',
						default: '',
					},
					{
						displayName: 'd',
						name: 'd',
						type: 'string',
						default: '',
					},
					{
						displayName: 'e',
						name: 'e',
						type: 'string',
						default: '',
					},
					{
						displayName: 'f',
						name: 'f',
						type: 'string',
						default: '',
					},
				],
			},
		],
	}
];

// NON_ALPHABETIZED_OPTIONS_IN_COLLECTION_TYPE_PARAM
export const yetOtherProperties = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'b',
				name: 'b',
				type: 'string',
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Bcc Email',
				},
				description: 'Bcc Recipients of the email.',
				default: [],
			},
			{
				displayName: 'a',
				name: 'a',
				type: 'string',
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Cc Email',
				},
				description: 'Cc recipients of the email.',
				default: [],
			},
			{
				displayName: 'c',
				name: 'c',
				type: 'string',
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Cc Email',
				},
				description: 'Cc recipients of the email.',
				default: [],
			},
			{
				displayName: 'd',
				name: 'd',
				type: 'string',
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Cc Email',
				},
				description: 'Cc recipients of the email.',
				default: [],
			},
			{
				displayName: 'e',
				name: 'e',
				type: 'string',
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Cc Email',
				},
				description: 'Cc recipients of the email.',
				default: [],
			},
			{
				displayName: 'f',
				name: 'f',
				type: 'string',
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Cc Email',
				},
				description: 'Cc recipients of the email.',
				default: [],
			},
		],
	}
];

// FIXED_COLLECTION_VALUE_DISPLAY_NAME_WITH_NO_TITLECASE
export const hello = [
	{
		displayName: 'Template Data',
		name: 'templateDataUi',
		type: 'fixedCollection',
		placeholder: 'Add Data',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		options: [
			{
				displayName: 'Data',
				name: 'templateDataValues',
				values: [
					{
						displayName: 'alice',
						name: 'alice',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Bob',
						name: 'bob',
						type: 'string',
						default: '',
					},
				],
			},
		],
	}
];

// OPTIONS_NAME_WITH_NO_TITLECASE
// OPTIONS_VALUE_WITH_NO_CAMELCASE
export const hello2 = [
	{
		displayName: 'Encoding',
		name: 'encoding',
		type: 'options',
		options: [
			{
				name: 'alice',
				value: 'Alice',
			},
			{
				name: 'bob',
				value: 'Bob',
			},
		],
		default: 'Bob',
		required: true,
	},
];