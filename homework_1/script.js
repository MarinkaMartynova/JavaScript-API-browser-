"use strict";

// Необходимо создать веб-страницу с динамическими элементами с расписанием занятий.
// На странице должна быть таблица с расписанием занятий, на основе JSON-данных.
// Каждая строка таблицы должна содержать информацию о занятии, а именно:
// - название занятия
// - время проведения занятия
// - максимальное количество участников
// - текущее количество участников
// - кнопка "записаться"
// - кнопка "отменить запись"
//
// Если максимальное количество участников достигнуто, либо пользователь уже записан на занятие, сделайте кнопку "записаться" неактивной.
// Кнопка "отменить запись" активна в случае, если пользователь записан на занятие, иначе она должна быть неактивна.
//
// Пользователь может записаться на один курс только один раз.
//
// При нажатии на кнопку "записаться" увеличьте количество записанных участников.
// Если пользователь нажимает "отменить запись", уменьшите количество записанных участников.
// Обновляйте состояние кнопок и количество участников в реальном времени.
//
// Если количество участников уже максимально, то пользователь не может записаться, даже если он не записывался ранее.
//
// Сохраняйте данные в LocalStorage, чтобы они сохранялись и отображались при перезагрузке страницы.
//
//
// Начальные данные (JSON):
/* [
    {
        "id": 1,
        "name": "Йога",
        "time": "10:00 - 11:00",
        "maxParticipants": 15,
        "currentParticipants": 8
    },
    {
        "id": 2,
        "name": "Пилатес",
        "time": "11:30 - 12:30",
        "maxParticipants": 10,
        "currentParticipants": 5
    },
    {
        "id": 3,
        "name": "Кроссфит",
        "time": "13:00 - 14:00",
        "maxParticipants": 20,
        "currentParticipants": 15
    },
    {
        "id": 4,
        "name": "Танцы",
        "time": "14:30 - 15:30",
        "maxParticipants": 12,
        "currentParticipants": 10
    },
    {
        "id": 5,
        "name": "Бокс",
        "time": "16:00 - 17:00",
        "maxParticipants": 8,
        "currentParticipants": 6
    }
]  */

let scheduleData = [];

// Функция для отмены записи участника на занятие
function cancel(id) {
  if (scheduleData && scheduleData.length > 0) {
    const scheduleItem = scheduleData.find((item) => item.id === id);
    if (getBooked().some((x) => x.id === id)) {
      scheduleItem.currentParticipants--;
      localStorage.setItem(
        "booked",
        JSON.stringify(getBooked().filter((x) => x.id !== id))
      );
      updateUI();
    }
  } else {
    console.error("Данные расписания не загружены");
  }
}

//Получение данных из JSON
fetch("./data/schedule.json")
  .then((response) => response.json())
  .then((data) => {
    scheduleData = data;
    localStorage.setItem("scheduleData", JSON.stringify(scheduleData));
    createSchedule();
  })
  .catch((error) => {
    console.error("Ошибка при загрузке данных:", error);
  });

//Функция для отрисовки занятий
const scheduleContainer = document.getElementById("schedule");

// Функция для получения данных о записанных участниках из localStorage
function getBooked() {
  return JSON.parse(localStorage.getItem("booked")) || [];
}

// Функция для обновления состояния кнопок и количества участников
function updateUI() {
  scheduleData.forEach((item) => {
    const scheduleItem = document.getElementById(`schedule-item-${item.id}`);
    const registerButton = scheduleItem.querySelector(".register-button");
    const cancelButton = scheduleItem.querySelector(".cancel-button");

    if (
      item.currentParticipants >= item.maxParticipants ||
      getBooked().some((x) => x.id === item.id)
    ) {
      registerButton.disabled = true;
    } else {
      registerButton.disabled = false;
    }

    if (getBooked().some((x) => x.id === item.id)) {
      cancelButton.disabled = false;
    } else {
      cancelButton.disabled = true;
    }

    scheduleItem.querySelector(
      ".current-participants"
    ).textContent = `Текущее количество участников: ${item.currentParticipants}`;
  });
}

// Функция для создания расписания на странице
function createSchedule() {
  if (scheduleData && scheduleData.length > 0) {
    scheduleData.forEach((item) => {
      const scheduleItem = document.createElement("div");
      scheduleItem.id = `schedule-item-${item.id}`;
      scheduleItem.innerHTML = `
        <h2>${item.name}</h2>
        <p><strong>Время:</strong> ${item.time}</p>
        <p><strong>Максимальное количество участников:</strong> ${item.maxParticipants}</p>
        <p class="current-participants"><strong>Текущее количество участников:</strong> ${item.currentParticipants}</p>
        <button class="register-button" >Записаться</button>
        <button class="cancel-button" >Отменить запись</button>
      `;
      const registerButton = scheduleItem.querySelector(".register-button");
      registerButton.addEventListener("click", () => register(item.id));
      const cancelButton = scheduleItem.querySelector(".cancel-button");
      cancelButton.addEventListener("click", () => cancel(item.id));
      scheduleContainer.appendChild(scheduleItem);
    });
    updateUI();
  } else {
    console.error("Данные расписания не загружены");
  }
}

// Функция для записи участника на занятие
function register(id) {
  if (scheduleData && scheduleData.length > 0) {
    const scheduleItem = scheduleData.find((item) => item.id === id);
    if (
      scheduleItem.currentParticipants < scheduleItem.maxParticipants &&
      !getBooked().some((x) => x.id === id)
    ) {
      scheduleItem.currentParticipants++;
      localStorage.setItem(
        "booked",
        JSON.stringify([...getBooked(), { id: id }])
      );
      updateUI();
    } else {
      alert(
        "Вы уже записаны на это занятие или максимальное количество участников уже достигнуто"
      );
    }
  } else {
    console.error("Данные расписания не загружены");
  }
}

// Обновление состояния кнопок и количества участников при загрузке страницы
updateUI();
