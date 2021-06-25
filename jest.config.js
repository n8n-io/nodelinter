module.exports = {
	rootDir: ".",
	testMatch: ["<rootDir>/src/tests/*.test.ts"],
	transform: {
		"^.+\\.ts$": "ts-jest"
	},
	testEnvironment: "node",
	verbose: true,
	// silent: true,
	maxWorkers: 1
};