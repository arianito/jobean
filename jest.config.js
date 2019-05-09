module.exports = {
	"transform": {
		"^.+\\.tsx?$": "ts-jest"
	},
	"snapshotSerializers": ["enzyme-to-json/serializer"],
	"setupFilesAfterEnv": [
		"<rootDir>/test.config.ts"
	],
	"testRegex": "(/__tests__/.*|(\\.|/|-)(test|spec))\\.tsx?$",
	"moduleFileExtensions": [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json"
	]
};
