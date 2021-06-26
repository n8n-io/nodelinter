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

  // LIMIT_LOWER_THAN_ONE
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
		description: 'The number of results to return.',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
	},
];