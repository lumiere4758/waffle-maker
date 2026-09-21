const state = {
    hasBatter: false,
    isCooking: false,
    cookTime: 0,
    cookStatus: 'empty',
    selectedTopping: 'butter',
    toppings: []
}

let cookInterval = null;

// DOM

const wafflePlate = document.getElementById('wafflePlate');
const toppingCanvas = document.getElementById('toppingCanvas');
const ctx = toppingCanvas.getContext('2d');
const statusBadge = document.getElementById('statusBadge');
const timerLabel = document.getElementById('timerLabel');
const donenessLabel = document.getElementById('donenessLabel');
const progressBar = document.getElementById('progressBar');
const pourBtn = document.getElementById('pourBtn');
const cookBtn = document.getElementById('cookBtn');
const clearToppingsBtn = document.getElementById('clearToppingsBtn');
const serveBtn = document.getElementById('serveBtn');
const resetBtn = document.getElementById('resetBtn');
const toppingCounter = document.getElementById('toppingCounter');
const scoreDisplay = document.getElementById('scoreDisplay');
const critiqueDisplay = document.getElementById('critiqueDisplay');
const toppingBtns = document.querySelectorAll('.topping-btn');

function initWaffleGrid() {
    wafflePlate.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'waffle-cell';
        wafflePlate.appendChild(cell);
    }
}
initWaffleGrid();

pourBtn.addEventListener('click', () => {
    if (state.hasBatter || state.isCooking) return;
    state.hasBatter = true;
    state.cookStatus = 'raw';
    updateBakeState();

    cookBtn.disabled = false;
    pourBtn.disabled = true;
})

cookBtn.addEventListener('click', () => {
    if (!state.hasBatter) return;

    if (!state.isCooking) {
        // start cookin
        state.isCooking = true;
        cookBtn.innerHTML = '<span>⏸️</span> Stop Cooking';
        cookBtn.classList.replace('btn-secondary', 'btn-danger');

        const startTime = Date.now() - (state.cookTime * 1000);
        cookInterval = setInterval(() => {
            state.cookTime = (Date.now() - startTime) / 1000;
            updateCookingProgress();
        }, 100);
    } else {
        // Stop cooking
        state.isCooking = false;
        clearInterval(cookInterval);
        cookBtn.innerHTML = 'Resume Cooking';
        cookBtn.classList.replace('btn-danger', 'btn-secondary');
    }
});


