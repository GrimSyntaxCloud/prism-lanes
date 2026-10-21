const modal = document.querySelector("#plan");
const type = document.querySelector("#visit-type");
const players = document.querySelector("#players");
let opener;
for (const button of document.querySelectorAll("[data-plan]"))
  button.addEventListener("click", () => {
    opener = button;
    modal.showModal();
  });
modal.addEventListener("close", () => opener?.focus());
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    const r = modal.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      modal.close();
  }
});
function estimate() {
  const rates = { cosmic: 12, weekday: 5.5, weekend: 6 };
  document.querySelector("#estimate").textContent = new Intl.NumberFormat(
    "en-US",
    { style: "currency", currency: "USD" },
  ).format(rates[type.value] * Number(players.value));
  document.querySelector("#estimate-detail").textContent =
    type.value === "cosmic"
      ? "Cosmic bowling with shoes"
      : "One game per player + shoe rental";
}
type.addEventListener("change", estimate);
players.addEventListener("change", estimate);
const motion = document.querySelector(".motion-toggle");
let paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function applyMotion() {
  document.body.classList.toggle("pause-motion", paused);
  motion.setAttribute("aria-pressed", String(paused));
  motion.textContent = paused ? "Motion paused" : "Pause motion";
  document.dispatchEvent(
    new CustomEvent("prism-motion", { detail: { paused } }),
  );
}
motion.addEventListener("click", () => {
  paused = !paused;
  applyMotion();
});
applyMotion();
