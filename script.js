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

function updateCookingProgress() {
    timerLabel.textContent = `${state.cookTime.toFixed(1)}s`;

    // Calculate progress percentage based on 10 second scale
    const maxSeconds = 12;
    const progressPct = Math.min(100, (state.cookTime / maxSeconds) * 100);
    progressBar.style.width = `${progressPct}%`;

    // Determine Doneness Status based on cook time
    if (state.cookTime < 4) {
        state.cookStatus = 'raw';
        donenessLabel.textContent = `Raw (${Math.round(progressPct)}%)`;
    } else if (state.cookTime >= 4 && state.cookTime <= 8) {
        state.cookStatus = 'golden';
        donenessLabel.textContent = `Golden Brown (${Math.round(progressPct)}%)`;
    } else {
        state.cookStatus = 'burnt';
        donenessLabel.textContent = `Burnt (${Math.round(progressPct)}%)`;
    }

    updateBakeState();
}

function updateBakeState() {
    wafflePlate.className = 'waffle-plate ' + (state.isCooking ? 'cooking' : state.cookStatus);

    // Update badge UI
    statusBadge.className = 'badge ' + state.cookStatus;
    if (state.cookStatus === 'empty') statusBadge.textContent = 'Empty';
    else if (state.cookStatus === 'raw') statusBadge.textContent = 'Raw Batter';
    else if (state.cookStatus === 'golden') statusBadge.textContent = 'Golden Brown';
    else if (state.cookStatus === 'burnt') statusBadge.textContent = 'Burnt Crispy';

    renderToppings();
}

toppingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        toppingBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedTopping = btn.getAttribute('data-topping');
    });
});

function getCanvasCoords(e) {
    const rect = toppingCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
        x: (clientX - rect.left) * (toppingCanvas.width / rect.width),
        y: (clientY - rect.top) * (toppingCanvas.height / rect.height)
    }
}

function addTopping(e) {
    if (!state.hasBatter) {
        alert("You gotta pour batter before adding toppings xD");
        return;
    }

    const coords = getCanvasCoords(e);
    const distFromCenter = Math.hypot(coords.x - 160, coords.y - 160);
    if (distFromCenter > 130) return;

    state.toppings.push({
        type: state.selectedTopping,
        x: coords.x,
        y: coords.y
    });

    toppingCounter.textContent = `${state.toppings.length} Topping${state.toppings.length === 1 ? '' : 's'}`;
    renderToppings();
}

toppingCanvas.addEventListener('click', addTopping);


// create small cute toppings using shapes

function renderToppings() {
    ctx.clearRect(0, 0, toppingCanvas.width, toppingCanvas.height);

    state.toppings.forEach(t => {
        ctx.save();
        ctx.translate(t.x, t.y);

        switch (t.type) {
            case 'butter':
                ctx.fillStyle = '#fef08a';
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2;
                ctx.fillRect(-12, -10, 24, 20);
                ctx.strokeRect(-12, -10, 24, 20);
                break;
            case 'syrup':
                ctx.fillStyle = 'rgba(180, 83, 9, 0.7)';
                ctx.beginPath();
                ctx.arc(0, 0, 20, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'strawberry':
                ctx.fillStyle = '#e74c3c';
                ctx.beginPath();
                ctx.arc(0, 0, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#2ecc71';
                ctx.fillRect(-3, -12, 6, 4);
                break;
            case 'blueberry':
                ctx.fillStyle = '#3498db';
                ctx.beginPath();
                ctx.arc(0, 0, 8, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'cream':
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(0, 0, 14, 0, Math.PI * 2);
                ctx.arc(6, -4, 8, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'chocolate':
                ctx.fillStyle = '#5d4037';
                ctx.beginPath();
                ctx.arc(0, 0, 5, 0, Math.PI * 2);
                ctx.fill();
                break;
        }

        ctx.restore();
    });
}

clearToppingsBtn.addEventListener('click', () => {
    state.toppings = [];
    toppingCounter.textContent = '0 Toppings';
    renderToppings();
})

serveBtn.addEventListener('click', () => {
    if (!state.hasBatter) {
        critiqueDisplay.textContent = "you rlly gonna serve an empty waffle?";
        return;
    }

    let score = 50;
    let critique = "";

    if (state.cookStatus == 'golden') {
        score += 35;
        critique = "golden brown perfection!";
    } else if (state.cookStatus === 'raw') {
        score -= 20;
        critique = "u like liquid waffles??";
    } else if (state.cookStatus === 'burnt') {
        score -= 30;
        critique = "bro u burnt it </3";
    }

    const uniqueToppings = new Set(state.toppings.map(t => t.type)).size;
    score += uniqueToppings * 5;

    if (state.toppings.length === 0) {
        critique += "nice bread you made there xD";
    } else if (state.toppings.length > 15) {
        score -= 10;
        critique += "a lot of toppings damn";
    } else {
        critique += "ok nice";
    }

    score = Math.max(0, Math.min(100, score));

    scoreDisplay.textContent = `${score}%`;
    critiqueDisplay.textContent = critique;
});

resetBtn.addEventListener('click', () => {
    clearInterval(cookInterval);

    state.hasBatter = false;
    state.isCooking = false;
    state.cookTime = 0;
    state.cookStatus = 'empty';
    state.toppings = [];

    timerLabel.textContent = '0.0s';
    donenessLabel.textContent = 'Raw (0%)';
    progressBar.style.width = '0%';

    pourBtn.disabled = false;
    cookBtn.disabled = true;
    cookBtn.innerHTML = 'Start Cooking';
    cookBtn.className = 'btn btn-secondary';

    toppingCounter.textContent = '0 Toppings';
    scoreDisplay.textContent = '--%';
    critiqueDisplay.textContent = 'Bake the waffle now';

    updateBakeState();
});