const modal = document.getElementById("modal");
const text = document.getElementById("modal-text");

function openModal(type) {
  modal.style.display = "block";

  const data = {
    team1: "Member 1: Lead Programmer - IoT & System Design",
    team2: "Member 2: Chief Architech - Hardware Integration",
    team3: "Member 3: Head Researcher - Data Collection & Management",

    f1: "Flood detection using water level sensors + alert system",
    f2: "Automated barrier system for flood prevention",
    f3: "Real-time IoT dashboard for monitoring",

    sdg6: "Clean Water & Sanitation",
    sdg11: "Sustainable Cities & Communities",
    sdg13: "Climate Action",
    sdg14: "Life Below Water",
    sdg15: "Life on Land",

    video: "Demo Video Placeholder (embed YouTube here later)"
  };

  text.innerHTML = data[type] || "No data";
}

function closeModal() {
  modal.style.display = "none";
}

window.onclick = function(e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
}
