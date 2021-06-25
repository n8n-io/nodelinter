import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	billFields,
	billOperations,
	customerFields,
	customerOperations,
	employeeFields,
	employeeOperations,
	estimateFields,
	estimateOperations,
	invoiceFields,
	invoiceOperations,
	itemFields,
	itemOperations,
	paymentFields,
	paymentOperations,
	vendorFields,
	vendorOperations,
} from './descriptions';

import {
	getRefAndSyncToken,
	getSyncToken,
	handleBinaryData,
	handleListing,
	loadResource,
	populateFields,
	processLines,
	quickBooksApiRequest,
} from './GenericFunctions';

export class QuickBooks implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'QuickBooks',
		name: 'quickbooks',
		icon: 'file:quickbooks.png',
		group: ['transform'],
		version: 1,
		Xsubtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume the QuickBooks API',
		defaults: {
			name: 'QuickBooks',
			color: '#2CA01C',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'quickBooksOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Bill',
						value: 'bill',
					},
					{
						name: 'Customer',
						value: 'customer',
					},
				],
				default: 1,
				description: 'Resource to consume',
			},
		],
	};
}