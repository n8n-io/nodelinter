export const properties = [
  // NON_ALPHABETIZED_OPTIONS
  {
    displayName: 'Choices',
    name: 'choices',
    type: 'options',
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
    ],
    default: 'public',
  },
];
