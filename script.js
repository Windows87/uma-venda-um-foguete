let lastCoffeeSells = Number(localStorage.getItem('lastCoffeeSells') || 0);

const playFireworkSound = () => {
    const audio = new Audio('fireworks.mp3');
    audio.play();
}

const runFireworkAnimation = () => {
    const container = document.querySelector('.fireworks')
    const fireworks = new Fireworks.default(container)
    fireworks.start()

    setTimeout(() => {
        fireworks.stop()
    }, 17000)
}

const fetchCoffeeSells = async () => {
    const response = await fetch('https://7cixi4v6v6lvehveuzctyo5swm0exrzc.lambda-url.sa-east-1.on.aws');
    const data = await response.text();
    return Number(data);
}

const setLastCoffeeSells = (sells) => {
    localStorage.setItem('lastCoffeeSells', sells);
    lastCoffeeSells = sells;
}

const startPooling = async () => {
    while (true) {
        const sells = await fetchCoffeeSells();

        if(!lastCoffeeSells) {
            setLastCoffeeSells(sells);
            continue;
        }

        if (sells > lastCoffeeSells) {
            const difference = sells - lastCoffeeSells;
            for (let i = 0; i < difference; i++) {
                playFireworkSound();
                runFireworkAnimation();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            setLastCoffeeSells(sells);
        }

        await new Promise(resolve => setTimeout(resolve, 60000));
    }
}

const button = document.querySelector('button');

button.addEventListener('click', () => {
    startPooling();
    button.style.display = 'none';
});