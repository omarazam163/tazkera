let counter = 0;
const token = localStorage.getItem("token");
currentPage = 1;
const totalPages = 604;
const searchInput = document.getElementById("search");
const surahList = document.getElementById("surah-list");
const imagePage = document.getElementById("imagePage");
const pageNumber = document.getElementById("pageNumber");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const sideBar = document.getElementById("sidebar");
const sideButton = document.getElementById("sideButton");
let allSurahs = [];

if (!token) {
  currentPage = localStorage.getItem("lastPage")
    ? Number(localStorage.getItem("lastPage"))
    : 1;
  console.log(currentPage);
  updatePage(currentPage);
} else {
  getBookMark(token);
  getDays(token);
}

fetch("https://api.alquran.cloud/v1/quran/quran-uthmani")
  .then((response) => response.json())
  .then((data) => {
    allSurahs = data.data.surahs.map((surah) => ({
      number: surah.number,
      name: removeTashkeel(surah.name),
      page: surah.ayahs[0].page,
    }));
    displaySurahs(allSurahs);
  })
  .catch((error) => console.error("Error fetching data:", error));

function removeTashkeel(text) {
  return text.replace(/[\u064B-\u0652]/g, "");
}

function displaySurahs(surahs) {
  surahList.innerHTML = "";
  surahs.forEach((surah) => {
    const li = document.createElement("li");
    li.textContent = `${surah.number}. ${surah.name}`;
    li.dataset.page = surah.page;

    li.addEventListener("click", function () {
      currentPage = Number(this.dataset.page);
      updatePage(currentPage);
        searchInput.value="";
    });
    surahList.appendChild(li);
  });
}

function updatePage(currentPage) {
  if (currentPage >= 1 && currentPage <= totalPages) {
    imagePage.src = `quran-images/${currentPage}.png`;
    pageNumber.textContent = `${currentPage}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    localStorage.setItem("lastPage", currentPage);
    addBookMark(token, currentPage);
  }
}

prevButton.addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    updatePage(currentPage);
  }
});

nextButton.addEventListener("click", function () {
  if (currentPage < totalPages) {
    currentPage++;
    updatePage(currentPage);
    if (token) {
      console.log(counter);
      updateNumberOfPages(token, ++counter);
    }
  }
});

searchInput.addEventListener("input", function () {
  const searchText = removeTashkeel(searchInput.value.trim());
  const filteredSurahs = allSurahs.filter((surah) =>
    surah.name.includes(searchText)
  );
  displaySurahs(filteredSurahs);
});

async function getBookMark(token) {
  let data = await fetch(
    "https://ieee-comp-backend.vercel.app/api/calender/getBookMark",
    {
      method: "Get",
      headers: {
        token: token,
      },
    }
  );
  data = await data.json();
  currentPage = data.data.bookMark;
  updatePage(data.data.bookMark);
}

async function addBookMark(token, page) {
  let data = await fetch(
    "https://ieee-comp-backend.vercel.app/api/calender/updateBookMark",
    {
      method: "PATCH",
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookMark: page,
      }),
    }
  );
  data = await data.json();
  if (data.status === 200) {
  } else {
    console.log("error");
  }
}

async function getDays(token) {
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const formattedDate = now.toISOString().split("T")[0];
  console.log(formattedDate);
  let data = await fetch(
    `https://ieee-comp-backend.vercel.app/api/calender/getSpecificDate/${formattedDate}`,
    {
      method: "GET",
      headers: {
        token: token,
        "content-type": "application/json",
      },
    }
  );
  data = await data.json();
  counter = data.data.pageRead;
}

async function updateNumberOfPages(token, page) {
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const formattedDate = now.toISOString().split("T")[0];
  console.log(page);
  let data = await fetch(
    "https://ieee-comp-backend.vercel.app/api/calender/updateQuraan",
    {
      method: "PUT",
      headers: {
        token: token,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        date: formattedDate,
        numberOfPages: page,
      }),
    }
  );
  data = await data.json();
  if (data.status === 200) {
    console.log("success");
  } else {
    console.log("error");
  }
}

sideButton.addEventListener("click", function () {
  sideBar.classList.toggle("d-none");
});
