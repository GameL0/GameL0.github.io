// Espera todo o documento HTML carregar
document.addEventListener('DOMContentLoaded', function() {
    
    // Agora sim, ele vai achar os IDs com certeza
    const form = document.getElementById('contact-form');
    const btnSubmit = document.getElementById('btn-submit');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const successToast = document.getElementById('success-toast');

    // Se o formulário não for encontrado, ele avisa no console e para aqui
    if (!form) {
        console.error("Formulário não encontrado no HTML!");
        return; 
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o recarregamento da página

        btnSubmit.disabled = true;
        btnSubmit.classList.add('opacity-75', 'cursor-not-allowed');
        btnText.textContent = 'Enviando...';
        btnSpinner.classList.remove('hidden');

        setTimeout(() => {
            btnSubmit.disabled = false;
            btnSubmit.classList.remove('opacity-75', 'cursor-not-allowed');
            btnText.textContent = 'Enviar Mensagem';
            btnSpinner.classList.add('hidden');

            successToast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
            successToast.classList.add('translate-y-0', 'opacity-100');

            form.reset();

            setTimeout(() => {
                successToast.classList.remove('translate-y-0', 'opacity-100');
                successToast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
            }, 4000);

        }, 1500); 
    });

});