import { api } from '..';

const SUBMITTED_NOTIF_EMAIL_ENDPOINT = 'custom/email/notification/submission';
const SUBMITTED_NOTIF_SMS_ENDPOINT = 'custom/sms/notification/submission';
const METHOD = 'notification()';

export async function submissionNotificationSms(phone: string, applicantName: string) {
    try {
        await api.axios.post(SUBMITTED_NOTIF_SMS_ENDPOINT, { phone, applicantName });
    } catch (error) {
        console.error(`sms ${METHOD}`, error);
    }
    return null;
}

export async function submissionNotificationEmail(email: string, applicantName: string) {
    try {
        await api.axios.post(SUBMITTED_NOTIF_EMAIL_ENDPOINT, { email, applicantName });
    } catch (error) {
        console.error(`email ${METHOD}`, error);
    }
    return null;
}

