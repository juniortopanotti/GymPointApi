import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { student, question, answer } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Your answer has been replyed',
      template: 'answer-reply',
      context: {
        question,
        answer,
      },
    });
  }
}

export default new AnswerMail();
