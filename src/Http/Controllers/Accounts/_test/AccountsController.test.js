const AccountsController = require('../AccountsController');

describe('AccountsController', () => {
    let usersServicesMock;
    let responseMock;
    let accountsServicesMock;
    let ApiAuthMock;
    let reqMock;
    let resMock;
    let accountsController;

    beforeEach(() => {
        // Mock dependencies
        usersServicesMock = {};
        responseMock = {
            success: jest.fn(),
            error: jest.fn()
        };
        accountsServicesMock = {
            getAccounts: jest.fn(),
            getAccountById: jest.fn(),
            updateAccount: jest.fn(),
            getLast3DaysLogin: jest.fn()
        };
        ApiAuthMock = jest.fn((req, res, next) => next());

        // Mock request and response objects
        reqMock = {
            params: { id: 'someId' },
            body: {}
        };
        resMock = {
            status: jest.fn(() => resMock),
            json: jest.fn(() => resMock)
        };

        // Instantiate the controller
        accountsController = new AccountsController(
            usersServicesMock,
            responseMock,
            accountsServicesMock,
            ApiAuthMock
        );
    });

    describe('getAccounts', () => {
        it('should return accounts successfully', async () => {
            const accounts = [{ id: 1 }, { id: 2 }];
            accountsServicesMock.getAccounts.mockResolvedValue(accounts);

            await accountsController.getAccounts(reqMock, resMock);

            expect(accountsServicesMock.getAccounts).toHaveBeenCalled();
            expect(responseMock.success).toHaveBeenCalledWith(resMock, accounts);
        });

        it('should handle errors', async () => {
            accountsServicesMock.getAccounts.mockRejectedValue(new Error('Error'));

            await accountsController.getAccounts(reqMock, resMock);

            expect(accountsServicesMock.getAccounts).toHaveBeenCalled();
            expect(responseMock.error).toHaveBeenCalledWith(resMock, "Something went wrong!");
        });
    });

    describe('getAccountById', () => {
        it('should return account by id successfully', async () => {
            const account = { id: 'someId' };
            accountsServicesMock.getAccountById.mockResolvedValue(account);

            await accountsController.getAccountById(reqMock, resMock);

            expect(accountsServicesMock.getAccountById).toHaveBeenCalledWith('someId');
            expect(responseMock.success).toHaveBeenCalledWith(resMock, account);
        });

        it('should handle errors', async () => {
            accountsServicesMock.getAccountById.mockRejectedValue(new Error('Error'));

            await accountsController.getAccountById(reqMock, resMock);

            expect(accountsServicesMock.getAccountById).toHaveBeenCalledWith('someId');
            expect(responseMock.error).toHaveBeenCalledWith(resMock, "Something went wrong!");
        });
    });

    describe('updateAccount', () => {
        it('should update account successfully', async () => {
            const updatedAccount = { id: 'someId', name: 'Updated' };
            accountsServicesMock.updateAccount.mockResolvedValue(updatedAccount);

            await accountsController.updateAccount(reqMock, resMock);

            expect(accountsServicesMock.updateAccount).toHaveBeenCalledWith('someId', reqMock.body);
            expect(responseMock.success).toHaveBeenCalledWith(resMock, updatedAccount);
        });

        it('should handle errors', async () => {
            accountsServicesMock.updateAccount.mockRejectedValue(new Error('Error'));

            await accountsController.updateAccount(reqMock, resMock);

            expect(accountsServicesMock.updateAccount).toHaveBeenCalledWith('someId', reqMock.body);
            expect(responseMock.error).toHaveBeenCalledWith(resMock, "Something went wrong!");
        });
    });

    describe('getAccountsLast3DaysLogin', () => {
        it('should return accounts with last login within 3 days successfully', async () => {
            const accounts = [{ id: 1, lastLogin: new Date() }];
            accountsServicesMock.getLast3DaysLogin.mockResolvedValue(accounts);

            await accountsController.getAccountsLast3DaysLogin(reqMock, resMock);

            expect(accountsServicesMock.getLast3DaysLogin).toHaveBeenCalled();
            expect(responseMock.success).toHaveBeenCalledWith(resMock, accounts);
        });

        it('should handle errors', async () => {
            accountsServicesMock.getLast3DaysLogin.mockRejectedValue(new Error('Error'));

            await accountsController.getAccountsLast3DaysLogin(reqMock, resMock);

            expect(accountsServicesMock.getLast3DaysLogin).toHaveBeenCalled();
            expect(responseMock.error).toHaveBeenCalledWith(resMock, "Something went wrong!");
        });
    });
});
