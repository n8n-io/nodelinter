export const accountContactOperations = [
	{
		displayName: 'Clean Session',
		name: 'clean',
		type: 'boolean',
		default: true,
		description: 'Set to false to receive QoS 1 and 2 messages while offline.',
	},
] as INodeProperties[];