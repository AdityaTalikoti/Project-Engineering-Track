import express from 'express';
import { events } from '../data/store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Middleware to protect all routes
router.use(authMiddleware);

// Broken Flow 3: Returns all events, including those the user is not invited to
router.get('/', (req, res) => {
    const filteredEvents = events.filter(e => e.creatorId === req.user.id || e.invitedEmails.includes(req.user.email));
    res.json(filteredEvents);
});

router.post('/', (req, res) => {
    const { title, description, date, invitedEmails } = req.body;
    const newEvent = {
        id: Date.now().toString(),
        title,
        description,
        date,
        creatorId: req.user.id,
        invitedEmails: invitedEmails || [],
        rsvps: []
    };
    events.push(newEvent);
    console.log(`Invitations sent for event "${title}" to: ${newEvent.invitedEmails.join(', ')}`);
    res.status(201).json(newEvent);
});

// Broken Flow 1: Any user can view any event
router.get('/:id', (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    const isCreator = event.creatorId === req.user.id;
    const isInvited = event.invitedEmails.includes(req.user.email);
    if (!isCreator && !isInvited) {
        return res.status(403).json({ message: 'Access denied: You are not invited to this event' });
    }
    
    res.json({
        ...event,
        isCreator,
        isInvited
    });
});

// Broken Flow 2: Any user can RSVP
router.post('/:id/rsvp', (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isInvited = event.invitedEmails.includes(req.user.email);
    if (!isInvited) {
        return res.status(403).json({ message: 'Access denied: You are not invited to this event' });
    }

    const alreadyRSVPed = event.rsvps.includes(req.user.id);
    if (alreadyRSVPed) {
        return res.status(400).json({ message: 'You have already RSVPed' });
    }

    event.rsvps.push(req.user.id);
    res.json({ message: 'RSVP successful', event });
});

// Broken Flow 4: Any user can delete any event
router.delete('/:id', (req, res) => {
    const index = events.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Event not found' });

    // In starter, no check for ownership
    events.splice(index, 1);
    res.json({ message: 'Event deleted' });
});

export default router;
