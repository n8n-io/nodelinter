import { INodeProperties } from 'n8n-workflow';

export const accountContactOperations = [
  {
    displayName: 'User of Users',
    name: 'userId',
    type: 'string',
    default: '',
		description: 'Some description'
  },
] as INodeProperties[];
