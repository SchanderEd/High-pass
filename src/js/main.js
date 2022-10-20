ymaps.ready(function () {
  var myMap = new ymaps.Map('map', {
    center: [55.769383, 37.638521],
    zoom: 15,
    controls: []
  }, {
    searchControlProvider: 'yandex#search'
  }),

    // Создаём макет содержимого.
    MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
      '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
    ),

    myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
      hintContent: 'Собственный значок метки',
      balloonContent: '<h3 class="reset-h">Студия “High pass”</h3><p class="reset-p">107045, Москва, Даев переулок, дом 41, бизнес-центр «Даев Плаза», этаж 8, офис № 82</p><a href="tel:+749542423532">+7 (495) 42-423-532</a>'
    }, {
      // Опции.
      // Необходимо указать данный тип макета.
      iconLayout: 'default#image',
      // Своё изображение иконки метки.
      iconImageHref: 'img/myplacemark.png',
      // Размеры метки.
      iconImageSize: [20, 20],
      // Смещение левого верхнего угла иконки относительно
      // её "ножки" (точки привязки).
      iconImageOffset: [-5, -38]
    })

    myMap.behaviors.disable('scrollZoom');

  myMap.geoObjects
    .add(myPlacemark)
});


// Info close

window.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.contacts__info-close').addEventListener('click', function () {
    document.querySelector('.contacts__info').classList.add('contacts__info--disabled')
  })
})
