import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, from = 'TradeFair <noreply@tradefair.app>' }) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendOrderConfirmationEmail(order, user) {
  const subject = `Order Confirmation #${order.id.substring(0, 8)}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #059669 0%, #14b8a6 100%); color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 30px 20px; }
          .order-details { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .order-details h2 { margin-top: 0; color: #059669; }
          .order-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .order-item:last-child { border-bottom: none; }
          .total { font-size: 18px; font-weight: bold; color: #059669; margin-top: 15px; text-align: right; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Order Confirmed!</h1>
            <p>Thank you for your order, ${user.displayName}!</p>
          </div>
          <div class="content">
            <p>Hi ${user.displayName},</p>
            <p>We've received your order and it's being processed. You'll receive another email when your order ships.</p>
            
            <div class="order-details">
              <h2>Order #${order.id.substring(0, 8)}</h2>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              
              <h3>Items:</h3>
              ${order.items.map(item => `
                <div class="order-item">
                  <div>
                    <strong>${item.listing.title}</strong><br>
                    <span style="color: #6b7280;">Quantity: ${item.quantity}</span>
                  </div>
                  <div>${(item.priceCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              `).join('')}
              
              <div class="total">
                Total: ${(order.totalAmountCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            
            <p><strong>Shipping Address:</strong><br>
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
            ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}</p>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}" class="button">View Order Details</a>
            </center>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
          </div>
          <div class="footer">
            <p>© 2025 TradeFair. All rights reserved.</p>
            <p>Your Trusted African Marketplace</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: user.email, subject, html });
}

export async function sendOrderStatusEmail(order, user, newStatus) {
  const statusMessages = {
    PROCESSING: 'Your order is being processed',
    SHIPPED: 'Your order has been shipped',
    DELIVERED: 'Your order has been delivered',
    CANCELLED: 'Your order has been cancelled',
  };

  const subject = `Order ${statusMessages[newStatus]} #${order.id.substring(0, 8)}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #059669 0%, #14b8a6 100%); color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 30px 20px; }
          .status-badge { display: inline-block; background: #059669; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Order Update</h1>
          </div>
          <div class="content">
            <p>Hi ${user.displayName},</p>
            <p>${statusMessages[newStatus]}!</p>
            
            <div style="text-align: center;">
              <span class="status-badge">${newStatus}</span>
            </div>
            
            <p><strong>Order #${order.id.substring(0, 8)}</strong></p>
            <p>Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            ${newStatus === 'SHIPPED' ? `
              <p>Your order is on its way! You can track your shipment using the tracking information provided by the vendor.</p>
            ` : ''}
            
            ${newStatus === 'DELIVERED' ? `
              <p>We hope you enjoy your purchase! If you're satisfied with your order, please consider leaving a review.</p>
            ` : ''}
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}" class="button">View Order Details</a>
            </center>
          </div>
          <div class="footer">
            <p>© 2025 TradeFair. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: user.email, subject, html });
}

export async function sendVendorApprovalEmail(vendor, user, approved) {
  const subject = approved 
    ? 'Congratulations! Your Vendor Application is Approved'
    : 'Update on Your Vendor Application';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: ${approved ? 'linear-gradient(135deg, #059669 0%, #14b8a6 100%)' : 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)'}; color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 30px 20px; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${approved ? '🎉 Congratulations!' : '📋 Application Update'}</h1>
          </div>
          <div class="content">
            <p>Hi ${user.displayName},</p>
            
            ${approved ? `
              <p>Great news! Your vendor application for <strong>${vendor.businessName}</strong> has been approved!</p>
              <p>You can now start listing your products and reaching customers across Africa.</p>
              
              <div class="highlight">
                <strong>Next Steps:</strong>
                <ol>
                  <li>Log in to your vendor dashboard</li>
                  <li>Add your first products</li>
                  <li>Set up your payment information</li>
                  <li>Start selling!</li>
                </ol>
              </div>
              
              <center>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/store" class="button">Go to Vendor Dashboard</a>
              </center>
            ` : `
              <p>Thank you for your interest in becoming a vendor on TradeFair.</p>
              <p>Unfortunately, we are unable to approve your application for <strong>${vendor.businessName}</strong> at this time.</p>
              
              ${vendor.rejectionReason ? `
                <div class="highlight">
                  <strong>Reason:</strong><br>
                  ${vendor.rejectionReason}
                </div>
              ` : ''}
              
              <p>If you have any questions or would like to reapply, please contact our support team.</p>
            `}
            
            <p>Thank you for choosing TradeFair!</p>
          </div>
          <div class="footer">
            <p>© 2025 TradeFair. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: user.email, subject, html });
}

export async function sendNewOrderNotificationToVendor(order, vendor, vendorUser) {
  const subject = `New Order Received #${order.id.substring(0, 8)}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #059669 0%, #14b8a6 100%); color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 30px 20px; }
          .order-details { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛍️ New Order!</h1>
          </div>
          <div class="content">
            <p>Hi ${vendorUser.displayName},</p>
            <p>You have received a new order for <strong>${vendor.businessName}</strong>!</p>
            
            <div class="order-details">
              <h2>Order #${order.id.substring(0, 8)}</h2>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Customer:</strong> ${order.buyer?.displayName || 'Customer'}</p>
              <p><strong>Items:</strong> ${order.items.length}</p>
              <p><strong>Total:</strong> ${(order.totalAmountCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            
            <p>Please process this order as soon as possible and update the status accordingly.</p>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/store/orders" class="button">View Order in Dashboard</a>
            </center>
          </div>
          <div class="footer">
            <p>© 2025 TradeFair. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: vendorUser.email, subject, html });
}

export async function sendWelcomeEmail(user) {
  const subject = 'Welcome to TradeFair - Your African Marketplace';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #059669 0%, #14b8a6 100%); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 32px; }
          .content { padding: 30px 20px; }
          .feature { display: flex; margin: 20px 0; }
          .feature-icon { font-size: 40px; margin-right: 15px; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👋 Welcome to TradeFair!</h1>
            <p style="font-size: 18px;">Your Trusted African Marketplace</p>
          </div>
          <div class="content">
            <p>Hi ${user.displayName},</p>
            <p>Thank you for joining TradeFair! We're excited to have you as part of our community.</p>
            
            <h2 style="color: #059669;">What you can do:</h2>
            
            <div class="feature">
              <div class="feature-icon">🛍️</div>
              <div>
                <strong>Shop Quality Products</strong><br>
                Browse thousands of products from verified African vendors
              </div>
            </div>
            
            <div class="feature">
              <div class="feature-icon">⭐</div>
              <div>
                <strong>AI-Powered Recommendations</strong><br>
                Get personalized product suggestions based on your interests
              </div>
            </div>
            
            <div class="feature">
              <div class="feature-icon">💳</div>
              <div>
                <strong>Secure Payments</strong><br>
                Shop with confidence using our secure payment system
              </div>
            </div>
            
            <div class="feature">
              <div class="feature-icon">🚀</div>
              <div>
                <strong>Become a Vendor</strong><br>
                Start selling your products and reach customers across Africa
              </div>
            </div>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" class="button">Start Shopping</a>
            </center>
            
            <p>If you have any questions, our support team is here to help!</p>
          </div>
          <div class="footer">
            <p>© 2025 TradeFair. All rights reserved.</p>
            <p>Built with ❤️ for the African marketplace</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: user.email, subject, html });
}
