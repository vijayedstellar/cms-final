import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransporter(config);
  }

  async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || 'noreply@cms.com',
        to: template.to,
        subject: template.subject,
        html: template.html,
        text: template.text
      });

      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  generateUserCreatedTemplate(userName: string, userEmail: string, role: string): EmailTemplate {
    return {
      to: userEmail,
      subject: 'Welcome to CMS - Account Created',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to CMS</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to CMS</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Your CMS account has been successfully created with the following details:</p>
              
              <ul>
                <li><strong>Email:</strong> ${userEmail}</li>
                <li><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</li>
                <li><strong>Status:</strong> Pending Approval</li>
              </ul>
              
              <p>Your account is currently pending approval from an administrator. You will receive another email once your account has been activated.</p>
              
              <p>If you have any questions, please contact our support team.</p>
              
              <div class="footer">
                <p>This is an automated message from CMS Admin Panel.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to CMS!
        
        Hello ${userName},
        
        Your CMS account has been successfully created with the following details:
        - Email: ${userEmail}
        - Role: ${role.charAt(0).toUpperCase() + role.slice(1)}
        - Status: Pending Approval
        
        Your account is currently pending approval from an administrator. You will receive another email once your account has been activated.
        
        If you have any questions, please contact our support team.
      `
    };
  }

  generateUserApprovedTemplate(userName: string, userEmail: string): EmailTemplate {
    return {
      to: userEmail,
      subject: 'CMS Account Approved - Access Granted',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Approved</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Account Approved!</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Great news! Your CMS account has been approved and is now active.</p>
              
              <p>You can now log in to the CMS dashboard and start managing content.</p>
              
              <a href="#" class="button">Login to CMS</a>
              
              <p>If you have any questions or need assistance getting started, please don't hesitate to contact our support team.</p>
              
              <div class="footer">
                <p>This is an automated message from CMS Admin Panel.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Account Approved!
        
        Hello ${userName},
        
        Great news! Your CMS account has been approved and is now active.
        
        You can now log in to the CMS dashboard and start managing content.
        
        If you have any questions or need assistance getting started, please don't hesitate to contact our support team.
      `
    };
  }
}

// Create email service instance
const emailConfig: EmailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
};

export const emailService = new EmailService(emailConfig);