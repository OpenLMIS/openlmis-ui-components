// jest.config.js
module.exports = {
    setupFilesAfterEnv: ['./jest.setup.js'],
    collectCoverageFrom: [
        '**/*.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**'
    ],
    // Add more setup options before each test is run
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/.*\\.spec\\.js$'
    ],
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        // Use babel-jest to transpile tests with the babel preset
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(somePkg)|react-dnd|dnd-core|@react-dnd)',
        '^.+\\.module\\.(css|sass|scss)$'
    ]
}
