/* Хелпери для макетів: статус-бар iPhone і клонування екранів у рамки. */
(function () {
  const statusBar = (time = "9:41") => `
    <div class="status"><span>${time}</span>
      <span class="status__icons"><i class="st-signal"><b></b><b></b><b></b><b></b></i><i class="st-wifi"></i><i class="st-bat"></i></span>
    </div>`;

  // <div class="phone" data-screen="home"></div>  → рамка + вміст <template id="home">
  document.querySelectorAll(".phone[data-screen]").forEach((ph) => {
    const tpl = document.getElementById(ph.dataset.screen);
    ph.innerHTML = `<div class="phone__screen ${tpl.dataset.class || ""}">
        <i class="phone__island"></i>${statusBar(tpl.dataset.time)}${tpl.innerHTML}<i class="home-ind"></i>
      </div>`;
  });

  // <div data-clone="id"></div> → копія вмісту <template id="id"> (для браузерних сторінок)
  document.querySelectorAll("[data-clone]").forEach((el) => {
    el.innerHTML = document.getElementById(el.dataset.clone).innerHTML;
  });
})();
