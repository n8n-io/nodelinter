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

// COLOR_TYPE_NOT_USED_FOR_COLOR_PARAM
const abc = {
	displayName: 'Foreground Colour',
	name: 'foregroundColor',
	type: 'coXlor',
	default: '#000000',
	displayOptions: {
		show: {
			resource: [
				'spaceTag',
			],
			operation: [
				'create',
				'update',
			],
		},
	},
	required: true,
};

// TOP_LEVEL_OPTIONAL_FIXED_COLLECTION
export const objectOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		default: 'get',
		description: 'Operation to perform',
		options: [
			{
				name: 'Create',
				value: 'create',
			},
			{
				name: 'Delete',
				value: 'delete',
			},
			{
				name: 'Get',
				value: 'get',
			},
			{
				name: 'Get All',
				value: 'getAll',
			},
			{
				name: 'Update',
				value: 'update',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'object',
				],
			},
		},
	},
] as INodeProperties[];

export const objectFields = [
	// ----------------------------------
	//         object: create
	// ----------------------------------
	{
		displayName: 'Type Name',
		name: 'typeName',
		type: 'string',
		required: true,
		description: 'Name of data type of the object to create.',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'object',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Properties',
		name: 'properties',
		placeholder: 'Add Property',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: [
					'object',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Property',
				name: 'property',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'Field to set for the object to create.',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value to set for the object to create.',
					},
					{
						displayName: 'Elements',
						name: 'elementsUi',
						placeholder: 'Add Element',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						displayOptions: {
							show: {
								type: [
									'actions',
								],
							},
						},
						default: {},
						options: [
							{
								name: 'elementsValues',
								displayName: 'Element',
								values: [
									{
										displayName: 'Type',
										name: 'type',
										type: 'options',
										options: [
											{
												name: 'Button',
												value: 'button',
											},
										],
										default: 'button',
										description: 'The type of element',
									},
									{
										displayName: 'Text',
										name: 'text',
										type: 'string',
										displayOptions: {
											show: {
												type: [
													'button',
												],
											},
										},
										default: '',
										description: 'The text for the block.',
									},
									{
										displayName: 'Emoji',
										name: 'emoji',
										type: 'boolean',
										displayOptions: {
											show: {
												type: [
													'button',
												],
											},
										},
										default: false,
										description: 'Indicates whether emojis in a text field should be escaped into the colon emoji format.',
									},
								],
							},
						],
					},
				],
			},
		],
	},
] as INodeProperties[];
