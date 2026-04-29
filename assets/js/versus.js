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
          <img src="assets/images/party/UP.png">
        </div>`;
    } else {
      return `
        <div class="leading">
          <div class="trend down">பின்னடைவு</div>
          <img src="assets/images/party/Down.png">
        </div>`;
    }
  }

  // 🔥 IMAGE CHECK (NO FLICKER)
  function getSafeImage(name) {
    const clean = (name || "").trim();
    const path = `assets/images/versus/${clean}.png`;
    const fallback = "assets/images/versus/default.png";

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(path);
      img.onerror = () => resolve(fallback);
      img.src = path;
    });
  }

  // 🔹 INITIAL RENDER (ASYNC)
  async function renderCarousel(data) {

    let html = `<div class="owl-carousel vs-carousel">`;

    for (let i = 0; i < data.length; i++) {

      const item = data[i];

      const lsrc = await getSafeImage(item.limg);
      const rsrc = await getSafeImage(item.rimg);

      html += `
      <div class="item">
        <div class="bg-color">

          <div class="location">${item.vlocan}</div>

          <div class="row align-items-center text-center">

            <!-- LEFT -->
            <div class="col-lg-5 col-md-5">
              <div class="row align-items-center justify-content-end">
                
                <div class="col-md-6 col-6">
                <div class="leftImage">
                  <img id="limg-${i}" src="${lsrc}" class="vs-img">
                  <p> ${item.lname} </p>
                </div>
                 </div>

                <div class="col-md-6 col-6 text-center">
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
            <div class="col-lg-2 col-md-2">
            <div class="vs-image"> 
              <img src="assets/images/versus/VS.png" alt="">
            </div>
             </div>

            <!-- RIGHT -->
            <div class="col-lg-5 col-md-5">
              <div class="row align-items-center justify-content-start">
                
                <div class="col-md-6 col-6 text-center">
                  <div id="rvote-${i}" class="vs-count">
                    ${item.rvote.toLocaleString()}
                  </div>

                  <div id="rtrend-${i}">
                    ${getTrendHTML(item.rresult)}
                  </div>
                </div>

                <div class="col-md-6 col-6">
                <div class="leftImage">
                
                  <img id="rimg-${i}" src="${rsrc}" class="vs-img">
                 <p> ${item.rname} </p>
                </div>
                <div >
                
                 
                   
                </div>
                  
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>`;
    }

    html += `</div>`;
    versus.innerHTML = html;

    $('.vs-carousel').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      dots: false,
      autoplay: false,
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

  // 🔥 UPDATE IMAGE (NO FLICKER)
  function updateImageNoFlicker(imgEl, name) {
    if (!imgEl) return;

    const clean = (name || "").trim();
    const path = `assets/images/versus/${clean}.jpg`;
    const fallback = "assets/images/versus/default.png";

    if (imgEl.src.includes(clean)) return;

    const temp = new Image();

    temp.onload = () => {
      imgEl.src = path + "?t=" + Date.now();
    };

    temp.onerror = () => {
      imgEl.src = fallback;
    };

    temp.src = path;
  }

  // 🔹 UPDATE (NO RE-RENDER)
  function updateVS(data) {

    data.forEach((item, i) => {

      const lvoteEl = document.getElementById(`lvote-${i}`);
      const rvoteEl = document.getElementById(`rvote-${i}`);
      const ltrendEl = document.getElementById(`ltrend-${i}`);
      const rtrendEl = document.getElementById(`rtrend-${i}`);
      const limgEl = document.getElementById(`limg-${i}`);
      const rimgEl = document.getElementById(`rimg-${i}`);

      // LEFT VOTE
      if (lvoteEl && lvoteEl.innerText !== item.lvote.toLocaleString()) {
        lvoteEl.innerText = item.lvote.toLocaleString();
        lvoteEl.classList.add("pulse");
        setTimeout(() => lvoteEl.classList.remove("pulse"), 300);
      }

      // LEFT TREND
      if (ltrendEl) {
        ltrendEl.innerHTML = getTrendHTML(item.lresult);
      }

      // LEFT IMAGE
      updateImageNoFlicker(limgEl, item.limg);

      // RIGHT VOTE
      if (rvoteEl && rvoteEl.innerText !== item.rvote.toLocaleString()) {
        rvoteEl.innerText = item.rvote.toLocaleString();
        rvoteEl.classList.add("pulse");
        setTimeout(() => rvoteEl.classList.remove("pulse"), 300);
      }

      // RIGHT TREND
      if (rtrendEl) {
        rtrendEl.innerHTML = getTrendHTML(item.rresult);
      }

      // RIGHT IMAGE
      updateImageNoFlicker(rimgEl, item.rimg);

    });
  }

  // 🔹 FETCH
  function loadVS() {
    fetch(versusUrl)
      .then(res => res.json())
      .then(async data => {

        if (!isInitialized) {
          await renderCarousel(data);
          isInitialized = true;
        } else {
          updateVS(data);
        }

      })
      .catch(err => console.error(err));
  }

  // 🚀 FIRST LOAD
  loadVS();

  // 🔄 AUTO REFRESH
  setInterval(loadVS, 3000);

});