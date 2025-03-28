const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    availableTickets: { type: Number, required: true },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;