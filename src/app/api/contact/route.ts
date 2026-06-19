import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_EMAIL_TO;

  if (!resendApiKey || !from || !to) {
    return NextResponse.json(
      { message: "Serviço de e-mail não configurado." },
      { status: 500 }
    );
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { message: "Dados da mensagem inválidos." },
      { status: 400 }
    );
  }

  const name = getField(payload.name);
  const email = getField(payload.email);
  const subject = getField(payload.subject);
  const message = getField(payload.message);

  if (!name || !email || !subject || !message || !emailRegex.test(email)) {
    return NextResponse.json(
      { message: "Preencha todos os campos corretamente." },
      { status: 400 }
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Contato pelo site: ${subject}`,
      text: [
        `Nome: ${name}`,
        `E-mail: ${email}`,
        `Assunto: ${subject}`,
        "",
        message,
      ].join("\n"),
      html: `
        <h2>Nova mensagem pelo site</h2>
        <p><strong>Nome:</strong> ${safeName}</p>
        <p><strong>E-mail:</strong> ${safeEmail}</p>
        <p><strong>Assunto:</strong> ${safeSubject}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${safeMessage}</p>
      `,
    }),
  });

  if (!resendResponse.ok) {
    console.error("Resend contact email failed", await resendResponse.text());

    return NextResponse.json(
      { message: "Não foi possível enviar sua mensagem agora." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
