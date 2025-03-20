// Função para criar o elemento de item
function createItemElement(itemName) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    
    const title = document.createElement("h3");
    title.textContent = itemName;
    
    const captureBtn = document.createElement("button");
    captureBtn.textContent = "Capturar Fotos";
    captureBtn.classList.add("capture-btn");
    captureBtn.onclick = () => capturePhoto(itemDiv);
    
    const photosContainer = document.createElement("div");
    photosContainer.classList.add("photos-container");
    
    itemDiv.appendChild(title);
    itemDiv.appendChild(captureBtn);
    itemDiv.appendChild(photosContainer);
    document.getElementById("items-list").appendChild(itemDiv);
}

// Função para capturar foto
function capturePhoto(itemDiv) {
    const photosContainer = itemDiv.querySelector(".photos-container");
    const photoDiv = document.createElement("div");
    photoDiv.classList.add("photo");
    photoDiv.textContent = "Foto";
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => photoDiv.remove();
    
    photoDiv.appendChild(deleteBtn);
    photosContainer.appendChild(photoDiv);
}

// Função para abrir o modal e carregar o item
function abrirModal(itemName) {
    document.getElementById("modalTitle").textContent = `Captura: ${itemName}`;
    document.getElementById("items-list").innerHTML = "";
    createItemElement(itemName);
    
    // Exibir o modal
    document.getElementById("modalCaptura").style.display = "flex";
}

// Função para exibir os itens na lista
function exibirItens() {
    const lista = document.getElementById("romaneioList");
    lista.innerHTML = "";
    romaneio.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.material}</strong> - Quantidade: ${item.qtd}`;
        
        // Abrir o modal ao clicar no item
        li.onclick = () => abrirModal(item.material);

        lista.appendChild(li);
    });
}

// Fechar o modal ao clicar no "X"
document.querySelector(".close").onclick = function () {
    document.getElementById("modalCaptura").style.display = "none";
};

// Fechar ao clicar fora do modal
window.onclick = function (event) {
    if (event.target === document.getElementById("modalCaptura")) {
        document.getElementById("modalCaptura").style.display = "none";
    }
}

// Carregar os dados ao abrir a página (exemplo)
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

carregarRomaneio();
