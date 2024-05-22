const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const AccountsServices = require('../AccountsServices'); // Adjust the path as necessary

jest.mock('nanoid');
jest.mock('bcrypt');

describe('AccountsServices', () => {
    let accountModelMock;
    let accountsServices;

    beforeEach(() => {
        accountModelMock = {
            find: jest.fn(),
            findOne: jest.fn().mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            })),
            insertMany: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
        };

        accountsServices = new AccountsServices(accountModelMock);
    });

    describe('getAccounts', () => {
        it('should return all accounts', async () => {
            const accounts = [{ accountId: '1' }, { accountId: '2' }];
            accountModelMock.find.mockResolvedValue(accounts)

            const result = await accountsServices.getAccounts();

            expect(accountModelMock.find).toHaveBeenCalledWith({});
            expect(result).toEqual(accounts);
        });
    });

    describe('getAccountById', () => {
        it('should return an account by id', async () => {
            const account = { accountId: '1' };
            accountModelMock.findOne.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(account),
            }));

            const result = await accountsServices.getAccountById('1');

            expect(accountModelMock.findOne).toHaveBeenCalledWith({ accountId: '1' });
            expect(result).toEqual(account);
        });
    });

    describe('addAccount', () => {
        it('should add an account and return the result', async () => {
            const payload = { userName: 'testUser', password: 'password123' };
            const hashedPassword = 'hashedPassword123';
            const id = 'account-1234567';

            nanoid.mockReturnValue('1234567');
            bcrypt.hash.mockResolvedValue(hashedPassword);
            accountModelMock.insertMany.mockResolvedValue([{ ...payload, accountId: id, password: hashedPassword }]);

            const result = await accountsServices.addAccount(payload);

            expect(nanoid).toHaveBeenCalledWith(7);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(accountModelMock.insertMany).toHaveBeenCalledWith({ ...payload, accountId: id, password: hashedPassword });
            expect(result).toEqual({ ...payload, accountId: id, password: hashedPassword });
        });
    });

    describe('getIdByUsername', () => {
        it('should return an account by username', async () => {
            const account = { userName: 'testUser' };
            accountModelMock.findOne.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(account),
            }));

            const result = await accountsServices.getIdByUsername('testUser');

            expect(accountModelMock.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
            expect(result).toEqual(account);
        });
    });

    describe('updateAccount', () => {
        it('should update an account and return the result', async () => {
            const payload = { password: 'newPassword123' };
            const hashedPassword = 'hashedNewPassword123';
            const updatedAccount = { accountId: '1', ...payload, password: hashedPassword };

            bcrypt.hash.mockResolvedValue(hashedPassword);
            accountModelMock.findOneAndUpdate.mockResolvedValue(updatedAccount);

            const result = await accountsServices.updateAccount('1', payload);

            expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
            expect(accountModelMock.findOneAndUpdate).toHaveBeenCalledWith(
                { accountId: '1' },
                { ...payload, password: hashedPassword },
                { new: true }
            );
            expect(result).toEqual(updatedAccount);
        });
    });

    describe('updateLoginDate', () => {
        it('should update the login date and return the result', async () => {
            const userName = 'testUser';
            const updatedAccount = { userName: 'testUser', lastLoginDateTime: new Date() };

            accountModelMock.findOneAndUpdate.mockResolvedValue(updatedAccount)

            const result = await accountsServices.updateLoginDate(userName);

            expect(accountModelMock.findOneAndUpdate).toHaveBeenCalledWith(
                { userName: userName },
                { $currentDate: { lastLoginDateTime: true } }
            );
            expect(result).toEqual(updatedAccount);
        });
    });

    describe('deleteAccount', () => {
        it('should delete an account and return the deleted count', async () => {
            accountModelMock.deleteOne.mockResolvedValue({ deletedCount: 1 });

            const result = await accountsServices.deleteAccount('1');

            expect(accountModelMock.deleteOne).toHaveBeenCalledWith({ accountId: '1' });
            expect(result).toBe(1);
        });
    });

    describe('verifyUserCredential', () => {
        it('should verify user credentials and return the account id', async () => {
            const account = { userName: 'testUser', password: 'hashedPassword123', accountId: '1' };
            accountModelMock.findOne.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(account),
            }));
            bcrypt.compare.mockResolvedValue(true);

            const result = await accountsServices.verifyUserCredential('testUser', 'password123');

            expect(accountModelMock.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
            expect(result).toBe('1');
        });

        it('should throw an error if the password is incorrect', async () => {
            const account = { userName: 'testUser', password: 'hashedPassword123' };
            accountModelMock.findOne.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(account),
            }));
            bcrypt.compare.mockResolvedValue(false);

            await expect(accountsServices.verifyUserCredential('testUser', 'wrongPassword')).rejects.toThrow('Wrong password!');
        });

        it('should throw an error if the user is not found', async () => {
            accountModelMock.findOne.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            }));

            await expect(accountsServices.verifyUserCredential('testUser', 'password123')).rejects.toThrow('Wrong password!');
        });
    });

    describe('getLast3DaysLogin', () => {
        it('should return accounts that logged in within the last 3 days', async () => {
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

            const accounts = [{ accountId: '1', lastLoginDateTime: new Date() }];
            accountModelMock.find.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(accounts),
            }));

            const result = await accountsServices.getLast3DaysLogin();

            expect(accountModelMock.find).toHaveBeenCalledWith({ lastLoginDateTime: { $lt: threeDaysAgo } });
            expect(result).toEqual(accounts);
        });
    });
});
