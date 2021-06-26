export class OpenWeatherMap implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenWeatherMap',
		name: 'openWeatherMap',
		icon: 'fa:sun',
		group: ['input'],
		version: 1,
		description: 'Gets current and future weather information.',
		defaults: {
			name: 'OpenWeatherMap',
			color: '#554455',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'openWeatherMapApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Current Weather',
						value: 'currentWeather',
						description: 'Returns the current weather data',
					},
					{
						name: '5 day Forecast',
						value: '5DayForecast',
						description: 'Returns the weather data for the next 5 days',
					},
				],
				default: 'currentWeather',
				description: 'The operation to perform.',
			},
		]
	}
}