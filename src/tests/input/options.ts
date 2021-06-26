export const properties = [
  // NON_ALPHABETIZED_OPTIONS
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
];

// UPSERT_OPTION_WITH_WRONG_NAME
// UPSERT_OPTION_WITH_WRONG_DESCRIPTION
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
