chrome.runtime.sendMessage({ message: "getTimings", data: 123 }, (data) => {
  displayData(data.data);
});

function displayData(data) {
  let prayer_body = document.getElementById("prayers");
  let city = document.getElementById("city");
  const nextPrayer = document.getElementById("next-prayer");
  nextPrayer.innerHTML = `${data.dueTime[0]} in ${
    data.dueTime[1] < 10 ? "0" + data.dueTime[1] : data.dueTime[1]
  }:${data.dueTime[2] < 10 ? "0" + data.dueTime[2] : data.dueTime[2]}`;
  city.innerHTML = data.city;
  prayer_body.innerHTML = "";
  const prayers = data.prayers;
  for (const prayer in prayers) {
    prayer_body.innerHTML += `
                    <tr class="bg-white dark:bg-gray-800">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            ${prayer}
                        </th>
                        <td class="px-6 py-4">
                            ${prayers[prayer]}
                        </td>
                    </tr>`;
  }
}
