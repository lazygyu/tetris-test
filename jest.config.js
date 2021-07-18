module.exports = {
    testEnvironment: 'node',
    roots: ['./test/'],
    transform: {
        '\\.ts$': 'esbuild-jest'
    }
}
