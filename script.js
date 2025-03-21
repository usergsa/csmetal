let romaneio = [];
let itemStates = {}; // Objeto para armazenar fotos capturadas de cada item

function createItemElement(itemName) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    const captureBtn = document.createElement("button");
    captureBtn.textContent = "Capturar Fotos";
    captureBtn.classList.add("capture-btn");
    captureBtn.style.marginTop = "15px"; // Adiciona uma margem superior ao botão
    captureBtn.onclick = () => capturePhoto(itemName, itemDiv);
    
    const photosContainer = document.createElement("div");
    photosContainer.classList.add("photos-container");

    itemDiv.appendChild(photosContainer);
    itemDiv.appendChild(captureBtn);
    
    document.getElementById("items-list").appendChild(itemDiv);

    // Recarregar fotos do item, se houver
    if (itemStates[itemName]) {
        itemStates[itemName].forEach(photo => photosContainer.appendChild(photo));
    }

    // Atualizar cor do item no modal
    updateItemColor(itemDiv, itemName);
}

function capturePhoto(itemName, itemDiv) {
    const photosContainer = itemDiv.querySelector(".photos-container");
    const photoDiv = document.createElement("div");
    photoDiv.classList.add("photo");
    photoDiv.textContent = "Foto";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => {
        photoDiv.remove();
        itemStates[itemName] = itemStates[itemName].filter(photo => photo !== photoDiv);
        updateItemColor(itemDiv, itemName);
        updateMainListItemColor(itemName);
    };

    photoDiv.appendChild(deleteBtn);
    photosContainer.appendChild(photoDiv);

    // Adicionar ao estado do item
    if (!itemStates[itemName]) {
        itemStates[itemName] = [];
    }
    itemStates[itemName].push(photoDiv);

    updateItemColor(itemDiv, itemName);
    updateMainListItemColor(itemName);
}

function updateItemColor(itemDiv, itemName) {
    const item = romaneio.find(i => i.material === itemName);
    const itemPhotos = itemStates[itemName] ? itemStates[itemName].length : 0;

    if (itemPhotos === item.qtd) {
        itemDiv.style.backgroundColor = "green";
        itemDiv.style.color = "white"; 
    } else if (itemPhotos > item.qtd) {
        itemDiv.style.backgroundColor = "yellow";
        itemDiv.style.color = "black";
    } else {
        itemDiv.style.backgroundColor = "#333";
        itemDiv.style.color = "white";
    }
}

function updateMainListItemColor(itemName) {
    const item = romaneio.find(i => i.material === itemName);
    const itemPhotos = itemStates[itemName] ? itemStates[itemName].length : 0;
    const listItem = document.querySelector(`#romaneioList li[data-material="${itemName}"]`);

    if (!listItem) return;

    if (itemPhotos === item.qtd) {
        listItem.style.backgroundColor = "green";
        listItem.style.color = "white";
    } else if (itemPhotos > item.qtd) {
        listItem.style.backgroundColor = "yellow";
        listItem.style.color = "black";
    } else {
        listItem.style.backgroundColor = "#333";
        listItem.style.color = "white";
    }
}

function abrirModal(itemName) {
    const item = romaneio.find(i => i.material === itemName);
    var i=7;
    document.getElementById("modalTitle").textContent = `${itemName} - Quantidade: ${item.qtd}`; // Exibe o nome e a quantidade do item
    document.getElementById("items-list").innerHTML = "";
    
    createItemElement(itemName);
    document.getElementById("modalCaptura").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modalCaptura").style.display = "none";
}

function exibirItens() {
    const lista = document.getElementById("romaneioList");
    lista.innerHTML = "";
    romaneio.forEach(item => {
        const li = document.createElement("li");
        li.setAttribute("data-material", item.material);
        li.innerHTML = `<strong>${item.material}</strong> - Quantidade: ${item.qtd}`;
        li.onclick = () => abrirModal(item.material);
        lista.appendChild(li);
        updateMainListItemColor(item.material);
    });
}

function filtrarItens() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const ul = document.getElementById('romaneioList');
    const li = ul.getElementsByTagName('li');

    for (let i = 0; i < li.length; i++) {
        const item = li[i].textContent || li[i].innerText;
        if (item.toLowerCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            // Highlight somente se houver texto no filtro
            if (filter.length > 0) {
                li[i].classList.add('highlight');
            } else {
                li[i].classList.remove('highlight');
            }
        } else {
            li[i].style.display = "none";
            li[i].classList.remove('highlight');
        }
    }
}

function carregarRomaneio() {
    fetch('https://script.google.com/macros/s/AKfycbwgfpNbszHct7ODmRP0MvfSQJ2JMK5O09pLmXXYfj01YgDV8InGCxbwWQ0sZzHt6LMrVg/exec')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                romaneio = data.images;
                exibirItens();
            } else {
                throw new Error("Resposta inesperada da API");
            }
        })
        .catch(error => console.error("Erro ao buscar dados:", error.message));
}

// Event listeners
document.querySelector(".close").onclick = fecharModal;

window.onclick = function(event) {
    if (event.target === document.getElementById("modalCaptura")) {
        fecharModal();
    }
};

// Inicializar a aplicação
carregarRomaneio();
