const { isAdmin, isAuth, isOrganizer } = require("../../middlewares/auth");
const { getEvents, getEventbyID, getEventbyArtist, getEventbyAssistant, getEventbyLocation, getEventbyPrice, postEvent, updateEvent, deleteEvent, deleteAssistant, getEventByCategory } = require("../controllers/events");

const eventRouter = require("express").Router();

eventRouter.post("/",isAuth, isAdmin, postEvent);
eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEventbyID);
eventRouter.get("/:assistants",isAdmin, isOrganizer, getEventbyAssistant);
eventRouter.get("/artist/:artist", getEventbyArtist);
eventRouter.get("/location/:location", getEventbyLocation);
eventRouter.put("/:id",isAuth, isAdmin, updateEvent);
eventRouter.put("/removeAssistant/:id", isAuth, isAdmin, deleteAssistant);
eventRouter.delete("/:id",isAdmin, deleteEvent);

module.exports = eventRouter;

