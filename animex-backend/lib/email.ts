import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'AnimeX <noreply@animex.lk>',
            to,
            subject,
            html,
        });
        if (error) {
            console.error('Email send error:', error);
            return { success: false, error };
        }
        return { success: true, data };
    } catch (err) {
        console.error('Email service error:', err);
        return { success: false, error: err };
    }
}

export function feedbackReplyTemplate(userName: string, reply: string) {
    return `
    <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A1A; color: #fff; padding: 32px; border-radius: 16px;">
      <h1 style="color: #FF2D78; font-size: 24px; margin-bottom: 16px;">AnimeX</h1>
      <p>Hi ${userName},</p>
      <p>Thank you for your feedback! Here's our response:</p>
      <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 3px solid #FF2D78;">
        ${reply}
      </div>
      <p>- The AnimeX Team</p>
    </div>
  `;
}
