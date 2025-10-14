const { checkForDuplicates } = require("../../utils/checkForDuplicate");
const deleteFromCloudinary = require("../../utils/deleteFiles");
const Artist = require("../models/artists");
const Event = require("../models/events");


const postEvent = async (req, res, next) => {
  try {
    const { name, date, location, price, artist, category, description } = req.body;

      if (new Date(date) < new Date()) {
      return res.status(400).json({ message: "No puedes crear eventos en el pasado" });
    }

        const artistFromDB = await Artist.findById(artist);
          if (!artistFromDB) {
          return res.status(400).json({ message: "Artista no válido" });
          }

        const existingEvent = await Event.findOne({ name});
          if (existingEvent) {
            return res
              .status(400)
              .json(`${existingEvent.name} ya está en la base de datos.`);
          }
            const newEvent = new Event({
            name,
            date,
            location,
            price,
            artist,
            category,
            description,
            organizer: req.user._id,
            image: req.file?.path || undefined, 
          });

            const savedEvent = await newEvent.save();
            const populatedEvent = await Event.findById(savedEvent._id).populate('artist');

            return res.status(201).json({ message: "Evento creado correctamente", event: populatedEvent });
          } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al crear el evento" });
          }
        };

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate("assistants", "username favArtist")
      .populate("artist")
      .populate("organizer", "username email");
    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener los eventos" });
  }
};

const getEventbyID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate(["assistants", "organizer", "artist"]);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al buscar el evento por ID" });
  }
};

const getEventbyAssistant = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const events = await Event.find({ assistants: userId })
      .populate("assistants")
      .populate("artist");

    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener eventos por asistente" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const oldEvent = await Event.findById(id);

    if (!oldEvent) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Solo organizador o admin puede actualizar
    if (oldEvent.organizer.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "No tienes permisos para editar este evento" });
    }

    const { name, date, location, price, artist, category, description, assistants } = req.body;

    if (new Date(date) < new Date()) {
      return res.status(400).json({ message: "No puedes actualizar el evento a una fecha pasada" });
    }

    const updatedEventData = {
      name,
      date,
      location,
      price,
      artist,
      category,
      description,
      assistants: checkForDuplicates(oldEvent.assistants, assistants),
      organizer: oldEvent.organizer,
      image: req.file?.path || oldEvent.image,
    };

    if (req.file && oldEvent.image) {
      deleteFromCloudinary(oldEvent.image);
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedEventData, { new: true })
      .populate("artist")
      .populate("assistants", "username")
      .populate("organizer", "username");

    return res.status(200).json({ message: "Evento actualizado", event: updatedEvent });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar el evento" });
  }
};

const deleteAssistant = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    const updatedAssistants = event.assistants.filter(
      (assistantId) => assistantId.toString() !== req.user._id.toString()
    );

    const updatedEvent = await Event.findByIdAndUpdate(id, { assistants: updatedAssistants }, { new: true });

    return res.status(200).json({ message: "Asistente eliminado correctamente", event: updatedEvent });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar asistente" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Solo organizador o admin puede eliminar
    if (event.organizer.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "No tienes permisos para eliminar este evento" });
    }

    if (event.image) {
      deleteFromCloudinary(event.image);
    }

    await event.deleteOne();

    return res.status(200).json({ message: "Evento eliminado correctamente", event });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el evento" });
  }
};



    module.exports = { postEvent, getEvents, getEventbyID, getEventbyAssistant, updateEvent, deleteAssistant, deleteEvent }
