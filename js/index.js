// ==========
//Nav Link and sections
// =========
var navLinks = document.querySelectorAll(".nav-link");
var sections = document.querySelectorAll("section[data-section]");
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    var sectionName = link.getAttribute("data-section");
    if (sectionName == "launches") {
      displayRoctes();
    }
    sections.forEach((section) => {
      section.classList.add("hidden");
    });
    var selectedSection = document.querySelector(
      `section[data-section="${sectionName}"]`,
    );
    selectedSection.classList.remove("hidden");
  });
});

// =====
// Sidebar Mobile Open
// =========
var sidebarBtn = document.querySelector("#sidebar-toggle");
var sidebar = document.querySelector("#sidebar");
sidebarBtn.addEventListener("click", () => {
  sidebar.classList.add("sidebar-open");
});

document.addEventListener("click", function (e) {
  if (!sidebar.contains(e.target) && !sidebarBtn.contains(e.target)) {
    sidebar.classList.remove("sidebar-open");
  }
});
// ***************************************
// ==========
// Today in Space, Astronomy Picture of the Day
// =========
async function getTodayAPOD(date) {
  var response = await fetch(
    `https://science.nasa.gov/wp-json/wp/v2/apod-basic/?api_key=bUnQkVvRRYP9UigstKgGV2r4IWIUpuXzyMQbE6ZE&date=${date}`,
  );
  if (!response.ok) {
    console.log("HTTP error: " + response.status);
    return;
  }
  let data = await response.json();
  //   console.log(data);
  return data;
}
// =================
//Display Apod data
// ================

//APOD Title
var titleElement = document.querySelector("#apod-title");
//APOD Explanation
var explanationElement = document.querySelector("#apod-explanation");
//APOD CopyRight
var copyrightElement = document.querySelector("#apod-copyright");
// APOD Media Type
var MediaTypeElement = document.querySelector("#apod-media-type");
async function displayAPOD(date) {
  var actualData = await getTodayAPOD(date);
  console.log(actualData);
  var selectedAPOD = actualData.find(function (item) {
    return item.date === date;
  });
  var { title, explanation, copyright, hdurl, media_type, url } = selectedAPOD;
  // APOD Image or Videos

  var imageElement = document.querySelector("#apod-image");
  if (media_type === "image") {
    imageElement.innerHTML = `  <img
                  
                  class="w-full h-full object-cover"
                  src="${hdurl}"
                  alt="Astronomy Picture of the Day"
                />`;
    console.log(hdurl);
  } else {
    imageElement.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">
  View Today's Astronomy Video
  </a>`;
  }

  document.querySelector(".label-date").textContent = date;
  document.querySelector("#apod-date-detail").textContent = date;
  document.querySelector("#apod-date-info").textContent = date;
  document.getElementById("apod-date").textContent =
    `Astronomy Picture of the Day - ${date}`;
  titleElement.textContent = title;
  explanationElement.innerHTML = explanation;
  copyrightElement.innerHTML = copyright;
  MediaTypeElement.textContent = media_type;
}

function getTodayDate() {
  var today = new Date();
  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, "0");
  var day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function loadSelectedDate() {
  var dateInputElement = document.getElementById("apod-date-input");
  var selectedDate = dateInputElement.value;
  var day = getTodayDate();
  if (selectedDate > day) {
    Swal.fire({
      title: "Invalid Date",
      text: "you cannot select a future date. ",
      icon: "error",
    });
    return;
  } else if (selectedDate < "1995-06-16") {
    Swal.fire({
      title: "Invalid Date",
      text: "please select June 16, 1995. or a later date ",
      icon: "error",
    });
    return;
  }
  displayAPOD(selectedDate);
}

var loadDateBtn = document.querySelector("#load-date-btn");
loadDateBtn.addEventListener("click", () => {
  loadSelectedDate();
});

// ===============
// Solar System OpenData
// ================

// Get Rockets API

async function getRocketsData() {
  var response = await fetch(
    `https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10`,
  );

  if (!response.ok) {
    console.log("http error : " + response.status);
    return;
  }
  var data = await response.json();
  var { results } = data;
  // console.log(results);
  return results;
}
getRocketsData();
// ================
// fetech Launches Rockets From API
//==================

async function displayRoctes() {
  //Data Limit 10 Arrays
  let launchesData = await getRocketsData();
  if (!launchesData) {
    return;
  }

  let box = ``;
  launchesData.forEach((rocket) => {
    let {
      // Make Aliases
      launch_service_provider: { name: providerName },
      name: launchName,
      net,
      image: { image_url, thumbnail_url },
      rocket: {
        configuration: { name: rocketName },
      },
      pad: {
        location: { name: locationName },
      },
    } = rocket;
    let date = new Date(net);
    let launchDate = date.toLocaleDateString("en-us", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    let launchTime = date.toLocaleTimeString("en-us", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      hour12: false,
    });
    box += `
     <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">

    <!-- IMAGE -->
    <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
  <img
                      src="${thumbnail_url}"
                      alt="${launchName}"
                      class="w-full h-full object-cover"
                      onerror="
                        this.onerror = null;
                        this.src = '/images/launch-placeholder.png';
                      "
                    />
    

      <div class="absolute top-3 right-3">
        <span class="px-3 py-1 bg-green-500/90 text-white rounded-full text-xs font-semibold">
          Go
        </span>
      </div>

    </div>
           <!--Information-->
      <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >        <!--Laucnh Name -->
                    ${launchName}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    <!-- launch_service_provider:{name:providerName} -->
                    ${providerName}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                              <!-- net Date -->
                    <span class="text-slate-300">${launchDate}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                                 <!-- net Time -->
                    <span class="text-slate-300">${launchTime}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                                 <!-- rocket:{configuration:{name}} -->
                    <span class="text-slate-300">${rocketName}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                                   <!-- pad:{location:{name}} -->
                    <span class="text-slate-300 line-clamp-1">${locationName}</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div> 
                </div>`;
  });
  document.querySelector("#launches-grid").innerHTML = box;
}

// =====================
// Get Planets API
// =====================
async function getPlanetsAPI() {
  let response = await fetch(
    `https://solar-system-opendata-proxy.vercel.app/api/planets`,
  );
  if (!response.ok) {
    console.log("HTTP error : " + response.status);
    return;
  }
  let data = await response.json();
  console.log(data);
  return data.bodies;
}

// =========
// Display planets
// ==========
async function displayPlanets() {
  let planetsData = await getPlanetsAPI();

  if (!planetsData) {
    return;
  }

  planetsData.forEach((planet) => {
    let {
      axialTilt,
      density,
      description,
      discoveredBy,
      discoveryDate,
      englishName,
      gravity,
      meanRadius,
      mass: { massExponent, massValue },
      moons,
      semimajorAxis,
      sideralOrbit,
      sideralRotation,
      vol: { volExponent, volValue },
      aphelion,
      eccentricity,
      escape,
      inclination,
      perihelion,
      avgTemp,
    } = planet;

    if (englishName.toLowerCase() === selectedPlanet.toLowerCase()) {
      document.querySelector("#planet-detail-image").src =
        `images/${englishName.toLowerCase()}.png`;
      document.querySelector("#planet-detail-image").alt =
        `${englishName.toLowerCase()} planet detailed realistic render with clouds and continents`;
      document.querySelector("#planet-detail-name").textContent = englishName;

      document.querySelector("#planet-detail-description").textContent =
        description;

      document.querySelector("#planet-distance").textContent =
        `${semimajorAxis.toFixed(1)}M km`;

      document.querySelector("#planet-radius").textContent =
        `${Math.round(meanRadius)} km`;

      document.querySelector("#planet-mass").innerHTML =
        `${massValue} × 10<sup>${massExponent}</sup> kg`;
      // === \uOOD7  Multiply Sign

      document.querySelector("#planet-density").textContent =
        `${density.toFixed(2)} g/cm³`;

      document.querySelector("#planet-orbital-period").textContent =
        `${sideralOrbit.toFixed(2)} days`;

      document.querySelector("#planet-rotation").textContent =
        `${sideralRotation.toFixed(2)} hours`;

      document.querySelector("#planet-moons").textContent = moons
        ? moons.length
        : 0;

      document.querySelector("#planet-gravity").textContent =
        `${gravity.toFixed(2)} m/s²`;

      document.querySelector("#planet-discoverer").textContent =
        discoveredBy === "" ? "Known since antiquity" : discoveredBy;

      document.querySelector("#planet-discovery-date").textContent =
        discoveryDate === "" ? "Ancient" : discoveryDate;

      document.querySelector("#planet-volume").innerHTML =
        `${volValue} × 10<sup>${volExponent}</sup> km<sup>3</sup>`;

      document.querySelector("#planet-perihelion").textContent =
        `${perihelion.toFixed(1)}M km`;

      document.querySelector("#planet-aphelion").textContent =
        `${aphelion.toFixed(1)}M km`;

      document.querySelector("#planet-eccentricity").textContent =
        eccentricity.toFixed(5);

      document.querySelector("#planet-inclination").textContent =
        `${inclination?.toFixed(2) ?? "N/A"}°`;

      document.querySelector("#planet-axial-tilt").textContent =
        `${axialTilt?.toFixed(2) ?? "N/A"}°`;

      document.querySelector("#planet-temp").textContent =
        `${avgTemp != null ? Math.round(avgTemp) : "N/A"}°C`;

      document.querySelector("#planet-escape").textContent =
        `${escape.toFixed(2)} km/s`;

      var box = ``;
      box += ` <li class="flex items-start">
                     <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                     <span class="text-slate-300"
                       >Mass: ${massValue} × 10<sup>${massExponent}</sup> kg </span
                     >
                   </li>
                   <li class="flex items-start">
                     <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                     <span class="text-slate-300"
                       >Surface gravity: ${gravity?.toFixed(5) ?? "N/A"} m/s²</span
                     >
                   </li>
                   <li class="flex items-start">
                     <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                     <span class="text-slate-300"
                       >Density: ${density?.toFixed(4) ?? "N/A"} g/cm³</span
                     >
                   </li>
                   <li class="flex items-start">
                     <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                     <span class="text-slate-300"
                       >Axial tilt: ${axialTilt?.toFixed(4) ?? "N/A"}°</span
                     >
                   </li>`;
      document.querySelector("#planet-facts").innerHTML = box;
    }
  });
}
var planetsCards = document.querySelectorAll(".planet-card");

var selectedPlanet = "earth";

function PlanetSelected() {
  planetsCards.forEach((planetCard) => {
    planetCard.addEventListener("click", function () {
      selectedPlanet = planetCard.getAttribute("data-planet-id");
      console.log("selected Planet ", selectedPlanet);
      // return Name of Planet
      displayPlanets();
    });
  });
}

PlanetSelected();
