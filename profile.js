const display_name = document.querySelector(".displayname");
const username = document.querySelector(".username");

const displayInput = document.querySelector("#display-name");
const usernameInput = document.querySelector("#username");
const bioInput = document.querySelector("#bio");

function handleRenderProfile() {
  axios
    .get(`${env.DOMAIN_SERVER}:${env.PORT}/api/users/Q7JSJgGjI5`)
    .then((res) => res.data.data.recordset[0])
    .then((data) => {
      display_name.textContent = data.display_name;
      username.textContent = data.username;

      usernameInput.value = data.username;
      displayInput.value = data.display_name;
      bioInput.value = data.bio || null;
    });
}

handleRenderProfile();
