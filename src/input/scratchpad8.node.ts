
export class ActionNetwork implements INodeType {


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		const resource = this.getNodeParameter('resource', 0) as Resource;
		const operation = this.getNodeParameter('operation', 0) as Operation;

		let response;

		for (let i = 0; i < items.length; i++) {
			try {

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
