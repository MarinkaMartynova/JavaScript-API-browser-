"use strict";

const scheduleData = [
  {
    id: 1,
    name: "Йога",
    time: "10:00 - 11:00",
    maxParticipants: 15,
    currentParticipants: 8,
  },
  {
    id: 2,
    name: "Пилатес",
    time: "11:30 - 12:30",
    maxParticipants: 10,
    currentParticipants: 5,
  },
  {
    id: 3,
    name: "Кроссфит",
    time: "13:00 - 14:00",
    maxParticipants: 20,
    currentParticipants: 15,
  },
  {
    id: 4,
    name: "Танцы",
    time: "14:30 - 15:30",
    maxParticipants: 12,
    currentParticipants: 10,
  },
  {
    id: 5,
    name: "Бокс",
    time: "16:00 - 17:00",
    maxParticipants: 8,
    currentParticipants: 6,
  },
];

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

// Функция для записи участника на занятие
function register(id) {
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
}

// Функция для отмены записи участника на занятие
function cancel(id) {
  const scheduleItem = scheduleData.find((item) => item.id === id);
  if (getBooked().some((x) => x.id === id)) {
    scheduleItem.currentParticipants--;
    localStorage.setItem(
      "booked",
      JSON.stringify(getBooked().filter((x) => x.id !== id))
    );
    updateUI();
  }
}

// Создание расписания на странице
scheduleData.forEach((item) => {
  const scheduleItem = document.createElement("div");
  scheduleItem.id = `schedule-item-${item.id}`;
  scheduleItem.innerHTML = `
    <h2>${item.name}</h2>
    <p><strong>Время:</strong> ${item.time}</p>
    <p><strong>Максимальное количество участников:</strong> ${item.maxParticipants}</p>
    <p class="current-participants">Текущее количество участников: ${item.currentParticipants}</p>
    <button class="register-button" onclick="register(${item.id})">Записаться</button>
    <button class="cancel-button" onclick="cancel(${item.id})">Отменить запись</button>
  `;
  scheduleContainer.appendChild(scheduleItem);
});

// Обновление состояния кнопок и количества участников при загрузке страницы
updateUI();
