const { isAdmin, isAuth} = require("../../middlewares/auth");
const { getArtists, getArtistbyID, postArtist, updateArtist, deleteArtist, getArtistbyNombre, getArtistByCategory } = require("../controllers/artists");

const artistRouter = require("express").Router();

artistRouter.get("/", getArtists);
artistRouter.get("/:artistID", getArtistbyID);
artistRouter.get("/name/:nombre", getArtistbyNombre);
artistRouter.post("/", isAuth, isAdmin, postArtist);
artistRouter.put("/:id", isAuth, isAdmin, updateArtist);
artistRouter.delete("/:id",isAuth, isAdmin, deleteArtist);

module.exports = artistRouter;
