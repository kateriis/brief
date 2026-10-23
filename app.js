/* =========================================================
   Бриф на розробку сайту — логіка
   ---------------------------------------------------------
   Щоб змінити питання, редагуйте лише масив STAGES нижче.
   Поля питання:
     id        — унікальний ключ (латиницею, без пробілів)
     label     — текст питання
     hint      — підказка під питанням (необов'язково)
     required  — true, якщо питання обов'язкове
     key       — true, щоб показати плашку «важливо»
     type      — short | long | radio | checkbox | files | links
     options   — варіанти для radio / checkbox
     other     — true, щоб додати варіант «Інше» з полем для тексту
     summary   — назва рядка у першому (зведеному) повідомленні в Telegram
     placeholder — підказка всередині поля (необов'язково)
   ========================================================= */

const STAGES = [
  {
    id: 'about-you',
    title: 'Знайомство',
    desc: 'Кілька слів про вас, щоб я знала, до кого звертатися і як з вами зв’язатися.',
    questions: [
      { id: 'name', label: 'Як вас звати?', type: 'short', required: true, summary: 'Ім’я' },
      { id: 'company', label: 'Назва компанії, бренду або ваше ім’я як експерта', type: 'short', required: true, summary: 'Компанія' },
      { id: 'contact', label: 'Як з вами зручніше зв’язатися?', hint: 'Telegram, телефон чи пошта — те, що ви реально перевіряєте щодня.', type: 'short', required: true, summary: 'Контакт', placeholder: '@нік, +380… або пошта' },
      { id: 'socials', label: 'Посилання на сайт або соцмережі, якщо вони є', type: 'long', summary: 'Сайт / соцмережі' }
    ]
  },
  {
    id: 'business',
    title: 'Бізнес-задача',
    desc: 'Сайт — це інструмент. Тут розберемося, яку саме задачу він має вирішити.',
    questions: [
      { id: 'why_now', label: 'Навіщо вам сайт саме зараз?', hint: 'Наприклад: запускаєте новий продукт, старий сайт не приносить заявок, хочете вийти на нову аудиторію.', type: 'long', required: true, key: true },
      { id: 'main_action', label: 'Що відвідувач має зробити на сайті найчастіше?', hint: 'Можна обрати кілька варіантів.', type: 'checkbox', required: true, key: true, other: true, summary: 'Головна дія',
        options: ['Залишити заявку', 'Записатися', 'Зателефонувати або написати в месенджер', 'Розрахувати вартість', 'Купити онлайн', 'Ознайомитися з інформацією'] },
      { id: 'priority', label: 'Який напрямок, регіон чи сегмент клієнтів зараз у пріоритеті?', hint: 'Що для вас зараз найважливіше: конкретна послуга, місто, країна чи тип клієнтів.', type: 'long' }
    ]
  },
  {
    id: 'product',
    title: 'Продукт і фокус',
    desc: 'Що ви продаєте і на чому сайт має робити акцент.',
    questions: [
      { id: 'about', label: 'Розкажіть коротко про себе чи компанію', hint: 'Позиціонування, історія створення, цінності — те, що вважаєте важливим.', type: 'long' },
      { id: 'product', label: 'Що ви продаєте і в яких форматах це можна купити?', type: 'long', required: true, summary: 'Продукт' },
      { id: 'bestsellers', label: 'Що купують найчастіше, а що ви хотіли б продавати більше?', type: 'long' },
      { id: 'limits', label: 'Що входить у продукт і які в нього обмеження?', hint: 'Що клієнт отримує, а що не входить. Це допоможе не пообіцяти на сайті зайвого.', type: 'long' }
    ]
  },
  {
    id: 'client',
    title: 'Клієнт',
    desc: 'Перша гіпотеза про те, для кого ми робимо сайт.',
    questions: [
      { id: 'audience', label: 'Хто зазвичай у вас купує?', hint: 'Вік, рід занять, звідки про вас дізнаються — усе, що знаєте. Кількох речень достатньо.', type: 'long', required: true, key: true },
      { id: 'trigger', label: 'У якій ситуації людина починає шукати таке рішення?', hint: 'Що має статися в житті клієнта, щоб він пішов шукати когось, як ви?', type: 'long' },
      { id: 'choice', label: 'Що для неї найважливіше при виборі?', hint: 'Ціна, швидкість, гарантія, досвід, рекомендації знайомих…', type: 'long' }
    ]
  },
  {
    id: 'sales',
    title: 'Шлях продажу',
    desc: 'Якщо ви продаєте особисто і процес простий, відповідайте коротко або пропускайте питання.',
    questions: [
      { id: 'first_contact', label: 'Хто першим спілкується з клієнтом і що відбувається після заявки?', type: 'long' },
      { id: 'journey', label: 'Який шлях проходить клієнт від першого звернення до покупки?', hint: 'Наприклад: пише в Instagram → консультація → рахунок → оплата.', type: 'long' },
      { id: 'dropoff', label: 'На якому етапі угоди зриваються найчастіше?', hint: 'Що відбувається перед тим, як клієнт зникає: питає ціну й мовчить, «йде подумати», не відповідає після дзвінка? Ця відповідь найбільше впливає на структуру сайту.', type: 'long', key: true }
    ]
  },
  {
    id: 'value',
    title: 'Цінність і докази',
    desc: 'За що вас обирають і чим ми це підтвердимо на сайті.',
    questions: [
      { id: 'valued_for', label: 'За що клієнти вас цінують і рекомендують?', type: 'long', required: true },
      { id: 'difference', label: 'Що ви робите інакше, ніж конкуренти?', type: 'long' },
      { id: 'proof', label: 'Чим це можна довести?', hint: 'Цифри, роки досвіду, кількість клієнтів, кейси, відгуки, сертифікати, публікації — тільки те, що реально є на руках.', type: 'long', required: true, key: true },
      { id: 'no_promise', label: 'Чого у вас немає, тобто що сайт не повинен обіцяти?', hint: 'Наприклад: немає гарантії результату, немає доставки за кордон. Так ми не напишемо того, чого ви не зможете виконати.', type: 'long', key: true }
    ]
  },
  {
    id: 'site',
    title: 'Сайт',
    desc: 'Формат і склад майбутнього сайту.',
    questions: [
      { id: 'site_type', label: 'Тип сайту', type: 'radio', required: true, summary: 'Тип сайту',
        options: ['Лендінг — одна сторінка з блоками один під одним', 'Сайт-візитка або портфоліо', 'Багатосторінковий корпоративний сайт', 'Не знаю, порадьте'] },
      { id: 'language', label: 'Мова сайту', type: 'checkbox', other: true, options: ['Українська', 'Англійська'] },
      { id: 'sections', label: 'Які розділи чи сторінки мають бути на сайті?', hint: 'Наприклад: «про нас», «послуги», «ціни», «відгуки», «контакти». Якщо не знаєте — пропустіть, запропоную сама.', type: 'long' },
      { id: 'domain', label: 'Чи є у вас домен і хостинг?', hint: 'Домен — це адреса сайту (наприклад, apple.com), хостинг — місце, де він «живе».', type: 'radio',
        options: ['Є і домен, і хостинг', 'Є тільки домен', 'Немає, потрібна допомога', 'Не знаю'] }
    ]
  },
  {
    id: 'visual',
    title: 'Візуал',
    desc: 'Яким сайт має виглядати і відчуватися.',
    questions: [
      { id: 'brandbook', label: 'Чи є у вас брендбук або фірмовий стиль?', hint: 'Логотип, кольори, шрифти.', type: 'radio', required: true,
        options: ['Так, є повний брендбук', 'Є логотип і кольори', 'Немає'] },
      { id: 'mood', label: 'Яким має бути сайт?', hint: 'Можна обрати кілька варіантів.', type: 'checkbox', other: true,
        options: ['Мінімалістичним, з акцентом на функціональність', 'Формальним, лаконічним', 'Яскравим, емоційним', 'Насиченим фото та кейсами', 'Легким, позитивним', 'Витонченим, розкішним'] },
      { id: 'likes', label: 'Які сайти чи застосунки вам подобаються і чим саме?', hint: 'Додайте посилання і кілька слів про те, що зачепило: кольори, шрифти, фото, настрій, анімації.', type: 'long', required: true, key: true },
      { id: 'dislikes', label: 'Які сайти вам не подобаються і чого ви точно не хочете?', type: 'long' }
    ]
  },
  {
    id: 'materials',
    title: 'Матеріали',
    desc: 'Що вже є для сайту і хто готує решту.',
    questions: [
      { id: 'have', label: 'Що з цього вже є?', type: 'checkbox', other: true,
        options: ['Фото продукції, команди, клієнтів', 'Тексти', 'Відгуки — текстові або відео'] },
      { id: 'photos', label: 'Хто готує фото для сайту?', type: 'radio', other: true,
        options: ['Надасте ви', 'У вас є фотограф', 'Підбираю я з безкоштовних фотостоків', 'Підбираю я з платних фотостоків'] },
      { id: 'texts', label: 'Хто готує тексти для сайту?', type: 'radio', other: true,
        options: ['Надасте ви', 'У вас є копірайтер', 'Пишу я'] },
      { id: 'files', label: 'Файли', hint: 'Логотип, брендбук, фото, відгуки. Файли не зберігаються в чернетці, тому додайте їх перед відправкою.', type: 'files' },
      { id: 'links', label: 'Посилання на матеріали', hint: 'Google Drive, Dropbox, Figma, Pinterest — кожне посилання з нового рядка.', type: 'links', placeholder: 'https://…' }
    ]
  },
  {
    id: 'timing',
    title: 'Терміни і бюджет',
    desc: 'Останній крок — і бриф готовий.',
    questions: [
      { id: 'deadline', label: 'До якої дати потрібен сайт?', hint: 'Конкретна дата або подія, до якої сайт має запрацювати.', type: 'short', required: true, summary: 'Дедлайн' },
      { id: 'budget', label: 'На який бюджет ви орієнтуєтесь?', hint: 'Можна приблизно або діапазоном. Це допоможе запропонувати рішення, яке вам підійде.', type: 'short', summary: 'Бюджет' },
      { id: 'extra', label: 'Чи є ще щось, про що я не спитала?', type: 'long' }
    ]
  }
];

// Дані власниці брифу: фото, Telegram і документи для підвалу
const OWNER = {
  name: 'Катерина Качур',
  telegram: 'kateriis',
  role: 'Дизайн і розробка сайтів',
  photo: 'assets/photo.jpg',          // фото на фінальному екрані
  introPhoto: 'assets/photo-intro.webp', // фото на першому екрані (кольорове, повний кадр)
  replyTime: '1–2 робочих дні',
  // Юридичні документи. Порожнє посилання показується як текст без лінка.
  legal: [
    { title: 'Політика конфіденційності', url: 'privacy.html' },
    { title: 'Згода на обробку персональних даних', url: 'consent.html' }
  ],
  contacts: [
    { title: 'Telegram', url: 'https://t.me/kateriis' },
    { title: 'kateriis@gmail.com', url: 'mailto:kateriis@gmail.com' }
  ]
};

// Обмеження для файлів
const LIMITS = { maxFiles: 10, maxFileSize: 18 * 1024 * 1024 };

// Ключ чернетки в localStorage
const DRAFT_KEY = 'site-brief-draft-v1';

/* =========================================================
   Далі — код. Для зміни питань його редагувати не потрібно.
   ========================================================= */

const OTHER = '__other';          // значення варіанта «Інше»
const OTHER_SUFFIX = '__other';   // суфікс поля з текстом для «Інше»

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const form = $('#briefForm');
const intro = $('#intro');
const finalScreen = $('#final');
const nav = $('#stepnav');
const nextBtn = $('#nextBtn');
const backBtn = $('#backBtn');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Стан анкети
const state = {
  id: makeId(),
  step: -1,          // -1 — вступ, 0..N-1 — етапи
  answers: {},
  consent: false
};
let files = [];       // файли тримаємо в пам'яті, у чернетку вони не потрапляють
let sending = false;
let submitted = false;
const stageErrors = new Set();

// Швидкий доступ до питання за id
const Q = {};
STAGES.forEach((s, i) => s.questions.forEach(q => { Q[q.id] = Object.assign(q, { stage: i }); }));

/* ---------- Допоміжне ---------- */
function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function pad(n) { return String(n).padStart(2, '0'); }
function makeId() { return Math.random().toString(36).slice(2, 8); }
function fmtSize(bytes) {
  if (bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + ' КБ';
  return (bytes / 1024 / 1024).toFixed(1).replace('.', ',') + ' МБ';
}
const ARROW = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12m0 0-5-5m5 5-5 5" stroke="currentColor" stroke-width="1.6"/></svg>';

/* ---------- Побудова розмітки ---------- */
function renderAll() {
  STAGES.forEach((stage, i) => form.appendChild(renderStage(stage, i)));
  $('#dots').innerHTML = STAGES.map((s, i) =>
    `<button class="dot" type="button" data-step="${i}" aria-label="Етап ${i + 1}: ${esc(s.title)}"></button>`).join('');
  $('#factStages').textContent = STAGES.length;
}

function renderStage(stage, i) {
  const sec = document.createElement('section');
  sec.className = 'stage';
  sec.id = 'stage-' + stage.id;
  sec.dataset.index = i;
  sec.setAttribute('aria-labelledby', 'title-' + stage.id);
  sec.innerHTML = `
    <div class="stage__aside">
      <div class="stage__count"><span class="stage__num">${pad(i + 1)}</span><span class="stage__total">/ ${pad(STAGES.length)}</span></div>
      <h2 class="stage__title" id="title-${stage.id}" tabindex="-1">${esc(stage.title)}</h2>
      ${stage.desc ? `<p class="stage__desc">${esc(stage.desc)}</p>` : ''}
      <ol class="toc" aria-label="Усі етапи">${STAGES.map((s, j) =>
        `<li><button class="toc__item" type="button" data-step="${j}"><span class="toc__num">${pad(j + 1)}</span>${esc(s.title)}</button></li>`).join('')}</ol>
    </div>
    <div class="stage__body"></div>`;
  const body = $('.stage__body', sec);
  stage.questions.forEach(q => body.appendChild(renderQuestion(q)));
  if (i === STAGES.length - 1) body.appendChild(renderConsent());
  return sec;
}

function renderQuestion(q) {
  const wrap = document.createElement('div');
  wrap.className = 'q';
  wrap.dataset.qid = q.id;
  const fid = 'f-' + q.id, hid = 'h-' + q.id, eid = 'e-' + q.id;
  const isGroup = q.type === 'radio' || q.type === 'checkbox';
  const describedby = [q.hint ? hid : '', eid].filter(Boolean).join(' ');
  const req = q.required ? '<span class="q__req" aria-hidden="true">&nbsp;*</span>' : '';
  const labelInner = esc(q.label) + req;
  const label = isGroup || q.type === 'files'
    ? `<span class="q__label" id="l-${q.id}">${labelInner}</span>`
    : `<label class="q__label" for="${fid}">${labelInner}</label>`;

  let control = '';
  const ariaReq = q.required ? ' aria-required="true"' : '';
  const ph = q.placeholder ? ` placeholder="${esc(q.placeholder)}"` : '';
  switch (q.type) {
    case 'short':
      control = `<textarea class="field field--short" id="${fid}" name="${q.id}" rows="1" aria-describedby="${describedby}"${ariaReq}${ph}></textarea>`;
      break;
    case 'long':
    case 'links':
      control = `<textarea class="field field--long" id="${fid}" name="${q.id}" rows="4" aria-describedby="${describedby}"${ariaReq}${ph}></textarea>`;
      break;
    case 'radio':
    case 'checkbox': {
      const opts = q.options.map(o => optHtml(q, o, o)).join('');
      const other = q.other
        ? optHtml(q, 'Інше', OTHER) +
          `<textarea class="field field--short opt-other" rows="1" name="${q.id}${OTHER_SUFFIX}" aria-label="Ваш варіант для питання «${esc(q.label)}»" placeholder="Ваш варіант" hidden></textarea>`
        : '';
      control = `<div class="opts" role="${q.type === 'radio' ? 'radiogroup' : 'group'}" aria-labelledby="l-${q.id}" aria-describedby="${describedby}"${ariaReq}>${opts}${other}</div>`;
      break;
    }
    case 'files':
      control = `
        <div class="drop" id="${fid}" tabindex="0" role="button" aria-labelledby="l-${q.id}" aria-describedby="${describedby}">
          <input class="drop__input" type="file" multiple tabindex="-1" aria-hidden="true">
          <span class="drop__icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 14V3m0 0L4.5 7.5M9 3l4.5 4.5" stroke="currentColor" stroke-width="1.6"/></svg></span>
          <span class="drop__title">Перетягніть файли сюди</span>
          <span class="drop__sub">або натисніть, щоб вибрати · до ${LIMITS.maxFiles} файлів, кожен до ${LIMITS.maxFileSize / 1024 / 1024} МБ</span>
        </div>
        <ul class="filelist" aria-live="polite"></ul>`;
      break;
  }
  wrap.innerHTML = `
    <div class="q__head">${label}${q.key ? '<span class="badge">важливо</span>' : ''}</div>
    ${q.hint ? `<p class="q__hint" id="${hid}">${esc(q.hint)}</p>` : ''}
    ${control}
    <p class="q__error" id="${eid}"></p>`;
  return wrap;
}

function optHtml(q, text, value) {
  return `<label class="opt opt--${q.type}"><input type="${q.type}" name="${q.id}" value="${esc(value)}"><span class="opt__mark" aria-hidden="true"></span><span class="opt__text">${esc(text)}</span></label>`;
}

function legalLink(doc) {
  return doc.url ? `<a href="${esc(doc.url)}" target="_blank" rel="noopener">${esc(doc.title)}</a>` : esc(doc.title);
}

function renderConsent() {
  const wrap = document.createElement('div');
  wrap.className = 'q q--consent';
  wrap.dataset.qid = 'consent';
  const docs = OWNER.legal.slice(0, 2).map(d => `«${legalLink(d)}»`).join(' та ');
  wrap.innerHTML = `
    <label class="opt opt--checkbox consent">
      <input type="checkbox" name="consent" id="f-consent" aria-describedby="e-consent" aria-required="true">
      <span class="opt__mark" aria-hidden="true"></span>
      <span class="opt__text">Я погоджуюсь на обробку персональних даних відповідно до ${docs}</span>
    </label>
    <p class="q__error" id="e-consent"></p>`;
  return wrap;
}

function renderStatic() {
  $('#introName').textContent = OWNER.name;
  $('#introRole').textContent = OWNER.role;
  const introImg = $('#introImg');
  introImg.addEventListener('error', () => { $('#introPhoto').hidden = true; });
  introImg.alt = `${OWNER.name} — ${OWNER.role.toLowerCase()}`;
  introImg.src = OWNER.introPhoto || OWNER.photo;
  $('#footerName').textContent = OWNER.name;
  $('#footerLegal').innerHTML = OWNER.legal.map(d => `<li>${d.url ? legalLink(d) : `<span>${esc(d.title)}</span>`}</li>`).join('');
  $('#footerContacts').innerHTML = OWNER.contacts.map(c => `<li><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.title)}</a></li>`).join('');

  const tg = tgUrl();
  $('#finalTg').href = tg;
  const img = $('#finalImg');
  img.addEventListener('error', () => $('#finalPhoto').classList.add('is-empty'));
  img.alt = OWNER.name;
  // заглушка, поки немає фото: ініціали на бордовому тлі
  $('#finalMono').textContent = OWNER.name.split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
  $('#finalTag').textContent = OWNER.name;
  img.src = OWNER.photo;

  $('#nextSteps').innerHTML = [
    `<b>Прочитаю бриф</b> і продумаю перші ідеї — протягом ${esc(OWNER.replyTime)}.`,
    `<b>Напишу вам</b> з уточненнями та запропоную час для короткого дзвінка.`,
    `<b>Після дзвінка надішлю пропозицію:</b> етапи, терміни і вартість роботи.`
  ].map(t => `<li><span>${t}</span></li>`).join('');
}

function tgUrl() { return 'https://t.me/' + OWNER.telegram.replace(/^@/, ''); }

/* ---------- Значення відповідей ---------- */
function formatAnswer(q) {
  const a = state.answers[q.id];
  const other = String(state.answers[q.id + OTHER_SUFFIX] || '').trim();
  const otherText = other ? 'Інше: ' + other : 'Інше';
  switch (q.type) {
    case 'radio':
      if (!a) return '';
      return a === OTHER ? otherText : a;
    case 'checkbox':
      if (!Array.isArray(a) || !a.length) return '';
      return a.map(v => (v === OTHER ? otherText : v)).join(', ');
    case 'files':
      return files.map(f => `${f.name} (${fmtSize(f.size)})`).join('\n');
    case 'links':
      return String(a || '').split('\n').map(s => s.trim()).filter(Boolean).join('\n');
    default:
      return String(a || '').trim();
  }
}
const isEmpty = q => formatAnswer(q) === '';

// Зчитуємо значення з поля в стан
function syncFromField(t) {
  const name = t.name;
  if (!name) return;
  if (name === 'consent') {
    state.consent = t.checked;
    t.closest('.opt').classList.toggle('is-checked', t.checked);
    if (t.checked) clearError('consent');
  } else if (name.endsWith(OTHER_SUFFIX)) {
    state.answers[name] = t.value;
  } else {
    const q = Q[name];
    if (!q) return;
    if (q.type === 'radio') {
      const c = $(`input[name="${name}"]:checked`, form);
      state.answers[name] = c ? c.value : '';
      refreshOptions(q);
    } else if (q.type === 'checkbox') {
      state.answers[name] = $$(`input[name="${name}"]:checked`, form).map(i => i.value);
      refreshOptions(q);
    } else {
      state.answers[name] = t.value;
    }
    if (!isEmpty(q)) clearError(q.id);
  }
  scheduleSave();
  updateDots();
}

// Підсвічування вибраних варіантів і поле «Інше»
function refreshOptions(q) {
  const inputs = $$(`input[name="${q.id}"]`, form);
  inputs.forEach(i => i.closest('.opt').classList.toggle('is-checked', i.checked));
  const otherField = $(`[name="${q.id}${OTHER_SUFFIX}"]`, form);
  if (otherField) {
    const show = inputs.some(i => i.value === OTHER && i.checked);
    const wasHidden = otherField.hidden;
    otherField.hidden = !show;
    if (show) {
      autoGrow(otherField);
      if (wasHidden && document.activeElement && document.activeElement.value === OTHER) otherField.focus();
    }
  }
}

// Відновлюємо поля зі стану (після чернетки)
function applyState() {
  Object.values(Q).forEach(q => {
    const a = state.answers[q.id];
    if (q.type === 'radio' || q.type === 'checkbox') {
      const vals = q.type === 'radio' ? [a] : (Array.isArray(a) ? a : []);
      $$(`input[name="${q.id}"]`, form).forEach(i => { i.checked = vals.includes(i.value); });
      const of = $(`[name="${q.id}${OTHER_SUFFIX}"]`, form);
      if (of) of.value = state.answers[q.id + OTHER_SUFFIX] || '';
      refreshOptions(q);
    } else if (q.type !== 'files') {
      const t = $(`[name="${q.id}"]`, form);
      if (t) t.value = a || '';
    }
  });
  const c = $('#f-consent');
  c.checked = !!state.consent;
  c.closest('.opt').classList.toggle('is-checked', c.checked);
}

/* ---------- Поля, що ростуть разом з текстом ---------- */
function autoGrow(t) {
  if (!t.offsetParent) return;      // приховане поле не міряємо
  t.style.height = 'auto';
  t.style.height = (t.scrollHeight + 2) + 'px';
}
function growVisible() { $$('.stage.is-active textarea', form).forEach(autoGrow); }

/* ---------- Чернетка ---------- */
let saveTimer = null;
function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveDraft, 300); }
function saveDraft() {
  if (submitted) return;            // бриф уже надіслано — чернетку не відновлюємо
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      v: 1, savedAt: Date.now(), id: state.id, step: state.step, answers: state.answers, consent: state.consent
    }));
  } catch (e) { /* приватний режим або заблоковане сховище — працюємо без чернетки */ }
}
function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function clearDraft() {
  submitted = true;
  clearTimeout(saveTimer);
  try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ігноруємо */ }
}
function hasAnswers(answers) {
  return Object.values(answers || {}).some(v => (Array.isArray(v) ? v.length : String(v || '').trim()));
}

/* ---------- Валідація ---------- */
function setError(id, msg) {
  const wrap = $(`.q[data-qid="${id}"]`, form);
  if (!wrap) return;
  wrap.classList.add('q--error');
  $('.q__error', wrap).textContent = msg;
  const ctl = $('textarea, .opts, .drop, input', wrap);
  if (ctl) ctl.setAttribute('aria-invalid', 'true');
}
function clearError(id) {
  const wrap = $(`.q[data-qid="${id}"]`, form);
  if (!wrap || !wrap.classList.contains('q--error')) return;
  wrap.classList.remove('q--error');
  $('.q__error', wrap).textContent = '';
  $$('[aria-invalid]', wrap).forEach(el => el.removeAttribute('aria-invalid'));
  const i = Q[id] ? Q[id].stage : STAGES.length - 1;
  if (!$$('.q--error', form).some(w => Number(w.closest('.stage').dataset.index) === i)) {
    stageErrors.delete(i);
    updateDots();
  }
}

// Повертає перший незаповнений блок етапу або null
function validateStage(i) {
  let first = null;
  STAGES[i].questions.forEach(q => {
    if (q.required && isEmpty(q)) {
      const group = q.type === 'radio' || q.type === 'checkbox';
      setError(q.id, group ? 'Оберіть, будь ласка, хоча б один варіант' : 'Заповніть, будь ласка, це поле');
      first = first || $(`.q[data-qid="${q.id}"]`, form);
    }
  });
  if (i === STAGES.length - 1 && !state.consent) {
    setError('consent', 'Без згоди на обробку даних я не зможу отримати бриф');
    first = first || $('.q[data-qid="consent"]', form);
  }
  if (first) stageErrors.add(i); else stageErrors.delete(i);
  updateDots();
  return first;
}

function focusError(wrap) {
  wrap.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  const ctl = $('textarea:not([hidden]), input, .drop', wrap);
  if (ctl) setTimeout(() => ctl.focus({ preventScroll: true }), reduceMotion ? 0 : 350);
}

/* ---------- Навігація ---------- */
function updateChrome() {
  const n = STAGES.length;
  const onStage = state.step >= 0;
  const counter = $('#counter');
  counter.hidden = !onStage;
  if (onStage) counter.innerHTML = `<b>${pad(state.step + 1)}</b><span>/${pad(n)}</span>`;
  $('#progressBar').style.width = onStage ? ((state.step + 1) / n * 100) + '%' : '0%';
  document.body.classList.toggle('is-stage', onStage);
}

function updateDots() {
  $$('.toc__item').forEach(b => {
    const i = Number(b.dataset.step);
    const qs = STAGES[i].questions;
    b.classList.toggle('is-current', i === state.step);
    b.classList.toggle('is-done', i !== state.step && qs.some(q => !isEmpty(q)) && qs.every(q => !q.required || !isEmpty(q)));
    b.classList.toggle('has-error', i !== state.step && stageErrors.has(i));
    if (i === state.step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
  });
  $$('.dot').forEach((d, i) => {
    const qs = STAGES[i].questions;
    const done = qs.some(q => !isEmpty(q)) && qs.every(q => !q.required || !isEmpty(q));
    d.classList.toggle('is-current', i === state.step);
    d.classList.toggle('is-done', done && i !== state.step);
    d.classList.toggle('has-error', stageErrors.has(i) && i !== state.step);
    if (i === state.step) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
  });
}

function showScreen(which) {
  intro.hidden = which !== 'intro';
  intro.classList.toggle('is-active', which === 'intro');
  finalScreen.hidden = which !== 'final';
  finalScreen.classList.toggle('is-active', which === 'final');
  form.hidden = which !== 'form';
  nav.hidden = which !== 'form';
}

function goTo(i, opts = {}) {
  i = Math.max(0, Math.min(STAGES.length - 1, i));
  showScreen('form');
  const stages = $$('.stage', form);
  stages.forEach((s, j) => s.classList.toggle('is-active', j === i));
  state.step = i;
  placeNav();
  $('#nextLabel').textContent = i === STAGES.length - 1 ? 'Надіслати бриф' : 'Далі';
  updateChrome();
  updateDots();
  requestAnimationFrame(growVisible);
  if (!opts.keepScroll) window.scrollTo(0, 0);
  if (opts.focus !== false) $('.stage__title', stages[i]).focus({ preventScroll: true });
  scheduleSave();
}

// Від 700px навігація стоїть під полями поточного етапу.
// На мобільному вона лежить прямо в body: анімація етапу (transform)
// інакше ламає position: fixed, і панель з'їжджає вниз.
const wideMq = window.matchMedia('(min-width: 700px)');
function placeNav() {
  const active = $('.stage.is-active', form);
  const target = wideMq.matches && active ? $('.stage__body', active) : document.body;
  if (nav.parentNode !== target) {
    if (target === document.body) document.body.insertBefore(nav, $('#footer'));
    else target.appendChild(nav);
  }
}

function showIntro() {
  state.step = -1;
  showScreen('intro');
  updateChrome();
  window.scrollTo(0, 0);
  scheduleSave();
}

function next() {
  if (sending) return;
  const err = validateStage(state.step);
  if (err) { focusError(err); return; }
  if (state.step === STAGES.length - 1) submit();
  else goTo(state.step + 1);
}

function back() {
  if (state.step > 0) goTo(state.step - 1);
  else showIntro();
}

/* ---------- Файли ---------- */
function addFiles(list) {
  const errors = [];
  for (const f of Array.from(list)) {
    if (files.some(x => x.name === f.name && x.size === f.size)) continue;
    if (files.length >= LIMITS.maxFiles) { errors.push(`Можна додати не більше ${LIMITS.maxFiles} файлів.`); break; }
    if (f.size > LIMITS.maxFileSize) { errors.push(`«${f.name}» більший за ${LIMITS.maxFileSize / 1024 / 1024} МБ — надішліть його посиланням.`); continue; }
    files.push(f);
  }
  renderFiles();
  if (errors.length) setError('files', errors.join(' ')); else clearError('files');
  updateDots();
}

function renderFiles() {
  const list = $('.q[data-qid="files"] .filelist', form);
  if (!list) return;
  list.innerHTML = files.map((f, i) => `
    <li>
      <span class="filelist__name" title="${esc(f.name)}">${esc(f.name)}</span>
      <span class="filelist__size">${fmtSize(f.size)}</span>
      <button class="filelist__del" type="button" data-del="${i}" aria-label="Видалити ${esc(f.name)}">×</button>
    </li>`).join('') +
    (files.length ? `<li class="filelist__count" style="border:0;padding:4px 0 0">${files.length} з ${LIMITS.maxFiles}</li>` : '');
}

function bindFiles() {
  const zone = $('.drop', form);
  if (!zone) return;
  const input = $('.drop__input', zone);
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
  input.addEventListener('click', e => e.stopPropagation());
  input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });
  let depth = 0;
  zone.addEventListener('dragenter', e => { e.preventDefault(); depth++; zone.classList.add('is-drag'); });
  zone.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
  zone.addEventListener('dragleave', () => { depth = Math.max(0, depth - 1); if (!depth) zone.classList.remove('is-drag'); });
  zone.addEventListener('drop', e => {
    e.preventDefault(); depth = 0; zone.classList.remove('is-drag');
    if (e.dataTransfer && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  });
  // файл, кинутий повз зону, не повинен відкриватися у вкладці замість анкети
  window.addEventListener('dragover', e => e.preventDefault());
  window.addEventListener('drop', e => e.preventDefault());

  $('.filelist', form).addEventListener('click', e => {
    const b = e.target.closest('[data-del]');
    if (!b) return;
    files.splice(Number(b.dataset.del), 1);
    renderFiles();
    clearError('files');
    updateDots();
  });
}

/* ---------- Збір відповідей ---------- */
function buildPayload() {
  const summary = [];
  Object.values(Q).forEach(q => {
    if (!q.summary) return;
    const v = formatAnswer(q);
    if (v) summary.push({ label: q.summary, value: v.length > 300 ? v.slice(0, 300) + '…' : v });
  });
  if (files.length) summary.push({ label: 'Файли', value: files.length + ' шт. — надійдуть окремими повідомленнями' });
  const stages = STAGES.map((s, i) => ({
    num: pad(i + 1),
    title: s.title,
    items: s.questions.map(q => ({ label: q.label, value: formatAnswer(q) })).filter(it => it.value)
  })).filter(s => s.items.length);
  return { id: state.id, createdAt: new Date().toISOString(), source: location.href, summary, stages };
}

// Текстова копія відповідей для завантаження
function buildText() {
  const p = buildPayload();
  const date = new Date().toLocaleString('uk-UA');
  const out = ['БРИФ НА РОЗРОБКУ САЙТУ', `№ ${p.id} · ${date}`, ''];
  if (p.summary.length) {
    out.push('КОРОТКО', '');
    p.summary.forEach(s => out.push(`• ${s.label}: ${s.value}`));
    out.push('');
  }
  p.stages.forEach(s => {
    const head = `${s.num} · ${s.title.toUpperCase()}`;
    out.push('', head, '—'.repeat(Math.min(head.length, 40)), '');
    s.items.forEach(it => out.push(it.label, it.value, ''));
  });
  if (files.length) out.push('', 'Файли з анкети не вкладено в цей документ — надішліть їх, будь ласка, окремо в Telegram.');
  return out.join('\n');
}

function downloadAnswers() {
  const name = String(state.answers.name || 'бриф').trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 40) || 'бриф';
  const blob = new Blob(['﻿' + buildText()], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `бриф-${name}-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ---------- Надсилання ---------- */
async function fetchWithTimeout(url, options, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, Object.assign({}, options, { signal: ctrl.signal })); }
  finally { clearTimeout(timer); }
}

function setSending(on, label) {
  sending = on;
  nextBtn.disabled = on;
  backBtn.disabled = on;
  $('#nextLabel').textContent = on ? (label || 'Надсилаю…') : 'Надіслати бриф';
}

async function submit() {
  // перевіряємо всі етапи: якщо десь порожньо — ведемо туди
  for (let i = 0; i < STAGES.length; i++) {
    const err = validateStage(i);
    if (err) {
      if (i !== state.step) {
        goTo(i, { focus: false });
        toast('Залишилось заповнити кілька питань на цьому етапі');
      }
      setTimeout(() => focusError(err), 80);
      return;
    }
  }
  saveDraft();   // спершу зберігаємо, щоб нічого не загубилося

  const endpoint = String((window.BRIEF_CONFIG && window.BRIEF_CONFIG.endpoint) || '').trim();
  if (!endpoint) { openSheet('offline'); return; }

  setSending(true);
  const payload = buildPayload();
  try {
    const res = await fetchWithTimeout(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, 30000);
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || 'HTTP ' + res.status);
  } catch (err) {
    console.error('Бриф не надіслано:', err);
    setSending(false);
    openSheet('error');
    return;
  }

  // файли — окремими запитами, щоб великий файл не зупинив текст брифу
  const failed = [];
  for (let k = 0; k < files.length; k++) {
    setSending(true, `Файли ${k + 1}/${files.length}…`);
    try {
      const fd = new FormData();
      fd.append('briefId', state.id);
      fd.append('name', String(state.answers.name || '').trim());
      fd.append('file', files[k], files[k].name);
      const res = await fetchWithTimeout(endpoint, { method: 'POST', body: fd }, 120000);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'HTTP ' + res.status);
    } catch (err) {
      console.error('Файл не надіслано:', files[k].name, err);
      failed.push(files[k].name);
    }
  }
  setSending(false);
  clearDraft();
  showFinal({ failed });
}

function showFinal({ failed = [], offline = false } = {}) {
  state.step = -1;
  showScreen('final');
  updateChrome();
  $('#progressBar').style.width = '100%';
  const lead = $('#finalLead');
  const note = $('#finalNote');
  if (offline) {
    lead.textContent = 'Залишився один крок: надішліть завантажений файл мені в Telegram — і я скоро з вами зв’яжуся.';
    note.hidden = !files.length;
    note.textContent = 'Файли з анкети теж додайте до повідомлення в Telegram.';
  } else {
    lead.textContent = 'Я отримала ваш бриф і скоро з вами зв’яжуся.';
    note.hidden = !failed.length;
    note.textContent = failed.length ? `Не вдалося передати файли: ${failed.join(', ')}. Надішліть їх, будь ласка, мені в Telegram.` : '';
  }
  window.scrollTo(0, 0);
  $('#finalTitle').focus({ preventScroll: true });
}

/* ---------- Модальне вікно ---------- */
let lastFocus = null;
function openSheet(mode) {
  const sheet = $('#sheet');
  const btn = (label, action, ghost) =>
    `<button class="btn${ghost ? ' btn--ghost' : ''}" type="button" data-action="${action}"><span class="btn__label">${label}</span>${ghost ? '' : `<span class="btn__arrow" aria-hidden="true">${ARROW}</span>`}</button>`;
  if (mode === 'offline') {
    $('#sheetTitle').textContent = 'Майже готово';
    $('#sheetText').textContent = 'Автоматичне надсилання ще не налаштоване. Завантажте файл з відповідями й надішліть його мені в Telegram — так нічого не загубиться.';
    $('#sheetActions').innerHTML = btn('Завантажити відповіді', 'download-offline') + btn('Написати в Telegram', 'telegram', true);
  } else {
    $('#sheetTitle').textContent = 'Не вдалося надіслати';
    $('#sheetText').textContent = 'Ваші відповіді збережені на цьому пристрої. Спробуйте ще раз або завантажте файл і надішліть його мені в Telegram.';
    $('#sheetActions').innerHTML = btn('Спробувати ще раз', 'retry') + btn('Завантажити відповіді', 'download', true) + btn('Написати в Telegram', 'telegram', true);
  }
  lastFocus = document.activeElement;
  sheet.hidden = false;
  $('.sheet__actions .btn', sheet).focus();
}
function closeSheet() {
  $('#sheet').hidden = true;
  if (lastFocus) lastFocus.focus({ preventScroll: true });
}

/* ---------- Сповіщення ---------- */
let toastTimer = null;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-visible'), 3200);
}

/* ---------- Події ---------- */
function bindEvents() {
  form.addEventListener('input', e => {
    if (e.target.matches('textarea')) autoGrow(e.target);
    syncFromField(e.target);
  });
  form.addEventListener('change', e => { if (e.target.matches('input')) syncFromField(e.target); });
  form.addEventListener('submit', e => e.preventDefault());

  // Enter у короткому полі переводить до наступного поля
  form.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && e.target.matches('.field--short')) {
      e.preventDefault();
      const fields = $$('.stage.is-active textarea:not([hidden]), .stage.is-active input:not(.drop__input)', form);
      const i = fields.indexOf(e.target);
      if (fields[i + 1]) fields[i + 1].focus(); else nextBtn.focus();
    }
  });

  $('#startBtn').addEventListener('click', () => goTo(0));
  nextBtn.addEventListener('click', next);
  backBtn.addEventListener('click', back);
  $('#dots').addEventListener('click', e => {
    const d = e.target.closest('.dot');
    if (d && !sending) goTo(Number(d.dataset.step));
  });
  form.addEventListener('click', e => {
    const b = e.target.closest('.toc__item');
    if (b && !sending) goTo(Number(b.dataset.step));
  });
  $('#finalDownload').addEventListener('click', downloadAnswers);

  $('#sheet').addEventListener('click', e => {
    if (e.target.closest('[data-close]')) { closeSheet(); return; }
    const b = e.target.closest('[data-action]');
    if (!b) return;
    const action = b.dataset.action;
    if (action === 'download') downloadAnswers();
    if (action === 'download-offline') {
      downloadAnswers();
      $('#sheet').hidden = true;
      showFinal({ offline: true });   // чернетку не видаляємо — бриф ще не надіслано
    }
    if (action === 'telegram') window.open(tgUrl(), '_blank', 'noopener');
    if (action === 'retry') { $('#sheet').hidden = true; submit(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet(); });

  let rt = null;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(growVisible, 120); });
  wideMq.addEventListener('change', placeNav);
  // зберігаємо чернетку при закритті вкладки
  window.addEventListener('pagehide', saveDraft);
}

/* ---------- Старт ---------- */
function init() {
  renderAll();
  renderStatic();
  bindFiles();
  bindEvents();

  const draft = loadDraft();
  if (draft && hasAnswers(draft.answers)) {
    state.id = draft.id || state.id;
    state.answers = draft.answers || {};
    state.consent = !!draft.consent;
    applyState();
    if (typeof draft.step === 'number' && draft.step >= 0) goTo(draft.step, { focus: false });
    else showIntro();
    toast('Чернетку відновлено');
  } else {
    showIntro();
  }
}

init();
