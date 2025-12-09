const user = require("../models/profileModels");


exports.getProfiles = (req, res, next) => {
    user.getAllUsers((err, profiles) => {
        if (err) return next(err);
        res.json(profiles);
    });
};

exports.getUserById = (req, res, next) => {
    const userId = req.params.id;
    console.log('userId: ', userId);

    user.getUserById(userId, (err, profile) => {
        if (err) return next(err);

        if (!profile || !profile.id) {
            const error = new Error("User Id not found");
            error.status = 404;
            return next(error);
        }
        res.json(profile);
    })
};

exports.createUser = (req, res, next) => {
    const userData = req.body;
    console.log('userData controller 1: ', userData);        // entered data in postman body

    user.createUser(userData, (err, profile) => {
        console.log('userData 2 :  ', userData);

        if (err) return next(err);

        res.status(201).json({
            status: "success",
            data: profile,
        });
    })
};

exports.updateUser = (req, res, next) => {
    const userId = req.params.id;
    console.log('userId: ', userId); // params passing id will come here

    const updateData = { id: userId, ...req.body };
    console.log('updateData: ', updateData);  // body data which is going to update will come

    user.updateUser(updateData, (err, profile) => {
        if (err) return next(err);

        console.log('profile: ', profile); // updated profile details will come here
        
        if (!profile) {
            const error = new Error("No Profile ID or Profile is Found"); // Sent to global error (postman response)
            error.status = 404;
            return next(error);
        }
        res.status(200).json({
            status: "success",
            message: "User updated successfully",       // Postman response
            data: profile,
        });
    })
};

exports.deleteUser = (req, res, next) => {
    console.log('req: ', req);

    const userId = req.params.id;
    console.log('userId to delete: ', userId); // params passing id will come here

    user.deleteUser(userId, (err, profile) => {
        console.log('profile: ', profile);
        if (err) return next(err);

        if (!profile || profile.affectedRows === 0) {
            const error = new Error("No Profile ID or Profile is Found"); // Sent to global error (postman response)
            error.status = 404;
            return next(error);
        }
        res.status(200).json({
            status: "success",
            message: "User Deleted successfully",       // Postman response
            data: profile,
        });
    })
};

exports.updatePatchUser = (req, res, next) => {
    const userId = req.params.id;
    console.log('userId: ', userId);

    const { name, email } = req.body;
    console.log('email: ', email);
    console.log('name: ', name);

    user.patchUpdateUser({ id: userId, name, email }, (err, profile) => {
        if (err) return next(err);

        if (!profile) {
            const error = new Error("No Profile ID or Profile is Found"); // Sent to global error (postman response)
            error.status = 404;
            return next(error);
        }
        res.status(200).json({
            status: "success",
            message: "Patch User updated successfully",       // Postman response
            data: { id: userId, name, email },
        });
    })

}







