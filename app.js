/* ============================
   AI WEB STUDIO — App JS
   ============================ */

(function() {
  'use strict';

  // === HEADER: show/hide on scroll ===
  const header = document.getElementById('header');
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const currentY = window.scrollY;
    if (currentY > 100) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    if (currentY > lastScrollY && currentY > 200) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }
    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });

  // === BURGER MENU ===
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  burger.addEventListener('click', function() {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
  });

  // Close menu on link click
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      burger.classList.remove('active');
      nav.classList.remove('open');
    });
  });

  // === FADE-IN ON SCROLL (Intersection Observer) ===
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeEls.forEach(function(el) {
    fadeObserver.observe(el);
  });

  // === PARALLAX for background images ===
  const parallaxSections = document.querySelectorAll('.hero__bg img, .advantages__bg img, .how-it-works__bg img');
  
  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxSections.forEach(function(img) {
      const section = img.closest('section') || img.closest('.hero');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      const offset = (scrollY - sectionTop) * 0.15;
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        img.style.transform = 'translateY(' + offset + 'px) scale(1.1)';
      }
    });
  }

  window.addEventListener('scroll', function() {
    requestAnimationFrame(updateParallax);
  });
  updateParallax();

  // === COUNTER ANIMATION ===
  const counters = document.querySelectorAll('[data-target]');
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(el) {
    counterObserver.observe(el);
  });

  function animateCounter(el, target) {
    const duration = 1500;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // === FLOATING PARTICLES (Canvas) ===
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2
    };
  }

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function(p) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += 0.02;
      var alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(108, 99, 255, ' + alpha + ')';
      ctx.fill();

      // glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 212, 255, ' + (alpha * 0.15) + ')';
      ctx.fill();
    });

    // Draw connections
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(108, 99, 255, ' + (0.05 * (1 - dist / 150)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // === SMOOTH SCROLL for anchor links ===
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // === LEAD FORM SUBMISSION (Telegram) ===
  var form = document.getElementById('leadForm');
  var formSuccess = document.getElementById('formSuccess');
  var formError = document.getElementById('formError');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var formData = new FormData(form);
      var name = formData.get('name') || '';
      var phone = formData.get('phone') || '';
      var business = formData.get('business') || '';
      var message = formData.get('message') || '';

      // Экранируем HTML-спецсимволы
      function escapeHtml(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      }

      var text = '🚀 <b>Новая заявка с сайта AI Web Studio</b>\n\n'
        + '👤 Имя: ' + escapeHtml(name) + '\n'
        + '📱 Телефон/Telegram: ' + escapeHtml(phone) + '\n'
        + '🏢 Бизнес: ' + escapeHtml(business || 'не указан') + '\n'
        + '💬 Задача: ' + escapeHtml(message || 'не указана');

      // Bot token and chat IDs for Telegram
      var BOT_TOKEN = '8601694694:AAE0UO5tGjZl_y3hnkvjL3HzVHCxAbtGlEk';
      var CHAT_ID_PERSONAL = '7692089613';
      var CHAT_ID_GROUP = '@StudioWebAi';

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';

      // Send to personal chat
      var sendPersonal = fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID_PERSONAL,
          text: text,
          parse_mode: 'HTML'
        })
      });

      // Send to group/channel @StudioWebAi (бот должен быть админом канала)
      var sendGroup = fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID_GROUP,
          text: text,
          parse_mode: 'HTML'
        })
      }).catch(function() {});

      // Wait for at least personal Telegram to succeed
      sendPersonal
      .then(function(response) {
        if (response.ok) {
          form.style.display = 'none';
          formSuccess.style.display = 'block';
          formError.style.display = 'none';
        } else {
          throw new Error('API error');
        }
      })
      .catch(function() {
        formError.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
      });
    });
  }

  // === EXPANDABLE FEATURE CARDS ===
  document.querySelectorAll('.feature-card--expandable').forEach(function(card) {
    card.addEventListener('click', function() {
      var targetId = card.getAttribute('data-expand');
      var expandEl = document.getElementById(targetId);
      if (!expandEl) return;

      var isOpen = expandEl.classList.contains('open');

      // Close all other panels
      document.querySelectorAll('.feature-expand.open').forEach(function(el) {
        el.classList.remove('open');
      });
      document.querySelectorAll('.feature-card--expandable.active').forEach(function(el) {
        el.classList.remove('active');
      });

      // Toggle current
      if (!isOpen) {
        expandEl.classList.add('open');
        card.classList.add('active');
      }
    });
  });

  // === CASE STUDY MODALS ===
  var caseData = {
    'case-modal-1': {
      title: 'Бот для автошколы',
      badge: 'Telegram-бот',
      stat: '+40%', statLabel: 'рост записей на обучение',
      image: './assets/case-autoschool.png',
      before: 'Менеджер автошколы отвечал на звонки и сообщения вручную. Вечером и в выходные заявки терялись — клиент звонил, не дозванивался и уходил к конкурентам. Средняя скорость ответа — 2 часа. В месяц терялось до 15–20 потенциальных учеников.',
      after: 'Telegram-бот принимает заявки 24/7. Клиент выбирает категорию (А, B, C), удобное время, получает расписание и записывается в 2 клика. Бот отправляет напоминание за день и за час до занятия. Оплата через ЮKassa прямо в Telegram. Менеджер получает уведомления только о новых записях.',
      tools: ['Telegram Bot API', 'Node.js', 'ЮKassa', 'Напоминания', 'Админ-панель'],
      timeline: 'Срок разработки: 4 дня'
    },
    'case-modal-2': {
      title: 'Лендинг для юриста',
      badge: 'Сайт + AI-чат',
      stat: '3x', statLabel: 'рост заявок с сайта (с 3 до 10 в месяц)',
      image: './assets/case-lawyer.png',
      before: 'У юриста был старый сайт на Tilda — шаблонный дизайн, нет доверия, 2–3 заявки в месяц. Клиенты не понимали, чем он отличается от других юристов. Сайт не адаптирован под мобильные. AI-чат отсутствовал — часть вопросов оставалась без ответа.',
      after: 'Разработали современный лендинг с акцентом на результат: цифры выигранных дел, отзывы, чёткие услуги с ценами. Встроили AI-чат, обученный на базе знаний юриста: бот отвечает на частые вопросы (стоимость, сроки, документы), собирает контакты и передаёт менеджеру. Конверсия выросла с 1.5% до 4.8%.',
      tools: ['HTML/CSS/JS', 'AI-чат (GPT)', 'Адаптивный дизайн', 'SEO', 'Яндекс.Метрика'],
      timeline: 'Срок разработки: 3 дня'
    },
    'case-modal-3': {
      title: 'Интернет-магазин одежды',
      badge: 'Автоматизация поддержки',
      stat: '–70%', statLabel: 'нагрузки на менеджеров',
      image: './assets/case-clothing.png',
      before: '3 менеджера весь день отвечали на одинаковые вопросы в чатах: «Есть ли в наличии?», «Как оплатить?», «Когда доставка?», «Какой размер выбрать?». Среднее время ответа — 8 минут. Клиенты уходили, не дождавшись. ФОТ на поддержку — 120 000 ₽/мес.',
      after: 'Внедрили AI-бота, обученного на каталоге магазина. Бот знает наличие, размеры, цены, условия доставки. Закрывает 80% обращений без участия человека. Сложные вопросы передаёт менеджеру с полным контекстом переписки. ФОТ сократился до 40 000 ₽/мес (1 менеджер вместо 3).',
      tools: ['Telegram-бот', 'AI (GPT)', 'Интеграция с 1С', 'Каталог товаров', 'Отчёты в Telegram'],
      timeline: 'Срок разработки: 5 дней'
    },
    'case-modal-4': {
      title: 'Онлайн-школа английского',
      badge: 'Бот-воронка продаж',
      stat: '+25%', statLabel: 'рост продаж курсов',
      image: './assets/case-english.png',
      before: 'Школа привлекала учеников через рекламу в Telegram и Instagram. Проблема: люди подписывались, но не покупали курс. Конверсия из подписчика в покупателя — 3%. Прогрев был ручным: менеджер писал каждому. На 500 подписчиков в месяц не хватало рук.',
      after: 'Создали бот-воронку: подписчик получает бесплатный мини-урок → через день тест на уровень → персональная рекомендация курса → ограниченная скидка на 24 часа → напоминание. Всё автоматически. Конверсия выросла с 3% до 7.5%. Менеджер подключается только для «тёплых» клиентов.',
      tools: ['Telegram Bot API', 'Автоворонка', 'Таймер скидок', 'A/B тесты', 'Аналитика'],
      timeline: 'Срок разработки: 5 дней'
    },
    'case-modal-5': {
      title: 'Салон красоты',
      badge: 'Сайт + Бот + CRM',
      stat: '–50%', statLabel: 'меньше неявок клиентов',
      image: './assets/case-salon.png',
      before: 'Администратор записывала клиентов по телефону и в тетрадку. 30% клиентов не приходили — забывали. Нет напоминаний, нет онлайн-записи. Сайт — визитка 2018 года без формы заявки. Мастера простаивали по 2–3 часа в день.',
      after: 'Разработали: 1) Современный сайт с онлайн-записью — клиент выбирает мастера, услугу, время. 2) Telegram-бот для записи — дублирует функции сайта в мессенджере. 3) Автоматические напоминания за день и за 2 часа (SMS + Telegram). 4) Все записи попадают в AmoCRM. Неявки упали с 30% до 15%.',
      tools: ['Сайт (HTML/CSS/JS)', 'Telegram-бот', 'AmoCRM', 'SMS-рассылка', 'Онлайн-запись'],
      timeline: 'Срок разработки: 7 дней'
    }
  };

  // Tool descriptions for clickable tags
  var toolDescriptions = {
    'Telegram Bot API': {
      icon: '🤖',
      desc: 'Официальный интерфейс Telegram для создания ботов. Позволяет отправлять сообщения, кнопки, меню, принимать оплату и работать с пользователями 24/7.'
    },
    'Node.js': {
      icon: '⚡',
      desc: 'Быстрая серверная платформа на JavaScript. Идеальна для ботов, API и реал-тайм приложений. Выдерживает тысячи одновременных пользователей.'
    },
    'ЮKassa': {
      icon: '💳',
      desc: 'Платёжная система от Яндекса. Принимает карты, SBP, электронные кошельки. Интегрируется с сайтом и Telegram-ботом. Комиссия от 3.5%.'
    },
    'Напоминания': {
      icon: '🔔',
      desc: 'Автоматические уведомления клиентам за день и за час до записи. Снижают неявки на 40–60%. Работают через Telegram, SMS или WhatsApp.'
    },
    'Админ-панель': {
      icon: '📊',
      desc: 'Личный кабинет владельца бизнеса. Статистика заявок, управление ботом, редактирование услуг и цен. Всё через Telegram или веб-интерфейс.'
    },
    'HTML/CSS/JS': {
      icon: '🌐',
      desc: 'Современная веб-разработка без шаблонов. Кастомный дизайн, анимации, адаптив под мобильные. Быстрая загрузка, нет зависимости от конструкторов.'
    },
    'AI-чат (GPT)': {
      icon: '🧠',
      desc: 'Искусственный интеллект на базе GPT. Обучается на ваших данных — знает услуги, цены, FAQ. Отвечает естественно, как живой менеджер.'
    },
    'Адаптивный дизайн': {
      icon: '📱',
      desc: 'Сайт идеально выглядит на любом устройстве: телефон, планшет, компьютер. 70% посетителей заходят с мобильных — это критично.'
    },
    'SEO': {
      icon: '🔍',
      desc: 'Поисковая оптимизация. Сайт находят в Яндексе и Google по ключевым запросам. Мета-теги, семантическая вёрстка, скорость загрузки.'
    },
    'Яндекс.Метрика': {
      icon: '📈',
      desc: 'Аналитика посещений сайта. Показывает откуда приходят клиенты, что смотрят, где уходят. Вебвизор, карты кликов, конверсии.'
    },
    'Telegram-бот': {
      icon: '🤖',
      desc: 'Бот в мессенджере Telegram. Клиенты пишут боту как человеку — он отвечает, записывает, продаёт, напоминает. Работает 24/7.'
    },
    'AI (GPT)': {
      icon: '🧠',
      desc: 'Нейросеть GPT, обученная на данных вашего бизнеса. Понимает естественный язык, отвечает как опытный консультант, сам обучается.'
    },
    'Интеграция с 1С': {
      icon: '🔗',
      desc: 'Связка бота/сайта с вашей 1С. Синхронизация товаров, цен, остатков в реальном времени. Бот всегда знает актуальное наличие.'
    },
    'Каталог товаров': {
      icon: '🛝',
      desc: 'Интерактивный каталог прямо в боте или на сайте. Фото, описания, цены, размеры. Фильтры и поиск.'
    },
    'Отчёты в Telegram': {
      icon: '📊',
      desc: 'Ежедневная статистика прямо в Telegram: сколько заявок, продаж, обращений. Владелец видит всё без личного кабинета.'
    },
    'Автоворонка': {
      icon: '🎯',
      desc: 'Цепочка сообщений, которая прогревает клиента до покупки: лид-магнит → польза → предложение → дедлайн. Всё автоматически.'
    },
    'Таймер скидок': {
      icon: '⏰',
      desc: 'Ограниченная по времени скидка с обратным отсчётом. Создаёт срочность и повышает конверсию в 2–3 раза.'
    },
    'A/B тесты': {
      icon: '🧪',
      desc: 'Сравниваем два варианта сообщений/кнопок/офферов и выбираем тот, что даёт больше продаж. Решения на основе данных, не интуиции.'
    },
    'Аналитика': {
      icon: '📈',
      desc: 'Полная статистика по воронке: сколько зашло, сколько купило, где отвалились. Помогает улучшать конверсию каждый месяц.'
    },
    'Сайт (HTML/CSS/JS)': {
      icon: '🌐',
      desc: 'Полностью кастомный сайт без конструкторов. Быстрая загрузка, уникальный дизайн, SEO-оптимизация. Работает на любом устройстве.'
    },
    'AmoCRM': {
      icon: '📋',
      desc: 'Популярная CRM-система для продаж. Все заявки в одном месте, воронка продаж, задачи менеджерам. Интегрируем с ботом и сайтом.'
    },
    'SMS-рассылка': {
      icon: '📨',
      desc: 'Автоматические SMS для тех, кто не в Telegram. Напоминания о записи, подтверждения заказов. Работает с любым телефоном.'
    },
    'Онлайн-запись': {
      icon: '📅',
      desc: 'Клиент сам выбирает услугу, мастера, дату и время. Без звонков, без ожидания. Работает на сайте и в Telegram-боте.'
    }
  };

  var overlay = document.getElementById('caseModalOverlay');
  var modalBody = document.getElementById('caseModalBody');
  var modalClose = document.getElementById('caseModalClose');

  document.querySelectorAll('.case-card--clickable').forEach(function(card) {
    card.addEventListener('click', function() {
      var caseId = card.getAttribute('data-case');
      var d = caseData[caseId];
      if (!d) return;

      var toolsHtml = d.tools.map(function(t) {
        var info = toolDescriptions[t];
        if (info) {
          return '<span class="modal-tool-tag modal-tool-tag--active" data-tool="' + t + '">' + (info.icon || '') + ' ' + t + '</span>';
        }
        return '<span class="modal-tool-tag">' + t + '</span>';
      }).join('');

      var imageHtml = d.image ? '<div class="modal-image"><img src="' + d.image + '" alt="' + d.title + '" loading="lazy"></div>' : '';

      modalBody.innerHTML = '<h3>' + d.title + '</h3>'
        + '<span class="modal-badge">' + d.badge + '</span>'
        + imageHtml
        + '<div class="modal-stat"><span class="modal-stat-number">' + d.stat + '</span><span class="modal-stat-label">' + d.statLabel + '</span></div>'
        + '<h4>Задача</h4>'
        + '<div class="modal-section modal-before"><span class="label">Проблема клиента</span><p>' + d.before + '</p></div>'
        + '<h4>Решение</h4>'
        + '<div class="modal-section modal-after"><span class="label">Что мы сделали</span><p>' + d.after + '</p></div>'
        + '<h4>Инструменты</h4>'
        + '<div class="modal-tools">' + toolsHtml + '</div>'
        + '<p class="modal-timeline">' + d.timeline + '</p>'
        + '<div class="modal-cta"><a href="#contact" class="btn btn--primary btn--glow" onclick="document.getElementById(\'caseModalOverlay\').classList.remove(\'open\'); document.body.style.overflow=\'\'">Хочу так же</a></div>';

      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Attach click handlers to tool tags
      modalBody.querySelectorAll('.modal-tool-tag--active').forEach(function(tag) {
        tag.addEventListener('click', function(e) {
          e.stopPropagation();
          var toolName = tag.getAttribute('data-tool');
          var info = toolDescriptions[toolName];
          if (!info) return;

          // Remove existing tooltip
          var existing = modalBody.querySelector('.tool-tooltip');
          if (existing) existing.remove();

          // Create tooltip
          var tooltip = document.createElement('div');
          tooltip.className = 'tool-tooltip';
          tooltip.innerHTML = '<div class="tool-tooltip__header">' + (info.icon || '') + ' <strong>' + toolName + '</strong><span class="tool-tooltip__close">&times;</span></div><p>' + info.desc + '</p>';
          tag.parentNode.insertBefore(tooltip, tag.nextSibling);

          // Animate in
          requestAnimationFrame(function() { tooltip.classList.add('open'); });

          // Close on X
          tooltip.querySelector('.tool-tooltip__close').addEventListener('click', function(ev) {
            ev.stopPropagation();
            tooltip.remove();
          });
        });
      });
    });
  });

  function closeCaseModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeCaseModal);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeCaseModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeCaseModal();
  });

  // === BOTS RESULT ITEMS: CLICKABLE ===
  document.querySelectorAll('.bots__result-item--click').forEach(function(item) {
    item.addEventListener('click', function() {
      var tipId = item.getAttribute('data-result-tip');
      var tipEl = document.getElementById(tipId);
      if (!tipEl) return;

      var isOpen = tipEl.classList.contains('open');

      // Close all result tips
      document.querySelectorAll('.bots__result-tip.open').forEach(function(t) {
        t.classList.remove('open');
      });
      document.querySelectorAll('.bots__result-item--click.active').forEach(function(i) {
        i.classList.remove('active');
      });

      if (!isOpen) {
        tipEl.classList.add('open');
        item.classList.add('active');
      }
    });
  });

  // === BOTS SECTION: CLICKABLE LIST ITEMS ===
  var botTips = {
    'bot-tip-biz': '<p><strong>Малый и средний бизнес</strong> — бот берёт на себя рутину: ответы на типовые вопросы, приём заявок, уведомления. Вы сосредоточитесь на развитии, а не на однотипных задачах.</p><div class="bots__tip-example">Пример: строительная компания — бот собирает заявки на замер, рассчитывает предварительную стоимость, отправляет портфолио работ</div>',
    'bot-tip-edu': '<p><strong>Онлайн-школы</strong> — бот прогревает подписчиков, выдаёт бесплатные уроки, проводит тесты на уровень, предлагает подходящий курс и принимает оплату.</p><div class="bots__tip-example">Пример: школа английского — бот-воронка увеличила продажи курсов на 25% за первый месяц</div>',
    'bot-tip-expert': '<p><strong>Эксперты и коучи</strong> — бот записывает на консультации, отправляет расписание, принимает оплату. Вы не тратите время на переписку — занимаетесь клиентами.</p><div class="bots__tip-example">Пример: психолог — бот ведёт запись, напоминает о сессии, принимает предоплату через ЮKassa</div>',
    'bot-tip-shop': '<p><strong>Интернет-магазины</strong> — бот показывает каталог, помогает выбрать размер, отвечает про наличие и доставку, принимает заказ и оплату прямо в Telegram.</p><div class="bots__tip-example">Пример: магазин одежды — AI-бот закрывает 80% обращений, экономия 80 000 ₽/мес на менеджерах</div>',
    'bot-tip-beauty': '<p><strong>Салоны, клиники, автосервисы</strong> — онлайн-запись через бота: выбор мастера, услуги, времени. Напоминания снижают неявки вдвое.</p><div class="bots__tip-example">Пример: салон красоты — неявки упали с 30% до 15%, мастера перестали простаивать</div>',
    'bot-tip-food': '<p><strong>Доставка еды и рестораны</strong> — меню в боте, оформление заказа, оплата, отслеживание доставки. Клиент заказывает в 2 клика не выходя из Telegram.</p><div class="bots__tip-example">Пример: пиццерия — 30% заказов перешли из звонков в бота, средний чек вырос на 15%</div>',
    'bot-tip-247': '<p><strong>Отвечает 24/7</strong> — бот не спит, не уходит в отпуск и не болеет. Клиент пишет в 3 часа ночи — получает ответ за секунду. По статистике до 35% заявок приходит ночью и в выходные.</p><div class="bots__tip-example">Результат: автошкола перестала терять 15–20 учеников/мес из-за неотвеченных сообщений</div>',
    'bot-tip-crm': '<p><strong>Заявки сразу в CRM</strong> — каждое обращение автоматически попадает в AmoCRM, Битрикс24 или любую другую систему. Создаётся сделка, назначается ответственный, ставится задача на перезвон. Ни одна заявка не теряется.</p><div class="bots__tip-example">Результат: менеджер видит всю историю переписки с клиентом прямо в CRM</div>',
    'bot-tip-booking': '<p><strong>Онлайн-запись</strong> — клиент сам выбирает услугу, специалиста, дату и время. Бот отправляет напоминание за день и за час. Если клиент отменяет — освободившееся время предлагается другим.</p><div class="bots__tip-example">Результат: салон красоты сократил неявки на 50%, администратор освободился от телефона</div>',
    'bot-tip-consult': '<p><strong>AI-консультант</strong> — бот обучен на ваших данных: знает услуги, цены, наличие, условия. Отвечает естественным языком, как опытный менеджер. Если не знает ответ — передаёт человеку.</p><div class="bots__tip-example">Результат: магазин одежды — бот отвечает про размеры, состав, доставку за 1 секунду</div>',
    'bot-tip-pay': '<p><strong>Приём оплаты</strong> — подключаем ЮKassa, Robokassa или Тинькофф. Клиент оплачивает прямо в Telegram в 1 клик: карта, SBP, электронные кошельки. Вы получаете уведомление о каждой оплате.</p><div class="bots__tip-example">Результат: автошкола — 70% учеников оплачивают через бота, а не наличными</div>',
    'bot-tip-feedback': '<p><strong>Сбор отзывов</strong> — после оказания услуги бот просит оценку от 1 до 5. Положительные — предлагает оставить на Яндекс.Картах или Google. Отрицательные — передаёт руководителю для разбора.</p><div class="bots__tip-example">Результат: салон набрал 50 отзывов на Яндекс.Картах за 2 месяца без усилий</div>'
  };

  document.querySelectorAll('.bots__li--click').forEach(function(li) {
    li.addEventListener('click', function() {
      var tipId = li.getAttribute('data-bot-tip');
      var content = botTips[tipId];
      if (!content) return;

      // Check if already open
      var existingTip = li.nextElementSibling;
      if (existingTip && existingTip.classList.contains('bots__tip') && existingTip.classList.contains('open')) {
        existingTip.classList.remove('open');
        li.classList.remove('active');
        setTimeout(function() { existingTip.remove(); }, 400);
        return;
      }

      // Close all other tips in same list
      li.closest('ul').querySelectorAll('.bots__tip.open').forEach(function(t) {
        t.classList.remove('open');
        setTimeout(function() { t.remove(); }, 400);
      });
      li.closest('ul').querySelectorAll('.bots__li--click.active').forEach(function(l) {
        l.classList.remove('active');
      });

      // Create tip
      var tip = document.createElement('li');
      tip.className = 'bots__tip';
      tip.innerHTML = content;
      li.after(tip);
      li.classList.add('active');

      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          tip.classList.add('open');
        });
      });
    });
  });

  // === EXPANDABLE BADGE ITEMS ===
  document.querySelectorAll('.badge-item--expandable').forEach(function(badge) {
    badge.addEventListener('click', function() {
      var targetId = badge.getAttribute('data-expand');
      var expandEl = document.getElementById(targetId);
      if (!expandEl) return;

      var isOpen = expandEl.classList.contains('open');

      // Close all badge panels
      document.querySelectorAll('.badge-expand.open').forEach(function(el) {
        el.classList.remove('open');
      });
      document.querySelectorAll('.badge-item--expandable.active').forEach(function(el) {
        el.classList.remove('active');
      });

      // Toggle current
      if (!isOpen) {
        expandEl.classList.add('open');
        badge.classList.add('active');
      }
    });
  });

  // === TELEGRAM FLOATING WIDGET ===
  var tgFab = document.getElementById('tgFab');
  var tgPopup = document.getElementById('tgPopup');
  var tgPopupClose = document.getElementById('tgPopupClose');

  if (tgFab && tgPopup) {
    tgFab.addEventListener('click', function() {
      var isOpen = tgPopup.classList.contains('open');
      tgPopup.classList.toggle('open');
      tgFab.classList.toggle('active');
    });

    tgPopupClose.addEventListener('click', function() {
      tgPopup.classList.remove('open');
      tgFab.classList.remove('active');
    });

    // Auto-show popup after 5 seconds
    setTimeout(function() {
      if (!tgPopup.classList.contains('open')) {
        tgPopup.classList.add('open');
        // Auto-hide after 4 seconds
        setTimeout(function() {
          tgPopup.classList.remove('open');
        }, 4000);
      }
    }, 5000);
  }

  // === GLOW follow cursor on cards ===
  document.querySelectorAll('.case-card, .pricing-card, .review-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--glow-x', x + 'px');
      card.style.setProperty('--glow-y', y + 'px');
      var glow = card.querySelector('.case-card__glow');
      if (glow) {
        glow.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(108, 99, 255, 0.12) 0%, transparent 50%)';
      }
    });
  });

})();
