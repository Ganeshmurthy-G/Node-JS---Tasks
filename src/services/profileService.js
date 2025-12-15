const Profile = require('../models/profileModels');

const profileService = {
    getAllUsers: async () => {
        return await Profile.getAllUsers();
    },

    getUserById: async (id) => {
        const user = await Profile.getUserById(id);
        if (!user) throw { status: 404, message: 'User not found' };
        return user;
    },

    createUser: async (userData) => {
        return await Profile.createUser(userData);
    },

    updateUser: async (id, userData) => {
        const updated = await Profile.updateUser({ id, ...userData });
        if (!updated) throw { status: 404, message: 'User not found' };
        return updated;
    },

    patchUpdateUser: async (id, userData) => {
        const updated = await Profile.patchUpdateUser({ id, ...userData });
        if (!updated) throw { status: 404, message: 'User not found' };
        return updated;
    },

    deleteUser: async (id) => {
        const deleted = await Profile.deleteUser(id);
        if (!deleted) throw { status: 404, message: 'User not found' };
        return deleted;
    }
};

module.exports = profileService;
