export const properties = [
  // LIMIT_WITHOUT_TYPE_OPTIONS
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    XtypeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 100,
    description: 'Number of results to return.',
  },

  // LIMIT_WITH_MIN_VALUE_LOWER_THAN_ONE
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: {
      minValue: 0,
      maxValue: 100,
    },
    default: 100,
    description: 'Number of results to return.',
  },

  // WRONG_DEFAULT_FOR_LIMIT_PARAM
  {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 5,
		description: 'How many results to return',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
	},
];

// NON_STANDARD_LIMIT_DESCRIPTION
export const accountContactOperations = [
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				operation: [
					'getAll',
				],
				resource: [
					'project',
				],
				returnAll: [
					false,
				],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		default: 100,
		description: 'Something is wrong here',
	},
]