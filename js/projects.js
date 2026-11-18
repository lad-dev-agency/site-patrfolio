/*
  Дані портфоліо LAD.
  Щоб додати реальний кейс — додайте об'єкт у масив.
  mock: phone | browser | dashboard | chat | brand | cloud | map — тип обкладинки, що малюється CSS.
  size: "wide" | "tall" | "" — розмір картки у bento-сітці.
  cover: зображення-обкладинка замість CSS-мокапу (необов'язково).
  gallery: [{ src, alt }] — екрани, що показуються в модальному вікні кейсу.
  Вихідники макетів — design/*.html, рендер у WebP: cd design && npm install && npm run render
*/
window.LAD_PROJECTS = [
  {
    id: "monetra",
    title: "Monetra",
    industry: "Фінтех",
    category: ["mobile", "design"],
    tags: ["iOS / Android", "UI/UX", "Open Banking"],
    result: "+180% активних користувачів",
    size: "wide",
    mock: "phone",
    cover: "img/cases/monetra/cover.webp",
    gallery: [{ src: "img/cases/monetra/screens.webp", alt: "Екрани застосунку Monetra: аналітика витрат, головна, обмін валют" }],
    colors: ["#7b5cff", "#e8438f"],
    about: "Monetra — молодий фінтех-стартап, що допомагає фрілансерам і малому бізнесу керувати грошима в кількох валютах.",
    task: "Старий застосунок був перевантажений, користувачі губилися в меню, а відтік після першого тижня сягав 60%.",
    solution: "Ми провели 24 глибинні інтерв'ю, перебудували інформаційну архітектуру й створили новий застосунок на Flutter з розумними підказками, автокатегоризацією витрат і миттєвими переказами.",
    stack: ["Flutter", "Node.js", "PostgreSQL", "Figma", "Open Banking API"],
    metrics: [
      { value: "+180%", label: "активних користувачів" },
      { value: "4.8★", label: "рейтинг у сторах" },
      { value: "−42%", label: "відтоку за 1-й тиждень" }
    ]
  },
  {
    id: "verde",
    title: "Verde Market",
    industry: "E-commerce",
    category: ["web", "design"],
    tags: ["Інтернет-магазин", "Headless", "SEO"],
    result: "+214% конверсії",
    size: "tall",
    mock: "browser",
    cover: "img/cases/verde/cover.webp",
    gallery: [{ src: "img/cases/verde/page.webp", alt: "Головна сторінка інтернет-магазину Verde Market" }],
    colors: ["#2bd27b", "#0b8f6a"],
    about: "Verde Market — мережа еко-магазинів з доставкою фермерських продуктів у 9 містах.",
    task: "Повільний сайт на шаблонній CMS: 7 секунд завантаження, незручний кошик і втрата третини замовлень на мобільних.",
    solution: "Розробили headless-магазин на Next.js з миттєвим пошуком, оформленням замовлення в один крок, підпискою на кошики та інтеграцією з 1С і службами доставки.",
    stack: ["Next.js", "Shopify Headless", "Algolia", "Vercel", "1С"],
    metrics: [
      { value: "+214%", label: "конверсії" },
      { value: "0.9 с", label: "час завантаження" },
      { value: "×2.6", label: "виручки з мобільних" }
    ]
  },
  {
    id: "medisense",
    title: "MediSense",
    industry: "HealthTech",
    category: ["ai", "web"],
    tags: ["AI-асистент", "LLM", "Інтеграція з CRM"],
    result: "70% звернень без оператора",
    size: "",
    mock: "chat",
    cover: "img/cases/medisense/cover.webp",
    gallery: [{ src: "img/cases/medisense/screens.webp", alt: "Сайт мережі клінік MediSense з відкритим AI-асистентом запису" }],
    colors: ["#22b8ff", "#7b5cff"],
    about: "MediSense — мережа приватних клінік з 14 філіями та власним контакт-центром.",
    task: "Оператори не встигали обробляти записи й типові питання, пацієнти чекали на лінії до 12 хвилин.",
    solution: "Створили AI-асистента для сайту, Telegram і Viber, який записує на прийом, відповідає на питання про послуги та передає складні випадки лікарю з повною історією діалогу.",
    stack: ["Python", "LLM API", "RAG", "Telegram Bot API", "Medical CRM"],
    metrics: [
      { value: "70%", label: "звернень без оператора" },
      { value: "24/7", label: "запис пацієнтів" },
      { value: "−85%", label: "часу очікування" }
    ]
  },
  {
    id: "cargoflow",
    title: "CargoFlow",
    industry: "Логістика",
    category: ["web", "devops"],
    tags: ["SaaS", "Трекінг", "Мікросервіси"],
    result: "−35% порожніх рейсів",
    size: "",
    mock: "map",
    cover: "img/cases/cargoflow/cover.webp",
    gallery: [{ src: "img/cases/cargoflow/dashboard.webp", alt: "Диспетчерська CargoFlow: карта рейсів, статуси вантажів, AI-підбір зворотного вантажу" }],
    colors: ["#f59a3c", "#e8438f"],
    about: "CargoFlow — логістичний оператор з автопарком 300+ вантажівок по Україні та ЄС.",
    task: "Диспетчери планували рейси в таблицях, клієнти не бачили, де їхній вантаж, а простої коштували мільйони.",
    solution: "Побудували платформу з онлайн-трекінгом, автоматичним плануванням маршрутів і кабінетом клієнта. Розгорнули її на Kubernetes з автомасштабуванням.",
    stack: ["React", "Go", "Kafka", "Kubernetes", "Mapbox"],
    metrics: [
      { value: "−35%", label: "порожніх рейсів" },
      { value: "99.98%", label: "аптайм" },
      { value: "×3", label: "швидше планування" }
    ]
  },
  {
    id: "kavarnia",
    title: "Kavarnia 1890",
    industry: "HoReCa / Брендинг",
    category: ["design", "mobile"],
    tags: ["Брендинг", "Застосунок лояльності", "Айдентика"],
    result: "+60% повторних візитів",
    size: "tall",
    mock: "brand",
    cover: "img/cases/kavarnia/cover.webp",
    gallery: [
      { src: "img/cases/kavarnia/brand.webp", alt: "Айдентика Kavarnia 1890: логотип, палітра, шрифти, упаковка, меню" },
      { src: "img/cases/kavarnia/screens.webp", alt: "Застосунок лояльності Kavarnia 1890: товар, головна з карткою гостя, готове замовлення" }
    ],
    colors: ["#c8873a", "#5a2f1c"],
    about: "Kavarnia 1890 — мережа кав'ярень у Львові з історією, що почалася в родинній пекарні.",
    task: "Бренд виглядав застаріло й не відрізнявся від сотні інших кав'ярень. Програма лояльності трималася на паперових картках.",
    solution: "Створили нову айдентику з вінтажним характером, упаковку, меню та застосунок лояльності з передзамовленням кави й персональними пропозиціями.",
    stack: ["Брендбук", "Figma", "React Native", "Firebase"],
    metrics: [
      { value: "+60%", label: "повторних візитів" },
      { value: "25 тис.", label: "користувачів застосунку" },
      { value: "+28%", label: "середній чек" }
    ]
  },
  {
    id: "pulse",
    title: "Pulse Analytics",
    industry: "SaaS / B2B",
    category: ["web", "design", "ai"],
    tags: ["Дашборд", "BI", "Прогнозування"],
    result: "ROI ×4 за пів року",
    size: "wide",
    mock: "dashboard",
    cover: "img/cases/pulse/cover.webp",
    gallery: [{ src: "img/cases/pulse/dashboard.webp", alt: "Дашборд Pulse Analytics: виручка, AI-прогноз, топ магазинів" }],
    colors: ["#e8438f", "#f59a3c"],
    about: "Pulse — B2B-платформа аналітики продажів для мереж роздрібної торгівлі.",
    task: "Клієнти отримували звіти раз на тиждень у Excel і не могли швидко реагувати на падіння продажів.",
    solution: "Розробили real-time дашборд з налаштовуваними віджетами, AI-прогнозом попиту та алертами в Slack. Дизайн-система з 120+ компонентів.",
    stack: ["Vue 3", "ClickHouse", "Python ML", "D3.js", "AWS"],
    metrics: [
      { value: "×4", label: "ROI клієнтів" },
      { value: "1.2 млрд", label: "подій на день" },
      { value: "−90%", label: "часу на звіти" }
    ]
  },
  {
    id: "agronova",
    title: "AgroNova",
    industry: "Агробізнес",
    category: ["devops"],
    tags: ["Міграція в хмару", "CI/CD", "Моніторинг"],
    result: "−48% витрат на інфраструктуру",
    size: "wide",
    mock: "cloud",
    cover: "img/cases/agronova/cover.webp",
    gallery: [{ src: "img/cases/agronova/dashboard.webp", alt: "Ops-консоль AgroNova: аптайм, навантаження, сервіси, релізи, витрати AWS" }],
    colors: ["#9ae65c", "#22b8ff"],
    about: "AgroNova — агрохолдинг, що обробляє 120 тис. га та має власну систему обліку врожаю.",
    task: "Старі сервери в офісі регулярно падали в розпал жнив, а оновлення системи займало вихідні.",
    solution: "Перенесли інфраструктуру в AWS, налаштували CI/CD, резервне копіювання й моніторинг 24/7. Тепер оновлення виходять кілька разів на день без простоїв.",
    stack: ["AWS", "Terraform", "Docker", "GitLab CI", "Grafana"],
    metrics: [
      { value: "−48%", label: "витрат на інфраструктуру" },
      { value: "0", label: "простоїв за сезон" },
      { value: "15 хв", label: "від коміту до релізу" }
    ]
  }
];
