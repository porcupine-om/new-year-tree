/* ========================================
   JAVASCRIPT ДЛЯ ПРОЕКТА "НАРЯДИ ЁЛОЧКУ"
   Масштабирование через CSS переменную
   ======================================== */

// Убрана функция масштабирования - возвращаемся к оригинальному виду

// Создаём объект для управления звуками
const sounds = {
    fireplace: new Audio('sounds/fireplace.mp3'),
    music: new Audio('sounds/fon-christmas.mp3'),
    miracle: new Audio('sounds/miracle.mp3'),
    hanging: new Audio('sounds/hanging.mp3'),
    hlopushka: new Audio('sounds/zvuk-hlopushki.mp3')
  };
  
  // Настройка звуков
  sounds.fireplace.loop = true;
  sounds.music.loop = true;
  sounds.fireplace.volume = 0.3;  // 30%
  sounds.music.volume = 0.15;     // 15%
  sounds.miracle.volume = 0.4;     // 50%
  sounds.hanging.volume = 0.5;      // 50%
  sounds.hlopushka.volume = 0.7;   // 70%
  
  // Флаг для отслеживания, была ли игра запущена
  let gameStarted = false;
  
  // Флаг для отслеживания, включены ли звуки (по умолчанию false, так как звуки запускаются только при нажатии "Играть")
  let soundsEnabled = false;
  
  // Автоматический запуск звуков при загрузке страницы - УБРАН
  // Теперь звуки запускаются только при нажатии кнопки "Играть"
  
  // Функция для запуска игры (первый раз)
  function startGame() {
    if (gameStarted) return; // Если игра уже запущена, ничего не делаем
    
    gameStarted = true;
    
    // Убеждаемся, что звуки включены при запуске игры
    soundsEnabled = true;
    
    // Запускаем анимацию камина
    const fireplaceFlame = document.getElementById('fireplace-flame');
    if (fireplaceFlame) {
      fireplaceFlame.classList.add('animated');
    }
    
    // Запускаем анимацию снежинок
    const snowflakes = document.querySelectorAll('.snowflake');
    snowflakes.forEach(snowflake => {
      snowflake.classList.add('animated');
    });
    
    // Сначала запускаем звук камина
    sounds.fireplace.play().catch(e => {
      console.log("Автовоспроизведение fireplace заблокировано:", e);
    });
    
    // Затем запускаем основную фоновую музыку с небольшой задержкой
    setTimeout(() => {
      sounds.music.play().catch(e => {
        console.log("Автовоспроизведение music заблокировано:", e);
      });
    }, 500); // задержка 500мс после звука камина
    
    // Запускаем анимацию подпрыгивания для box1 через 8 секунд после нажатия кнопки
    setTimeout(() => {
      startBox1BounceAnimation();
    }, 8000);
    
    // Обновляем текст кнопки звуков
    setTimeout(() => {
      updateButtonText();
    }, 500);
    
    // Меняем текст кнопки на "Играть сначала"
    const restartBtn = document.getElementById('restart-game');
    if (restartBtn) {
      restartBtn.textContent = '🔄 Играть сначала';
    }
    
    // Обновляем курсоры для коробок и хлопушки после запуска игры
    updateBoxCursors();
    updateFireworksCursor();
  }
  
  // Функция для запуска анимации подпрыгивания box1
  function startBox1BounceAnimation() {
    const box1 = document.querySelector('.box[data-box="1"]');
    if (!box1) {
      // Если элемент еще не найден, пробуем еще раз через небольшую задержку
      setTimeout(startBox1BounceAnimation, 100);
      return;
    }
    
    // Проверяем, открыта ли коробка 1 - если да, анимация не нужна
    if (boxStates[1]) {
      return; // Коробка уже открыта, анимация не нужна
    }
    
    // Добавляем класс анимации
    box1.classList.add('bounce-hint');
    console.log('Анимация подпрыгивания запущена для box1');
  }
  
  // Функция для остановки анимации подпрыгивания
  function stopBox1BounceAnimation() {
    const box1 = document.querySelector('.box[data-box="1"]');
    if (box1) {
      box1.classList.remove('bounce-hint');
    }
  }
  
  // Кнопка "Включить звуки"
  const toggleSoundBtn = document.getElementById('toggle-sound');
  
  // Проверяем, играют ли звуки
  function checkSoundsPlaying() {
    return !sounds.fireplace.paused && !sounds.music.paused;
  }
  
  // Обновляем текст кнопки в зависимости от состояния звуков
  function updateButtonText() {
    if (checkSoundsPlaying()) {
      toggleSoundBtn.textContent = '🔇 Выключить звуки';
    } else {
      toggleSoundBtn.textContent = '🔊 Включить звуки';
    }
  }
  
  // Проверяем состояние звуков периодически (на случай, если браузер заблокировал автовоспроизведение)
  setInterval(updateButtonText, 500);
  
  toggleSoundBtn.addEventListener('click', () => {
    if (checkSoundsPlaying()) {
      // Останавливаем ВСЕ звуки полностью
      sounds.fireplace.pause();
      sounds.music.pause();
      sounds.miracle.pause();
      sounds.hanging.pause();
      sounds.hlopushka.pause();
      
      // Сбрасываем позицию воспроизведения для всех звуков
      sounds.fireplace.currentTime = 0;
      sounds.music.currentTime = 0;
      sounds.miracle.currentTime = 0;
      sounds.hanging.currentTime = 0;
      sounds.hlopushka.currentTime = 0;
      
      // Устанавливаем флаг, что звуки выключены
      soundsEnabled = false;
      
      // Убираем анимацию подпрыгивания при выключении звуков
      stopBox1BounceAnimation();
      
      toggleSoundBtn.textContent = '🔊 Включить звуки';
    } else {
      // Включаем звуки только если игра запущена
      if (!gameStarted) {
        return; // Не включаем звуки до начала игры
      }
      
      // Запускаем только фоновые звуки (камин и музыка)
      sounds.fireplace.play().catch(e => console.log("Ошибка воспроизведения:", e));
      sounds.music.play().catch(e => console.log("Ошибка воспроизведения:", e));
      
      // Устанавливаем флаг, что звуки включены
      soundsEnabled = true;
      
      // НЕ запускаем анимацию коробки - это делает только кнопка "Играть"
      
      toggleSoundBtn.textContent = '🔇 Выключить звуки';
    }
  });
  
  // Обновляем текст кнопки при загрузке (звуки не запускаются автоматически, поэтому кнопка будет "Включить звуки")
  window.addEventListener('DOMContentLoaded', () => {
    // Убеждаемся, что все звуки остановлены при загрузке страницы
    sounds.fireplace.pause();
    sounds.music.pause();
    sounds.miracle.pause();
    sounds.hanging.pause();
    sounds.hlopushka.pause();
    
    // Сбрасываем позицию воспроизведения для всех звуков
    sounds.fireplace.currentTime = 0;
    sounds.music.currentTime = 0;
    sounds.miracle.currentTime = 0;
    sounds.hanging.currentTime = 0;
    sounds.hlopushka.currentTime = 0;
    
    // Кнопка звуков будет показывать "Включить звуки", так как звуки не запущены
    updateButtonText();
  });

  // ========== СЦЕНА 2: ОТКРЫТИЕ КОРОБОК ==========
  
  // Содержимое коробок
  const boxContents = {
    1: [
      { name: 'ball', image: 'assets/images/ball.png', alt: 'Шар' },
      { name: 'icicle', image: 'assets/images/icicle.png', alt: 'Сосулька' },
      { name: 'doll', image: 'assets/images/doll.png', alt: 'Куколка' },
      { name: 'snowman', image: 'assets/images/snowman.png', alt: 'Снеговик' },
      { name: 'bear', image: 'assets/images/bear.png', alt: 'Медвежонок' },
      { name: 'ball-blue', image: 'assets/images/ball-blue.png', alt: 'Синий шар' }
    ],
    2: [
      { name: 'garland-white', image: 'assets/images/garland-white.png', alt: 'Гирлянда с белыми лампочками' },
      { name: 'garland-lanterns', image: 'assets/images/garland-lanterns.png', alt: 'Гирлянда с фонариками' }
    ],
    3: [
      { name: 'snowflake', image: 'assets/images/snowflake.png', alt: 'Снежинка' },
      { name: 'tinsel-rainbow', image: 'assets/images/tinsel-rainbow.png', alt: 'Мишура цветная' },
      { name: 'tinsel-gold', image: 'assets/images/tinsel-gold.png', alt: 'Мишура золотая' }
    ]
  };

  // Состояние коробок (открыта/закрыта)
  const boxStates = {
    1: false,
    2: false,
    3: false
  };
  
  // Флаг, что хотя бы одна коробка была открыта
  let atLeastOneBoxOpened = false;
  
  // Флаг, что хлопушка была использована (после первого использования коробки становятся недоступны)
  let popperUsed = false;
  
  // Счетчик взрывов хлопушки (максимум 3)
  let fireworksExplosionCount = 0;
  const MAX_FIREWORKS_EXPLOSIONS = 3;
  
  // Счетчик открытий коробки 1 (максимум 3 раза)
  let box1OpenCount = 0;
  const MAX_BOX1_OPENS = 3;
  
  let box2OpenCount = 0;
  const MAX_BOX2_OPENS = 2;
  
  let box3OpenCount = 0;
  const MAX_BOX3_OPENS = 2;

  // Контейнер для игрушек
  let toysContainer = null;

  // Создаем контейнер для игрушек
  function createToysContainer() {
    if (!toysContainer) {
      toysContainer = document.createElement('div');
      toysContainer.id = 'toys-container';
      const sceneContainer = document.getElementById('scene-container');
      if (sceneContainer) {
        sceneContainer.appendChild(toysContainer);
      } else {
        document.body.appendChild(toysContainer);
      }
    }
    return toysContainer;
  }

  // Очистка контейнера игрушек
  function clearToysContainer() {
    if (toysContainer) {
      toysContainer.innerHTML = '';
    }
  }

  // Показать игрушки из коробки
  function showToys(boxNumber) {
    const container = createToysContainer();
    const toys = boxContents[boxNumber];
    
    // Для коробки 1 показываем все 6 игрушек каждый раз (не фильтруем по лимиту)
    // Для коробок 2 и 3 фильтруем игрушки, которые уже достигли лимита
    // Но только если коробка еще не достигла лимита открытий
    let availableToys;
    if (boxNumber === 1) {
      availableToys = toys;
    } else if (boxNumber === 2) {
      // Для коробки 2: фильтруем игрушки, которые уже достигли лимита
      // (счетчик открытий проверяется в toggleBox, здесь просто фильтруем по количеству на елке)
      availableToys = toys.filter(toy => {
        const count = toysOnTree[toy.name] || 0;
        return count < 3;
      });
    } else if (boxNumber === 3) {
      // Для коробки 3: фильтруем игрушки, которые уже достигли лимита
      // (счетчик открытий проверяется в toggleBox, здесь просто фильтруем по количеству на елке)
      availableToys = toys.filter(toy => {
        const count = toysOnTree[toy.name] || 0;
        return count < 3;
      });
    } else {
      availableToys = toys;
    }
    
    // Определяем размеры для разных типов игрушек
    const getToySize = (toyName, boxNum) => {
      if (isGarlandOrTinsel(toyName) && boxNum === 2) {
        // Для коробки 2: гирлянды увеличены на 50% при показе в ряду, затем уменьшены на 20%
        return { width: '120px', spacing: 136 }; // 150px * 0.8 = 120px, 170 * 0.8 = 136
      }
      if (isGarlandOrTinsel(toyName)) {
        return { width: '80px', spacing: 96 }; // 100px * 0.8 = 80px, 120 * 0.8 = 96
      }
      return { width: '80px', spacing: 96 }; // 100px * 0.8 = 80px, 120 * 0.8 = 96
    };
    
    // Если нет доступных игрушек, не показываем ряд
    if (availableToys.length === 0) {
      return;
    }
    
    // Вычисляем начальную позицию для ряда (адаптивно)
    let totalWidth = 0;
    availableToys.forEach(toy => {
      const size = getToySize(toy.name, boxNumber);
      totalWidth += size.spacing;
    });
    
    // Высота ряда адаптивно относительно viewport
    const centerY = Math.min(window.innerHeight * 0.15, 120);
    
    let startX;
    if (boxNumber === 1) {
      // Для коробки 1: ряд растягивается равномерно по горизонтали относительно ёлки
      const treeContainer = document.getElementById('tree-with-star');
      if (treeContainer) {
        const treeRect = treeContainer.getBoundingClientRect();
        const treeCenterX = treeRect.left + treeRect.width / 2;
        startX = treeCenterX - totalWidth / 2; // центрируем относительно ёлки
      } else {
        // Fallback если ёлка не найдена
        startX = (window.innerWidth - totalWidth) / 2;
      }
    } else {
      // Для коробок 2 и 3: сдвинуто вправо адаптивно
      const offsetRight = Math.min(window.innerWidth * 0.052, 100);
      startX = (window.innerWidth - totalWidth) / 2 + offsetRight;
    }
    
    let currentX = startX;
    availableToys.forEach((toy, index) => {
      const toyElement = document.createElement('img');
      toyElement.className = 'toy';
      toyElement.src = toy.image;
      toyElement.alt = toy.alt;
      toyElement.dataset.toy = toy.name;
      toyElement.dataset.box = boxNumber;
      
      const size = getToySize(toy.name, boxNumber);
      
      // Позиционирование в ряд по центру экрана
      toyElement.style.position = 'absolute';
      toyElement.style.left = `${currentX}px`;
      toyElement.style.top = `${centerY}px`;
      toyElement.style.width = size.width;
      toyElement.style.height = 'auto';
      toyElement.style.transform = 'translateY(-50%)';
      
      // Сохраняем исходный размер для гирлянд и мишуры
      if (isGarlandOrTinsel(toy.name)) {
        if (boxNumber === 2) {
          // Для коробки 2: гирлянды увеличены в ряду, сохраняем исходный размер
          toyElement.dataset.originalWidth = '100px'; // исходный размер (до увеличения)
          toyElement.dataset.originalHeight = '100px'; // исходная высота
        } else {
          // Для коробки 3: мишура обычного размера, сохраняем текущий размер
          toyElement.dataset.originalWidth = '100px'; // исходный размер
          toyElement.dataset.originalHeight = '100px'; // исходная высота
        }
      }
      
      // Анимация всплытия
      toyElement.style.opacity = '0';
      toyElement.style.transform = 'translateY(-50%) scale(0)';
      
      container.appendChild(toyElement);
      
      // Запуск анимации с задержкой
      setTimeout(() => {
        toyElement.style.transition = 'all 0.5s ease-out';
        toyElement.style.opacity = '1';
        toyElement.style.transform = 'translateY(-50%) scale(1)';
      }, index * 100);
      
      currentX += size.spacing;
    });
  }

  // Скрыть игрушки из коробки (только из ряда, не с ёлки)
  function hideToys(boxNumber) {
    const container = createToysContainer();
    if (!container) return;
    
    const toys = container.querySelectorAll(`.toy[data-box="${boxNumber}"]`);
    toys.forEach((toy, index) => {
      // Не удаляем игрушки, которые уже на ёлке
      if (!toy.classList.contains('toy-on-tree')) {
        setTimeout(() => {
          toy.style.transition = 'all 0.3s ease-in';
          toy.style.opacity = '0';
          toy.style.transform = 'translateY(-50%) scale(0)';
          setTimeout(() => {
            toy.remove();
          }, 300);
        }, index * 50);
      }
    });
  }
  
  // Проверить, все ли игрушки из коробки взяты/развешены, и закрыть коробку
  function checkAndCloseBoxIfComplete(boxNumber) {
    const toys = boxContents[boxNumber];
    
    if (boxNumber === 1) {
      // Для коробки 1: проверяем, все ли 6 игрушек взяты из ряда (последняя повешена)
      const container = createToysContainer();
      const toysInRow = container.querySelectorAll(`.toy[data-box="${boxNumber}"]`);
      const toysNotOnTree = Array.from(toysInRow).filter(toy => !toy.classList.contains('toy-on-tree'));
      
      if (toysNotOnTree.length === 0 && boxStates[boxNumber]) {
        // Все игрушки взяты из ряда, закрываем коробку
        const box = document.querySelector(`.box[data-box="${boxNumber}"]`);
        if (box) {
          box.src = `assets/images/box${boxNumber}.png`;
          boxStates[boxNumber] = false;
          hideToys(boxNumber);
        }
      }
    } else if (boxNumber === 2) {
      // Для коробки 2: проверяем, все ли игрушки взяты из ряда (не осталось в ряду)
      const container = createToysContainer();
      const toysInRow = container.querySelectorAll(`.toy[data-box="${boxNumber}"]`);
      const toysNotOnTree = Array.from(toysInRow).filter(toy => !toy.classList.contains('toy-on-tree'));
      
      if (toysNotOnTree.length === 0 && boxStates[boxNumber]) {
        // Все игрушки взяты, закрываем коробку
        const box = document.querySelector(`.box[data-box="${boxNumber}"]`);
        if (box) {
          box.src = `assets/images/box${boxNumber}.png`;
          boxStates[boxNumber] = false;
          hideToys(boxNumber);
        }
      }
    } else if (boxNumber === 3) {
      // Для коробки 3: проверяем, все ли игрушки взяты из ряда (не осталось в ряду)
      // Снежинка вешается как обычная игрушка, мишура - как гирлянда
      const container = createToysContainer();
      const toysInRow = container.querySelectorAll(`.toy[data-box="${boxNumber}"]`);
      const toysNotOnTree = Array.from(toysInRow).filter(toy => !toy.classList.contains('toy-on-tree'));
      
      if (toysNotOnTree.length === 0 && boxStates[boxNumber]) {
        // Все игрушки взяты, закрываем коробку
        const box = document.querySelector(`.box[data-box="${boxNumber}"]`);
        if (box) {
          box.src = `assets/images/box${boxNumber}.png`;
          boxStates[boxNumber] = false;
          hideToys(boxNumber);
        }
      }
    }
  }

  // Переключение состояния коробки
  function toggleBox(boxNumber) {
    // Проверяем, была ли игра запущена
    if (!gameStarted) {
      return; // Не открываем коробки до начала игры
    }
    
    const box = document.querySelector(`.box[data-box="${boxNumber}"]`);
    if (!box) return;

    // Убираем анимацию подпрыгивания при открытии любой коробки
    stopBox1BounceAnimation();

    if (boxStates[boxNumber]) {
      // Закрываем коробку (разрешаем закрытие даже после использования хлопушки)
      box.src = `assets/images/box${boxNumber}.png`;
      hideToys(boxNumber);
      boxStates[boxNumber] = false;
    } else {
      // Проверяем, была ли использована хлопушка (блокируем только открытие новых коробок)
      if (popperUsed) {
        return; // Не открываем новые коробки после использования хлопушки
      }
      // Проверяем ограничения на открытие
      if (boxNumber === 1) {
        // Коробка 1: можно открыть максимум 3 раза (циклы)
        if (box1OpenCount >= MAX_BOX1_OPENS) {
          return; // Не открываем, если достигнут лимит циклов
        }
        // Счетчик увеличим после открытия коробки
      } else if (boxNumber === 2) {
        // Коробка 2: можно открыть максимум 2 раза (циклы)
        if (box2OpenCount >= MAX_BOX2_OPENS) {
          return; // Не открываем, если достигнут лимит циклов
        }
        // Счетчик увеличим после открытия коробки
      } else if (boxNumber === 3) {
        // Коробка 3: можно открыть максимум 2 раза (циклы)
        if (box3OpenCount >= MAX_BOX3_OPENS) {
          return; // Не открываем, если достигнут лимит циклов
        }
        // Счетчик увеличим после открытия коробки
      }
      
      // Открываем коробку
      box.src = `assets/images/open-box${boxNumber}.png`;
      
      // Закрываем другие открытые коробки
      Object.keys(boxStates).forEach(num => {
        if (num != boxNumber && boxStates[num]) {
          const otherBox = document.querySelector(`.box[data-box="${num}"]`);
          if (otherBox) {
            otherBox.src = `assets/images/box${num}.png`;
            hideToys(num);
            boxStates[num] = false;
          }
        }
      });
      
      // Проигрываем звук волшебства (только если звуки включены)
      if (soundsEnabled) {
        sounds.miracle.currentTime = 0;
        sounds.miracle.play().catch(e => console.log("Ошибка воспроизведения miracle:", e));
      }
      
      // Отмечаем, что хотя бы одна коробка была открыта
      atLeastOneBoxOpened = true;
      
      // Обновляем курсор хлопушки, если она теперь доступна
      updateFireworksCursor();
      
      // Увеличиваем счетчик открытий при открытии
      if (boxNumber === 1) {
        box1OpenCount++;
      } else if (boxNumber === 2) {
        box2OpenCount++;
      } else if (boxNumber === 3) {
        box3OpenCount++;
      }
      
      // Показываем игрушки
      showToys(boxNumber);
      boxStates[boxNumber] = true;
    }
  }

  // ========== СЦЕНА 3: УКРАШЕНИЕ ЁЛКИ ==========
  
  // Счетчик игрушек на ёлке (максимум 3 каждого типа)
  const toysOnTree = {};
  
  // Проверка, находится ли точка над ёлкой (строгая проверка, адаптивная)
  function isOverTree(x, y) {
    const treeContainer = document.getElementById('tree-with-star');
    if (!treeContainer) return false;
    
    const treeRect = treeContainer.getBoundingClientRect();
    
    // СТРОГАЯ ПРОВЕРКА: точка должна быть строго внутри границ ёлки
    // Используем адаптивные отступы относительно размера ёлки
    const marginX = Math.max(treeRect.width * 0.12, 30); // 12% ширины или минимум 30px
    const marginY = Math.max(treeRect.height * 0.05, 20); // 5% высоты или минимум 20px
    
    // Проверяем, что точка находится строго внутри границ с отступами
    const isInsideX = x >= (treeRect.left + marginX) && x <= (treeRect.right - marginX);
    const isInsideY = y >= (treeRect.top + marginY) && y <= (treeRect.bottom - marginY);
    
    // Дополнительная проверка: учитываем форму ёлки (треугольник)
    // Ёлка шире внизу, поэтому проверяем пропорционально
    const relativeY = (y - treeRect.top) / treeRect.height; // 0 вверху, 1 внизу
    const maxWidthAtY = treeRect.width * (0.2 + 0.8 * relativeY); // ширина на высоте Y (20% вверху, 100% внизу)
    const centerX = treeRect.left + treeRect.width / 2;
    const distanceFromCenter = Math.abs(x - centerX);
    const isWithinWidth = distanceFromCenter <= (maxWidthAtY / 2 - marginX);
    
    // Только если все проверки пройдены
    return isInsideX && isInsideY && isWithinWidth;
  }
  
  // Получить границы ёлки
  function getTreeBounds() {
    const treeContainer = document.getElementById('tree-with-star');
    if (!treeContainer) return null;
    return treeContainer.getBoundingClientRect();
  }
  
  // Проверка, является ли игрушка гирляндой или мишурой
  function isGarlandOrTinsel(toyName) {
    return toyName.includes('garland') || toyName.includes('tinsel');
  }
  
  // Разместить гирлянду/мишуру на ёлке
  function placeGarlandOrTinsel(toyElement, toyName) {
    const treeBounds = getTreeBounds();
    if (!treeBounds) return false;
    
    const container = createToysContainer();
    
    // Создаем элемент для растянутой гирлянды/мишуры
    // Для гирлянд используем div с background-image, для мишуры - тоже div с background-image
    const isTinselForElement = toyName.includes('tinsel');
    let garlandElement;
    
    // Для всех используем div с background-image
    garlandElement = document.createElement('div');
    garlandElement.className = 'toy-on-tree garland-tinsel';
    garlandElement.dataset.toy = toyName;
    garlandElement.style.position = 'fixed';
    garlandElement.style.margin = '0';
    garlandElement.style.padding = '0';
    garlandElement.style.border = 'none';
    
    // Определяем исходный размер (для коробки 2 возвращаем к исходному размеру)
    // Берем исходный размер ДО увеличения в ряду
    const originalWidth = toyElement.dataset.originalWidth || '100px';
    const originalHeight = toyElement.dataset.originalHeight || '100px';
    const baseWidth = parseInt(originalWidth) || 100;
    const baseHeight = parseInt(originalHeight) || 100;
    
    // Уменьшаем размер гирлянды при размещении (как у игрушек)
    // Для garland-white делаем меньшее уменьшение (30% вместо 50%)
    const isGarlandWhite = toyName.includes('garland-white');
    const reductionFactor = isGarlandWhite ? 0.7 : 0.5; // для garland-white уменьшаем на 30%, для остальных на 50%
    const reducedWidth = baseWidth * reductionFactor;
    const reducedHeight = baseHeight * reductionFactor;
    
    // Определяем, до какого края ёлки растягивать
    // Используем сохраненную позицию мыши или текущую позицию элемента
    const savedMouseX = toyElement.dataset.mouseX;
    const savedMouseY = toyElement.dataset.mouseY;
    const mouseX = savedMouseX ? parseFloat(savedMouseX) : (parseFloat(toyElement.style.left) || treeBounds.left + treeBounds.width / 2);
    const mouseY = savedMouseY ? parseFloat(savedMouseY) : (treeBounds.top + treeBounds.height * 0.4);
    const treeCenterX = treeBounds.left + treeBounds.width / 2;
    const isLeftSide = mouseX < treeCenterX;
    
    // Проверяем, что позиция мыши находится в пределах ёлки
    if (!isOverTree(mouseX, mouseY)) {
      return false; // Не размещаем, если позиция вне ёлки
    }
    
    // Ограничиваем позицию границами ёлки с отступами (адаптивно)
    // Используем увеличенные отступы, чтобы гирлянды не висели в воздухе
    const marginX = Math.max(treeBounds.width * 0.15, 60); // 15% ширины или минимум 60px
    const marginY = Math.max(treeBounds.height * 0.06, 30); // 6% высоты или минимум 30px
    
    // Уменьшаем размер мишуры для создания эффекта тонкой ленты
    const isTinsel = toyName.includes('tinsel');
    // Для гирлянд используем уменьшенную высоту (50% от исходной)
    // Для мишуры уменьшенная высота (30% от исходной)
    const finalHeight = isTinsel ? Math.max(30, reducedHeight * 0.6) : reducedHeight; // для мишуры еще больше уменьшаем, для гирлянд используем уменьшенную высоту
    const heightForPosition = finalHeight; // используем для расчета позиции
    
    // Ограничиваем вертикальную позицию строго в пределах ёлки
    // Используем позицию мыши для определения Y-координаты
    const minTop = treeBounds.top + marginY;
    const maxTop = treeBounds.bottom - marginY - heightForPosition;
    const desiredTop = Math.max(minTop, Math.min(mouseY - heightForPosition / 2, maxTop));
    
    // Финальная проверка вертикальной позиции
    if (desiredTop < minTop || desiredTop + heightForPosition > treeBounds.bottom - marginY) {
      return false; // Не размещаем, если выходит за границы
    }
    
    // Учитываем треугольную форму ёлки: на высоте Y ёлка имеет определенную ширину
    const relativeY = (desiredTop - treeBounds.top) / treeBounds.height;
    const maxWidthAtY = treeBounds.width * (0.2 + 0.8 * relativeY); // ширина на высоте Y
    const centerX = treeBounds.left + treeBounds.width / 2;
    
    // Позиционируем гирлянду строго в пределах ёлки с учетом её треугольной формы
    // Гирлянда растягивается от левого до правого края ёлки на этой высоте
    // Используем увеличенные отступы для более строгого ограничения
    const leftBound = centerX - (maxWidthAtY / 2 - marginX);
    const rightBound = centerX + (maxWidthAtY / 2 - marginX);
    const leftPos = Math.max(treeBounds.left + marginX, leftBound);
    const rightPos = Math.min(treeBounds.right - marginX, rightBound);
    const finalWidth = rightPos - leftPos;
    
    // Финальная проверка: убеждаемся, что гирлянда не выходит за границы на этой высоте
    if (leftPos < (centerX - maxWidthAtY / 2 + marginX) || 
        leftPos + finalWidth > (centerX + maxWidthAtY / 2 - marginX) ||
        finalWidth <= 0) {
      return false; // Не размещаем, если выходит за границы
    }
    
    // Устанавливаем ширину контейнера (растягивается по длине до границ елки)
    garlandElement.style.width = `${finalWidth}px`;
    
    // Высота устанавливается ниже для гирлянд и мишуры
    
    // Используем уменьшенный размер мишуры и повторение для создания эффекта ленты
    const originalSrc = toyElement.src;
    
    if (isTinsel) {
      // Для мишуры: загружаем изображение отдельно, чтобы получить его РЕАЛЬНЫЕ размеры
      // Используем реальную ширину изображения БЕЗ масштабирования
      const img = new Image();
      img.src = originalSrc;
      
      // Функция для установки правильного размера фона
      const setTinselBackgroundSize = () => {
        // Получаем РЕАЛЬНЫЕ размеры исходного изображения (не масштабированного)
        const realNaturalWidth = img.naturalWidth;
        const realNaturalHeight = img.naturalHeight;
        
        // Проблема: когда мы указываем фиксированную высоту в background-size,
        // браузер масштабирует изображение, чтобы оно соответствовало этим размерам.
        // Решение: используем реальную ширину изображения и НЕ указываем высоту вообще
        // Это означает, что ширина будет исходной, а высота будет автоматически вычислена пропорционально
        // Элемент обрежет высоту до tinselHeight через overflow: hidden и height элемента
        // Изображение НЕ будет масштабироваться, а будет повторяться в исходном размере по ширине
        // Используем только ширину - высота будет вычислена автоматически пропорционально
        garlandElement.style.backgroundSize = `${realNaturalWidth}px`; // только ширина = исходный размер, высота = auto (пропорционально)
      };
      
      // Устанавливаем настройки фона для мишуры
      garlandElement.style.backgroundImage = `url('${originalSrc}')`;
      garlandElement.style.backgroundRepeat = 'repeat-x'; // повторяем по горизонтали для достраивания
      garlandElement.style.backgroundPosition = '0 center'; // начинаем с левого края
      
      // Если изображение уже загружено, сразу устанавливаем размер
      if (img.complete && img.naturalWidth > 0) {
        setTinselBackgroundSize();
      } else {
        // Иначе ждем загрузки
        img.onload = setTinselBackgroundSize;
      }
    } else {
      // Для гирлянд: используем уменьшенный размер (50% от исходного)
      garlandElement.style.backgroundImage = `url('${originalSrc}')`;
      garlandElement.style.backgroundRepeat = 'repeat-x'; // повторяем по горизонтали для достраивания
      garlandElement.style.backgroundPosition = '0 center'; // начинаем с левого края
      
      // Используем уменьшенную ширину для backgroundSize (50% от исходной)
      // Это обеспечит повторение изображения в уменьшенном размере по ширине
      garlandElement.style.backgroundSize = `${reducedWidth}px auto`; // ширина = уменьшенный размер (50%), высота = пропорционально
      
      // Устанавливаем высоту элемента на основе уменьшенной высоты
      garlandElement.style.height = `${reducedHeight}px`;
    }
    
    garlandElement.style.display = 'block';
    garlandElement.style.overflow = 'hidden'; // скрываем переполнение
    garlandElement.style.boxSizing = 'border-box'; // учитываем padding и border в размерах
    
    // Устанавливаем позицию
    garlandElement.style.left = `${leftPos}px`;
    garlandElement.style.top = `${desiredTop}px`;
    garlandElement.style.transformOrigin = 'left center';
    garlandElement.style.zIndex = '10';
    garlandElement.style.pointerEvents = 'none';
    
    // Небольшой наклон для естественности (только если помещается)
    // Для мишуры делаем более горизонтальное расположение
    const angle = isTinsel ? (isLeftSide ? -2 : 2) : (isLeftSide ? -5 : 5); // для мишуры меньший угол
    garlandElement.style.transform = `rotate(${angle}deg)`;
    garlandElement.style.animation = 'swayGarland 3s ease-in-out';
    
    // Останавливаем покачивание через 3 секунды
    setTimeout(() => {
      garlandElement.style.animation = 'none';
    }, 3000);
    
    container.appendChild(garlandElement);
    return true;
  }
  
  // Разместить обычную игрушку на ёлке
  function placeToyOnTree(toyElement, x, y) {
    // Сохраняем текущий размер игрушки перед размещением
    // Используем offsetWidth для получения реального размера элемента
    // Если размер не определен, используем значение по умолчанию 80px (после уменьшения на 20%)
    const currentWidth = toyElement.offsetWidth || parseInt(toyElement.style.width) || 80;
    const currentHeight = toyElement.offsetHeight || parseInt(toyElement.style.height) || 80;
    
    // Проверяем, является ли это мишурой или гирляндой
    const toyName = toyElement.dataset.toy || '';
    const isTinsel = toyName.includes('tinsel');
    const isGarland = toyName.includes('garland');
    
    // Для мишуры делаем маленькой (размером с кружок-маркер)
    // Для гирлянд - оставляем как есть (они обрабатываются отдельно в placeGarlandOrTinsel)
    // Для обычных игрушек - уменьшаем на 60% (коэффициент 0.4)
    let newWidth, newHeight;
    if (isTinsel) {
      newWidth = 20; // мишура становится размером 20px (как кружок)
      newHeight = 20;
    } else if (isGarland) {
      // Гирлянды обрабатываются в placeGarlandOrTinsel, здесь не должны попадать
      newWidth = currentWidth;
      newHeight = currentHeight;
    } else {
      // Обычные игрушки уменьшаем на 50% (коэффициент 0.5)
      // Сохраняем пропорции изображения
      const aspectRatio = currentHeight / currentWidth; // соотношение сторон
      newWidth = Math.round(currentWidth * 0.5); // коэффициент 0.5
      newHeight = Math.round(newWidth * aspectRatio); // вычисляем высоту пропорционально ширине
    }
    
    // Применяем стили принудительно
    toyElement.classList.add('toy-on-tree');
    toyElement.style.position = 'fixed';
    toyElement.style.left = `${x - newWidth / 2}px`; // центрируем относительно курсора
    toyElement.style.top = `${y - newHeight / 2}px`;
    toyElement.style.width = `${newWidth}px`;
    toyElement.style.height = `${newHeight}px`; // Устанавливаем конкретную высоту для сохранения пропорций
    toyElement.style.objectFit = 'contain'; // Сохраняем пропорции изображения
    toyElement.style.transform = 'none';
    toyElement.style.cursor = isTinsel ? 'default' : 'default';
    toyElement.style.pointerEvents = isTinsel ? 'auto' : 'none'; // для мишуры разрешаем взаимодействие
    toyElement.style.animation = 'sway 3s ease-in-out';
    toyElement.style.zIndex = '10';
    
    // Для мишуры: сохраняем исходные размеры для растягивания
    if (isTinsel) {
      toyElement.dataset.originalTinselWidth = currentWidth.toString();
      toyElement.dataset.originalTinselHeight = currentHeight.toString();
      toyElement.dataset.originalTinselSrc = toyElement.src;
    }
    
    // Останавливаем покачивание через 3 секунды
    setTimeout(() => {
      toyElement.style.animation = 'none';
    }, 3000);
  }
  
  // Преобразовать мишуру в растягиваемый элемент с background-image
  function convertTinselToStretchable(tinselElement) {
    const originalSrc = tinselElement.src || tinselElement.dataset.originalTinselSrc;
    const originalWidth = parseInt(tinselElement.dataset.originalTinselWidth) || tinselElement.offsetWidth || 100;
    const originalHeight = parseInt(tinselElement.dataset.originalTinselHeight) || tinselElement.offsetHeight || 100;
    
    // Сохраняем текущие стили
    const currentLeft = tinselElement.style.left;
    const currentTop = tinselElement.style.top;
    const currentWidth = tinselElement.style.width || `${tinselElement.offsetWidth}px`;
    const currentHeight = tinselElement.style.height || `${tinselElement.offsetHeight}px`;
    const currentZIndex = tinselElement.style.zIndex || '10';
    
    // Если это уже div, просто обновляем стили
    if (tinselElement.tagName === 'DIV') {
      tinselElement.style.backgroundImage = `url('${originalSrc}')`;
      tinselElement.style.backgroundRepeat = 'repeat-x';
      tinselElement.style.backgroundPosition = '0 center';
      tinselElement.style.backgroundSize = `${originalWidth}px auto`;
      tinselElement.style.overflow = 'hidden';
      tinselElement.style.boxSizing = 'border-box';
      return tinselElement;
    }
    
    // Создаем новый div элемент
    const newTinsel = document.createElement('div');
    newTinsel.className = tinselElement.className;
    newTinsel.dataset.toy = tinselElement.dataset.toy;
    newTinsel.dataset.box = tinselElement.dataset.box;
    newTinsel.dataset.originalTinselWidth = originalWidth.toString();
    newTinsel.dataset.originalTinselHeight = originalHeight.toString();
    newTinsel.dataset.originalTinselSrc = originalSrc;
    
    // Устанавливаем стили
    newTinsel.style.position = 'fixed';
    newTinsel.style.left = currentLeft;
    newTinsel.style.top = currentTop;
    newTinsel.style.width = currentWidth;
    newTinsel.style.height = currentHeight;
    newTinsel.style.zIndex = currentZIndex;
    newTinsel.style.backgroundImage = `url('${originalSrc}')`;
    newTinsel.style.backgroundRepeat = 'repeat-x';
    newTinsel.style.backgroundPosition = '0 center';
    newTinsel.style.backgroundSize = `${originalWidth}px auto`; // исходная ширина, высота пропорционально
    newTinsel.style.pointerEvents = 'auto';
    newTinsel.style.cursor = 'default';
    newTinsel.style.overflow = 'hidden';
    newTinsel.style.boxSizing = 'border-box';
    
    // Заменяем старый элемент новым
    if (tinselElement.parentNode) {
      tinselElement.parentNode.replaceChild(newTinsel, tinselElement);
    } else {
      document.body.appendChild(newTinsel);
    }
    
    return newTinsel;
  }
  
  // Добавить ручку для растягивания мишуры
  function addTinselResizeHandle(tinselElement, toyName) {
    const treeBounds = getTreeBounds();
    if (!treeBounds) return;
    
    // Получаем начальную позицию мишуры (центр маленькой мишуры)
    const tinselRect = tinselElement.getBoundingClientRect();
    const startX = tinselRect.left + tinselRect.width / 2;
    const startY = tinselRect.top + tinselRect.height / 2;
    
    // Создаем контейнер для сегментов мишуры
    const tinselContainer = document.createElement('div');
    tinselContainer.className = 'tinsel-container';
    tinselContainer.style.position = 'fixed';
    tinselContainer.style.left = '0';
    tinselContainer.style.top = '0';
    tinselContainer.style.width = '100%';
    tinselContainer.style.height = '100%';
    tinselContainer.style.pointerEvents = 'none';
    tinselContainer.style.zIndex = '10';
    
    // Скрываем исходную мишуру (она маленькая, размером с кружок)
    tinselElement.style.display = 'none';
    
    // Сохраняем путь движения маркера (начинаем с центра мишуры)
    const path = [{ x: startX, y: startY }];
    
    // Создаем ручку для растягивания (маленький круг)
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'tinsel-resize-handle';
    resizeHandle.dataset.toy = toyName;
    resizeHandle.style.position = 'fixed';
    resizeHandle.style.width = '20px';
    resizeHandle.style.height = '20px';
    resizeHandle.style.borderRadius = '50%';
    resizeHandle.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    resizeHandle.style.border = '2px solid rgba(0, 0, 0, 0.7)';
    resizeHandle.style.cursor = 'move';
    resizeHandle.style.zIndex = '1000';
    resizeHandle.style.pointerEvents = 'auto';
    resizeHandle.style.boxSizing = 'border-box';
    resizeHandle.style.transform = 'translate(-50%, -50%)';
    
    // Начальная позиция ручки - в центре мишуры (она маленькая)
    resizeHandle.style.left = `${startX}px`;
    resizeHandle.style.top = `${startY}px`;
    
    // Добавляем начальную точку в путь (позиция ручки)
    path.push({ x: startX, y: startY });
    
    document.body.appendChild(tinselContainer);
    document.body.appendChild(resizeHandle);
    
    // Сохраняем ссылку на ручку и контейнер в элементе мишуры
    tinselElement.dataset.resizeHandle = 'true';
    tinselElement.dataset.tinselContainer = 'true';
    tinselElement.dataset.startX = startX.toString();
    tinselElement.dataset.startY = startY.toString();
    
    // Функция для создания сегмента мишуры
    const createTinselSegment = (x1, y1, x2, y2, originalSrc, originalWidth, originalHeight) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      const segment = document.createElement('div');
      segment.className = 'tinsel-segment';
      segment.style.position = 'fixed';
      segment.style.left = `${x1}px`;
      segment.style.top = `${y1 - originalHeight / 2}px`;
      segment.style.width = `${distance}px`;
      segment.style.height = `${originalHeight}px`;
      segment.style.backgroundImage = `url('${originalSrc}')`;
      segment.style.backgroundRepeat = 'repeat-x';
      segment.style.backgroundPosition = '0 center';
      // Используем только ширину в background-size, чтобы изображение НЕ масштабировалось
      // Высота будет автоматически вычислена пропорционально, но мы обрежем её через height элемента
      // Это предотвратит искажение и "густоту" мишуры
      segment.style.backgroundSize = `${originalWidth}px`; // только ширина, без указания высоты
      segment.style.transform = `rotate(${angle}deg)`;
      segment.style.transformOrigin = 'left center';
      segment.style.overflow = 'hidden';
      segment.style.boxSizing = 'border-box';
      segment.style.pointerEvents = 'none';
      
      return segment;
    };
    
    // Используем сохраненные размеры из dataset (это размеры из ряда, не реальные размеры изображения)
    const originalSrc = tinselElement.dataset.originalTinselSrc;
    const originalWidth = parseInt(tinselElement.dataset.originalTinselWidth) || 100;
    const originalHeight = parseInt(tinselElement.dataset.originalTinselHeight) || 100;
    
    // Функция для обновления мишуры вдоль пути
    const updateTinselPath = () => {
      // Очищаем контейнер
      tinselContainer.innerHTML = '';
      
      if (path.length < 2) return;
      
      // Создаем сегменты мишуры между точками пути
      for (let i = 0; i < path.length - 1; i++) {
        const segment = createTinselSegment(
          path[i].x,
          path[i].y,
          path[i + 1].x,
          path[i + 1].y,
          originalSrc,
          originalWidth,
          originalHeight
        );
        tinselContainer.appendChild(segment);
      }
    };
    
    // Инициализируем мишуру
    updateTinselPath();
    
    // Обработчики для растягивания
    let isResizing = false;
    let lastPoint = null;
    
    resizeHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      isResizing = true;
      lastPoint = { x: e.clientX, y: e.clientY };
      document.body.style.cursor = 'move';
      document.body.style.userSelect = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (isResizing) {
        const newX = e.clientX;
        const newY = e.clientY;
        
        // Проверяем, находится ли позиция в пределах ёлки
        if (isOverTree(newX, newY)) {
          // Добавляем точку в путь, если мышь переместилась достаточно далеко
          if (!lastPoint || Math.sqrt(Math.pow(newX - lastPoint.x, 2) + Math.pow(newY - lastPoint.y, 2)) > 5) {
            path.push({ x: newX, y: newY });
            lastPoint = { x: newX, y: newY };
            
            // Обновляем позицию ручки
            resizeHandle.style.left = `${newX}px`;
            resizeHandle.style.top = `${newY}px`;
            
            // Обновляем мишуру вдоль пути
            updateTinselPath();
          }
        }
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        // Фиксируем мишуру и удаляем ручку
        tinselElement.style.pointerEvents = 'none';
        tinselElement.dataset.resizeHandle = 'false';
        
        // Удаляем ручку
        if (resizeHandle && resizeHandle.parentNode) {
          resizeHandle.parentNode.removeChild(resizeHandle);
        }
        
        // Удаляем исходную мишуру (она скрыта)
        if (tinselElement.parentNode) {
          tinselElement.parentNode.removeChild(tinselElement);
        }
      }
    });
  }
  
  // Вернуть игрушку в ряд на исходное место
  function returnToyToRow(toyElement, boxNumber) {
    const container = createToysContainer();
    
    // Убеждаемся, что игрушка в контейнере
    if (!container.contains(toyElement)) {
      container.appendChild(toyElement);
    }
    
    // Если есть сохраненная исходная позиция, возвращаем на неё
    if (originalPosition && originalPosition.left && originalPosition.top) {
      toyElement.style.transition = 'all 0.3s ease-out';
      toyElement.style.position = originalPosition.position || 'absolute';
      toyElement.style.left = originalPosition.left;
      toyElement.style.top = originalPosition.top;
      toyElement.style.transform = originalPosition.transform || 'translateY(-50%)';
      toyElement.style.width = originalPosition.width || '80px';
      toyElement.style.cursor = 'grab';
      toyElement.style.animation = 'none';
      toyElement.style.zIndex = '100';
      toyElement.classList.remove('toy-on-tree');
      return;
    }
    
    // Если исходная позиция не сохранена, вычисляем позицию заново
    const toys = boxContents[boxNumber];
    const toyName = toyElement.dataset.toy;
    
    // Определяем размер для игрушки
    const getToySize = (name, boxNum) => {
      if (isGarlandOrTinsel(name) && boxNum === 2) {
        return { width: '120px', spacing: 136 }; // гирлянды из коробки 2 увеличены, затем уменьшены на 20%
      }
      return { width: '80px', spacing: 96 }; // все остальные игрушки уменьшены на 20%
    };
    
    // Находим все игрушки этого типа в ряду (не на ёлке)
    const toysInRow = Array.from(container.querySelectorAll(`.toy[data-toy="${toyName}"][data-box="${boxNumber}"]`))
      .filter(t => !t.classList.contains('toy-on-tree'));
    
    // Если игрушка уже в ряду, находим её индекс
    let toyIndex = toysInRow.indexOf(toyElement);
    
    // Если игрушка не в ряду, добавляем её в конец
    if (toyIndex === -1) {
      toyIndex = toysInRow.length;
    }
    
    // Вычисляем позицию с учетом размеров всех игрушек
    let totalWidth = 0;
    const availableToys = boxNumber === 1 ? toys : toys.filter(toy => {
      const count = toysOnTree[toy.name] || 0;
      return count < 3;
    });
    
    // Высота ряда адаптивно
    const centerY = Math.min(window.innerHeight * 0.15, 120);
    
    let startX;
    if (boxNumber === 1) {
      // Для коробки 1: ряд относительно ёлки
      const treeContainer = document.getElementById('tree-with-star');
      if (treeContainer) {
        const treeRect = treeContainer.getBoundingClientRect();
        const treeCenterX = treeRect.left + treeRect.width / 2;
        availableToys.forEach(toy => {
          const size = getToySize(toy.name, boxNumber);
          totalWidth += size.spacing;
        });
        startX = treeCenterX - totalWidth / 2;
      } else {
        availableToys.forEach(toy => {
          const size = getToySize(toy.name, boxNumber);
          totalWidth += size.spacing;
        });
        startX = (window.innerWidth - totalWidth) / 2;
      }
    } else {
      // Для коробок 2 и 3: сдвинуто вправо адаптивно
      availableToys.forEach(toy => {
        const size = getToySize(toy.name, boxNumber);
        totalWidth += size.spacing;
      });
      const offsetRight = Math.min(window.innerWidth * 0.052, 100);
      startX = (window.innerWidth - totalWidth) / 2 + offsetRight;
    }
    
    // Вычисляем позицию для этой конкретной игрушки
    let currentX = startX;
    for (let i = 0; i < toyIndex && i < availableToys.length; i++) {
      const size = getToySize(availableToys[i].name, boxNumber);
      currentX += size.spacing;
    }
    
    const size = getToySize(toyName, boxNumber);
    
    toyElement.style.transition = 'all 0.3s ease-out';
    toyElement.style.position = 'absolute';
    toyElement.style.left = `${currentX}px`;
    toyElement.style.top = `${centerY}px`;
    toyElement.style.transform = 'translateY(-50%)';
    toyElement.style.width = size.width;
    toyElement.style.cursor = 'grab';
    toyElement.style.animation = 'none';
    toyElement.style.zIndex = '100';
    toyElement.classList.remove('toy-on-tree');
  }
  
  // Перетаскивание игрушек
  let draggedElement = null;
  let offsetX = 0;
  let offsetY = 0;
  let originalPosition = null;

  function initDragAndDrop() {
    document.addEventListener('mousedown', (e) => {
      // Проверяем, была ли игра запущена
      if (!gameStarted) {
        return; // Не позволяем перетаскивать игрушки до начала игры
      }
      
      if (e.target.classList.contains('toy') && !e.target.classList.contains('toy-on-tree')) {
        draggedElement = e.target;
        const rect = draggedElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        // Сохраняем исходную позицию и стили для точного возврата
        originalPosition = {
          left: draggedElement.style.left,
          top: draggedElement.style.top,
          transform: draggedElement.style.transform,
          width: draggedElement.style.width,
          position: draggedElement.style.position || 'absolute'
        };
        
        draggedElement.style.cursor = 'grabbing';
        draggedElement.style.zIndex = '1000';
        draggedElement.style.transition = 'none';
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (draggedElement) {
        draggedElement.style.position = 'fixed';
        draggedElement.style.left = `${e.clientX - offsetX}px`;
        draggedElement.style.top = `${e.clientY - offsetY}px`;
        draggedElement.style.transform = 'none';
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (draggedElement) {
        const toyName = draggedElement.dataset.toy;
        const boxNumber = parseInt(draggedElement.dataset.box);
        const isGarland = isGarlandOrTinsel(toyName);
        
        // СТРОГАЯ ПРОВЕРКА: игрушки можно вешать ТОЛЬКО над ёлкой
        const isOverTreeArea = isOverTree(e.clientX, e.clientY);
        
        if (!isOverTreeArea) {
          // Отпущено вне ёлки, возвращаем в ряд на исходное место
          returnToyToRow(draggedElement, boxNumber);
          
          // Сбрасываем состояние перетаскивания и выходим
          draggedElement.style.cursor = 'grab';
          draggedElement.style.zIndex = '100';
          draggedElement = null;
          originalPosition = null;
          return; // Выходим, не продолжаем обработку
        }
        
        // Если над ёлкой - продолжаем размещение
        // Проверяем ограничение (максимум 3 экземпляра)
        if (!toysOnTree[toyName]) {
          toysOnTree[toyName] = 0;
        }
        
        if (toysOnTree[toyName] < 3) {
          toysOnTree[toyName]++;
          
          // Проигрываем звук вешания (только если звуки включены)
          if (soundsEnabled) {
            sounds.hanging.currentTime = 0;
            sounds.hanging.play().catch(err => console.log("Ошибка воспроизведения hanging:", err));
          }
          
          if (isGarland) {
            const isTinsel = toyName.includes('tinsel');
            if (isTinsel) {
              // Для мишуры: размещаем как обычную игрушку, затем добавляем возможность растягивания
              placeToyOnTree(draggedElement, e.clientX, e.clientY);
              // Преобразуем мишуру в div с background-image для повторения
              const newTinsel = convertTinselToStretchable(draggedElement);
              // Добавляем ручку для растягивания мишуры
              addTinselResizeHandle(newTinsel, toyName);
            } else {
              // Для гирлянд: размещаем как раньше
              // Сохраняем позицию мыши для определения стороны ёлки и высоты
              draggedElement.dataset.mouseX = e.clientX.toString();
              draggedElement.dataset.mouseY = e.clientY.toString();
              
              const placed = placeGarlandOrTinsel(draggedElement, toyName);
              if (!placed) {
                // Если размещение не удалось, возвращаем в ряд
                returnToyToRow(draggedElement, boxNumber);
                toysOnTree[toyName]--; // откатываем счетчик
                draggedElement.style.cursor = 'grab';
                draggedElement.style.zIndex = '100';
                draggedElement = null;
                originalPosition = null;
                return;
              }
              
              draggedElement.remove();
            }
          } else {
            // Размещаем обычную игрушку
            placeToyOnTree(draggedElement, e.clientX, e.clientY);
          }
          
          // Удаляем игрушку из ряда, если достигнут лимит
          if (toysOnTree[toyName] >= 3) {
            const toysInRow = document.querySelectorAll(`.toy[data-toy="${toyName}"][data-box="${boxNumber}"]`);
            toysInRow.forEach(toy => {
              if (!toy.classList.contains('toy-on-tree') && toy !== draggedElement) {
                toy.remove();
              }
            });
          }
          
          // Проверяем, все ли игрушки из коробки взяты/развешены
          // Для коробок 2 и 3 проверяем сразу после взятия игрушки
          if (boxNumber === 2 || boxNumber === 3) {
            setTimeout(() => {
              checkAndCloseBoxIfComplete(boxNumber);
            }, 100);
          } else {
            checkAndCloseBoxIfComplete(boxNumber);
          }
        } else {
          // Лимит достигнут, возвращаем в ряд
          returnToyToRow(draggedElement, boxNumber);
        }
        
        // Сбрасываем состояние перетаскивания только после успешного размещения
        if (draggedElement) {
          draggedElement.style.cursor = 'grab';
          draggedElement.style.zIndex = '100';
          draggedElement = null;
          originalPosition = null;
        }
      }
    });
  }

  // Инициализация обработчиков коробок
  function initBoxHandlers() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
      // Устанавливаем курсор в зависимости от состояния игры
      updateBoxCursors();
      
      box.addEventListener('click', (e) => {
        e.stopPropagation();
        const boxNumber = parseInt(box.dataset.box);
        // Убираем анимацию подпрыгивания при клике на любую коробку
        stopBox1BounceAnimation();
        toggleBox(boxNumber);
      });
    });
  }
  
  // Обновление курсоров коробок в зависимости от состояния игры и использования хлопушки
  function updateBoxCursors() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
      if (!gameStarted || popperUsed) {
        box.style.cursor = 'not-allowed';
      } else {
        box.style.cursor = 'pointer';
      }
    });
  }

  // ========== КНОПКА "ИГРАТЬ СНАЧАЛА" ==========
  
  // Функция сброса игры к начальному состоянию
  function restartGame() {
    // Удаляем все контейнеры с мишурой (внутри них находятся все сегменты)
    const tinselContainers = document.querySelectorAll('.tinsel-container');
    tinselContainers.forEach(container => {
      // Удаляем все сегменты внутри контейнера
      const segments = container.querySelectorAll('.tinsel-segment');
      segments.forEach(segment => segment.remove());
      // Удаляем сам контейнер
      container.remove();
    });
    
    // Удаляем все ручки для растягивания мишуры
    const resizeHandles = document.querySelectorAll('.tinsel-resize-handle');
    resizeHandles.forEach(handle => handle.remove());
    
    // Удаляем все сегменты мишуры, которые могут быть вне контейнеров
    const tinselSegments = document.querySelectorAll('.tinsel-segment');
    tinselSegments.forEach(segment => segment.remove());
    
    // Удаляем все скрытые элементы мишуры (исходные img элементы)
    const hiddenTinsels = document.querySelectorAll('.toy-on-tree[data-toy*="tinsel"]');
    hiddenTinsels.forEach(tinsel => {
      if (tinsel.style.display === 'none' || tinsel.tagName === 'IMG') {
        tinsel.remove();
      }
    });
    
    // Удаляем все конфетти
    const confetti = document.querySelectorAll('.confetti');
    confetti.forEach(c => c.remove());
    
    // Удаляем все лампочки с елки
    const bulbs = document.querySelectorAll('.tree-bulb');
    bulbs.forEach(bulb => bulb.remove());
    
    // Убираем эффект свечения со звезды
    const star = document.getElementById('star');
    if (star) {
      star.classList.remove('lit');
    }
    
    // Убираем эффект переливания с гирлянды на камине
    const decoration = document.getElementById('fireplace-decoration');
    if (decoration) {
      decoration.classList.remove('lit');
    }
    
    // Удаляем все белые точки с гирлянды
    const decorationBulbs = document.querySelectorAll('.decoration-bulb');
    decorationBulbs.forEach(bulb => bulb.remove());
    
    // Восстанавливаем изображение хлопушки
    const fireworks = document.getElementById('fireworks');
    if (fireworks) {
      fireworks.src = 'assets/images/fireworks.png';
      // Убираем класс disabled при перезапуске (игра будет запущена)
      fireworks.classList.remove('disabled');
    }
    
    // Убираем анимацию подпрыгивания с box1
    stopBox1BounceAnimation();
    
    // Сбрасываем флаг открытия коробок и счетчик взрывов хлопушки
    atLeastOneBoxOpened = false;
    fireworksExplosionCount = 0;
    
    // Сбрасываем флаг использования хлопушки
    popperUsed = false;
    
    // Обновляем курсор хлопушки
    updateFireworksCursor();
    
    // Обновляем курсоры коробок (восстанавливаем доступность)
    updateBoxCursors();
    
    // Останавливаем все звуки
    sounds.fireplace.pause();
    sounds.music.pause();
    sounds.fireplace.currentTime = 0;
    sounds.music.currentTime = 0;
    
    // Закрываем все коробки
    Object.keys(boxStates).forEach(boxNumber => {
      const box = document.querySelector(`.box[data-box="${boxNumber}"]`);
      if (box) {
        box.src = `assets/images/box${boxNumber}.png`;
        boxStates[boxNumber] = false;
      }
    });
    
    // Удаляем все игрушки из контейнера (с ёлки и из ряда)
    const container = createToysContainer();
    if (container) {
      container.innerHTML = '';
    }
    
    // Удаляем все гирлянды и мишуру, которые были добавлены напрямую в body
    const garlandsOnTree = document.querySelectorAll('.garland-tinsel');
    garlandsOnTree.forEach(garland => {
      garland.remove();
    });
    
    // Удаляем все игрушки на ёлке, которые были добавлены напрямую в body
    const toysOnTreeElements = document.querySelectorAll('.toy-on-tree');
    toysOnTreeElements.forEach(toy => {
      toy.remove();
    });
    
    // Сбрасываем счетчики игрушек на ёлке
    Object.keys(toysOnTree).forEach(key => {
      delete toysOnTree[key];
    });
    
    // Сбрасываем счетчики открытий
    box1OpenCount = 0;
    box2OpenCount = 0;
    box3OpenCount = 0;
    
    // Перезапускаем фоновые звуки
    // Сначала запускаем звук камина
    sounds.fireplace.play().catch(e => {
      console.log("Автовоспроизведение fireplace заблокировано:", e);
    });
    
    // Затем запускаем основную фоновую музыку с небольшой задержкой
    setTimeout(() => {
      sounds.music.play().catch(e => {
        console.log("Автовоспроизведение music заблокировано:", e);
      });
    }, 500); // задержка 500мс после звука камина
    
    // Убеждаемся, что звуки включены при перезапуске
    soundsEnabled = true;
    
    // Убеждаемся, что анимации камина и снежинок запущены
    const fireplaceFlame = document.getElementById('fireplace-flame');
    if (fireplaceFlame) {
      fireplaceFlame.classList.add('animated');
    }
    
    const snowflakes = document.querySelectorAll('.snowflake');
    snowflakes.forEach(snowflake => {
      snowflake.classList.add('animated');
    });
    
    // Запускаем анимацию подпрыгивания для box1 через 8 секунд после перезапуска
    setTimeout(() => {
      startBox1BounceAnimation();
    }, 8000);
    
    // Обновляем текст кнопки звуков
    setTimeout(() => {
      updateButtonText();
    }, 500);
  }
  
  // Инициализация кнопки "Играть" / "Играть сначала"
  function initRestartButton() {
    const restartBtn = document.getElementById('restart-game');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        if (!gameStarted) {
          // Первый запуск игры
          startGame();
        } else {
          // Перезапуск игры
          restartGame();
        }
      });
    }
  }

  // ========== АНИМАЦИЯ ХЛОПУШКИ ==========
  
  // Функция для обновления курсора хлопушки
  function updateFireworksCursor() {
    const fireworks = document.getElementById('fireworks');
    if (!fireworks) return;
    
    // Если игра не запущена, курсор должен быть not-allowed и отключаем hover
    if (!gameStarted) {
      fireworks.classList.add('disabled');
      fireworks.style.cursor = 'not-allowed';
      return;
    }
    
    // Убираем класс disabled при запуске игры
    fireworks.classList.remove('disabled');
    
    if (!atLeastOneBoxOpened || fireworksExplosionCount >= MAX_FIREWORKS_EXPLOSIONS) {
      fireworks.style.cursor = 'not-allowed';
    } else {
      fireworks.style.cursor = 'pointer';
    }
  }
  
  function initFireworks() {
    const fireworks = document.getElementById('fireworks');
    if (!fireworks) return;
    
    // Устанавливаем начальный курсор в зависимости от состояния
    // Добавляем класс disabled до начала игры
    if (!gameStarted) {
      fireworks.classList.add('disabled');
    }
    updateFireworksCursor();
    
    let isAnimating = false;
    
    fireworks.addEventListener('click', () => {
      // Проверяем, была ли игра запущена
      if (!gameStarted) {
        return; // Не взрываем хлопушку до начала игры
      }
      
      // Проверяем, была ли открыта хотя бы одна коробка
      if (!atLeastOneBoxOpened) {
        return; // Не взрываем, если ни одна коробка не была открыта
      }
      
      // Проверяем лимит взрывов
      if (fireworksExplosionCount >= MAX_FIREWORKS_EXPLOSIONS) {
        return; // Не взрываем, если достигнут лимит
      }
      
      if (isAnimating) return; // Предотвращаем повторные клики во время анимации
      isAnimating = true;
      
      // Увеличиваем счетчик взрывов
      fireworksExplosionCount++;
      
      // Устанавливаем флаг, что хлопушка была использована (после первого использования)
      if (fireworksExplosionCount === 1) {
        popperUsed = true;
        // Закрываем все открытые коробки
        Object.keys(boxStates).forEach(boxNum => {
          if (boxStates[boxNum]) {
            const box = document.querySelector(`.box[data-box="${boxNum}"]`);
            if (box) {
              box.src = `assets/images/box${boxNum}.png`;
              hideToys(parseInt(boxNum));
              boxStates[boxNum] = false;
            }
          }
        });
        // Обновляем курсоры коробок - они становятся недоступны
        updateBoxCursors();
      }
      
      // Получаем позицию хлопушки
      const rect = fireworks.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;
      
      // Добавляем класс дрожания (быстрое)
      fireworks.style.animation = 'shake 1s ease-in-out';
      fireworks.style.cursor = 'not-allowed';
      
      // После дрожания - взрыв
      setTimeout(() => {
        // Воспроизводим звук (только если звуки включены)
        if (soundsEnabled) {
          sounds.hlopushka.currentTime = 0;
          sounds.hlopushka.play().catch(e => console.log("Ошибка воспроизведения hlopushka:", e));
        }
        
        // Меняем изображение на открытую хлопушку
        fireworks.src = 'assets/images/fireworks_open.png';
        
        // Взрыв (хлопушка остается видимой, но с эффектом)
        fireworks.style.transform = 'scale(1.2)';
        fireworks.style.transition = 'transform 0.2s ease-out';
        
        // Создаем конфетти, вылетающие из хлопушки с напором
        createBurstConfetti(startX, startY);
        
        // Создаем конфетти, которые разлетаются и падают
        createConfetti(startX, startY);
        
        // Восстанавливаем хлопушку через 0.5 секунды
        setTimeout(() => {
          fireworks.style.transform = 'scale(1)';
          fireworks.style.animation = 'none';
          // Если достигнут лимит взрывов, меняем курсор на not-allowed
          updateFireworksCursor();
          isAnimating = false;
        }, 500);
      }, 1000);
    });
  }
  
  // Создать конфетти, вылетающие из хлопушки с напором (исчезают)
  function createBurstConfetti(startX, startY) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
    const burstCount = 80; // Увеличено количество конфетти для вылета
    
    for (let i = 0; i < burstCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti burst';
      
      // Случайный цвет
      const color = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.backgroundColor = color;
      
      // Случайный размер (больше для лучшей видимости)
      const size = Math.random() * 8 + 5; // от 5 до 13px
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      
      // Начальная позиция (центр хлопушки)
      confetti.style.left = `${startX}px`;
      confetti.style.top = `${startY}px`;
      confetti.style.position = 'fixed';
      confetti.style.borderRadius = '50%';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '1001'; // выше обычных конфетти
      confetti.style.boxShadow = '0 0 6px rgba(0, 0, 0, 0.5)';
      confetti.style.opacity = '1';
      
      // Случайное направление вылета (во все стороны)
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 400 + 300; // скорость вылета
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      // Время полета до исчезновения (увеличено для лучшей видимости)
      const flightDuration = Math.random() * 1.5 + 1.0; // от 1.0 до 2.5 секунд
      const fadeStart = flightDuration * 0.6; // начинаем исчезать после 60% полета
      
      document.body.appendChild(confetti);
      
      // Анимация вылета с напором
      requestAnimationFrame(() => {
        // Сначала летим без исчезновения
        confetti.style.transition = `left ${flightDuration}s ease-out, top ${flightDuration}s ease-out, transform ${flightDuration}s linear`;
        confetti.style.left = `${startX + vx}px`;
        confetti.style.top = `${startY + vy}px`;
        confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
        
        // Затем начинаем исчезать
        setTimeout(() => {
          confetti.style.transition = `opacity ${flightDuration - fadeStart}s ease-out`;
          confetti.style.opacity = '0';
        }, fadeStart * 1000);
      });
      
      // Удаляем конфетти после вылета
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, flightDuration * 1000);
    }
  }
  
  function createConfetti(startX, startY) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
    const confettiCount = 200; // Количество конфетти (в два раза больше)
    
    // Флаг для отслеживания, зажгли ли уже елку
    let treeLighted = false;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      // Случайный цвет
      const color = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.backgroundColor = color;
      
      // Случайный размер
      const size = Math.random() * 8 + 4; // от 4 до 12px
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      
      // Начальная позиция (центр хлопушки)
      confetti.style.left = `${startX}px`;
      confetti.style.top = `${startY}px`;
      confetti.style.position = 'fixed';
      confetti.style.borderRadius = '50%';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '1000';
      confetti.style.boxShadow = '0 0 4px rgba(0, 0, 0, 0.3)';
      
      // Случайное направление разлета (шире)
      const angle = Math.random() * Math.PI * 2; // случайный угол 0-360 градусов
      const velocity = Math.random() * 600 + 400; // скорость разлета (больше для более широкого разлета)
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      // Время разлета вверх (до верхнего края)
      const riseDuration = 0.8; // 0.8 секунды до верха
      // Время падения вниз
      const fallDuration = Math.random() * 2 + 2; // от 2 до 4 секунд
      
      document.body.appendChild(confetti);
      
      // Первая фаза: разлет вверх до верхнего края экрана
      // Вычисляем конечную позицию вверх
      const topX = startX + vx;
      const topY = -100; // выше верхнего края экрана
      
      requestAnimationFrame(() => {
        confetti.style.transition = `left ${riseDuration}s ease-out, top ${riseDuration}s ease-out, transform ${riseDuration}s linear`;
        confetti.style.left = `${topX}px`;
        confetti.style.top = `${topY}px`;
        confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
      });
      
      // Зажигаем елку пульсирующими лампочками когда конфетти начинает падать с потолка
      if (!treeLighted) {
        treeLighted = true;
        setTimeout(() => {
          lightUpTree();
        }, riseDuration * 1000 + 2000); // добавляем 2 секунды задержки после достижения верхнего края
      }
      
      // Вторая фаза: падение вниз
      setTimeout(() => {
        // Увеличиваем разброс по горизонтали - конфетти разлетается по всей ширине экрана
        const screenWidth = window.innerWidth;
        // Конфетти может упасть в любом месте экрана, не только рядом с начальной точкой
        const finalX = Math.random() * screenWidth; // случайная позиция по всей ширине экрана
        
        // Конфетти падают на пол или на коробки (разные высоты)
        const floorY = window.innerHeight - 20; // пол
        const boxY = window.innerHeight - 100; // высота коробок
        
        // Случайно выбираем, куда упадет конфетти, с большим разбросом по высоте
        let finalY;
        if (Math.random() > 0.3) {
          // 70% конфетти падает на пол с небольшим разбросом по высоте
          finalY = floorY + (Math.random() - 0.5) * 30; // небольшой разброс вокруг уровня пола
        } else {
          // 30% конфетти падает на коробки с разбросом
          finalY = boxY + Math.random() * 80; // разброс на высоте коробок
        }
        
        requestAnimationFrame(() => {
          confetti.style.transition = `left ${fallDuration}s ease-in, top ${fallDuration}s ease-in, transform ${fallDuration}s linear`;
          confetti.style.left = `${finalX}px`;
          confetti.style.top = `${finalY}px`;
          confetti.style.transform = `rotate(${Math.random() * 720 + 360}deg)`;
          // Конфетти остается видимым (не исчезает)
        });
      }, riseDuration * 1000);
      
      // НЕ удаляем конфетти - они остаются на полу и коробках
    }
  }
  
  // ========== ФИНАЛЬНАЯ СЦЕНА: ЗАЖИГАНИЕ ЕЛКИ ==========
  
  // Функция для зажигания елки пульсирующими лампочками
  function lightUpTree() {
    const treeContainer = document.getElementById('tree-with-star');
    if (!treeContainer) return;
    
    const treeRect = treeContainer.getBoundingClientRect();
    
    // Цвета лампочек (яркие, праздничные)
    const bulbColors = [
      '#ff0000', // красный
      '#00ff00', // зеленый
      '#0000ff', // синий
      '#ffff00', // желтый
      '#ff00ff', // пурпурный
      '#00ffff', // голубой
      '#ff8800', // оранжевый
      '#ff0088', // розовый
      '#88ff00', // лайм
      '#0088ff'  // светло-синий
    ];
    
    // Количество лампочек (достаточно много для эффекта)
    const bulbCount = 80;
    
    // Создаем лампочки
    for (let i = 0; i < bulbCount; i++) {
      const bulb = document.createElement('div');
      bulb.className = 'tree-bulb';
      
      // Случайный цвет
      const color = bulbColors[Math.floor(Math.random() * bulbColors.length)];
      bulb.style.backgroundColor = color;
      bulb.style.color = color;
      
      // Позиционируем лампочку внутри елки (треугольная форма)
      // Учитываем форму елки: шире внизу, уже вверху
      const relativeY = Math.random(); // 0 вверху, 1 внизу
      const maxWidthAtY = treeRect.width * (0.2 + 0.8 * relativeY); // ширина на высоте Y
      const centerX = treeRect.left + treeRect.width / 2;
      const marginX = 80; // увеличенный отступ от краев для более центрального расположения
      
      // Случайная позиция X в пределах ширины елки на этой высоте (более узкий диапазон)
      const widthRange = (maxWidthAtY - marginX * 2) * 0.7; // уменьшаем диапазон на 30% для более центрального расположения
      const distanceFromCenter = (Math.random() - 0.5) * widthRange;
      const x = centerX + distanceFromCenter;
      
      // Позиция Y внутри елки
      const minY = treeRect.top + 30;
      const maxY = treeRect.bottom - 30;
      
      // Для самых нижних огоньков (relativeY > 0.8) ограничиваем минимальную Y-позицию,
      // чтобы они были выше уровня коробок
      let adjustedRelativeY = relativeY;
      if (relativeY > 0.8) {
        // Ограничиваем самые нижние огоньки: они должны быть выше уровня коробок
        // Преобразуем relativeY от 0.8-1.0 в диапазон 0.8-0.9 (вместо 0.8-1.0)
        adjustedRelativeY = 0.8 + (relativeY - 0.8) * 0.5; // сжимаем диапазон нижних 20% в 10%
      }
      
      const y = minY + (maxY - minY) * adjustedRelativeY;
      
      bulb.style.left = `${x}px`;
      bulb.style.top = `${y}px`;
      
      // Случайная задержка анимации для хаотичности (от 0 до 2 секунд)
      const delay = Math.random() * 2;
      bulb.style.animationDelay = `${delay}s`;
      
      // Случайная длительность анимации (от 1 до 2.5 секунд) для разнообразия
      const duration = 1 + Math.random() * 1.5;
      bulb.style.animationDuration = `${duration}s`;
      
      // Плавное появление с небольшой случайной задержкой для эффекта волны
      const fadeInDelay = Math.random() * 0.8; // случайная задержка от 0 до 0.8 секунды
      bulb.style.opacity = '0';
      bulb.style.transition = `opacity 1s ease-out`;
      setTimeout(() => {
        bulb.style.opacity = '1';
      }, fadeInDelay * 1000);
      
      document.body.appendChild(bulb);
    }
    
    // Зажигаем звезду одновременно с елкой
    const star = document.getElementById('star');
    if (star) {
      star.classList.add('lit');
    }
    
    // Зажигаем гирлянду на камине одновременно с елкой
    const decoration = document.getElementById('fireplace-decoration');
    if (decoration) {
      decoration.classList.add('lit');
      
      // Создаем белые светящиеся точки вдоль гирлянды
      const decorationRect = decoration.getBoundingClientRect();
      const bulbCount = 15; // количество точек
      
      for (let i = 0; i < bulbCount; i++) {
        const bulb = document.createElement('div');
        bulb.className = 'decoration-bulb';
        
        // Распределяем точки вдоль гирлянды
        const x = decorationRect.left + (decorationRect.width / bulbCount) * i + (decorationRect.width / bulbCount / 2);
        const y = decorationRect.top + decorationRect.height * 0.3 + Math.sin(i * 0.5) * 5; // небольшое вертикальное смещение для естественности
        
        bulb.style.left = `${x}px`;
        bulb.style.top = `${y}px`;
        
        // Случайная задержка анимации для эффекта переливания
        const delay = Math.random() * 2;
        bulb.style.animationDelay = `${delay}s`;
        
        // Случайная длительность анимации
        const duration = 1 + Math.random() * 1;
        bulb.style.animationDuration = `${duration}s`;
        
        document.body.appendChild(bulb);
      }
    }
  }
  
  // Инициализация при загрузке
  window.addEventListener('DOMContentLoaded', () => {
    initBoxHandlers();
    initDragAndDrop();
    initRestartButton();
    initFireworks();
  });