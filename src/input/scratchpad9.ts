export const accountContactOperations = [
  {
		displayName: 'For Customer',
		name: 'CustomerRef',
		type: 'options',
		required: true,
		description: 'The ID of the customer who the estimate is for.',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getCustomers',
		},
	},
] as INodeProperties[];