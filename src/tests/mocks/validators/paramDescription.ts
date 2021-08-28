[
  // PARAM_DESCRIPTION_MISSING_WHERE_REQUIRED
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
  },

  // PARAM_DESCRIPTION_WITH_UNCAPITALIZED_INITIAL
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
    description: 'description without initial capital.',
  },

  // PARAM_DESCRIPTION_UNTRIMMED
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
		description: ' This is untrimmed'
  },

  // PARAM_DESCRIPTION_WITH_MISCASED_ID
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
		description: 'This is a miscased id right here'
  },

  // PARAM_DESCRIPTION_WITH_UNNEEDED_BACKTICKS
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
		description: `These backticks are unnecessary`
  },

  // PARAM_DESCRIPTION_WITH_EXCESS_FINAL_PERIOD
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
    description: 'Sentence.',
  },

  // PARAM_DESCRIPTION_WITH_MISSING_FINAL_PERIOD
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
    description: 'Sentence. Another sentence',
  },

  // PARAM_DESCRIPTION_MISSING_WHERE_OPTIONAL
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
      {
        name: 'Employee',
        value: 'employee',
      },
    ],
    default: 'customer',
    description: 'Resource to consume',
  },

  // PARAM_DESCRIPTION_AS_EMPTY_STRING
  {
		displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
		description: '',
	},

  // BOOLEAN_DESCRIPTION_NOT_STARTING_WITH_WHETHER
  {
		displayName: 'Is Admin',
		name: 'isAdmin',
		type: 'boolean',
		default: true,
		description: 'This property determines if a user is an admin.',
	},

  // PARAM_DESCRIPTION_IDENTICAL_TO_DISPLAY_NAME
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
		description: 'User ID'
  },

  // TECHNICAL_TERM_IN_PARAM_DESCRIPTION
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
    description: 'A description containing the term string'
  },

];

// WEAK_PARAM_DESCRIPTION
export class OpenWeatherMap implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenWeatherMap',
		name: 'openWeatherMap',
		icon: 'fa:sun',
		group: ['input'],
		version: 1,
		description: 'Gets current and future weather information.',
		defaults: {
			name: 'OpenWeatherMap',
			color: '#554455',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Current Weather',
						value: 'currentWeather',
						description: 'Returns the current weather data',
					},
					{
						name: '5 day Forecast',
						value: '5DayForecast',
						description: 'Returns the weather data for the next 5 days',
					},
				],
				default: 'currentWeather',
				description: 'The operation to perform.',
			},
		]
	}
}

// NON_STANDARD_HTML_LINE_BREAK
export const accountContactOperations = [
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		placeholder: '',
		description: 'Name of the binary property which contains<br />the data for the file(s) to be compress/decompress. Multiple can be used separated by ,',
	},
]

// NON_STANDARD_DESCRIPTION_FOR_SIMPLIFY_PARAM
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

// PARAM_DESCRIPTION_WITH_EXCESS_WHITESPACE
export const x = [
  {
    displayName: 'Timezone',
    name: 'timeZone',
    type: 'string',
    typeOptions: {
      loadOptionsMethod: 'getTimezones',
    },
    default: '',
    description: 'Time zone used in the response.  The default is the time zone of the calendar.',
  },
];