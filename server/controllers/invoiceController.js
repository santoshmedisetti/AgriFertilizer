import Order from '../models/Order.js';
import { generateInvoicePDF } from '../services/invoiceService.js';

// @desc    Download order invoice PDF
// @route   GET /api/invoice/:orderId
// @access  Private
export const downloadInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Auth check: User must own the order or be admin
    if (
      order.user &&
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this invoice'
      });
    }

    const stream = res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
    });

    generateInvoicePDF(
      order,
      (chunk) => stream.write(chunk),
      () => stream.end()
    );
  } catch (error) {
    next(error);
  }
};
