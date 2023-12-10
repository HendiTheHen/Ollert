function handleTogglePassword(e) {
  const inputPassword = document.getElementById("password");
  let isShowed = e.target.getAttribute("is_showed");
  if (isShowed) {
    e.target.removeAttribute("is_showed");
    e.target.setAttribute("src", "../assets/images/ph_eye-bold.svg");
    inputPassword.setAttribute("type", "password");
  } else {
    e.target.setAttribute("is_showed", true);
    e.target.setAttribute("src", "../assets/images/ph_eye-closed-bold.svg");
    inputPassword.setAttribute("type", "text");
  }
}

function handleLoginSubmit(e) {
  e.preventDefault();

  window.location = "/toDoList.html";
}
