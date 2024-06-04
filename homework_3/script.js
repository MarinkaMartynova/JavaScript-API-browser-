"use strict";

const photoContainerElement = document.getElementById("photo-container");
const historyContainerElement = document.getElementById("history-container");
const prevBtnElement = document.getElementById("prev-btn");
const nextBtnElement = document.getElementById("next-btn");

let currentIndex = 0; //текущий индекс фотографии в истории просмотров.
let photoHistory = []; //массив, хранящий информацию о просмотренных фотографиях.

// Получаем API-ключ
const apiKey = "YOUR_API_KEY_HERE";

// Функция для получения и отображения случайного фото
async function getRandomPhoto() {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?client_id=${apiKey}`
    );
    const data = await response.json();

    // Создаем элемент фото и добавляем его в контейнер
    const photoElement = document.createElement("div");
    photoElement.classList.add("photo-container");
    const img = document.createElement("img");
    img.classList.add("photo");
    img.src = data.urls.regular;
    img.alt = "Random Photo";
    photoElement.appendChild(img);
    photoElement.addEventListener("click", () => showPhotoDetails(data));
    photoContainerElement.innerHTML = "";
    photoContainerElement.appendChild(photoElement);

    // Создаем элементы для имени фотографа и лайков
    const photographerNameElement = document.createElement("p");
    photographerNameElement.classList.add("photo-info");
    photographerNameElement.textContent = `Фото от: ${data.user.name}`;

    const likeContainer = document.createElement("div");
    likeContainer.classList.add("like-container");

    const likeBtnElement = document.createElement("button");
    likeBtnElement.classList.add("like-btn");
    likeBtnElement.textContent = "❤️";
    likeBtnElement.addEventListener("click", () => {
      handleLike(data.id, likeCountElement);
    });

    const likeCountElement = document.createElement("span");
    likeCountElement.classList.add("like-count");
    likeCountElement.textContent = getLikeCount(data.id) || "0";
    likeCountElement.dataset.photoId = data.id;

    likeContainer.appendChild(likeBtnElement);
    likeContainer.appendChild(likeCountElement);

    // Добавляем элементы в контейнер фото
    photoElement.appendChild(photographerNameElement);
    photoElement.appendChild(likeContainer);

    // Добавляем фото в историю
    photoHistory.push({ ...data, likeCountElement });
    currentIndex = photoHistory.length - 1;
    updateHistoryContainer();
  } catch (error) {
    console.error("Ошибка при получении фотографии:", error);
  }
}

// Функция для отображения деталей фотографии
function showPhotoDetails(photoData) {
  // Реализуйте логику отображения деталей фотографии, например, в модальном окне
  console.log("Детали фотографии:", photoData);
}

// Функция для обновления контейнера истории
function updateHistoryContainer() {
  historyContainerElement.innerHTML = "";
  photoHistory.forEach((photo, index) => {
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");
    historyItem.style.backgroundImage = `url(${photo.urls.thumb})`;
    historyItem.addEventListener("click", () => showPhotoAtIndex(index));
    historyContainerElement.appendChild(historyItem);
  });
}

// Функция для отображения фото по индексу
function showPhotoAtIndex(index) {
  currentIndex = index;
  getRandomPhoto();
}

// Функция для обработки лайка
function handleLike(photoId, likeCountElement) {
  const likeCount = incrementLikeCount(photoId);
  likeCountElement.textContent = likeCount;

  // Обновляем информацию о лайках в истории
  photoHistory[currentIndex].likeCountElement = likeCountElement;
  updateHistoryContainer();
}

// Функция для получения количества лайков по ID фото
function getLikeCount(photoId) {
  return localStorage.getItem(`likeCount-${photoId}`);
}

// Функция для увеличения количества лайков и сохранения в локальное хранилище
function incrementLikeCount(photoId) {
  const currentCount = parseInt(getLikeCount(photoId)) || 0;
  const newCount = currentCount + 1;
  localStorage.setItem(`likeCount-${photoId}`, newCount);
  return newCount;
}

// Обработчики событий для навигации
prevBtnElement.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + photoHistory.length) % photoHistory.length;
  getRandomPhoto();
});

nextBtnElement.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % photoHistory.length;
  getRandomPhoto();
});

// Загружаем первое случайное фото
getRandomPhoto();
