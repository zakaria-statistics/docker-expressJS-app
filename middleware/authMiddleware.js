const protect = (req, res, next) => {
    const { user } = req.session;

    if(!user) {
        console.log("session user => ", req.session)
        return res
        .status(401)
        .json({status: "fail", message: "unauthorized"});
    }
 
    req.user = user;

    console.log("session user => ", req.session)

    next();
};

module.exports = protect