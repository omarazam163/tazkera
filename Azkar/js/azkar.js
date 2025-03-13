const chooseSection = document.getElementById("choose");
const azkarSection = document.getElementById("azkar");
const azkarMorning = document.getElementById("azkar-morning");
const azkarNight = document.getElementById("azkar-night");
const azkarContent = document.getElementById("azkar-content");
const azkarName = document.getElementById("azkar-name");
const numberOfRepetition = document.getElementById("number-of-repetition");
const number = document.getElementById("number");
const next = document.getElementById("next");
const prev = document.getElementById("prev");
const back = document.getElementById("back");


let azkar;
let AzkarTobeDisplayed;
let count = 0;

azkarMorning.addEventListener("click", async (e) => {
  AzkarTobeDisplayed = azkar.morning;
  azkarName.innerHTML = "اذكار الصباح";
  azkarSection.classList.remove("d-none");
  chooseSection.classList.add("d-none");
  updatezkr();
});

azkarNight.addEventListener("click", async (e) => {
  AzkarTobeDisplayed = azkar.night;
  azkarName.innerHTML = "اذكار المساء";
  azkarSection.classList.remove("d-none");
  chooseSection.classList.add("d-none");
  updatezkr(count);
});

document.addEventListener("DOMContentLoaded", async () => {
  let data = await fetch("./azkar.json");
  data = await data.json();
  azkar = {
    morning: data["أذكار الصباح"],
    night: data["أذكار المساء"],
  };
});

next.addEventListener("click", () => {
  if (count < AzkarTobeDisplayed.length - 1) {
    count++;
    updatezkr();
  }
});

prev.addEventListener("click", () => {
  if (count > 0) {
    count--;
    updatezkr();
  }
});

function updatezkr() {
  azkarContent.innerHTML = AzkarTobeDisplayed[count].content;
  numberOfRepetition.innerHTML = AzkarTobeDisplayed[count].count;
  number.innerHTML = count+1;
}

back.addEventListener("click", () => {
  azkarSection.classList.add("d-none");
  chooseSection.classList.remove("d-none");
});