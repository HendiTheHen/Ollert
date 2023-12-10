function handleUpdateProfile(e) {
  e.preventDefault();

  let formUpdate = new FormData(e.target);

  axios
    .put(
      `${env.DOMAIN_SERVER}:${env.PORT}/api/users`,
      {
        username: formUpdate.get("username"),
        displayname: formUpdate.get("displayname"),
        bio: formUpdate.get("bio"),
      },
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then(() => {
      handleRenderProfile();
    })
    .catch((err) => console.log(err));
}

function handleRenderProfile() {
  const displayName = document.querySelector(".displayname");
  const username = document.querySelector(".user__info .username");

  const displayInput = document.querySelector("#display-name");
  const usernameInput = document.querySelector("#username");
  const bioInput = document.querySelector("#bio");

  axios
    .get(`${env.DOMAIN_SERVER}:${env.PORT}/api/users/Q7JSJgGjI5`)
    .then((res) => res.data.data.recordset[0])
    .then((data) => {
      console.log(username);
      console.log(data);
      displayName.textContent = data.display_name;
      username.textContent = data.username;

      usernameInput.value = data.username;
      displayInput.value = data.display_name;
      bioInput.value = data.bio || null;
    });
}

handleRenderProfile();
