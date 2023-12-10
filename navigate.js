document.addEventListener("click", (e) => {
  const { target } = e;

  if (!target.matches(".left-bar *")) {
    return;
  }

  console.log("clgt");

  e.preventDefault();
  navigatePageHandler(e);
});

const urlRoute = {
  "/": {
    template: "/index.html",
  },
  "/board": {
    template: "/boards.html",
    title: "Boards | Ollert",
  },
  "/profile": {
    template: "/profile.html",
    title: "Profile | Ollert",
  },
  "/table": {
    template: "/table.html",
    title: "Table | Ollert",
  },
  "/calendar": {
    template: "/calendar.html",
    title: "Calendar | Ollert",
  },
};

function navigatePageHandler(e) {
  e = e || window.Event;
  e.preventDefault();

  if (e.target.href) {
    window.history.pushState({}, "", e.target.href);
  } else if (e.target.parentNode.href) {
    window.history.pushState({}, "", e.target.parentNode.href);
  } else {
    window.history.pushState({}, "", e.target.parentNode.parentNode.href);
  }

  locationHandler();
}

const locationHandler = async () => {
  const location = window.location.pathname;
  //   console.log(location);

  if (location.length === 0) {
    location = "/";
  }

  const route = urlRoute[`/${location.split("/")[1]}`];

  //   console.log(route);

  const html = await fetch(route.template).then((res) => res.text());

  document.getElementById("right-bar").innerHTML = html;


  
  let path = `./${location.split("/")[1]}.js`;

  let scrpitJS = document.createElement("script");
  scrpitJS.setAttribute("src", path);
  document.getElementById("right-bar").appendChild(scrpitJS);
};

window.onpopstate = locationHandler;
window.route = urlRoute;
