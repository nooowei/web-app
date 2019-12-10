const express = require("express");
const router = express.Router();

// Mongoose
const mongoose = require("mongoose");
const Events = mongoose.model("events");

router.get("/", (req, res) => {
  res.send({
    path: "/",
    message: "Root GET working on /routes"
  });
});

router.post("/create_event", async (req, res) => {
  const { creator_uid, name, links, event_date, location, lineup } = req.body;

  const newEvent = new Events({
    creator_uid,
    name,
    links,
    event_date,
    location,
    lineup
  });

  const event = await newEvent.save(err => {
    if (err) {
      res.status(500).send({
        message: "An error occurred while saving this event.",
        error: err
      });
    }
  });

  res.status(201).send({ creator_uid, name });
});

router.post("/get_events", (req, res) => {
  // TODO: implement search filter. get_events only returns all events currently.
  Events.find({}, (err, events) => {
    if (err)
      res.status(500).send({
        message: "There was an error finding events."
      });

    res.send(events);
  });
});

router.post("/my_events", (req, res) => {
  const { spotify_uid } = req.body;
  Events.find({ creator_uid: spotify_uid }, (err, events) => {
    if (err)
      res.status(500).send({
        message: "There was an error finding events."
      });

    res.send(events);
  });
});

router.post("/edit_event", (req, res) => {
  // spotify_uid
  // event_id
  // Edited properties
  const { spotify_uid, event_id, properties } = req.body;
  Events.update(
    { _id: event_id, creator_uid: spotify_uid },
    { ...properties },
    (err, event) => {
      if (err)
        res.status(500).end({
          message: "An error occurred while updating this event",
          error: err
        });
      res.status(200).send(event);
    }
  );
});

router.post("/delete_event", async (req, res) => {
  // spotify_uid
  // event_id
  const { event_id, spotify_uid } = req.body;

  const deletedEvent = await Events.deleteOne({
    _id: event_id,
    creator_uid: spotify_uid
  });

  if (deletedEvent.deletedCount === 0)
    res
      .status(500)
      .send({ message: "There was an error deleting this document" });

  res
    .status(200)
    .send({ message: "Event successfully deleted!", response: deletedEvent });
});

router.post("/followed_events", (req, res) => {
  // spotify_uid
});

router.post("/follow_event", (req, res) => {
  // spotify_uid
  // event_id
});

router.post("/unfollow_event", (req, res) => {
  // spotify_uid
  // event_id
});

module.exports = router;
