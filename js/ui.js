let token = localStorage.getItem("token");
const logged_in_nav = document.getElementById("logged_in_nav");
const logged_out_nav = document.getElementById("logged_out_nav");
const User = document.getElementById("user");
const navButton = document.getElementById("navButton");
const nav2Ul = document.getElementById("nav2-ul");
let userData;
if (token) {
  console.log("here");
  logged_in_nav.style.display = "flex";
  logged_out_nav.style.display = "none";
  userData = jwt_decode(token);
  User.innerHTML = userData.name;
  addCharts();
}
else {
  document.getElementById("charts").style.display = "none";
}

const logout = document.getElementById("log-out");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  location.reload();
});

navButton.addEventListener("click", (e) => {
  nav2Ul.classList.toggle("open-nav");
  e.stopPropagation();
});

document.addEventListener("click", (e) => {
  nav2Ul.classList.remove("open-nav");
});



const today = new Date().getDay();
const dictionay = {
  6: "السبت",
  0: "الأحد",
  1: "الإثنين",
  2: "الثلاثاء",
  3: "الأربعاء",
  4: "الخميس",
  5: "الجمعة",
};

function getLabels() {
  let counter = today;
  let list = [];
  for (let i = 0; i < 7; i++) {
    list.push({ number: counter, day: dictionay[counter] });
    counter--;
    if (counter == -1) {
      counter = 6;
    }
  }
  list.reverse();
  return list;
}

async function getDays(token) {
  let data = await fetch(
    `https://ieee-comp-backend.vercel.app/api/calender/getAllUserDates`,
    {
      method: "GET",
      headers: {
        token: token,
        "content-type": "application/json",
      },
    }
  );
  data = await data.json();
  return data.UserDays;
}

async function getDaysofWeek() {
  let Days = await getDays(token);
  const date = new Date()
  //filtered date 
  // get 6 days before
  const dic = {};
  for (let i = 0; i <= 6; i++) {
    let b = new Date()
    b.setDate(b.getDate() - i);
    dic[b.toDateString()] = 0;
  }

  Days.forEach(element => {
    if (dic[new Date(element.DayId).toDateString()] != undefined) {
      dic[new Date(element.DayId).toDateString()] = element.pageRead;
    }
  });
  return MapDays(dic)
}

function MapDays(dic) {
  const label = getLabels();

  for (let i in dic) {
    for (let j = 0; j < label.length; j++) {
      console.log()
      if (label[j].number == new Date(i).getDay()) {
        console.log("here")
        label[j].pages = dic[i];
      }
    }
  }
  return label
}

async function addCharts() {
  let data = await getDaysofWeek();
  const ctx = document.getElementById("statsChart").getContext("2d");

  const labels = data.map((item) => item.day);
  const pages = data.map((item) => item.pages);
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          type: "bar",
          label: "عدد الصفحات المقروءة",
          data: pages, // Total pages read
          backgroundColor: "whitesmoke",
          borderColor: "#d1b260",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category",
          title: {
            display: true,
            text: "أيام الأسبوع",
            color: "whitesmoke",
            font: { size: 18 },
          },
          ticks: {
            font: function (context) {
              return context.index === labels.length - 1
                ? { weight: "bolder" } // Bold for last day
                : { weight: "normal" };
            },
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "عدد الصفحات",
            color: "whitesmoke",
            font: { size: 18 },
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "whitesmoke",
            font: { size: 18 },
          },
        },
      },
    },
  });
}





