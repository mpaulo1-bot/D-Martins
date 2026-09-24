const lightbox = document.querySelector(".comparison-lightbox");
const lightboxMedia = lightbox.querySelector(".lightbox-media");
const lightboxCaption = lightbox.querySelector("figcaption");
let lastTrigger;

document.querySelectorAll(".comparison-images button").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const original = trigger.querySelector("img");
    const image = document.createElement("img");
    image.src = original.getAttribute("src");
    image.alt = original.alt;
    image.width = original.width;
    image.height = original.height;
    lightboxMedia.replaceChildren(image);
    lightboxCaption.textContent = `${trigger.closest(".comparison-card").querySelector("h3").textContent} · ${trigger.parentElement.querySelector("figcaption").textContent}`;
    lastTrigger = trigger;
    lightbox.showModal();
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => lastTrigger?.focus());
