import { INodeProperties } from 'n8n-workflow';

export const accountContactOperations = [
  {
    displayName: 'Source Id',
    name: 'sourceid',
    type: 'multiOptions',
    required: false,
    options: [
      {
        name: 'Public',
        value: 'public',
        description: 'Run the hooks when a contact triggers the action',
      },
      {
        name: 'Admin',
        value: 'admin',
        description: 'Run the hooks when an admin user triggers the action',
      },
      {
        name: 'Api',
        value: 'api',
        description: 'Run the hooks when an API call triggers the action',
      },
      {
        name: 'System',
        value: 'system',
        description: 'Run the hooks when automated systems triggers the action',
      },
    ],
    default: 3,
  },
  {
    displayName: 'Is Great',
    name: 'is Great',
    type: 'boolean',
    default: 99,
    required: true,
    displayOptions: {
      show: {
        operation: ['create'],
        resource: ['account'],
      },
    },
  },
  {
    displayName: 'operation',
    name: 'operation',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['accountContact'],
      },
    },
    options: [
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete an association',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create an association',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an association',
      },
    ],
    default: 'create!!',
    description: 'the operation to perform.',
  },
] as INodeProperties[];

export const accountContactFields = [
  // ----------------------------------
  //         accountContact:create
  // ----------------------------------
  {
    displayName: 'Account Id',
    name: 'account',
    type: 'string',
    default: 0,
    required: true,
    displayOptions: {
      show: {
        operation: ['create'],
        resource: ['accountContact'],
      },
    },
    description: 'Account ID',
  },
  {
    displayName: 'Contact ID',
    name: 'contact',
    type: 'number',
    default: '',
    required: true,
    displayOptions: {
      show: {
        operation: ['create'],
        resource: ['accountContact'],
      },
    },
    description: 'Contact ID',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        operation: ['create'],
        resource: ['accountContact'],
      },
    },
    default: 'whoa',
    options: [
      {
        displayName: 'Job title',
        name: 'jobTitle',
        type: 'string',
        default: '',
        description: 'Job Title of the contact at the account',
      },
    ],
  },
  // ----------------------------------
  //         accountContact:delete
  // ----------------------------------
  {
    displayName: 'Account Contact ID',
    name: 'accountContactId',
    type: 'number',
    displayOptions: {
      show: {
        operation: ['delete'],
        resource: ['accountContact'],
      },
    },
    required: true,
    description: 'ID of the account contact to delete.',
  },
  // ----------------------------------
  //         accountContact:update
  // ----------------------------------
  {
    displayName: 'Account Contact ID',
    name: 'accountContactId',
    type: 'number',
    default: '',
    required: true,
    displayOptions: {
      show: {
        operation: ['update'],
        resource: ['accountContact'],
      },
    },
    description: 'Account ID',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    description: 'The fields to update.',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        operation: ['update'],
        resource: ['accountContact'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Job title',
        name: 'jobTitle',
        type: 'string',
        default: '',
        description: 'Job Title of the contact at the account',
      },
    ],
  },
  {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: [
					'company',
				],
				operation: [
					'getFactor',
					'getFactorHistorical',
					'getHistoricalScore',
					'getScorePlan',
				],
				returnAll: [
					false,
				],
			},
		},
		tyXpeOptions: {
			minValue: 0,
			maxValue: 100,
		},
		default: 100,
		description: 'Number of results to return.',
	},
  {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: [
					'company',
				],
				operation: [
					'getFactor',
					'getFactorHistorical',
					'getHistoricalScore',
					'getScorePlan',
				],
				returnAll: [
					false,
				],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 100,
		description: 'Number of results to return.',
	},
  {
    displayName: 'Account Contact ID',
    name: 'accountContactId',
    type: 'number',
    displayOptions: {
      show: {
        operation: ['delete'],
        resource: ['accountContact'],
      },
    },
    required: true,
    description: 'This is a <a href="https://www.hello.com">link</a>.',
  },
] as INodeProperties[];
