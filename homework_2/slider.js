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
