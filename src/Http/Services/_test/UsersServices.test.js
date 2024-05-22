const UsersServices = require('../UsersServices');
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");

jest.mock("nanoid", () => {
    return { nanoid: jest.fn(() => "uniqueId") }
});

describe('UsersServices', () => {
    let cacheServiceMock;
    let userModelMock;
    let usersServices;

    beforeEach(() => {
        cacheServiceMock = {
            get: jest.fn(),
            set: jest.fn(),
            delete: jest.fn(),
        };

        userModelMock = {
            find: jest.fn(),
            findOne: jest.fn().mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            })),
            insertMany: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
        };

        usersServices = new UsersServices(cacheServiceMock, userModelMock);
    });

    describe('getUsers', () => {
        it('should return cached users if available', async () => {
            const cachedResult = JSON.stringify([{ userId: 'user1' }]);
            cacheServiceMock.get.mockResolvedValue(cachedResult);

            const result = await usersServices.getUsers();

            expect(cacheServiceMock.get).toHaveBeenCalledWith('all-user');
            expect(result).toEqual([{ userId: 'user1' }]);
        });

        it('should fetch users from database if cache is not available', async () => {
            const dbResult = [{ userId: 'user1' }];
            cacheServiceMock.get.mockRejectedValue(new Error('Cache not found'));
            userModelMock.find.mockResolvedValue(dbResult);

            const result = await usersServices.getUsers();

            expect(userModelMock.find).toHaveBeenCalled();
            expect(cacheServiceMock.set).toHaveBeenCalledWith('all-user', JSON.stringify(dbResult));
            expect(result).toEqual(dbResult);
        });
    });

    describe('getUserById', () => {
        it('should return cached user if available', async () => {
            const cachedResult = JSON.stringify({ userId: 'user1' });
            cacheServiceMock.get.mockResolvedValue(cachedResult);

            const result = await usersServices.getUserById('user1');

            expect(cacheServiceMock.get).toHaveBeenCalledWith('user:user1');
            expect(result).toEqual({ userId: 'user1' });
        });

        it('should fetch user from database if cache is not available', async () => {
            const dbResult = { userId: 'user1' };
            cacheServiceMock.get.mockRejectedValue(new Error('Cache not found'));
            userModelMock.findOne.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(dbResult),
            }));

            const result = await usersServices.getUserById('user1');

            expect(userModelMock.findOne).toHaveBeenCalledWith({ userId: 'user1' });
            expect(cacheServiceMock.set).toHaveBeenCalledWith('user:user1', JSON.stringify(dbResult));
            expect(result).toEqual(dbResult);
        });
    });

    describe('addUser', () => {
        it('should add a user and invalidate cache', async () => {
            const payload = { fullName: 'John Doe' };
            const dbResult = [{ ...payload, userId: 'uniqueId' }];
            userModelMock.insertMany.mockResolvedValue(dbResult);

            const result = await usersServices.addUser(payload);

            expect(userModelMock.insertMany).toHaveBeenCalledWith({ ...payload, userId: 'user-uniqueId' });
            expect(cacheServiceMock.delete).toHaveBeenCalledWith('user-all');
            expect(result).toEqual(dbResult[0]);
        });
    });

    describe('updateUser', () => {
        it('should update a user and invalidate cache', async () => {
            const userId = 'user1';
            const payload = { fullName: 'John Doe' };
            const dbResult = { ...payload, userId: 'user1' };
            userModelMock.findOneAndUpdate.mockResolvedValue(dbResult);

            const result = await usersServices.updateUser(userId, payload);

            expect(userModelMock.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: userId },
                { ...payload },
                { new: true }
            );
            expect(cacheServiceMock.delete).toHaveBeenCalledWith(`user:${userId}`);
            expect(result).toEqual(dbResult);
        });
    });

    describe('deleteUser', () => {
        it('should delete a user and invalidate cache', async () => {
            const userId = 'user1';
            userModelMock.deleteOne.mockResolvedValue({ deletedCount: 1 });

            const result = await usersServices.deleteUser(userId);

            expect(userModelMock.deleteOne).toHaveBeenCalledWith({ userId: userId });
            expect(cacheServiceMock.delete).toHaveBeenCalledWith(`user:${userId}`);
            expect(result).toEqual(1);
        });
    });

    describe('getUserByAccountNumber', () => {
        it('should return user by account number', async () => {
            const accountNumber = 'account123';
            const dbResult = { userId: 'user1', accountNumber: 'account123' };
            userModelMock.findOne.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(dbResult),
            }));

            const result = await usersServices.getUserByAccountNumber(accountNumber);

            expect(userModelMock.findOne).toHaveBeenCalledWith({ accountNumber: accountNumber });
            expect(result).toEqual(dbResult);
        });
    });

    describe('getUserByRegistrationNumber', () => {
        it('should return user by registration number', async () => {
            const registrationNumber = 'reg123';
            const dbResult = { userId: 'user1', registrationNumber: 'reg123' };
            userModelMock.findOne.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(dbResult),
            }));

            const result = await usersServices.getUserByRegistrationNumber(registrationNumber);

            expect(userModelMock.findOne).toHaveBeenCalledWith({ registrationNumber: registrationNumber });
            expect(result).toEqual(dbResult);
        });
    });
});
