export const properties = [
  // DISPLAYNAME_WITH_MISCASED_ID
  {
    displayName: 'User Id',
    name: 'userId',
    type: 'string',
    default: '',
  },

  // DISPLAYNAME_WITH_NO_TITLECASE
  {
    displayName: 'user ID',
    name: 'userId',
    type: 'string',
    default: '',
  },

  // PARAM_DESCRIPTION_IDENTICAL_TO_DISPLAY_NAME
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
    description: 'User ID'
  },
];

// DISPLAYNAME_NOT_ENDING_WITH_TRIGGER_IN_NODE_DESCRIPTION
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

// FIXED_COLLECTION_VALUE_DISPLAY_NAME_WITH_NO_TITLECASE
export const hello = [
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
						displayName: 'alice',
						name: 'alice',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Bob',
						name: 'bob',
						type: 'string',
						default: '',
					},
				],
			},
		],
	}
];

// DISPLAYNAME_UNTRIMMED
const whoa = [
	{
		displayName: ' Additional Fields',
		name: 'additionalFieldsJson',
		type: 'json',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: [
					'company',
				],
				operation: [
					'create',
				],
				jsonParameters: [
					true,
				],
			},
		},
		description: 'Object of values to set as described <a href="https://github.com/agilecrm/rest-api#1-companys---companies-api" target="_blank">here</a>.',
	},
]

// NON_STANDARD_DISPLAY_NAME_FOR_SIMPLIFY_PARAM
export const a = [
  {
    displayName: 'SimplifyResponse',
    name: 'simple',
    type: 'boolean',
    displayOptions: {
        show: {
					operation: [
						'get',
						'getAll',
					],
					resource: [
						'contact',
					],
        },
    },
    default: true,
    description: 'Return a simplified version of the response instead of the raw data.',
  },
];

const g = [
  {
    displayName: 'Up1date Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: [
          'person',
        ],
        operation: [
          'update',
        ],
      },
    },
    options: [
      {
				name: 'Abc',
				value: 'abc',
			},
			{
				name: 'Def',
				value: 'def',
			},
    ],
  },
]