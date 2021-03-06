export const properties = [
  // WRONG_DEFAULT_FOR_STRING_TYPE_PARAM
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: 3,
  },

  // WRONG_DEFAULT_FOR_NUMBER_TYPE_PARAM
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'number',
    default: '',
  },

  // WRONG_DEFAULT_FOR_BOOLEAN_TYPE_PARAM
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'boolean',
    default: '',
  },

  // WRONG_DEFAULT_FOR_COLLECTION_TYPE_PARAM
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'collection',
    placeholder: 'Add Field',
    default: 'b',
    options: [
      {
        displayName: 'A',
        name: 'a',
        type: 'string',
        default: '',
        description: 'Some description.',
      },
    ],
  },

  // WRONG_DEFAULT_FOR_MULTIOPTIONS_TYPE_PARAM
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'multiOptions',
    placeholder: 'Add Field',
    default: '',
    options: [
      {
        displayName: 'A',
        name: 'a',
        type: 'string',
        default: '',
        description: 'Some description.',
      },
    ],
  },

  // WRONG_DEFAULT_FOR_OPTIONS_TYPE_PARAM
  {
    displayName: 'Non-Option Default',
    name: 'nonOptionDefault',
    type: 'options',
    options: [
      {
        name: 'a',
        value: 'a',
        description: 'Some description.',
      },
      {
        name: 'b',
        value: 'b',
        description: 'Some description.',
      },
    ],
    default: 'c',
  },

  // DEFAULT_MISSING
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    description: 'Some description.',
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

  // WRONG_DEFAULT_FOR_SIMPLIFY_PARAM
  {
    displayName: 'Simplify Response',
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
    default: false,
    description: 'Return a simplified version of the response instead of the raw data.',
  },
];
