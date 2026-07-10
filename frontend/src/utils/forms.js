// Espera todo o documento HTML carregar
document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('contact-form');
    const btnSubmit = document.getElementById('btn-submit');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const successToast = document.getElementById('success-toast');

    if (!form) {
        console.error("Formulário não encontrado no HTML!");
        return; 
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault();


        const name = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('mensagem').value;

        btnSubmit.disabled = true;
        btnSubmit.classList.add('opacity-75', 'cursor-not-allowed');
        btnText.textContent = 'Enviando...';
        btnSpinner.classList.remove('hidden');

        try {
            const response = await fetch('http://localhost:3000/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            if (!response.ok) {
                throw new Error('Erro ao enviar mensagem. Tente novamente.');
            }
            // Sucesso — mostra o toast
            successToast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
            successToast.classList.add('translate-y-0', 'opacity-100');
            form.reset();
            setTimeout(() => {
                successToast.classList.remove('translate-y-0', 'opacity-100');
                successToast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
            }, 4000);
        } catch (err) {
            alert(err.message);
        } finally {
            // Sempre restaura o botão
            btnSubmit.disabled = false;
            btnSubmit.classList.remove('opacity-75', 'cursor-not-allowed');
            btnText.textContent = 'Enviar Mensagem';
            btnSpinner.classList.add('hidden');
        }
    });

});