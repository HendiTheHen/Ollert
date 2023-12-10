const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoiUTdKU0pnR2pJNSIsImlhdCI6MTcwMjE4NzY2MX0.OU4nY0DkmFmTpGXk4HQAe0nLFFLxjK8hUQ-3_TpLikM";

let boardCache = [];
let currentBoard = {};

function handleCollapseLeftBar(e) {
  var leftBar = document.querySelector(".left-bar");

  leftBar.classList.toggle("collapsed");
}

function handleAddTodo(e) {
  e.preventDefault();
  const { target } = e;

  const id_board = currentBoard.id_board;

  let todoForm = new FormData(target);

  let todo_title = todoForm.get("todo_title");

  if (todo_title) {
    axios
      .post(
        `${env.DOMAIN_SERVER}:${env.PORT}/api/boards/${id_board}`,
        {
          todo_name: todo_title,
        },
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((res) => {
        console.log("vcl", currentBoard);
        // handleRenderTodo(currentBoard);
        handleRenderBoard();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function handleCloseAddList(e) {
  e.stopPropagation();
  const { target } = e;
  const containerList = target.parentElement.parentElement.parentElement;
  containerList.classList.replace("tdl__add", "tdl__button");
  containerList.setAttribute("onClick", "handleShowAddList(event)");
  containerList.innerHTML = `
        <h1 class="tdl-label m-0">+ Add a list</h1>`;
}

function handleShowAddList(e) {
  e.stopPropagation();
  const { target } = e;
  let containerButton = target;
  if (target.matches(".tdl__button .tdl-label"))
    containerButton = target.parentElement;

  containerButton.classList.replace("tdl__button", "tdl__add");
  containerButton.removeAttribute("onclick");
  containerButton.innerHTML = `<form onSubmit="handleAddTodo(event)">
    <input
      type="text"
      class="w-100"
      name="todo_title"
      autocomplete="off"
      autofocus="true"
      placeholder="Enter list title..."
    />
    <div class="d-flex align-items-center gap-3 mt-3">
      <button type="submit">Add list</button>
      <div
        class="close__icon"
        onClick="handleCloseAddList(event)"
      ></div>
    </div>
  </form>`;
}

function handleAddTask(e) {
  const { target } = e;
  let id_todo = target.parentNode.getAttribute("id");

  const todoTask = document.getElementById(id_todo);
  const listTaskNode = todoTask.getElementsByClassName("tdl__show-body")[0];

  axios
    .post(
      `${env.DOMAIN_SERVER}:${env.PORT}/api/todos/${id_todo}`,
      {
        title: "task",
      },
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then((res) => res.data.data)
    .then((task) => {
      let tdlShowTask = document.createElement("div");
      tdlShowTask.setAttribute("id", task.id_task);
      tdlShowTask.setAttribute("class", "tdl__show-task");
      tdlShowTask.classList.add("d-flex");
      tdlShowTask.classList.add("align-items-center");

      if (task?.deadline) {
        tdlShowTask.innerHTML = `
          <div 
              class="tdl__show-task-content" 
              data-bs-toggle="modal" 
              data-bs-target="#task-detail__container" >
            <div
              class="tdl__show-task-header d-flex align-items-center justify-content-between"
            >
                <p class="m-0">${task.title}</p>
              </div>
            <div
              class="tdl__show-task-date-tag d-flex align-items-center gap-3 mt-3"
            >
                <div class="clock-icon"></div>
                <p class="m-0">Date</p>
            </div>
          </div>
          <div class="tdl-del-icon"></div>
          `;
      } else {
        tdlShowTask.innerHTML = `
          <div class="tdl__show-task-content"
          data-bs-toggle="modal" 
          data-bs-target="#task-detail__container">
            <div
              class="tdl__show-task-header d-flex align-items-center justify-content-between"
            >
                <p class="m-0">${task.title}</p>
              </div>
            </div>
          <div class="tdl-del-icon"></div>`;
      }

      tdlShowTask.onclick = () => {
        currentTask = task;
        handleRenderTaskDetail(task.id_task);
      };

      tdlShowTask.querySelector(".tdl-del-icon").onclick = (e) => {
        e.stopPropagation();
        handleDelTask(tdlShowTask, task);
      };

      listTaskNode.appendChild(tdlShowTask);
    })
    .catch((err) => console.log(err));
}

function handleDelTask(node, task) {
  // const listTaskNode = todoTask.getElementsByClassName("tdl__show-body")[0];

  axios
    .delete(`${env.DOMAIN_SERVER}:${env.PORT}/api/tasks/${task.id_task}`)
    .then((res) => console.log(res, "dele"))
    .then(() => {
      console.log(node);
      // listTaskNode.removeChild(node);
      node.remove();
    })
    .catch((err) => {
      console.log(err);
    });
}

let currentTask = {};

async function handleRenderTask(listTask, idTodo) {
  try {
    // await waitUntilSelectorExist(`tdl__show-body`);
    const todoTask = document.getElementById(idTodo);
    const listTaskNode = todoTask.getElementsByClassName("tdl__show-body")[0];

    listTask.forEach((task) => {
      let tdlShowTask = document.createElement("div");
      tdlShowTask.setAttribute("id", task.id_task);
      tdlShowTask.setAttribute("class", "tdl__show-task");
      // tdlShowTask.setAttribute("data-bs-toggle", "modal");
      // tdlShowTask.setAttribute("data-bs-target", "#task-detail__container");
      tdlShowTask.classList.add("d-flex");
      tdlShowTask.classList.add("align-items-center");

      if (task?.deadline) {
        tdlShowTask.innerHTML = `
        <div class="tdl__show-task-content" 
        data-bs-toggle="modal" 
        data-bs-target="#task-detail__container">
          <div
            class="tdl__show-task-header d-flex align-items-center justify-content-between"
          >
              <p class="m-0">${task.title}</p>
            </div>
          <div
            class="tdl__show-task-date-tag d-flex align-items-center gap-3 mt-3"
          >
              <div class="clock-icon"></div>
              <p class="m-0">Date</p>
          </div>
        </div>
        <div class="tdl-del-icon"></div>
        `;
      } else {
        tdlShowTask.innerHTML = `
        <div class="tdl__show-task-content" 
        data-bs-toggle="modal" 
        data-bs-target="#task-detail__container">
          <div
            class="tdl__show-task-header d-flex align-items-center justify-content-between"
          >
              <p class="m-0">${task.title}</p>
            </div>
          </div>
        <div class="tdl-del-icon"></div>`;
      }

      tdlShowTask.onclick = () => {
        currentTask = task;
        handleRenderTaskDetail(task.id_task);
      };

      tdlShowTask.querySelector(".tdl-del-icon").onclick = (e) => {
        e.stopPropagation();
        handleDelTask(tdlShowTask, task);
      };
      listTaskNode.appendChild(tdlShowTask);
    });
  } catch (error) {}
}

function handleDelTodo(e) {
  const { target } = e;
  const id_todo = target.parentNode.parentNode.getAttribute("id");

  axios
    .delete(`${env.DOMAIN_SERVER}:${env.PORT}/api/todos/${id_todo}`, {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      console.log(res);
      handleRenderBoard();
    })
    .catch((err) => {
      console.log(err);
    });
}

async function handleRenderTodo(board) {
  try {
    await waitUntilSelectorExist(".tdl-name .title-text");

    let todoContainer = document.querySelector(".tdl-container");
    // todoContainer.innerHTML = "";
    let todoTitle = document.querySelector(".tdl-name .title-text");
    todoTitle.textContent = board.board_name;

    // todoContainer.setAttribute("id", board.id_board);

    console.log("hmmm", board);

    axios
      .get(`${env.DOMAIN_SERVER}:${env.PORT}/api/boards/${board.id_board}`, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => res.data.data)
      .then((todo) => {
        console.log(todo);
        for (let i = 0; i < todo.length; i++) {
          let tdlShow = document.createElement("div");
          tdlShow.classList.add("tdl", "tdl__show");
          tdlShow.setAttribute("id", todo[i].id_todo);
          tdlShow.setAttribute("data", todo[i].id_todo);

          console.log("la sao nua", tdlShow, todoContainer);
          todoContainer.appendChild(tdlShow);
          tdlShow.innerHTML = `
            <div class="tdl__show-header d-flex justify-content-between">
              <h3 class="tdl__show-name">${todo[i].todo_name}</h3>
              <div class="tdl-del-icon" onClick="handleDelTodo(event)"></div>
            </div>
            <div class="tdl__show-body"></div>
            <div class="tdl__show-add-task" onClick="handleAddTask(event)">+ Add Task</div>
          `;
          
          axios
            .get(
              `${env.DOMAIN_SERVER}:${env.PORT}/api/todos/${todo[i].id_todo}`
            )
            .then((res) => {
              console.log(res);
              return res.data.data;
            })
            .then((data) => {
              console.log(todo[i].id_todo, data, "hmmm");
              handleRenderTask(data, todo[i].id_todo);
            })
            .catch((err) => console.log(err));
        }

        return todoContainer;
      })
      .then((ele) => {
        ele.innerHTML += `<div class="tdl tdl__button" onClick="handleShowAddList(event)">
        <h1 class="tdl-label m-0">+ Add a list</h1>
      </div>`;
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
}

function handleRenderBoard(autoClickFirstBoard = true) {
  const boardsListEl = document.querySelector(".boards__list");

  boardsListEl.innerHTML = "";

  axios
    .get(`${env.DOMAIN_SERVER}:${env.PORT}/api/boards`, {
      mode: "cors",
      headers: {
        authorization: token,
      },
    })
    .then((res) => res.data)
    .then((data) => {
      // console.log(data);
      boardCache = data.data;
      data.data.map((board, index) => {
        let boardEle = document.createElement("a");
        boardEle.setAttribute(
          "class",
          "boards__item d-flex align-items-center justify-content-between"
        );
        boardEle.setAttribute("href", `/board`);

        boardEle.innerHTML = `<div class="d-flex align-items-center gap-2">
        <div class="boards__item-icon"></div>
        <div class="boards__item-label">${board.board_name}</div>
      </div>
      <div class="boards__item-del-icon"></div>`;

        const delBoardBtn = boardEle.getElementsByClassName(
          "boards__item-del-icon"
        )[0];

        delBoardBtn.onclick = () => {
          handleDelBoard(board);
        };

        boardEle.onclick = () => {
          currentBoard = board;
          console.log("handleRenderBoard");
          boardsListEl.childNodes.forEach((node) => {
            if (node.classList.contains("boards__item--current"))
              node.classList.remove("boards__item--current");
          });
          handleRenderTodo(board);
          boardEle.classList.add("boards__item--current");
        };

        boardsListEl.appendChild(boardEle);

        if (Object.keys(currentBoard).length > 0) {
          console.log(
            "lkjaflksj",
            String(board.id_board) == String(currentBoard.id_board)
          );
          console.log(currentBoard.id_board, board.id_board);
          if (String(board.id_board) == String(currentBoard.id_board)) {
            console.log("dữ roi dó");
            boardEle.click();
            currentBoard = board;
          }
        } else if (autoClickFirstBoard) {
          if (index === 0) {
            boardEle.click();
            currentBoard = board;
          } else if (index === data.data.length - 1) {
            boardEle.click();
            currentBoard = board;
          }
        }
      });
    })
    .catch((err) => console.log(err, "loi r"));
}

function waitUntilSelectorExist(selector) {
  let MutationObserver = window.MutationObserver;

  let promise = new Promise(function (resolve) {
    let observer;
    observer = new MutationObserver(function (mutations) {
      let element = document.querySelector(selector);
      if (element !== null) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
  // console.log("vai loz");
  return promise;
}

handleRenderBoard();

function handleAddBoard() {
  axios
    .post(
      `${env.DOMAIN_SERVER}:${env.PORT}/api/boards`,
      {
        board_name: "Board Name",
      },
      {
        headers: {
          authorization: token,
        },
      }
    )
    // .then((res) => console.log(res))
    .then(() => handleRenderBoard(false))
    .catch((err) => console.log(err));
}

function handleDelBoard(board) {
  axios
    .delete(`${env.DOMAIN_SERVER}:${env.PORT}/api/boards/${board.id_board}`, {
      headers: {
        authorization: token,
      },
    })
    // .then((res) => console.log(res))
    .then(() => {
      handleRenderBoard();
    })
    .catch((err) => console.log(err));
}

function handleAddMember(user) {
  axios
    .put(
      `${env.DOMAIN_SERVER}:${env.PORT}/api/tasks?field=member`,
      { id_user: user.id_user },
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then((res) => {
      // console.log(res);
      return res.data.data;
    })
    .then((member) => {
      let colorFont = randomColor();

      document.getElementsByClassName(
        "member__avatar-list"
      )[0].innerHTML += `<div class="avatar_mem" style="background-color: ${colorFont}" title="${
        member.username
      }">${String(member.username[0]).toUpperCase()}</div>`;
    })
    .catch((err) => console.log(err));
}

function handleRenderTaskDetail(id_task) {
  axios
    .get(`${env.DOMAIN_SERVER}:${env.PORT}/api/tasks/${id_task}`)
    .then((res) => {
      console.log(res);
      return res.data.data;
    })
    .then((task) => {
      const taskDetail = document.getElementById("task-detail__container");
      const taskTag = taskDetail.getElementsByClassName("task-tag")[0];

      taskDetail.setAttribute("data-set", id_task);

      taskDetail.getElementsByClassName("task-title")[0].textContent =
        task.title;
      taskDetail.getElementsByClassName("description-name")[0].textContent =
        task.description;

      if (task.deadline) {
        taskTag.innerHTML = `
          <div
            class="tdl__show-task-date-tag d-flex align-items-center justify-content-between gap-3 mt-3"
            >
            <div class="d-flex align-items-center gap-3">
              <div class="clock-icon"></div>
              <p class="m-0" style="font-size: 13px">Date</p>
            </div>
            <button
              type="button"
              class="delete-date btn-close shadow-none"
            ></button>
          </div>`;
      }

      const commentList = taskDetail.getElementsByClassName("comments-list")[0];

      commentList.innerHTML = task.comments
        .map(
          (comment) =>
            `<div class="comments-item d-flex justify-content-between">
            <div div class="avatar m-0 flex-shrink-0">
              <img
                src="./assets/images/avatar_default.png"
                alt=""
              />
            </div>
            <div class="content ms-4">
              <div class="username text-white">${comment.username}</div>
              <p class="text-white fs-5 text-break">
               ${comment.content}</p>
            </div>
          </div> `
        )
        .join("");

      const memberAvaList = taskDetail.getElementsByClassName(
        "member__avatar-list"
      )[0];

      memberAvaList.innerHTML = task.member
        .map((member) => {
          let colorFont = randomColor();

          return `<div class="avatar_mem" style="background-color: ${colorFont}" title="${
            member.username
          }">${String(member.username[0]).toUpperCase()}</div>`;
        })
        .join("");
    })
    .catch((err) => console.log(err));
}

function randomColor() {
  return (
    "#" + ("00000" + ((Math.random() * 16777216) << 0).toString(16)).substr(-6)
  );
}

function handleRenderMember(id_task) {
  axios
    .get(`${env.DOMAIN_SERVER}:${env.PORT}/api/tasks/${id_task}`)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

function handleSearch(e) {
  let value = e.target.value;

  axios
    .get(`${env.DOMAIN_SERVER}:${env.PORT}/api/users?username=${value}`)
    .then((res) => {
      // console.log(res);
      return res.data;
    })
    .then((data) => {
      const searchUserRes = document.getElementsByClassName(
        "search_user__result"
      )[0];

      searchUserRes.innerHTML = "";

      data.data.map((user) => {
        let searchItem = document.createElement("div");

        searchItem.classList.add("search_user__item");

        searchItem.innerHTML = `
            <div class="container-fluid">
              <div class="row">
                <div class="col-7">
                  <p class="username m-0">${user.username}</p>
                </div>
                <div class="col-5">
                  <p class="display-name m-0">${user.display_name}</p>
                </div>
              </div>
            </div>`;

        searchItem.onclick = () => {
          searchUserRes.innerHTML = "";
          handleAddMember(user);
        };

        searchUserRes.appendChild(searchItem);
      });
    })
    .catch((err) => console.log(err));
}

function handleShowFormAddMem(event) {
  document.querySelector(".member__group").classList.add("member__group--show");
}

function handleCloseFormAddMem(event) {
  document
    .querySelector(".member__group")
    .classList.remove("member__group--show");
}

function handleUpdateTaskTitle(id_task, newTitle) {
  axios
    .put(
      `${env.DOMAIN_SERVER}:${env.PORT}/api/tasks?field=title&id_task=${id_task}`,
      {
        title: newTitle,
      },
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then(() => {
      alert("Update success");
    })
    .catch((err) => console.log(err));
}

const taskTitle = document.querySelector(".task-title");

taskTitle.onblur = async (e) => {
  let newTitle = e.target.textContent;
  handleUpdateTaskTitle(currentTask.id_task, newTitle);
  handleRenderTodo(currentBoard);
};

const taskDetailDate = document.getElementById("myID");

taskDetailDate.onchange = (e) => {
  let date = e.target.value;

  axios
    .put(
      `${env.DOMAIN_SERVER}:${env.PORT}/api/tasks?field=deadline&id_task=${currentTask.id_task}`,
      { deadline: date },
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then(() => {
      handleRenderTaskDetail(currentTask.id_task);
    })
    .catch((err) => {
      console.log(err);
    });
};
