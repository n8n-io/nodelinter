export const properties = [
  // LIMIT_WITHOUT_TYPE_OPTIONS
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    XtypeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 100,
    description: 'Number of results to return.',
  },

  // LIMIT_LOWER_THAN_ONE
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: {
      minValue: 0,
      maxValue: 100,
    },
    default: 100,
    description: 'Number of results to return.',
  },
];