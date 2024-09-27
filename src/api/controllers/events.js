const { checkForDuplicates } = require("../../utils/checkForDuplicate");
const deleteFromCloudinary = require("../../utils/deleteFiles");
const Event = require("../models/events");

const postEvent = async (req,res,next) => {
    try {
        const existingEvent = await Event.findOne({
            name: req.body.name
          });
          if (existingEvent) {
            return res
              .status(400)
              .json(`${existingEvent.name} ya está en la base de datos.`);
          }
          //Primero veo que no este duplicado, sino:
            const newEvent = new Event(req.body);
            /*if (req.files) {
                req.files.forEach(file => {
                  newEvent.img.push(file.path);
                });
              }*/ 
            //La persona que crea el evento queda registrada como organizador.
            newEvent.organizer = req.user._id;
            const savedEvent = await newEvent.save();
            const populatedEvent = await Event.findById(savedEvent._id)
            .populate('artist');
            return res.status(201).json({ message:"Evento creado correctamente", event: populatedEvent });          
    } catch (error) {
        return res.status(400).json(console.log(error));
    }
};
const getEvents = async (req,res,next) => {
    try {
        const allEvents = await Event.find()
        .populate('assistants', 'username favArtist')
        .populate('artist');
        return res.status(200).json(allEvents);
    } catch (error) {
        return res.status(400).json("error");
    }
};
const getEventbyID = async (req,res,next) => {
    try {
        const {id} =req.params;
        const event = await Event.findById(id).populate([
          { path: 'assistants' },
          { path: 'organizer' },
          { path: 'artist' }]);
        return res.status(200).json(event);
    } catch (error) {
      console.error(`Error muestra del evento con: ${id}`, error);
        return res.status(400).json(`error en la busqueda por Id: ${id}`);
    }
};
const getEventbyAssistant = async (req,res,next) => {
    try {
        const userId= req.params.id;
        const eventAssistant = await Event.find({assistants: userId})
        .populate('assistants')
        .populate('artist');
        return res.status(200).json(eventAssistant);
     } catch (error) {
        return res.status(400).json("Error en la carga por Assistants");
     }
};

const updateEvent = async (req,res,next) => {
        try {
          const isOrganizer = req.user.isOrganizer;
          const { id } = req.params;
          const newEvent = new Event (req.body);
          const oldEvent = await Event.findById(id);
          if(!oldEvent){
            return res.status(404).json("Evento no encontrado");
          }
          newEvent._id = id;
          newEvent.assistants= checkForDuplicates
          (oldEvent.assistants,newEvent.assistants);

          if (req.file) {
            newEvent.img = req.file.path;
            if(oldEvent.img){
                deleteFromCloudinary(oldEvent.img)
            }
           };

           if(!isOrganizer) {
            newEvent.organizer = oldEvent.organizer;
           }
    
          const eventUpdate = await Event.findByIdAndUpdate(id,newEvent, {
            new: true,
          }).populate('artist')
          .populate('assistants', 'username')
          .populate('organizer', 'username');
          return res.status(200).json({
            mensaje:"Evento Actualizado", eventUpdate,});
        } catch (error) {
          console.log(error)
          return res.status(400).json(error);
        }
      };
const deleteAssistant = async (req,res,next) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        const newAssistantList = event.assistants.slice();
        newAssistantList.splice(event.assistants.indexOf(req.user._id), 1);
        console.log('lista nueva:', newAssistantList);
        console.log('lista vieja', event.assistants);
        const updatedEvent = await Event.findByIdAndUpdate(
          id,
          { assistants: newAssistantList },
          { new: true }
        );
        return res
          .status(200).json({ message: 'Evento actualizado correctamente',updatedEvent });
      } catch (error) {
        console.log(error)
        return res.status(400).json(error);
      }
    };
const deleteEvent = async (req,res,next) => {
    try {
        if (req.user.isAdmin || req.user.isOrganizer) {
        const { idEvent } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(idEvent);
        deletedEvent.img.forEach((url)=>{
            deleteFromCloudinary(url);
        });
        if(deletedEvent) {
            return res.status(200).json({message:"Evento Eliminado", event: deletedEvent});
        } else {
            deletedEvent 
            ? res.status(404).json("Evento no encontrado")
            : res.status(401).json("Necesitas autorización para realizar esta acción.");
        }}
      } catch (error) {
        return res.status(400).json("error")}
    };

    module.exports = { postEvent, getEvents, getEventbyID, getEventbyAssistant, updateEvent, deleteAssistant, deleteEvent }
