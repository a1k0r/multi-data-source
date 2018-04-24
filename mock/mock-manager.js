class MockManager {
    constructor() {
        this._enabledMocks = [];
        this._paramsMocks = new Map();
    }

    enableMock(mockName) {
        this._enabledMocks.push(mockName);
    }

    disableMock(mockName) {
        this._enabledMocks = this._enabledMocks.filter(mock => mock === mockName);
    }

    addArgsMock(name, args, returns) {
        if (this._paramsMocks.has(name)) {
            this._paramsMocks.get(name).push({
                params: args,
                returns,
            });
        }
    }

    mockQuery(query, params) {
        const {mock} = query;

        for (const mName of Object.keys(mock)) {
            if (this._enabledMocks.includes(mName)) {
                return mock[mName](params);
            }
        }

        return [];
    }
}

module.exports = new MockManager();
