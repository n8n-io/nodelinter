const whoa = {
  displayName: 'Simplify Response',
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
  default: false,
  description: 'Return a simplified version of the response instead of the raw data.',
};