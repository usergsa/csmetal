let romaneio = [];

function carregarRomaneio() {
    fetch('https://script.google.com/macros/s/AKfycbwgfpNbszHct7ODmRP0MvfSQJ2JMK5O09pLmXXYfj01YgDV8InGCxbwWQ0sZzHt6LMrVg/exec')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                romaneio = data.images;
                exibirItens();
            }
        })
        .catch(error => console.error("Erro ao buscar dados:", error));
}

function exibirItens() {
    const lista = document.getElementById("romaneioList");
    lista.innerHTML = "";
    romaneio.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.material}</strong> - Quantidade: ${item.qtd}`;
        lista.appendChild(li);
    });
}

function filtrarItens() {
    const termo = document.getElementById("searchInput").value.toLowerCase();
    const lista = document.getElementById("romaneioList");
    lista.innerHTML = "";
    romaneio.filter(item => item.material.toLowerCase().includes(termo))
        .forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${item.material}</strong> - Quantidade: ${item.qtd}`;
            lista.appendChild(li);
        });
}

function capturarImagem() {
    alert("Capturar imagem só funciona em apps móveis!");
}

// Carregar os dados quando a página abrir
carregarRomaneio();
