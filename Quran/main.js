let currentPage = localStorage.getItem("lastPage") ? Number(localStorage.getItem("lastPage")) : 1;
const totalPages = 604;

const searchInput = document.getElementById("search");
const surahList = document.getElementById("surah-list");
const imagePage = document.getElementById("imagePage");
const pageNumber = document.getElementById("pageNumber");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");

let allSurahs = [];

fetch("https://api.alquran.cloud/v1/quran/quran-uthmani")
    .then(response => response.json())
    .then(data => {
        allSurahs = data.data.surahs.map(surah => ({
            number: surah.number,
            name: removeTashkeel(surah.name),
            page: surah.ayahs[0].page
        }));

        displaySurahs(allSurahs);
        updatePage();
    })
.catch(error => console.error("Error fetching data:", error));

function removeTashkeel(text) {
    return text.replace(/[\u064B-\u0652]/g, "");
}

function displaySurahs(surahs) {
    surahList.innerHTML = "";
    surahs.forEach(surah => {
        const li = document.createElement("li");
        li.textContent = `${surah.number}. ${surah.name}`;
        li.dataset.page = surah.page;

        li.addEventListener("click", function () {
            currentPage = Number(this.dataset.page);
            updatePage();
        });

        surahList.appendChild(li);
    });
}

function updatePage() {
    if (currentPage >= 1 && currentPage <= totalPages) {
        imagePage.src = `quran-images/${currentPage}.png`;
        pageNumber.textContent = `${currentPage}`;
        prevButton.disabled = (currentPage === 1);
        nextButton.disabled = (currentPage === totalPages);
        localStorage.setItem("lastPage", currentPage);
    }
}

prevButton.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        updatePage();
    }
});

nextButton.addEventListener("click", function () {
    if (currentPage < totalPages) {
        currentPage++;
        updatePage();
    }
});

searchInput.addEventListener("input", function () {
    const searchText = removeTashkeel(searchInput.value.trim());
    const filteredSurahs = allSurahs.filter(surah => surah.name.includes(searchText));
    displaySurahs(filteredSurahs);
});
