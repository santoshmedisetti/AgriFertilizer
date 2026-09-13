import SupportTicket from '../models/SupportTicket.js';

// @desc    Create new support ticket
// @route   POST /api/support
// @access  Private
export const createTicket = async (req, res, next) => {
  try {
    const { subject, message } = req.body;

    const ticket = await SupportTicket.create({
      user: req.user._id,
      subject,
      message,
      history: [{ message, isAdmin: false }]
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's support tickets
// @route   GET /api/support
// @access  Private
export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a ticket
// @route   POST /api/support/:id/reply
// @access  Private
export const replyToTicket = async (req, res, next) => {
  try {
    const { message } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    // Auth check: User must own the ticket or be admin
    if (ticket.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized to access this ticket');
    }

    ticket.history.push({
      message,
      isAdmin: req.user.isAdmin
    });
    
    // Auto re-open if a user replies to a closed ticket
    if (!req.user.isAdmin && ticket.status === 'Closed') {
      ticket.status = 'In Progress';
    } else if (req.user.isAdmin && ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }

    await ticket.save();

    res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// =====================================
// ADMIN
// =====================================

// @desc    Get all support tickets
// @route   GET /api/admin/support
// @access  Private/Admin
export const getAllTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status
// @route   PUT /api/admin/support/:id/status
// @access  Private/Admin
export const updateTicketStatus = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    ticket.status = req.body.status;
    await ticket.save();

    res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};
