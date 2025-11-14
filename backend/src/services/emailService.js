import nodemailer from 'nodemailer'

// Email configuration - In production, use environment variables
const EMAIL_CONFIG = {
  service: 'gmail', // You can change this to your preferred email service
  auth: {
    user: process.env.EMAIL_USER || 'noreply.easybid@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password' // Use app password for Gmail
  }
}

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG)

// Email templates
const EMAIL_TEMPLATES = {
  tenderApproved: (tender, buyer) => ({
    subject: `✅ Your Tender "${tender.title}" has been Approved`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #ff8a4c, #ff5c2e); padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0;">Tender Approved! 🎉</h1>
        </div>
        
        <div style="background-color: #2a2a2a; padding: 20px; border-radius: 10px; border: 1px solid #444;">
          <h2 style="color: #ff8a4c; margin-top: 0;">Good news, ${buyer.name}!</h2>
          <p style="color: #e5e5e5; line-height: 1.6;">Your tender has been approved by our admin team and is now live for suppliers to bid on.</p>
          
          <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff8a4c;">
            <h3 style="color: #ff8a4c; margin: 0 0 10px 0;">${tender.title}</h3>
            <p style="color: #ccc; margin: 5px 0;"><strong>Category:</strong> ${tender.category === 'Other' && tender.customCategory ? tender.customCategory : tender.category}</p>
            <p style="color: #ccc; margin: 5px 0;"><strong>Budget:</strong> ${tender.budget ? `$${tender.budget.toLocaleString()}` : 'Not specified'}</p>
            <p style="color: #ccc; margin: 5px 0;"><strong>Deadline:</strong> ${new Date(tender.deadline).toLocaleDateString()}</p>
          </div>
          
          <p style="color: #e5e5e5; line-height: 1.6;">Suppliers can now view and submit bids for your tender. You'll receive notifications when new bids are submitted.</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/buyer/evaluate-bids" 
               style="background: linear-gradient(135deg, #ff8a4c, #ff5c2e); color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Tender Status
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
          <p>This is an automated message from EasyBid Platform</p>
        </div>
      </div>
    `
  }),

  tenderRejected: (tender, buyer, rejectionReason) => ({
    subject: `❌ Your Tender "${tender.title}" Requires Revision`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0;">Tender Requires Revision</h1>
        </div>
        
        <div style="background-color: #2a2a2a; padding: 20px; border-radius: 10px; border: 1px solid #444;">
          <h2 style="color: #ef4444; margin-top: 0;">Hello ${buyer.name},</h2>
          <p style="color: #e5e5e5; line-height: 1.6;">Unfortunately, your tender submission needs some revisions before it can be published.</p>
          
          <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <h3 style="color: #ef4444; margin: 0 0 10px 0;">${tender.title}</h3>
            <p style="color: #ccc; margin: 5px 0;"><strong>Category:</strong> ${tender.category === 'Other' && tender.customCategory ? tender.customCategory : tender.category}</p>
          </div>
          
          <div style="background-color: #2d1b1b; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ef4444;">
            <h4 style="color: #ef4444; margin: 0 0 10px 0;">Reason for Revision:</h4>
            <p style="color: #e5e5e5; margin: 0; line-height: 1.6;">${rejectionReason}</p>
          </div>
          
          <p style="color: #e5e5e5; line-height: 1.6;">Please review the feedback above and submit a revised version of your tender.</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/buyer/create-tender" 
               style="background: linear-gradient(135deg, #ff8a4c, #ff5c2e); color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Create New Tender
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
          <p>This is an automated message from EasyBid Platform</p>
        </div>
      </div>
    `
  }),

  newBidSubmitted: (bid, tender, buyer) => ({
    subject: `💼 New Bid Received for "${tender.title}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0;">New Bid Received! 📈</h1>
        </div>
        
        <div style="background-color: #2a2a2a; padding: 20px; border-radius: 10px; border: 1px solid #444;">
          <h2 style="color: #22c55e; margin-top: 0;">Great news, ${buyer.name}!</h2>
          <p style="color: #e5e5e5; line-height: 1.6;">A supplier has submitted a new bid for your tender.</p>
          
          <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff8a4c;">
            <h3 style="color: #ff8a4c; margin: 0 0 10px 0;">${tender.title}</h3>
            <p style="color: #ccc; margin: 5px 0;"><strong>Bid Amount:</strong> $${bid.amount?.toLocaleString() || 'Not specified'}</p>
            <p style="color: #ccc; margin: 5px 0;"><strong>Submitted by:</strong> ${bid.createdBy?.name || 'Unknown Supplier'}</p>
            <p style="color: #ccc; margin: 5px 0;"><strong>Submission Date:</strong> ${new Date(bid.createdAt).toLocaleDateString()}</p>
          </div>
          
          <p style="color: #e5e5e5; line-height: 1.6;">Review the bid details and compare with other submissions to make the best choice for your project.</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/buyer/evaluate-bids" 
               style="background: linear-gradient(135deg, #ff8a4c, #ff5c2e); color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Evaluate Bids
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
          <p>This is an automated message from EasyBid Platform</p>
        </div>
      </div>
    `
  }),

  newTenderPublished: (tender, supplier) => ({
    subject: `🔔 New Tender Available: "${tender.title}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0;">New Tender Opportunity! 🚀</h1>
        </div>
        
        <div style="background-color: #2a2a2a; padding: 20px; border-radius: 10px; border: 1px solid #444;">
          <h2 style="color: #3b82f6; margin-top: 0;">Hello ${supplier.name},</h2>
          <p style="color: #e5e5e5; line-height: 1.6;">A new tender matching your interests has been published on our platform.</p>
          
          <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff8a4c;">
            <h3 style="color: #ff8a4c; margin: 0 0 10px 0;">${tender.title}</h3>
            <p style="color: #ccc; margin: 5px 0;"><strong>Category:</strong> ${tender.category === 'Other' && tender.customCategory ? tender.customCategory : tender.category}</p>
            <p style="color: #ccc; margin: 5px 0;"><strong>Budget:</strong> ${tender.budget ? `$${tender.budget.toLocaleString()}` : 'Contact buyer for details'}</p>
            <p style="color: #ccc; margin: 5px 0;"><strong>Deadline:</strong> ${new Date(tender.deadline).toLocaleDateString()}</p>
            <p style="color: #ccc; margin: 10px 0 0 0;"><strong>Description:</strong></p>
            <p style="color: #e5e5e5; margin: 5px 0; line-height: 1.5;">${tender.description || 'No description provided'}</p>
          </div>
          
          <p style="color: #e5e5e5; line-height: 1.6;">Don't miss this opportunity! Submit your competitive bid before the deadline.</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/supplier/view-tenders" 
               style="background: linear-gradient(135deg, #ff8a4c, #ff5c2e); color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View & Bid Now
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
          <p>This is an automated message from EasyBid Platform</p>
        </div>
      </div>
    `
  })
}

// Email sending functions
export async function sendTenderApprovedEmail(tender, buyer) {
  try {
    // Check user email preferences
    if (!buyer.emailPreferences?.tenderApproval) {
      console.log(`Tender approved email skipped for ${buyer.email} (preference disabled)`)
      return
    }

    const template = EMAIL_TEMPLATES.tenderApproved(tender, buyer)
    await transporter.sendMail({
      from: EMAIL_CONFIG.auth.user,
      to: buyer.email,
      subject: template.subject,
      html: template.html
    })
    console.log(`Tender approved email sent to ${buyer.email}`)
  } catch (error) {
    console.error('Failed to send tender approved email:', error)
  }
}

export async function sendTenderRejectedEmail(tender, buyer, rejectionReason) {
  try {
    // Check user email preferences
    if (!buyer.emailPreferences?.tenderApproval) {
      console.log(`Tender rejected email skipped for ${buyer.email} (preference disabled)`)
      return
    }

    const template = EMAIL_TEMPLATES.tenderRejected(tender, buyer, rejectionReason)
    await transporter.sendMail({
      from: EMAIL_CONFIG.auth.user,
      to: buyer.email,
      subject: template.subject,
      html: template.html
    })
    console.log(`Tender rejected email sent to ${buyer.email}`)
  } catch (error) {
    console.error('Failed to send tender rejected email:', error)
  }
}

export async function sendNewBidEmail(bid, tender, buyer) {
  try {
    // Check user email preferences
    if (!buyer.emailPreferences?.newBids) {
      console.log(`New bid email skipped for ${buyer.email} (preference disabled)`)
      return
    }

    const template = EMAIL_TEMPLATES.newBidSubmitted(bid, tender, buyer)
    await transporter.sendMail({
      from: EMAIL_CONFIG.auth.user,
      to: buyer.email,
      subject: template.subject,
      html: template.html
    })
    console.log(`New bid email sent to ${buyer.email}`)
  } catch (error) {
    console.error('Failed to send new bid email:', error)
  }
}

export async function sendNewTenderEmail(tender, suppliers) {
  try {
    let sentCount = 0
    
    // Send to suppliers who have enabled new tender notifications
    for (const supplier of suppliers) {
      try {
        // Check user email preferences
        if (!supplier.emailPreferences?.newTenders) {
          console.log(`New tender email skipped for ${supplier.email} (preference disabled)`)
          continue
        }

        const template = EMAIL_TEMPLATES.newTenderPublished(tender, supplier)
        await transporter.sendMail({
          from: EMAIL_CONFIG.auth.user,
          to: supplier.email,
          subject: template.subject,
          html: template.html
        })
        sentCount++
      } catch (error) {
        console.error(`Failed to send new tender email to ${supplier.email}:`, error)
      }
    }
    console.log(`New tender emails sent to ${sentCount} out of ${suppliers.length} suppliers`)
  } catch (error) {
    console.error('Failed to send new tender emails:', error)
  }
}

// Test email function for development
export async function sendTestEmail(to = 'test@example.com') {
  try {
    await transporter.sendMail({
      from: EMAIL_CONFIG.auth.user,
      to,
      subject: '🧪 EasyBid Email Service Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #ff8a4c, #ff5c2e); padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">Email Service Working! ✅</h1>
          </div>
          <div style="background-color: #2a2a2a; padding: 20px; border-radius: 10px; border: 1px solid #444; margin-top: 20px;">
            <p style="color: #e5e5e5;">Your EasyBid email service is configured and working properly.</p>
            <p style="color: #888; font-size: 12px; margin-top: 20px;">This is a test message from EasyBid Platform</p>
          </div>
        </div>
      `
    })
    console.log(`Test email sent to ${to}`)
    return true
  } catch (error) {
    console.error('Failed to send test email:', error)
    return false
  }
}

export default {
  sendTenderApprovedEmail,
  sendTenderRejectedEmail,
  sendNewBidEmail,
  sendNewTenderEmail,
  sendTestEmail
}