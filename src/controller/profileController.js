const ProfileService = require('../services/profileService');

exports.getProfiles = async (req, res, next) => {
    try {
        const profiles = await ProfileService.getAllUsers();
        res.json(profiles);
    } catch (err) {
        next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const profile = await ProfileService.getUserById(req.params.id);
        if (!profile) return res.status(404).json({ message: 'User not found' });
        res.json(profile);
    } catch (err) {
        next(err);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const profile = await ProfileService.createUser(req.body);
        res.status(201).json({ status: 'success', data: profile });
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const profile = await ProfileService.updateUser({ id: req.params.id, ...req.body });
        if (!profile) return res.status(404).json({ message: 'User not found' });
        res.json({ status: 'success', data: profile });
    } catch (err) {
        next(err);
    }
};

exports.patchUpdateUser = async (req, res, next) => {
    try {
        const profile = await ProfileService.patchUpdateUser({ id: req.params.id, ...req.body });
        if (!profile) return res.status(404).json({ message: 'User not found' });
        res.json({ status: 'success', data: profile });
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const result = await ProfileService.deleteUser(req.params.id);
        if (!result) return res.status(404).json({ message: 'User not found' });
        res.json({ status: 'success', message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
};
