let romaneio = [];
let itemStates = {}; // Objeto para armazenar fotos capturadas de cada item

function createItemElement(itemName) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    const title = document.createElement("h3");
    title.textContent = itemName;

    const captureBtn = document.createElement("button");
    captureBtn.textContent = "Capturar Fotos";
    captureBtn.classList.add("capture-btn");
    captureBtn.onclick = () => capturePhoto(itemName, itemDiv);

    const photosContainer = document.createElement("div");
    photosContainer.classList.add("photos-container");

    itemDiv.appendChild(title);
    itemDiv.appendChild(captureBtn);
    itemDiv.appendChild(photosContainer);
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
    } else if (itemPhotos > item.qtd) {
        itemDiv.style.backgroundColor = "yellow";
    } else {
        itemDiv.style.backgroundColor = "white";
    }
}

function updateMainListItemColor(itemName) {
    const item = romaneio.find(i => i.material === itemName);
    const itemPhotos = itemStates[itemName] ? itemStates[itemName].length : 0;
    const listItem = document.querySelector(`#romaneioList li[data-material="${itemName}"]`);

    if (!listItem) return;

    if (itemPhotos === item.qtd) {
        listItem.style.backgroundColor = "green";
    } else if (itemPhotos > item.qtd) {
        listItem.style.backgroundColor = "yellow";
    } else {
        listItem.style.backgroundColor = "white";
    }
}

function abrirModal(itemName) {
    document.getElementById("modalTitle").textContent = `Captura: ${itemName}`;
    document.getElementById("items-list").innerHTML = "";
    createItemElement(itemName);

    document.getElementById("modalCaptura").style.display = "flex";
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

document.querySelector(".close").onclick = function () {
    document.getElementById("modalCaptura").style.display = "none";
};

window.onclick = function (event) {
    if (event.target === document.getElementById("modalCaptura")) {
        document.getElementById("modalCaptura").style.display = "none";
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


carregarRomaneio();
