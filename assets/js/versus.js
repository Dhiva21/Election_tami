$(document).ready(function () {
 
var versusUrl = 'https://script.google.com/macros/s/AKfycbycjiYgmD-4A4BadxOOWueWqwcEEBCpQjR5yZdW-aCNBKl4dCmfKBYMCVXjSrnAqkA/exec?sheetName=VVIP_VSCard';

const versus = document.getElementById("app");
let isInitialized = false;

// 🔹 Trend UI
function getTrendHTML(result) {
  if (result === "LEAD") {
    return `
      <div class="leading">
        <div class="trend up">முன்னிலை</div>
        <img src="assets/images/party/UP.png" alt="up">
      </div>`;
  } else {
    return `
      <div class="leading">
        <div class="trend down">பின்னடைவு</div>
        <img src="assets/images/party/Down.png" alt="down">
      </div>`;
  }
}

function renderCarousel(data) {

  let html = `<div class="owl-carousel vs-carousel">`;

  data.forEach((item, i) => {
    html += `
    <div class="item">
      <div class="bg-color">

        <div class="location">${item.vlocan}</div>

        <div class="row align-items-center text-center">

          <!-- LEFT -->
          <div class="col-5">
            <div class="row align-items-center justify-content-end">
              
              <div class="col-auto">
                <img src="assets/images/party/${item.lparty}.png" class="vs-img">
              </div>

              <div class="col-auto text-center">
                <div id="lvote-${i}" class="vs-count">
                  ${item.lvote.toLocaleString()}
                </div>

                <div id="ltrend-${i}">
                  ${getTrendHTML(item.lresult)}
                </div>
              </div>

            </div>
          </div>

          <!-- VS -->
          <div class="col-2">
            <div class="vs-text">VS</div>
          </div>

          <!-- RIGHT -->
          <div class="col-5">
            <div class="row align-items-center justify-content-start">
              
              <div class="col-auto text-center">
                <div id="rvote-${i}" class="vs-count">
                  ${item.rvote.toLocaleString()}
                </div>

                <div id="rtrend-${i}">
                  ${getTrendHTML(item.rresult)}
                </div>
              </div>

              <div class="col-auto">
                <img src="assets/images/party/${item.rparty}.png" class="vs-img">
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>`;
  });

  html += `</div>`;
  versus.innerHTML = html;

  // 🔥 INIT OWL ONLY ONCE
  $('.vs-carousel').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    navText: [
      "<span class='custom-prev'>‹</span>",
      "<span class='custom-next'>›</span>"
    ],
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      1024: { items: 1 }
    }
  });
}

// 🔹 UPDATE ONLY (🔥 முக்கியம்)
function updateVS(data) {

  data.forEach((item, i) => {

    const lvoteEl = document.getElementById(`lvote-${i}`);
    const rvoteEl = document.getElementById(`rvote-${i}`);
    const ltrendEl = document.getElementById(`ltrend-${i}`);
    const rtrendEl = document.getElementById(`rtrend-${i}`);

    if (lvoteEl) {
      lvoteEl.innerText = item.lvote.toLocaleString();
      ltrendEl.innerHTML = getTrendHTML(item.lresult);

      // 🔥 small animation
      lvoteEl.classList.add("pulse");
      setTimeout(() => lvoteEl.classList.remove("pulse"), 300);
    }

    if (rvoteEl) {
      rvoteEl.innerText = item.rvote.toLocaleString();
      rtrendEl.innerHTML = getTrendHTML(item.rresult);

      rvoteEl.classList.add("pulse");
      setTimeout(() => rvoteEl.classList.remove("pulse"), 300);
    }

  });
}

// 🔹 LOAD FUNCTION
function loadVS() {
  fetch(versusUrl)
    .then(res => res.json())
    .then(data => {

      if (!isInitialized) {
        renderCarousel(data); // first time மட்டும்
        isInitialized = true;
      } else {
        updateVS(data); // values மட்டும் update
      }

    })
    .catch(err => console.error(err));
}

// 🚀 FIRST LOAD
loadVS();

// 🔄 AUTO REFRESH (5 sec)
setInterval(loadVS, 3000);
























});