function getLast8Years() {
  const currentDate = new Date();
  const last8Years = [];
  for (
    let i = currentDate.getFullYear() - 7;
    i <= currentDate.getFullYear();
    i++
  ) {
    last8Years.push(i);
  }
  return last8Years;
}

function getLast12Months() {
  const months = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() - i;
    const date = new Date(year, month, 1);
    const monthNumber = (date.getMonth() + 1).toString().padStart(2, '0'); // Numărul specific al lunii

    const monthName = date.toLocaleString('ro-RO', { month: 'short' });
    const capitalizedMonthName =
      monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const monthEntry = {
      monthNumber,
      monthName: capitalizedMonthName,
    };

    months.push(monthEntry);
  }

  return months;
}

async function getPrisonersNoPerYear(year) {
  const request = await fetch(
    '/prisoners/get-count?' + new URLSearchParams({ year }),
    {
      method: 'GET',
      headers: {
        csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
      },
    }
  );
  const response = await request.json();

  if (response.error) {
    console.log(response.error);
  } else {
    const numberOfPrisoners = parseInt(response.numberOfPrisoners);
    return numberOfPrisoners;
  }
}

async function getPrisonersNoPerSentence(min, max) {
  const params = new URLSearchParams();
  params.append('min', min);
  params.append('max', max);

  const request = await fetch('/prisoners/get-sentence-count?' + params, {
    method: 'GET',
    headers: {
      csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
    },
  });
  const response = await request.json();

  if (response.error) {
    console.log(response.error);
  } else {
    const numberOfPrisoners = parseInt(response.numberOfPrisoners);
    return numberOfPrisoners;
  }
}

async function getVisitsNoPerMonth(month) {
  const request = await fetch(
    '/visits/get-month-count?' + new URLSearchParams({ month }),
    {
      method: 'GET',
      headers: {
        csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
      },
    }
  );
  const response = await request.json();

  if (response.error) {
    console.log(response.error);
  } else {
    const numberOfVisits = parseInt(response.numberOfVisits);
    return numberOfVisits;
  }
}

async function createBarChart() {
  const years = getLast8Years();
  const prisonerCounts = await Promise.all(years.map(getPrisonersNoPerYear));

  const ctx = document.getElementById('chart1');
  
  const screenWidth = window.innerWidth;
  let borderR, fsize;
  if (screenWidth < 475) {
    borderR = 2;
    fsize = 10;
  } else if (screenWidth < 875) {
    borderR = 2.5;
    fsize = 12.5;
  } else if (screenWidth < 1150) {
    borderR = 3.5;
    fsize = 15;
  } else {
    borderR = 5;
    fsize = 20;
  }
  await new Chart(ctx, {
    type: 'bar',
    data: {
      labels: getLast8Years(),
      datasets: [
        {
          data: prisonerCounts,
          backgroundColor: '#FAB696',
          borderRadius: borderR,
          categoryPercentage: 0.8,
        },
      ],
    },
    options: {
      responsive: false,
      aspectRatio: 1.3,
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            display: true,
            color: 'white',
            font: {
              size: fsize,
              family: "'Inter', 'sans-serif'",
              weight: 'bold',
            },
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'white',
            font: {
              size: fsize,
              family: "'Inter', 'sans-serif'",
              weight: 'bold',
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

async function createPieChart() {
  const prisonerCounts = [
    await getPrisonersNoPerSentence(0, 2),
    await getPrisonersNoPerSentence(2, 5),
    await getPrisonersNoPerSentence(5, 7),
    await getPrisonersNoPerSentence(7, 100), // for the rest of sentences
  ];
  const ctx = document.getElementById('chart2');
  const screenWidth = window.innerWidth;
  let fsize;
  if (screenWidth < 475) {
    fsize = 10;
  } else if (screenWidth < 875) {
    fsize = 12.5;
  } else if (screenWidth < 1150) {
    fsize = 15;
  } else {
    fsize = 20;
  }
  await new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['0-2 ani', '2-5 ani', '5-7 ani', '+7 ani'],
      datasets: [
        {
          data: prisonerCounts,
          backgroundColor: ['#FAB696', '#519872', '#FC5252', '#A4B494'],
          hoverOffset: 5,
          borderColor: 'transparent',
        },
      ],
    },
    options: {
      responsive: false,
      aspectRatio: 1.3,
      plugins: {
        legend: {
          labels: {
            color: 'white',
            font: {
              size: fsize,
              family: "'Inter', 'sans-serif'",
              weight: 'bold',
            },
          },
        },
      },
    },
  });
}

async function createLineChart() {
  const months = getLast12Months();

  const monthNumbers = months.map(month => month.monthNumber);
  const monthNames = months.map(month => month.monthName);
  const visitsCount = await Promise.all(monthNumbers.map(getVisitsNoPerMonth));
  const ctx = document.getElementById('chart3');
  const screenWidth = window.innerWidth;
  let fsize;
  if (screenWidth < 475) {
    fsize = 10;
  } else if (screenWidth < 875) {
    fsize = 12.5;
  } else if (screenWidth < 1150) {
    fsize = 15;
  } else {
    fsize = 20;
  }
  await new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthNames,
      datasets: [
        {
          data: visitsCount,
          borderColor: '#FAB696',
          hoverOffset: 5,
        },
      ],
    },
    options: {
      responsive: false,
      aspectRatio: 1.3,
      scales: {
        x: {
          grid: {
            color: 'white',
          },
          ticks: {
            display: true,
            color: 'white',
            font: {
              size: fsize,
              family: "'Inter', 'sans-serif'",
              weight: 'bold',
            },
          },
        },
        y: {
          grid: {
            color: 'white',
          },
          ticks: {
            color: 'white',
            font: {
              size: fsize,
              family: "'Inter', 'sans-serif'",
              weight: 'bold',
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

createBarChart();
createPieChart();
createLineChart();

window.addEventListener('resize', async function () {
  const chartElement1 = document.getElementById('chart1');
  chartElement1.parentElement.removeChild(chartElement1);

  const newChartElement1 = document.createElement('canvas');
  newChartElement1.setAttribute('id', 'chart1');
  newChartElement1.classList.add('charts');
  document.querySelector('#chart-container1').appendChild(newChartElement1);
  await createBarChart();

  const chartElement2 = document.getElementById('chart2');
  chartElement2.parentElement.removeChild(chartElement2);

  const newChartElement2 = document.createElement('canvas');
  newChartElement2.setAttribute('id', 'chart2');
  newChartElement2.classList.add('charts');
  document.querySelector('#chart-container2').appendChild(newChartElement2);
  await createPieChart();

  const chartElement3 = document.getElementById('chart3');
  chartElement3.parentElement.removeChild(chartElement3);

  const newChartElement3 = document.createElement('canvas');
  newChartElement3.setAttribute('id', 'chart3');
  newChartElement3.classList.add('charts');
  document.querySelector('#chart-container3').appendChild(newChartElement3);
  await createLineChart();
});
