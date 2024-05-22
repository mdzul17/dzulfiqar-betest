const UsersController = require('../UsersController');

describe('UsersController', () => {
    let usersServicesMock;
    let accountsServicesMock;
    let responseMock;
    let ApiAuthMock;
    let ValidatorMock;
    let reqMock;
    let resMock;
    let usersController;

    beforeEach(() => {
        usersServicesMock = {
            getUsers: jest.fn(),
            addUser: jest.fn(),
            getUserById: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            getUserByAccountNumber: jest.fn(),
            getUserByRegistrationNumber: jest.fn()
        };
        accountsServicesMock = {
            addAccount: jest.fn()
        };
        responseMock = {
            success: jest.fn(),
            error: jest.fn()
        };
        ApiAuthMock = jest.fn((req, res, next) => next());
        ValidatorMock = jest.fn((req, res, next) => next());

        reqMock = {
            params: { id: 'someId', accountNumber: '12345', registrationNumber: '67890' },
            body: {
                userName: 'testUser',
                password: 'testPassword',
                fullName: 'Test User',
                accountNumber: '12345',
                emailAddress: 'test@example.com',
                registrationNumber: '67890'
            }
        };
        resMock = {
            status: jest.fn(() => resMock),
            json: jest.fn(() => resMock)
        };

        usersController = new UsersController(
            usersServicesMock,
            accountsServicesMock,
            ApiAuthMock,
            responseMock,
            ValidatorMock
        );
    });

    describe('getUsers', () => {
        it('should return users successfully', async () => {
            const users = [{ id: 1 }, { id: 2 }];
            usersServicesMock.getUsers.mockResolvedValue(users);

            await usersController.getUsers(reqMock, resMock);

            expect(usersServicesMock.getUsers).toHaveBeenCalled();
            expect(responseMock.success).toHaveBeenCalledWith(resMock, users);
        });

        it('should handle errors', async () => {
            usersServicesMock.getUsers.mockRejectedValue(new Error('Error'));

            await usersController.getUsers(reqMock, resMock);

            expect(usersServicesMock.getUsers).toHaveBeenCalled();
            expect(responseMock.error).toHaveBeenCalledWith(resMock, "Something went wrong!");
        });
    });

    describe('addUser', () => {
        it('should add user successfully', async () => {
            const userResult = { userId: 'userId' };
            const accountResult = { userName: 'testUser' };

            usersServicesMock.addUser.mockResolvedValue(userResult);
            accountsServicesMock.addAccount.mockResolvedValue(accountResult);

            await usersController.addUser(reqMock, resMock);

            expect(usersServicesMock.addUser).toHaveBeenCalledWith({
                fullName: 'Test User',
                accountNumber: '12345',
                emailAddress: 'test@example.com',
                registrationNumber: '67890'
            });
            expect(accountsServicesMock.addAccount).toHaveBeenCalledWith({
                userName: 'testUser',
                password: 'testPassword',
                userId: 'userId'
            });
            expect(responseMock.success).toHaveBeenCalledWith(resMock, 'testUser has successfully added!');
        });

        it('should handle errors', async () => {
            usersServicesMock.addUser.mockRejectedValue(new Error('Error'));

            await usersController.addUser(reqMock, resMock);

            expect(usersServicesMock.addUser).toHaveBeenCalled();
            expect(responseMock.error).toHaveBeenCalledWith(resMock, "Something went wrong!");
        });
    });

    describe('getUserById', () => {
        it('should return user by id successfully', async () => {
            const user = { id: 'someId' };
            usersServicesMock.getUserById.mockResolvedValue(user);

            await usersController.getUserById(reqMock, resMock);

            expect(usersServicesMock.getUserById).toHaveBeenCalledWith('someId');
            expect(responseMock.success).toHaveBeenCalledWith(resMock, user);
        });

        it('should handle errors', async () => {
            usersServicesMock.getUserById.mockRejectedValue(new Error('Error'));

            await usersController.getUserById(reqMock, resMock);

            expect(usersServicesMock.getUserById).toHaveBeenCalledWith('someId');
            expect(responseMock.error).toHaveBeenCalledWith(resMock, "Something went wrong!");
        });
    });

    describe('updateUser', () => {
        it('should update user successfully', async () => {
            const updatedUser = { id: 'someId', name: 'Updated' };
            usersServicesMock.updateUser.mockResolvedValue(updatedUser);

            await usersController.updateUser(reqMock, resMock);

            expect(usersServicesMock.updateUser).toHaveBeenCalledWith('someId', reqMock.body);
            expect(responseMock.success).toHaveBeenCalledWith(resMock, updatedUser);
        });

        it('should handle errors', async () => {
            usersServicesMock.updateUser.mockRejectedValue(new Error('Error'));

            await usersController.updateUser(reqMock, resMock);

            expect(usersServicesMock.updateUser).toHaveBeenCalledWith('someId', reqMock.body);
            expect(responseMock.error).toHaveBeenCalledWith(resMock, "Something went wrong!");
        });
    });

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            const deletedUser = { id: 'someId' };
            usersServicesMock.deleteUser.mockResolvedValue(deletedUser);

            await usersController.deleteUser(reqMock, resMock);

            expect(usersServicesMock.deleteUser).toHaveBeenCalledWith('someId', reqMock.body);
            expect(responseMock.success).toHaveBeenCalledWith(resMock, deletedUser);
        });

        it('should handle errors', async () => {
            usersServicesMock.deleteUser.mockRejectedValue(new Error('Error'));

            await usersController.deleteUser(reqMock, resMock);

            expect(usersServicesMock.deleteUser).toHaveBeenCalledWith('someId', reqMock.body);
            expect(responseMock.error).toHaveBeenCalledWith(resMock, "Something went wrong!");
        });
    });

    describe('getUserByAccountNumber', () => {
        it('should return user by account number successfully', async () => {
            const user = { accountNumber: '12345' };
            usersServicesMock.getUserByAccountNumber.mockResolvedValue(user);

            await usersController.getUserByAccountNumber(reqMock, resMock);

            expect(usersServicesMock.getUserByAccountNumber).toHaveBeenCalledWith('12345');
            expect(responseMock.success).toHaveBeenCalledWith(resMock, user);
        });

        it('should handle errors', async () => {
            usersServicesMock.getUserByAccountNumber.mockRejectedValue(new Error('Error'));

            await usersController.getUserByAccountNumber(reqMock, resMock);

            expect(usersServicesMock.getUserByAccountNumber).toHaveBeenCalledWith('12345');
            expect(responseMock.error).toHaveBeenCalledWith(resMock, "Something went wrong!");
        });
    });

    describe('getUserByRegistrationNumber', () => {
        it('should return user by registration number successfully', async () => {
            const user = { registrationNumber: '67890' };
            usersServicesMock.getUserByRegistrationNumber.mockResolvedValue(user);

            await usersController.getUserByRegistrationNumber(reqMock, resMock);

            expect(usersServicesMock.getUserByRegistrationNumber).toHaveBeenCalledWith('67890');
            expect(responseMock.success).toHaveBeenCalledWith(resMock, user);
        });

        it('should handle errors', async () => {
            usersServicesMock.getUserByRegistrationNumber.mockRejectedValue(new Error('Error'));

            await usersController.getUserByRegistrationNumber(reqMock, resMock);

            expect(usersServicesMock.getUserByRegistrationNumber).toHaveBeenCalledWith('67890');
            expect(responseMock.error).toHaveBeenCalledWith(resMock, "Something went wrong!");
        });
    });
});
