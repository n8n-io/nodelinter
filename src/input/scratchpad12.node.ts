export const accountContactOperations = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		// @ts-ignore
		type: 'boolean',
		// TODO: Whoa
		displayOptions: {
			show: {
				operation: [
					'getAll',
				],
				resource: [
					'project',
				],
			},
		},
		default: false,
		description: 'Whether all results should be returned',
	},
]