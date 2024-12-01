export const sendEmail = async (email) => {
  if (email) {
    try {
      await fetch('https://api-cafe-gourmet.vercel.app/api/send-email', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Confirmação de Inscrição na Newsletter',
          text: 'Sua inscrição na nossa newsletter foi confirmada. Em breve receberá novas promoções e muito mais!!!',
        }),
      });
      alert('Inscrição confirmada! Verifique seu email.');
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      alert('Houve um problema ao confirmar sua inscrição. Tente novamente mais tarde.');
    }
  } else {
    alert('Por favor, insira um email válido.');
  }
};