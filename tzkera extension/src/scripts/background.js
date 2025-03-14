const apiKey = "02a1d04c-52a2-4c82-9b49-b0c00029bdaf";
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
    `https://api.aladhan.com/v1/timings?latitude=${location.latitude}&longitude=${location.longitude}`
  );
  timings = await timings.json();
  return [location, timings];
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "getTimings") {
    GetTimings()
      .then((result) => {
        const [location, timings] = result;
        console.log(timings);
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
  return [nextPrayer, Math.floor(minTime / 60), minTime % 60];
}

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
  AddAlarms();
}

function sendNotification(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "../../public/mosque.png",
    title: title,
    message: message,
  });
}

function AddAlarms() {
  chrome.alarms.clearAll(() => {
    console.log("All previous alarms cleared.");
    for (const prayer in prayers) {
      let [hours, minutes] = prayers[prayer].split(":").map(Number);
      let alarmTime = new Date();
      alarmTime.setHours(hours, minutes, 0, 0);
      // If the time has already passed today, schedule it for the next day
      if (alarmTime.getTime() <= Date.now()) {
        alarmTime.setDate(alarmTime.getDate() + 1);
      }

      chrome.alarms.create(prayer, { when: alarmTime.getTime() });
      console.log(`Alarm set for ${prayer} at`, alarmTime.toLocaleString());
    }
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(alarm.name)) {
    sendNotification("Prayer Time", `It's time for ${alarm.name}`);
    getPrayerTime();
  }
  if (alarm.name === "updatePrayerTimes") {
    getPrayerTime();
  }
});



chrome.alarms.create("updatePrayerTimes", {
      when: new Date().getTime(),
      periodInMinutes: 1440,
});

