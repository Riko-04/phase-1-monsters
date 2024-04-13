document.addEventListener("DOMContentLoaded", () => {
    const monsterContainer = document.getElementById("monster-container");
    const createMonsterForm = document.getElementById("create-monster");
    const backButton = document.getElementById("back");
    const forwardButton = document.getElementById("forward");
  
    let currentPage = 1;
  
    // Fetch and display the first 50 monsters
    fetchMonsters(currentPage);
  
    // Event listener for creating a new monster
    createMonsterForm.innerHTML = `
      <form id="monster-form">
        <input type="text" id="name" placeholder="Name">
        <input type="number" id="age" placeholder="Age">
        <input type="text" id="description" placeholder="Description">
        <button type="submit">Create Monster</button>
      </form>
    `;
  
    createMonsterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = event.target.name.value;
      const age = parseFloat(event.target.age.value);
      const description = event.target.description.value;
      createMonster(name, age, description);
      event.target.reset();
    });
  
    // Event listener for loading the next 50 monsters
    forwardButton.addEventListener("click", () => {
      currentPage++;
      fetchMonsters(currentPage);
    });
  
    // Event listener for loading the previous 50 monsters
    backButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchMonsters(currentPage);
      }
    });
  
    // Function to fetch monsters
    function fetchMonsters(page) {
      const limit = 50;
      const url = `http://localhost:3000/monsters/?_limit=${limit}&_page=${page}`;
      
      fetch(url)
        .then((response) => response.json())
        .then((monsters) => {
          displayMonsters(monsters);
          updateNavigationButtons(currentPage, monsters.length);
        })
        .catch((error) => console.error("Error fetching monsters:", error));
    }
  
    // Function to display monsters
    function displayMonsters(monsters) {
      monsterContainer.innerHTML = "";
      monsters.forEach((monster) => {
        const monsterCard = document.createElement("div");
        monsterCard.innerHTML = `
          <h3>${monster.name}</h3>
          <p>Age: ${monster.age}</p>
          <p>Description: ${monster.description}</p>
        `;
        monsterContainer.appendChild(monsterCard);
      });
    }
  
    // Function to create a new monster
    function createMonster(name, age, description) {
      const url = "http://localhost:3000/monsters";
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const body = JSON.stringify({ name, age, description });
  
      fetch(url, { method: "POST", headers, body })
        .then((response) => response.json())
        .then((monster) => {
          fetchMonsters(currentPage);
        })
        .catch((error) => console.error("Error creating monster:", error));
    }
  
    // Function to update navigation buttons
    function updateNavigationButtons(currentPage, monstersCount) {
      backButton.disabled = currentPage === 1;
      forwardButton.disabled = monstersCount < 50;
    }
  });
  