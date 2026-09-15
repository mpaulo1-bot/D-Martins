const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const year = document.querySelector("[data-year]");
const form = document.querySelector(".quote-form");
const whatsappButton = document.querySelector("[data-whatsapp]");
const whatsappNumber = "5527988624528";

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

function buildWhatsAppMessage() {
  if (!form || !whatsappButton) return;

  const services = [...form.querySelectorAll('input[type="checkbox"]:checked')]
    .map((input) => input.value)
    .join(", ");
  const etapa = form.elements.etapa?.value.trim();
  const medida = form.elements.medida?.value.trim();
  const local = form.elements.local?.value.trim();

  const message = [
    "Olá! Vi o site da D'Martins Construções e quero um orçamento.",
    services ? `Servico: ${services}` : "",
    etapa ? `Etapa da obra: ${etapa}` : "",
    medida ? `Quantidade ou medida: ${medida}` : "",
    local ? `Bairro ou cidade: ${local}` : "",
  ].filter(Boolean).join("\n");

  whatsappButton.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

if (form) {
  form.addEventListener("input", buildWhatsAppMessage);
  form.addEventListener("change", buildWhatsAppMessage);
  buildWhatsAppMessage();
}
