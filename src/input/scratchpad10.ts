import { INodeProperties } from 'n8n-workflow';

export const accountContactOperations = [
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
] as INodeProperties[];
