export const properties = [
  // REQUIRED_FALSE
  {
    displayName: 'Required False',
    name: 'requiredFalse',
    required: false,
    type: 'string',
    default: '',
    description: 'This has a required false.'
  },
] as INodeProperties[]; // Removing casing causes test to fail, for unknown reason.

// NON_STANDARD_RETURNALL_DESCRIPTION
export const accountContactOperations = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
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

// TS_IGNORE
export const webinarOperations = [
  {
    displayName: 'Timezone',
    name: 'timeZone',
    // @ts-ignore
    type: 'string',
    typeOptions: {
      loadOptionsMethod: 'getTimezones',
    },
    default: '',
    description: 'Time zone used in the response.  The default is the time zone of the calendar.',
  },
];

// TODO
export const abc = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		// TODO
		type: 'boolean',
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

// WRONG_ERROR_THROWN
throw Error();

// RESOURCE_WITHOUT_NO_DATA_EXPRESSION
export class Splunk implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Splunk',
		name: 'splunk',
		icon: 'file:splunk.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume the Splunk Enterprise API',
		defaults: {
			name: 'Splunk',
			color: '#e20082',
		},
		inputs: ['main'],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Fired Alert',
						value: 'firedAlert',
					},
					{
						name: 'Search Configuration',
						value: 'searchConfiguration',
					},
					{
						name: 'Search Job',
						value: 'searchJob',
					},
					{
						name: 'Search Result',
						value: 'searchResult',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'searchJob',
			},
		]
	}
};

// OPERATION_WITHOUT_NO_DATA_EXPRESSION
export const firedAlertOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'firedAlert',
				],
			},
		},
		options: [
			{
				name: 'Get Report',
				value: 'getReport',
				description: 'Retrieve a fired alerts report',
			},
		],
		default: 'getReport',
	},
];

// I_NODE_PROPERTIES_MISCASTING
export const firedAlertOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'firedAlert',
				],
			},
		},
		options: [
			{
				name: 'Get Report',
				value: 'getReport',
				description: 'Retrieve a fired alerts report',
			},
		],
		default: 'getReport',
	},
] as INodeProperties[];