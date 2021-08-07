export const webinarOperations3 = [
  {
    displayName: 'Timezone',
    name: 'timeZone',
    type: 'string',
    typeOptions: {
      loadOptionsMethod: 'getTimezones',
    },
    default: '',
    // nodelinter-ignore-next-line
    description: 'Time zone used in the response. The default is the time zone of the calendar.  ',
  },
];
