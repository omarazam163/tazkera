const timingsDivs = document.querySelectorAll(".timing");
const city = document.querySelectorAll(".city");
const apiKey = "07b82cf7-f587-4f06-8d60-f8d1a4cfaed1";
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

async function displayTimings() {
  const Data = await GetTimings();
  city.forEach((span)=> span.innerHTML= Data[0].city);
  let timings = Data[1];
  const prayers = {
    Fajr: timings.data.timings.Fajr,
    Dhuhr: timings.data.timings.Dhuhr,
    Asr: timings.data.timings.Asr,
    Maghrib: timings.data.timings.Maghrib,
    Isha: timings.data.timings.Isha,
  };
  let counter = 0;
  for(const prayer in prayers)
  {
    timingsDivs[counter].innerHTML= prayers[prayer]
    counter++;   
  }
}

displayTimings();
