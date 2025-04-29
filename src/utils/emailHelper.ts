import { env } from 'process';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KE);

export function forgotPasswordEmail(email: string, subject: string, body: string){
    resend.emails.send({
        from: 'no-reply@weshare.dev',
        to: email,
        subject: subject,
        html: body
    });
}
