module.exports = {
    testEnviroment: 'node',
    roots: ['./test/'],
    transform: {
        '\\.ts$': 'esbuild-jest'
    }
}