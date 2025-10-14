const { isAdmin, isAuth, isOrganizer } = require("../../middlewares/auth");
const { uploadEvento } = require("../../middlewares/uploadFiles");
const { getEvents, getEventbyAssistant, postEvent, updateEvent, deleteEvent, deleteAssistant, getEventByCategory } = require("../controllers/events");

const eventRouter = require("express").Router();

eventRouter.post("/",isAuth, uploadEvento, postEvent);
eventRouter.get("/", getEvents);
eventRouter.get("/:id",isAuth, getEventbyAssistant);
eventRouter.put("/:id",isAuth,isAdmin, updateEvent);
eventRouter.put("/removeAssistant/:id", isAuth, deleteAssistant);
eventRouter.delete("/:id",isAuth, isAdmin, deleteEvent);

module.exports = eventRouter;

