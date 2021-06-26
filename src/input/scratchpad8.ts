import { INodeProperties } from 'n8n-workflow';

export const accountContactOperations = [
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
		description: 'User ID'
  },
] as INodeProperties[];
