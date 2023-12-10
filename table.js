function handleRenderTaskItem() {
  const taskList = document.getElementsByClassName("task-list")[0];

  axios
    .get(`${env.DOMAIN_SERVER}:${env.PORT}/api/tasks`, {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      console.log(res);
      return res.data.data;
    })
    .then((datas) => {
      taskList.innerHTML = "";

      datas.map((task) => {
        let taskItem = document.createElement("div");
        taskItem.setAttribute("data-bs-toggle", "modal");
        taskItem.setAttribute("data-bs-target", "#task-detail__container");
        taskItem.classList.add("task-item");

        taskItem.innerHTML = `<p class="task-name m-0">${task.title}</p>`;

        taskItem.onclick = () => {
          handleRenderTaskDetail(task.id_task);
        };
        taskList.appendChild(taskItem);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

handleRenderTaskItem();
