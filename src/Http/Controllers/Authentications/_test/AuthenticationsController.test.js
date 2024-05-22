const AuthenticationsController = require('../AuthenticationsController'); // Adjust the path as necessary

describe('AuthenticationsController', () => {
    let authenticationsServicesMock;
    let responseMock;
    let accountsServicesMock;
    let jwtMock;
    let ApiAuthMock;
    let reqMock;
    let resMock;
    let authenticationsController;

    beforeEach(() => {
        // Mock dependencies
        authenticationsServicesMock = {
            addToken: jest.fn()
        };
        responseMock = {
            success: jest.fn(),
            error: jest.fn()
        };
        accountsServicesMock = {
            verifyUserCredential: jest.fn(),
            updateLoginDate: jest.fn()
        };
        jwtMock = {
            createAccessToken: jest.fn(),
            createRefreshToken: jest.fn()
        };
        ApiAuthMock = jest.fn((req, res, next) => next());

        // Mock request and response objects
        reqMock = {
            body: { userName: 'testUser', password: 'testPassword' }
        };
        resMock = {
            status: jest.fn(() => resMock),
            json: jest.fn(() => resMock)
        };

        // Instantiate the controller
        authenticationsController = new AuthenticationsController(
            authenticationsServicesMock,
            responseMock,
            accountsServicesMock,
            jwtMock,
            ApiAuthMock
        );
    });

    describe('login', () => {
        it('should login successfully', async () => {
            const id = 'userId';
            const accessToken = 'accessToken';
            const refreshToken = 'refreshToken';

            accountsServicesMock.verifyUserCredential.mockResolvedValue(id);
            jwtMock.createAccessToken.mockResolvedValue(accessToken);
            jwtMock.createRefreshToken.mockResolvedValue(refreshToken);
            authenticationsServicesMock.addToken.mockResolvedValue();

            await authenticationsController.login(reqMock, resMock);

            expect(accountsServicesMock.verifyUserCredential).toHaveBeenCalledWith('testUser', 'testPassword');
            expect(jwtMock.createAccessToken).toHaveBeenCalledWith({ id });
            expect(jwtMock.createRefreshToken).toHaveBeenCalledWith({ id });
            expect(authenticationsServicesMock.addToken).toHaveBeenCalledWith(refreshToken);
            expect(responseMock.success).toHaveBeenCalledWith(resMock, {
                accessToken, refreshToken
            });
        });

        it('should handle errors', async () => {
            accountsServicesMock.verifyUserCredential.mockRejectedValue(new Error('Error'));

            await authenticationsController.login(reqMock, resMock);

            expect(accountsServicesMock.verifyUserCredential).toHaveBeenCalledWith('testUser', 'testPassword');
            expect(responseMock.error).toHaveBeenCalledWith(resMock, "Something went wrong!");
        });
    });

    describe('logout', () => {
        it('should logout successfully', async () => {
            accountsServicesMock.updateLoginDate.mockResolvedValue();

            await authenticationsController.logout(reqMock, resMock);

            expect(accountsServicesMock.updateLoginDate).toHaveBeenCalledWith('testUser');
            expect(responseMock.success).toHaveBeenCalledWith(resMock);
        });

        it('should handle errors', async () => {
            accountsServicesMock.updateLoginDate.mockRejectedValue(new Error('Error'));

            await authenticationsController.logout(reqMock, resMock);

            expect(accountsServicesMock.updateLoginDate).toHaveBeenCalledWith('testUser');
            expect(responseMock.error).toHaveBeenCalledWith(resMock, "Something went wrong!");
        });
    });
});
