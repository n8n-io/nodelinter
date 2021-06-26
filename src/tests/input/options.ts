export const properties = [
  // NON_ALPHABETIZED_OPTIONS_IN_OPTIONS_TYPE_PARAM
  {
    displayName: 'Choices',
    name: 'choices',
    type: 'options',
    options: [
      {
        name: 'Public',
        value: 'public',
        description: 'Run the hooks when a contact triggers the action',
      },
      {
        name: 'Admin',
        value: 'admin',
        description: 'Run the hooks when an admin user triggers the action',
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
				name: 'bbbb',
				value: 'bbb',
			},
			{
				name: 'approved',
				value: 'approved',
			},
		],
		default: [],
		description: 'You may specify relations to include with your response.',
	},
];


// UPSERT_OPTION_WITH_MISWORDED_NAME
// UPSERT_OPTION_WITH_MISWORDED_DESCRIPTION
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
						displayName: 'Bob',
						name: 'bob',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Alice',
						name: 'alice',
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
				displayName: 'Bob',
				name: 'bob',
				type: 'string',
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Bcc Email',
				},
				description: 'Bcc Recipients of the email.',
				default: [],
			},
			{
				displayName: 'Alice',
				name: 'alice',
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