// MISSING_CONTINUE_ON_FAIL
// Separated from the main miscellaneous input file because the file name
// is checked and the continueOnFail check runs after traversal of the entire AST

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

// NON_EXISTENT_LOAD_OPTIONS_METHOD

export class Todoist implements INodeType {

	description: INodeTypeDescription = {
		displayName: 'Todoist',
		name: 'todoist',
		icon: 'file:todoist.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Todoist API',
		defaults: {
			name: 'Todoist',
			color: '#c02428',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'todoistApi',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'apiKey',
						],
					},
				},
			},
			{
				name: 'todoistOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'oAuth2',
						],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'API Key',
						value: 'apiKey',
					},
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'apiKey',
				description: 'The resource to operate on.',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Task',
						value: 'task',
						description: 'Task resource.',
					},
				],
				default: 'task',
				required: true,
				description: 'Resource to consume.',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'task',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new task',
					},
					{
						name: 'Close',
						value: 'close',
						description: 'Close a task',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a task',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a task',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all tasks',
					},
					{
						name: 'Reopen',
						value: 'reopen',
						description: 'Reopen a task',
					},
				],
				default: 'create',
				description: 'The operation to perform.',
			},
			{
				displayName: 'Project',
				name: 'project',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'whoa',
				},
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'create',
						],
					},
				},
				default: '',
				description: 'The project you want to operate on.',
			},
		],
	};

	methods = {
		loadOptions: {
			// Get all the available projects to display them to user so that he can
			// select them easily
			async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const projects = await todoistApiRequest.call(this, 'GET', '/projects');
				for (const project of projects) {
					const projectName = project.name;
					const projectId = project.id;

					returnData.push({
						name: projectName,
						value: projectId,
					});
				}

				return returnData;
			},

			// Get all the available sections in the selected project, to display them
			// to user so that he can select one easily
			async getSections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				const projectId = this.getCurrentNodeParameter('project') as number;
				if (projectId) {
					const qs: IDataObject = {project_id: projectId};
					const sections = await todoistApiRequest.call(this, 'GET', '/sections', {}, qs);
					for (const section of sections) {
						const sectionName = section.name;
						const sectionId = section.id;

						returnData.push({
							name: sectionName,
							value: sectionId,
						});
					}
				}

				return returnData;
			},

			// Get all the available labels to display them to user so that he can
			// select them easily
			async getLabels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const labels = await todoistApiRequest.call(this, 'GET', '/labels');

				for (const label of labels) {
					const labelName = label.name;
					const labelId = label.id;

					returnData.push({
						name: labelName,
						value: labelId,
					});
				}

				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length as unknown as number;
		const qs: IDataObject = {};
		let responseData;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < length; i++) {}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
