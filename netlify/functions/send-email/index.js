import nodemailer from 'nodemailer';

const TO_EMAIL = 'timgor6559@gmail.com';
const FROM_EMAIL = 'timgor6559@gmail.com';

function createBody(data) {
  return [
    `Name: ${data.fullName || '-'}`,
    `Email: ${data.email || '-'}`,
    `Phone: ${data.phone || '-'}`,
    `Address: ${data.address || '-'}`,
    `Others: ${data.others || '-'}`,
  ].join('\n');
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let data;
  try {
    data = await req.json();
  } catch {
    return new Response(JSON.stringify({ message: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!data.fullName || !data.email || !data.phone || !data.address) {
    return new Response(JSON.stringify({ message: 'Please fill in all required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: FROM_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `Enquiry from ${data.fullName}`,
      text: createBody(data),
    });

    return new Response(JSON.stringify({ message: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Email send failed:', err);
    return new Response(JSON.stringify({ message: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
