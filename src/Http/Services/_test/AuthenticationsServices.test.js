const AuthenticationsServices = require('../AuthenticationsServices'); // Adjust the path as necessary

describe('AuthenticationsServices', () => {
    let authenticationModelMock;
    let authenticationsServices;

    beforeEach(() => {
        authenticationModelMock = {
            findOne: jest.fn().mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            })),
            insertMany: jest.fn().mockResolvedValue([{ refreshToken: 'testToken' }]),
        };

        authenticationsServices = new AuthenticationsServices(authenticationModelMock);
    });

    describe('checkAvailabilityToken', () => {
        it('should check the availability of a token', async () => {
            const token = 'testToken';
            await authenticationsServices.checkAvailabilityToken(token);

            expect(authenticationModelMock.findOne).toHaveBeenCalledWith({ refreshToken: token });
        });
    });

    describe('addToken', () => {
        it('should add a token and return the result', async () => {
            const token = 'newToken';
            authenticationModelMock.insertMany.mockResolvedValue([{ refreshToken: token }]);

            const result = await authenticationsServices.addToken(token);

            expect(authenticationModelMock.insertMany).toHaveBeenCalledWith({ refreshToken: token });
            expect(result).toEqual({ refreshToken: token });
        });
    });
});
