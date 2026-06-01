document.addEventListener('DOMContentLoaded', function() {
    const texto1 = "Olá, sou";
    const texto2 = "Arthur Melo";
    
    const velocidade = 100;
    
    const h1Ola = document.getElementById('ola-text');
    const h2Nome = document.getElementById('nome-text');
    
    let index1 = 0;
    let index2 = 0;

    function digitarPrimeiraLinha() {
        if (index1 < texto1.length) {
            h1Ola.innerHTML += texto1.charAt(index1);
            index1++;
            setTimeout(digitarPrimeiraLinha, velocidade);
        } else {
            
            setTimeout(digitarSegundaLinha, 200);
        }
    }

    function digitarSegundaLinha() {
        if (index2 < texto2.length) {
            h2Nome.innerHTML += texto2.charAt(index2);
            index2++;
            setTimeout(digitarSegundaLinha, velocidade);
        } else {
            
            h2Nome.innerHTML += '<span class="animate-pulse font-light">|</span>';
        }
    }

    // Inicia a mágica
    if (h1Ola && h2Nome) {
        digitarPrimeiraLinha();
    }
});