
function startDemo() {
  document.getElementById("dashboard").style.display = "grid";
  drawChart();
}


async function analyzeDNA() {
  const dna = document.getElementById("dnaInput").value.trim();
  const speciesList = document.getElementById("speciesList");

  if (!dna) {
    alert("Please enter DNA sample 🧬");
    return;
  }

  const response = await fetch("http://127.0.0.1:5000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dna: dna })
  });

  const data = await response.json();

  document.getElementById("dashboard").style.display = "grid";
  speciesList.innerHTML = "";

  if (data.species === "Unknown") {
    speciesList.innerHTML =
      `<li class="unknown">Unknown Organism ⚠ (${data.match_percentage}%)</li>`;
  } else {
    speciesList.innerHTML =
      `<li>${data.species} – ${data.match_percentage}% Match</li>`;
  }

  // Optional: show all species match %
  data.all_results.forEach(item => {
    speciesList.innerHTML +=
      `<li>${item.species}: ${item.match_percentage}%</li>`;
  });
}



function drawChart() {
  const ctx = document.getElementById('biodiversityChart');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Species Count',
        data: [120, 140, 135, 110, 90],
        borderWidth: 2
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: 'white' }
        }
      },
      scales: {
        x: { ticks: { color: 'white' } },
        y: { ticks: { color: 'white' } }
      }
    }
  });
}
