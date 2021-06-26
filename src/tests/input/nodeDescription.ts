// PNG_ICON_IN_NODE_DESCRIPTION
// SUBTITLE_MISSING_IN_NODE_DESCRIPTION
export class QuickBooks implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'QuickBooks',
		name: 'quickbooks',
		icon: 'file:quickbooks.png',
		group: ['transform'],
		version: 1,
		Xsubtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume the QuickBooks API',
		defaults: {
			name: 'QuickBooks',
			color: '#2CA01C',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'quickBooksOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Bill',
						value: 'bill',
					},
					{
						name: 'Customer',
						value: 'customer',
					},
				],
				default: 'customer',
				description: 'Resource to consume',
			},
		],
	};
}

// DISPLAYNAME_NOT_ENDING_WITH_TRIGGER_IN_NODE_DESCRIPTION
// NAME_NOT_ENDING_WITH_TRIGGER_IN_NODE_DESCRIPTION
export class BoxTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Box Traigger', // misspelled
		name: 'boxTraigger', // misspelled
		icon: 'file:box.svg',
		group: ['trigger'],
		version: 1,
		subtitle: 'Whatever',
		description: 'Starts the workflow when a Box events occurs',
		defaults: {
			name: 'Box Trigger',
			color: '#00aeef',
		},
		inputs: [],
		outputs: ['main'],
	}
}
