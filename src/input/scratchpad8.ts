
export class Drift implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Drift',
		name: 'drift',
		icon: 'file:drift.png',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"]',
		description: 'Consume Drift API',
		defaults: {
			name: 'Drift ',
			color: '#404040',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'driftApi',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'accessToken',
						],
					},
				},
			},
			{
				name: 'driftOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'oAuth2',
						],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Access Token',
						value: 'accessToken',
					},
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'accessToken',
				description: 'The resource to operate on.',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Contact',
						value: 'contact',
					},
				],
				default: 'contact',
				description: 'Resource to consume.',
			},
		],
	};
}