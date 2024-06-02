/* https://habr.com/ru/articles/468253/
Урок 2. События, формы

Вашей задачей является создание веб-слайдера для отображения изображений на веб-странице. Слайдер должен позволять переключаться между изображениями и отображать их в центре экрана.

1. Создайте интерфейс веб-страницы, который включает в себя следующие элементы:

    a. Контейнер для отображения текущего изображения.
    b. Кнопки "Предыдущее изображение" и "Следующее изображение" для переключения между изображениями.
    c. Навигационные точки (индикаторы) для быстрого переключения между изображениями.

2. Используйте HTML для создания элементов интерфейса.

3. Используйте JavaScript для обработки событий:

    a. При клике на кнопку "Предыдущее изображение" должно отображаться предыдущее    изображение.
    b. При клике на кнопку "Следующее изображение" должно отображаться следующее     изображение.
    c. При клике на навигационные точки, слайдер должен переключаться к соответствующему изображению.

4. Слайдер должен циклически переключаться между изображениями, то есть после последнего изображения должно отображаться первое, и наоборот.

5. Добавьте стилизацию для слайдера и элементов интерфейса с использованием CSS для улучшения внешнего вида.
*/
"use strict";
//Определяем переменные по слайдеру
const sliderImages = document.querySelectorAll(".slider__img");
const sliderLine = document.querySelector(".slider__line");
const sliderDots = document.querySelectorAll(".slider__dot");
const sliderBtnNext = document.querySelector(".slider__btn-next");
const sliderBtnPrev = document.querySelector(".slider__btn-prev");

//Определяем переменные
let sliderCount = 0;
let sliderWidth;

//Адаптивность слайдера
window.addEventListener("resize", showSlide);

//Кнопки для перелистывания слайдов (вперед назад)
sliderBtnNext.addEventListener("click", nextSlide);
sliderBtnPrev.addEventListener("click", prevSlide);

//Автоматическое прелистывание слайдов
setInterval(() => {
  nextSlide();
}, 5000);

//Функции
//Задаем нужную ширину картинки и sliderLine
function showSlide() {
  sliderWidth = document.querySelector(".slider").offsetWidth;
  sliderLine.style.width = sliderWidth * sliderImages.length + "px";
  sliderImages.forEach((item) => (item.style.width = sliderWidth + "px"));

  rollSlider();
}
showSlide();

//Перелистывание слайдов (вперед)
function nextSlide() {
  sliderCount++;
  if (sliderCount >= sliderImages.length) sliderCount = 0;

  rollSlider();
  thisSlide(sliderCount);
}

//Перелистывание слайдов (назад)

function prevSlide() {
  sliderCount--;
  if (sliderCount < 0) sliderCount = sliderImages.length - 1;

  rollSlider();
  thisSlide(sliderCount);
}

//Задаем шаг перемещения слайдера
function rollSlider() {
  sliderLine.style.transform = `translateX(${-sliderCount * sliderWidth}px)`;
}

//Указываем какой слайд по счету активен
function thisSlide(index) {
  sliderDots.forEach((item) => item.classList.remove("active-dot"));
  sliderDots[index].classList.add("active-dot");
}

//Вешаем клик на точки
sliderDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    sliderCount = index;
    rollSlider();
    thisSlide(sliderCount);
  });
});
