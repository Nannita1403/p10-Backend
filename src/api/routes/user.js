const { isAdmin, isAuth } = require("../../middlewares/auth");
const { getUsers, register, updateUser, login, deleteUser } = require("../controllers/user");

const userRouter = require("express").Router();

userRouter.get("/",isAuth, isAdmin, getUsers);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.put("/:id",isAuth, updateUser);
userRouter.delete("/:id",isAuth, deleteUser)


module.exports = userRouter;
