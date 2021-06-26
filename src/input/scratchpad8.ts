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
						displayName: 'Alice',
						name: 'Alice',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Bob',
						name: 'Bob',
						type: 'string',
						default: '',
					},
				],
			},
		],
	}
];