// background Colors for the raindrop
const background = [
  "linear-gradient(transparent, #0369a1)",
  "linear-gradient(transparent, #0284c7)",
  "linear-gradient(transparent, #7dd3fc)",
];

export const renderRain = (cont: HTMLElement | null, amount: number) => {
  let i = 0;

  while (i < amount) {
    const drop = document.createElement("rainDrop");

    drop.style.width = Math.random() * 4 + "px";
    drop.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
    drop.style.animationDelay = Math.random() * -25 + "s";
    drop.style.animationDuration = (Math.random() + 0.75) * 2.5 + "s";
    drop.style.background =
      background[Math.floor(Math.random() * background.length)];
    drop.style.opacity = Math.random() + 0.2 + "";

    cont?.appendChild(drop);
    i++;
  }
};
