export const properties = [
  // NAME_WITH_MISCASED_ID
  {
    displayName: 'User ID',
    name: 'user ID',
    type: 'string',
    default: '',
  },

  // NAME_WITH_NO_CAMELCASE
  {
    displayName: 'User ID',
    name: 'User Id',
    type: 'string',
    default: '',
  },
];

// AUTHENTICATION_PROPERTY_NOT_IN_CREDENTIALS
export class Harvest implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Harvest',
		name: 'harvest',
		icon: 'file:harvest.png',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Access data on Harvest',
		defaults: {
			name: 'Harvest',
			color: '#e7863f',
		},
		inputs: ['main'],
		outputs: ['main'],
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
				description: 'Method of authentication.',
			},
		]
	}
}