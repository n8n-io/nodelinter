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
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
					},
				],
			},
		],
	}
];