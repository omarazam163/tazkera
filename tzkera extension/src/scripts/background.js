const apiKey = "fdcd50df-6653-49e6-87cb-ee2660e7c95c";
let prayers = {};
async function getIpAdress() {
  let ip = await fetch("https://api.ipify.org?format=json");
  ip = await ip.json();
  return ip.ip;
}

async function getLocationFromIp() {
  let ip = await getIpAdress();
  let location = await fetch(
    `https://apiip.net/api/check?ip=${ip}&accessKey=${apiKey}`
  );
  location = await location.json();
  return location;
}

async function GetTimings() {
  let location = await getLocationFromIp();
  let timings = await fetch(
    `https://api.aladhan.com/v1/timings/01-01-2025?latitude=${location.latitude}&longitude=${location.longitude}`
  );
  timings = await timings.json();
  return [location, timings];
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "getTimings") {
    GetTimings()
      .then((result) => {
        const [location, timings] = result;
        const displayedData = {
          city: location.city,
          country: location.countryName,
          prayers: {
            Fajr: timings.data.timings.Fajr,
            Dhuhr: timings.data.timings.Dhuhr,
            Asr: timings.data.timings.Asr,
            Maghrib: timings.data.timings.Maghrib,
            Isha: timings.data.timings.Isha,
          },
        };
        displayedData.dueTime = getDueTime(displayedData.prayers);
        sendResponse({ data: displayedData });
      })
      .catch((error) => {
        console.error("Error fetching timings:", error);
        sendResponse({ error: "Failed to fetch timings" });
      });
    return true;
  }
});

async function getPrayerTime() {
  let data = await GetTimings();
  let timings = data[1];
  prayers = {
    Fajr: timings.data.timings.Fajr,
    Dhuhr: timings.data.timings.Dhuhr,
    Asr: timings.data.timings.Asr,
    Maghrib: timings.data.timings.Maghrib,
    Isha: timings.data.timings.Isha,
  };
}

function getDueTime(prayers) {
  let now = new Date();
  let currentMinutes = now.getHours() * 60 + now.getMinutes();
  let nextPrayer = "";
  let minTime = Infinity;
  for (const prayer in prayers) {
    let [hours, minutes] = prayers[prayer].split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;
    if (totalMinutes < currentMinutes) {
      totalMinutes += 24 * 60;
    }
    let diff = totalMinutes - currentMinutes;
    if (diff < minTime) {
      minTime = diff;
      nextPrayer = prayer;
    }
  }
  return [nextPrayer, Math.floor(minTime/60), minTime%60];
}

function sendNotification(title, message) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "../../public/mosque.png",
        title: title,
        message: message,
      });
}

chrome.alarms.create("checkPrayerTime", {
  periodInMinutes: 0.5,
});


chrome.alarms.create("updatePrayerTimes", {
  when: new Date().setHours(0, 0, 1, 0),
  periodInMinutes: 1440,
});


chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkPrayerTime") {
    let dueTime = getDueTime(prayers);
    if (dueTime[2] <= 1) {
      sendNotification("Prayer Time", `It's time for ${dueTime[0]}`);
    }
  } else if (alarm.name === "updatePrayerTimes") {
    getPrayerTime(); 
  }
});



getPrayerTime();