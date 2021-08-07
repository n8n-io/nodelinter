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

// WRONG_ERROR_THROWN
throw Error();