import { Resend } from 'resend';

const FROM = 'Gustavo Lopes <gustavo@gusflopes.dev>';

export async function sendConfirmation(args: {
  apiKey: string;
  to: string;
  tag: string;
}) {
  const resend = new Resend(args.apiKey);

  const subject = subjectForTag(args.tag);
  const body = bodyForTag(args.tag);

  return resend.emails.send({
    from: FROM,
    to: args.to,
    subject,
    html: body,
  });
}

function subjectForTag(tag: string) {
  if (tag.startsWith('mentoria')) return 'Você está na lista da próxima turma de mentoria';
  if (tag.startsWith('curso')) return 'Você está na lista da próxima turma do curso';
  return 'Confirmado: você assinou a newsletter de gusflopes.dev';
}

function bodyForTag(tag: string) {
  const intro = tag.startsWith('mentoria')
    ? 'Você acabou de entrar na lista de espera da próxima turma de mentoria.'
    : tag.startsWith('curso')
    ? 'Você acabou de entrar na lista de espera do próximo curso.'
    : 'Você acabou de assinar a newsletter de gusflopes.dev.';
  return `<p>${intro}</p><p>Quando abrir vagas, você é avisado primeiro.</p><p>— Gustavo</p>`;
}
