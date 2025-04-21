// Variables principales
let money = 0;
let pickaxeMultiplier = 1;
let rockResistance = 10;
let workers = 0;
let inventoryCapacity = 50;
let inventory = {
    piedra: 0,
    carbon: 0,
    cobre: 0,
    hierro: 0,
    oro: 0,
    esmeralda: 0,
    diamante: 0,
    rubi: 0,
};
let level = 1;
let currentRockImage = "images/roca1.png";

// Elementos DOM
const mineButton = document.getElementById("mineButton");
const moneyElement = document.getElementById("money");
const pickaxeMultiplierElement = document.getElementById("pickaxeMultiplier");
const workersElement = document.getElementById("workers");
const inventoryStatus = document.getElementById("inventoryStatus");
const levelElement = document.getElementById("level");
const inventoryFullMessage = document.getElementById("inventoryFullMessage");
const inventoryProgress = document.getElementById("inventory-progress");
const currentInventoryDisplay = document.getElementById("currentInventory");
const maxInventoryDisplay = document.getElementById("maxInventory");

// Configuración de precios
let PRICES = {
    pickaxe: 1000,
    worker: 5000,
    inventory: 1000,
    zone2: 500, // Costo de la segunda mina
    zone3: 10000, // Costo de la tercera mina
};

// Elementos para mostrar los costos
const costPickaxeElement = document.getElementById("costPickaxe");
const costWorkerElement = document.getElementById("costWorker");
const costInventoryElement = document.getElementById("costInventory");

// Imágenes de minerales
const mineralImages = {
    piedra: "images/piedra.png",
    carbon: "images/carbon.png",
    cobre: "images/cobre.png",
    hierro: "images/hierro.png",
    oro: "images/oro.png",
    esmeralda: "images/esmeralda.png",
    diamante: "images/diamante.png",
    rubi: "images/rubi.png",
};

let hasZone2 = false;
let hasZone3 = false;

// Lista de logros
const achievements = [
    // Logros de trabajadores
    {
        id: "worker5",
        name: "Primeros Empleados",
        description: "Contrata 5 trabajadores.",
        unlocked: false,
        condition: () => workers >= 5,
    },
    {
        id: "worker10",
        name: "Contratista Experto",
        description: "Contrata 10 trabajadores.",
        unlocked: false,
        condition: () => workers >= 10,
    },
    {
        id: "worker25",
        name: "Imperio Minero",
        description: "Contrata 25 trabajadores.",
        unlocked: false,
        condition: () => workers >= 25,
    },
    {
        id: "worker50",
        name: "Magnate de la Mina",
        description: "Contrata 50 trabajadores.",
        unlocked: false,
        condition: () => workers >= 50,
    },
    // Logros de nivel
    {
        id: "level10",
        name: "Picando Piedra",
        description: "Alcanza el Nivel 10.",
        unlocked: false,
        condition: () => level >= 10,
    },
    {
        id: "level25",
        name: "Minería Avanzada",
        description: "Alcanza el Nivel 25.",
        unlocked: false,
        condition: () => level >= 25,
    },
    {
        id: "level50",
        name: "Excavador Profesional",
        description: "Alcanza el Nivel 50.",
        unlocked: false,
        condition: () => level >= 50,
    },
    {
        id: "level75",
        name: "Leyenda de la Mina",
        description: "Alcanza el Nivel 75.",
        unlocked: false,
        condition: () => level >= 75,
    },
    {
        id: "level100",
        name: "Minería Platino",
        description: "Alcanza el Nivel 100.",
        unlocked: false,
        condition: () => level >= 100,
    },
    // Logros de zonas
    {
        id: "zoneIce",
        name: "Explorador de Hielo",
        description: "Desbloquea la Mina de Hielo.",
        unlocked: false,
        condition: () => hasZone2 === true,
    },
    {
        id: "zoneVolcanic",
        name: "Corazón de Fuego",
        description: "Desbloquea la Mina Volcánica.",
        unlocked: false,
        condition: () => hasZone3 === true,
    },
    // Logro secreto
    {
        id: "bankrupt",
        name: "Juega nuestro juego",
        description: "Gracias por jugar.",
        unlocked: false,
        condition: () => money <= 0,
    },
];

function checkAchievements() {
    achievements.forEach((achievement) => {
        if (!achievement.unlocked && achievement.condition()) {
            achievement.unlocked = true;
            displayAchievement(achievement);
        }
    });
}

function displayAchievement(achievement) {
    const achievementPopup = document.createElement("div");
    achievementPopup.classList.add("achievement-popup");
    achievementPopup.innerHTML = `
        <h3>🏆 ¡Logro Desbloqueado!</h3>
        <p><strong>${achievement.name}</strong>... ${achievement.description}</p>
    `;
    document.body.appendChild(achievementPopup);
    // Elimina el popup después de 5 segundos
    setTimeout(() => {
        achievementPopup.remove();
    }, 5000);
}

// Función para crear el elemento del mineral flotante
function createFloatingMineral(mineralType, x, y) {
    const mineralImage = document.createElement("img");
    mineralImage.src = mineralImages[mineralType];
    mineralImage.classList.add("floating-mineral");
    mineralImage.style.left = `${x}px`;
    mineralImage.style.top = `${y}px`;
    mineButton.appendChild(mineralImage);
    mineralImage.addEventListener("animationend", () => {
        mineralImage.remove();
    });
}

// Función principal de minería
mineButton.addEventListener("click", function (event) {
    if (getTotalInventory() >= inventoryCapacity) {
        inventoryFullMessage.style.display = "block";
        mineButton.disabled = true;
        setTimeout(() => {
            inventoryFullMessage.style.display = "none";
            mineButton.disabled = false;
        }, 1000);
        return;
    }

    let random = Math.random();
    let minedMineral = null;

    // Probabilidades ajustadas por zona
    if (!hasZone2 && !hasZone3) {
        if (random < 0.33) {
            inventory.piedra += pickaxeMultiplier;
            minedMineral = "piedra";
        } else if (random < 0.66) {
            inventory.carbon += pickaxeMultiplier;
            minedMineral = "carbon";
        } else {
            inventory.cobre += pickaxeMultiplier;
            minedMineral = "cobre";
        }
    } else if (hasZone2 && !hasZone3) {
        if (random < 0.2) {
            inventory.piedra += pickaxeMultiplier;
            minedMineral = "piedra";
        } else if (random < 0.4) {
            inventory.carbon += pickaxeMultiplier;
            minedMineral = "carbon";
        } else if (random < 0.6) {
            inventory.cobre += pickaxeMultiplier;
            minedMineral = "cobre";
        } else if (random < 0.8) {
            inventory.hierro += pickaxeMultiplier;
            minedMineral = "hierro";
        } else if (random < 0.9) {
            inventory.oro += pickaxeMultiplier;
            minedMineral = "oro";
        } else {
            inventory.esmeralda += pickaxeMultiplier;
            minedMineral = "esmeralda";
        }
    } else if (!hasZone2 && hasZone3) {
        if (random < 0.66) {
            inventory.diamante += pickaxeMultiplier;
            minedMineral = "diamante";
        } else {
            inventory.rubi += pickaxeMultiplier;
            minedMineral = "rubi";
        }
    } else if (hasZone2 && hasZone3) {
        if (random < 0.33) {
            inventory.hierro += pickaxeMultiplier;
            minedMineral = "hierro";
        } else if (random < 0.66) {
            inventory.diamante += pickaxeMultiplier;
            minedMineral = "diamante";
        } else {
            inventory.rubi += pickaxeMultiplier;
            minedMineral = "rubi";
        }
    }

    let inventoryBeforeMine = getTotalInventory();
    // Prevent the inventory from exceeding capacity.
    let amountToAdd = pickaxeMultiplier;
    if (getTotalInventory() + amountToAdd > inventoryCapacity) {
        amountToAdd = inventoryCapacity - getTotalInventory();
    }

    if (minedMineral) {
        inventory[minedMineral] += amountToAdd;
        // Obtener la posición del clic
        const x = event.offsetX;
        const y = event.offsetY;
        // Crear mineral flotante
        createFloatingMineral(minedMineral, x, y);
        // Check if it's time to level up
        if (piedraCount >= 1000) {
            level++;
            levelElement.textContent = `Nivel ${level}`;
            piedraCount -= 1000; // Reset counter, subtracting the amount over 10000
            checkAchievements(); // Check level achievements
        }
    }
    updateInventoryDisplay();
    updateInventoryProgress();
});

// Sistema de venta sin cooldown
document.getElementById("sellAll").addEventListener("click", function () {
    const totalValue =
        inventory.piedra * 0.10 +
        inventory.carbon * 0.50 +
        inventory.cobre * 1 +
        inventory.hierro * 50 +
        inventory.oro * 100 +
        inventory.esmeralda * 250 +
        inventory.diamante * 300 +
        inventory.rubi * 500;
    if (totalValue > 0) {
        money += totalValue;
        moneyElement.textContent = money.toFixed(2);
        for (let material in inventory) {
            inventory[material] = 0;
        }
        updateInventoryDisplay();
        updateInventoryProgress();
        checkAchievements();
    }
});

// Sistema de mejoras
document.getElementById("upgradePickaxe").addEventListener("click", function () {
    if (money >= PRICES.pickaxe) {
        money -= PRICES.pickaxe;
        PRICES.pickaxe *= 1.5;
        pickaxeMultiplier += 0.5;
        pickaxeMultiplierElement.textContent = `x${pickaxeMultiplier.toFixed(1)}`;
        moneyElement.textContent = money.toFixed(2);
        costPickaxeElement.textContent = Math.round(PRICES.pickaxe);
        alert(`¡Pico mejorado! Ahora obtienes x${pickaxeMultiplier.toFixed(1)} materiales.`);
    } else {
        alert("Dinero insuficiente");
    }
});

document.getElementById("hireWorker").addEventListener("click", function () {
    if (money >= PRICES.worker) {
        money -= PRICES.worker;
        PRICES.worker *= 1.5;
        workers++;
        workersElement.textContent = workers;
        moneyElement.textContent = money.toFixed(2);
        costWorkerElement.textContent = Math.round(PRICES.worker);
        checkAchievements();
    } else {
        alert("Dinero insuficiente");
    }
});

document.getElementById("upgradeInventory").addEventListener("click", function () {
    if (money >= PRICES.inventory) {
        money -= PRICES.inventory;
        PRICES.inventory *= 1.5;
        inventoryCapacity += 10;
        maxInventoryDisplay.textContent = inventoryCapacity;
        updateInventoryProgress();
        moneyElement.textContent = money.toFixed(2);
        costInventoryElement.textContent = Math.round(PRICES.inventory);
    } else {
        alert("Dinero insuficiente");
    }
});

function unlockZone(zoneNumber) {
    const zoneButton = document.getElementById(`zone${zoneNumber}`);
    const zoneFooterElements = document.querySelectorAll(`.material[data-zone-id="zone${zoneNumber}"]`);
    zoneFooterElements.forEach((element) => {
        element.classList.remove("locked-zone");
        element.classList.remove(`zone${zoneNumber}-locked`);
    });
}

function updateLockIconsVisibility(zoneId, visible) {
    const elements = document.querySelectorAll(`.material[data-zone-id="${zoneId}"]`);
    elements.forEach((element) => {
        const lockIcon = element.querySelector(".lock-icon");
        if (lockIcon) {
            lockIcon.style.display = visible ? "block" : "none";
        }
    });
}

// Sistema de zonas desbloqueables
document.getElementById("zone2").addEventListener("click", function () {
    if (money >= PRICES.zone2) {
        money -= PRICES.zone2;
        hasZone2 = true;
        unlockZone(2);
        updateInventoryDisplay();
        alert("¡Zona de Hielo desbloqueada!");
        updateZoneProbabilities();
        // Cambia la imagen al comprar la zona
        mineButton.style.backgroundImage = `url('images/roca2.png')`;
        currentRockImage = "images/roca2.png";
        checkAchievements();
    } else {
        alert("Dinero insuficiente para desbloquear esta zona.");
    }
    updateLockIconsVisibility("zone2", false);
});

document.getElementById("zone3").addEventListener("click", function () {
    if (money >= PRICES.zone3) {
        money -= PRICES.zone3;
        hasZone3 = true;
        unlockZone(3);
        updateInventoryDisplay();
        alert("¡Zona Volcánica desbloqueada!");
        updateZoneProbabilities();
        // Cambia la imagen al comprar la zona
        mineButton.style.backgroundImage = `url('images/roca3.png')`;
        currentRockImage = "images/roca3.png";
        checkAchievements();
    } else {
        alert("Dinero insuficiente para desbloquear esta zona.");
    }
    updateLockIconsVisibility("zone3", false);
});

function updateZoneProbabilities() {
    updateLockIconsVisibility("zone2", !hasZone2);
    updateLockIconsVisibility("zone3", !hasZone3);
}

// Funciones auxiliares
function getTotalInventory() {
    return Object.values(inventory).reduce((a, b) => a + b, 0);
}

function updateInventoryDisplay() {
    document.getElementById("piedraCount").textContent = inventory.piedra;
    document.getElementById("carbonCount").textContent = inventory.carbon;
    document.getElementById("cobreCount").textContent = inventory.cobre;
    document.getElementById("hierroCount").textContent = inventory.hierro;
    document.getElementById("oroCount").textContent = inventory.oro;
    document.getElementById("esmeraldaCount").textContent = inventory.esmeralda;
    document.getElementById("diamanteCount").textContent = inventory.diamante;
    document.getElementById("rubiCount").textContent = inventory.rubi;
    currentInventoryDisplay.textContent = getTotalInventory();
}

function updateInventoryProgress() {
    const totalInventory = getTotalInventory();
    const percentage = (totalInventory / inventoryCapacity) * 100;
    inventoryProgress.style.width = `${percentage}%`;
}

// Ingresos pasivos por trabajadores cada segundo
setInterval(() => {
    money += workers * 1; // Cada trabajador genera $1 por segundo
    moneyElement.textContent = money.toFixed(2);
    checkAchievements();
}, 1000);

// Inicializar los costos de las mejoras
costPickaxeElement.textContent = PRICES.pickaxe;
costWorkerElement.textContent = PRICES.worker;
costInventoryElement.textContent = PRICES.inventory;

// Establecer la imagen inicial de la roca
mineButton.style.backgroundImage = `url('${currentRockImage}')`;

maxInventoryDisplay.textContent = inventoryCapacity;
updateInventoryDisplay();
updateInventoryProgress();

// Initial setup: hide lock icons for unlocked zone.
updateZoneProbabilities();

function updateAchievementsDisplay() {
    const achievementsList = document.getElementById("achievementsList");
    if (!achievementsList) return;

    achievementsList.innerHTML = "";

    achievements.forEach((achievement) => {
        const li = document.createElement("li");
        li.textContent = achievement.name;

        if (achievement.unlocked) {
            li.classList.add("unlocked");
            li.textContent += " - ✅";
        } else {
            li.classList.add("locked");
            li.textContent += " - ❌";
        }

        achievementsList.appendChild(li);
    });
}

// Llama a esta función después de verificar los logros
checkAchievements();
updateAchievementsDisplay();

document.addEventListener("DOMContentLoaded", function () {
    updateAchievementsDisplay();
});
