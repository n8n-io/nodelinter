export class Stripe implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Stripe',
		name: 'stripe',
		icon: 'file:stripe.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume the Stripe API',
		defaults: {
			name: 'Stripe',
			color: '#6772e5',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'stripeA2pi',
				required: true,
			},
		],
  }
}