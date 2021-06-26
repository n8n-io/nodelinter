export const properties = [
  // REQUIRED_FALSE
  {
    displayName: 'Required False',
    name: 'requiredFalse',
    required: false,
    type: 'string',
    default: '',
    description: 'This has a required false.'
  },
] as INodeProperties[]; // Removing casing causes test to fail, for unknown reason.


export class AwsRekognition implements INodeType {

  // PUSH_APPLY
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const qs: IDataObject = {};
		let responseData;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		for (let i = 0; i < items.length; i++) {

			if (Array.isArray(responseData)) {
				returnData.push.apply(returnData, responseData as IDataObject[]);
			} else {
				returnData.push(responseData);
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}

// NON_STANDARD_RETURNALL_DESCRIPTION
export const accountContactOperations = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: [
					'getAll',
				],
				resource: [
					'project',
				],
			},
		},
		default: false,
		description: 'Whether all results should be returned',
	},
]