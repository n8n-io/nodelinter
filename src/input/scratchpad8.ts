export const properties = [
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