import {
	INodeProperties,
} from 'n8n-workflow';

export const webinarOperations = [
  {
    displayName: 'Timezone',
    name: 'timeZone',
    type: 'string',
    typeOptions: {
      loadOptionsMethod: 'getTimezones',
    },
    default: '',
    description: `Time zone used in the response. The default is the time zone of the calendar.`,
  },
] as INodeProperties[];
