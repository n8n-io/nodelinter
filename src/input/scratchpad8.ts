export const properties = [
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