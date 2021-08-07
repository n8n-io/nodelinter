export const webinarOperations2 = [
  {
    displayName: 'Timezone',
    name: 'timeZone',
    type: 'string',
    typeOptions: {
      loadOptionsMethod: 'getTimezones',
    },
    default: '',
    // nodelinter-ignore-next-line PARAM_DESCRIPTION_UNTRIMMED PARAM_DESCRIPTION_WITH_EXCESS_WHITESPACE
    description: 'Time zone used in the response. The default is the time zone of the calendar.  ',
  },
];
