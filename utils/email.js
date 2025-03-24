import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
    try {
        // הגדרת טרנספורטר לשליחת מיילים דרך Gmail
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // כתובת המייל שלך
                pass: process.env.EMAIL_PASS, // סיסמת האפליקציה של Gmail
            },
        });

        // פרטי המייל
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: to, // כתובת הלקוח
            subject: subject, // נושא המייל
            text: text, // תוכן המייל
        };

        // שליחת המייל
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
