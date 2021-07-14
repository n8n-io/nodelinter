
export class ActionNetwork implements INodeType {


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		const resource = this.getNodeParameter('resource', 0) as Resource;
		const operation = this.getNodeParameter('operation', 0) as Operation;

		let response;

		const whoa = {
			name: this.getNodeParameter('name', 0)
		};

		for (let i = 0; i < items.length; i++) {

			responseData = getAllResponse.map(o => ({ name: o }));

			try {
				throw new Error();
			} catch (error) {
				// if (this.continueOnFail()) {
				// 	returnData.push({ error: error.message });
				// 	continue;
				// }
				throw error;
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
