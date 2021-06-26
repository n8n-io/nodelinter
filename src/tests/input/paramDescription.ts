const properties = [
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
    description: 'Sentence. Another sentence.',
  },

  // PARAM_DESCRIPTION_MISSING_WHERE_REQUIRED
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
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

  // ANCHOR_LINK_WITH_TARGET_BLANK_MISSING
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
    description: 'This is a <a href="https://www.hello.com">link</a>.',
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
];
