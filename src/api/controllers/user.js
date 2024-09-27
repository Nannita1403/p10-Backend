const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generarLlave } = require("../../utils/jwt");
const { hashPassword } = require("../../utils/hashPassword");
const { checkForDuplicates } = require("../../utils/checkForDuplicate");
const deleteFromCloudinary = require("../../utils/deleteFiles");


const getUsers = async (req,res,next) => {
    try {
        const users = await User.find().populate('favArtist');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).json("Error al recolectar los Usuarios");
    }
};
const register = async (req,res,next) => {
     try {
        const newUser = new User(req.body);
        newUser.role = "user";

        const userDuplicated = await User.findOne({ email: req.body.email });
        if (userDuplicated) return res.status(400).json("Usuario ya existente con ese email");

        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        return res.status(400).json("Error en la creación de tu User");
    }
};
const login = async (req,res,next) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(400).json("Usuario o contraseña incorrectos");
        } 
       if (bcrypt.compareSync(password, user.password)) {
                const token = generarLlave(user._id);
                return res.status(200).json({ user, token });
        }else{
       return res.status(400).json("Usuario o contraseña incorrectos");
    }

    } catch (error) {
        console.log(error);
        return res.status(400).json("Error en el Login");
    }
};

const updateUser = async (req,res,next) => {
    try {
        const { id } = req.params;
        const newUser = new User(req.body);
        newUser.role = "user";
        if (req.user.role === "admin") {
            newUser.role = req.body.role;
        }

        const oldUser = await User.findById(id);
        newUser._id = id;
        newUser.password = hashPassword;
        newUser.events = checkForDuplicates(
            oldUser.events,
            newUser.events);
        newUser.favArtist = checkForDuplicates(
            oldUser.favArtist,
            newUser.favArtist);
        
        const editUser = await User.findByIdAndUpdate(id, newUser, { new: true });
        return res.status(200).json("Usuario actualizado correctamente", editUser);
    } catch (error) {
        return res.status(400).json("error en el update del User");
    }
};

const deleteUser = async (req,res,next) => {
    try {
        const {id} = req.params;
        if (req.user.id === id || req.user.role === "admin") {
        const userDeleted = await User.findByIdAndDelete(id);
        deleteFromCloudinary(deleteUser.profilePic)

        
        return res.status(200).json({message:"User Eliminado", event: userDeleted});
    } else {
        return res.status(401).json("No estas autorizado para esta acción")
    }
    } catch (error) {
        return res.status(400).json("error en la eliminación del Juego");
    }
};


module.exports = {
    getUsers, register, updateUser, login, deleteUser }