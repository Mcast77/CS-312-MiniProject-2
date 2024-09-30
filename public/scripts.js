const inUSA = document.getElementById("inUSA");
const stateOptions = document.getElementById("stateOptions");

function changeVisability() {
    inUSA.addEventListener("change", (event) => {
      if (event.target.value === "yes") {
        stateOptions.classList.remove("hidden");
      } else {
        stateOptions.classList.add("hidden");
      }
    });
  }

document.addEventListener("DOMContentLoaded", changeVisability );