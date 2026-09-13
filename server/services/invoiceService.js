import PDFDocument from 'pdfkit';

export const generateInvoicePDF = (order, dataCallback, endCallback) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  // Header
  doc
    .fillColor('#16a34a')
    .fontSize(28)
    .text('AGRIFTILIZER', 50, 50)
    .fillColor('#444444')
    .fontSize(10)
    .text('123 Farming Avenue', 200, 50, { align: 'right' })
    .text('Kisan Nagar, AG 45678', 200, 65, { align: 'right' })
    .text('support@agriftilizer.com', 200, 80, { align: 'right' })
    .moveDown();

  doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, 110).lineTo(550, 110).stroke();

  // Invoice details
  doc
    .fontSize(20)
    .text('INVOICE', 50, 130)
    .fontSize(10)
    .text(`Invoice Number: INV-${order.orderNumber || order._id.toString().substring(0,8).toUpperCase()}`, 50, 160)
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 175)
    .text(`Payment Status: ${order.isPaid ? 'PAID' : 'UNPAID'}`, 50, 190);

  // Customer Details
  doc
    .text('Bill To:', 300, 130)
    .font('Helvetica-Bold')
    .text(order.user.name, 300, 145)
    .font('Helvetica')
    .text(order.shippingAddress.street, 300, 160)
    .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pinCode}`, 300, 175)
    .text(order.shippingAddress.phone, 300, 190);

  doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, 220).lineTo(550, 220).stroke();

  // Table Header
  let i = 250;
  doc
    .font('Helvetica-Bold')
    .text('Item', 50, i)
    .text('Quantity', 280, i, { width: 90, align: 'right' })
    .text('Unit Price', 370, i, { width: 90, align: 'right' })
    .text('Line Total', 470, i, { width: 80, align: 'right' });
  
  doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, i + 15).lineTo(550, i + 15).stroke();
  
  i += 30;
  doc.font('Helvetica');

  // Items
  order.orderItems.forEach((item) => {
    const lineTotal = item.qty * item.price;
    doc
      .text(item.name, 50, i, { width: 220 })
      .text(item.qty.toString(), 280, i, { width: 90, align: 'right' })
      .text(`Rs. ${item.price.toFixed(2)}`, 370, i, { width: 90, align: 'right' })
      .text(`Rs. ${lineTotal.toFixed(2)}`, 470, i, { width: 80, align: 'right' });
    i += 30;
  });

  doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, i).lineTo(550, i).stroke();
  i += 20;

  // Totals
  doc
    .font('Helvetica')
    .text('Subtotal:', 370, i, { width: 90, align: 'right' })
    .text(`Rs. ${order.itemsPrice.toFixed(2)}`, 470, i, { width: 80, align: 'right' });
  i += 20;
  
  if (order.discount > 0) {
    doc
      .text('Discount:', 370, i, { width: 90, align: 'right' })
      .text(`- Rs. ${order.discount.toFixed(2)}`, 470, i, { width: 80, align: 'right' });
    i += 20;
  }

  doc
    .text('Shipping:', 370, i, { width: 90, align: 'right' })
    .text(`Rs. ${order.shippingPrice.toFixed(2)}`, 470, i, { width: 80, align: 'right' });
  i += 20;

  doc
    .text('GST (18%):', 370, i, { width: 90, align: 'right' })
    .text(`Rs. ${order.taxPrice.toFixed(2)}`, 470, i, { width: 80, align: 'right' });
  i += 25;

  doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(370, i-5).lineTo(550, i-5).stroke();

  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .text('Grand Total:', 320, i, { width: 140, align: 'right' })
    .fillColor('#16a34a')
    .text(`Rs. ${order.totalPrice.toFixed(2)}`, 470, i, { width: 80, align: 'right' });

  // Footer
  doc
    .fillColor('#444444')
    .fontSize(10)
    .font('Helvetica')
    .text('Thank you for shopping with Agriftilizer!', 50, 700, { align: 'center' });

  doc.end();
};
