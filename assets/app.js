/* Общий каркас всех страниц: навигация, тема, загрузка данных, утилиты, иконки.
   Дизайн v2 (docs/ДИЗАЙН.md): верхние таблетки + левая рейка иконок, никакого сайдбара.
   Подключается после CoreUI и Chart.js. Страница задаёт себя атрибутом body[data-page]. */
(function (глобал) {
'use strict';

/* ───────── страницы сайта ───────── */
const СТРАНИЦЫ = [
  {id:'index',          имя:'Главная',        файл:'index.html',          иконка:'тело'},
  {id:'whoop',          имя:'WHOOP',          файл:'whoop.html',          иконка:'сердце'},
  {id:'связи',          имя:'Связи',          файл:'связи.html',          иконка:'график'},
  {id:'тело',           имя:'Тело',           файл:'тело.html',           иконка:'весы'},
  {id:'анализы',        имя:'Анализы',        файл:'анализы.html',        иконка:'капля'},
  {id:'данные',         имя:'Данные',         файл:'данные.html',         иконка:'база'},
  {id:'врач',           имя:'Для врача',      файл:'врач.html',           иконка:'бланк'},
];
const СКОРО = [];

/* ───────── иконки: свои линейные, 1.8px, скруглённые концы ───────── */
const ИКОНКИ = {
  тело:    '<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
  сердце:  '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"></path>',
  молния:  '<path d="M13 2L5 14h6l-1 8 8-12h-6z"></path>',
  график:  '<path d="M3 17l5-6 4 4 5-8 4 5"></path>',
  часы:    '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
  капля:   '<path d="M12 3l4 7a4.5 4.5 0 1 1-8 0z"></path>',
  печень:  '<path d="M4 10c0-3 3-5 8-5s8 2 8 5-2 9-8 9-8-6-8-9z"></path>',
  почки:   '<ellipse cx="9" cy="12" rx="4" ry="6"></ellipse><ellipse cx="15" cy="12" rx="4" ry="6"></ellipse>',
  мышцы:   '<path d="M6 16l3-9 4 3 5-2"></path><circle cx="18" cy="8" r="2"></circle>',
  весы:    '<path d="M4 20h16"></path><path d="M6 20V8h12v12"></path><path d="M9 12h6"></path>',
  база:    '<ellipse cx="12" cy="6" rx="7" ry="3"></ellipse><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"></path><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"></path>',
  поиск:   '<circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path>',
  колокол: '<path d="M6 8a6 6 0 0 1 12 0v5l2 3H4l2-3z"></path><path d="M10 19a2 2 0 0 0 4 0"></path>',
  печать:  '<path d="M7 9V4h10v5"></path><rect x="4" y="9" width="16" height="7" rx="2"></rect><path d="M7 14h10v6H7z"></path>',
  луна:    '<path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10z"></path>',
  солнце:  '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"></path>',
  вверх:   '<path d="M12 19V5"></path><path d="M6 11l6-6 6 6"></path>',
  вниз:    '<path d="M12 5v14"></path><path d="M6 13l6 6 6-6"></path>',
  ровно:   '<path d="M5 12h14"></path>',
  вперёд:  '<path d="M9 6l6 6-6 6"></path>',
  календарь:'<rect x="3" y="5" width="18" height="16" rx="3"></rect><path d="M8 3v4M16 3v4M3 11h18"></path>',
  внимание:'<path d="M12 4l9 16H3z"></path><path d="M12 10v4M12 17v.5"></path>',
  крест:   '<path d="M12 5v14M5 12h14"></path>',
  список:  '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"></path>',
  луна2:   '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"></path>',
  гантель: '<path d="M6 12h12M4 9v6M20 9v6M2 10v4M22 10v4"></path>',
  огонь:   '<path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-4 1 1 2 1 3-4z"></path><path d="M9 14c0 2 1 4 3 4"></path>',
  весы2:   '<path d="M12 3v18"></path><path d="M5 8h14"></path><path d="M5 8l-3 6h6z"></path><path d="M19 8l-3 6h6z"></path>',
  ходьба:  '<circle cx="12" cy="5" r="2"></circle><path d="M9 21l2-7-3-2 3-5 4 2 2 3"></path>',
  йога:    '<circle cx="12" cy="4" r="2"></circle><path d="M4 14l8-4 8 4M12 10v10"></path>',
  велосипед:'<circle cx="6" cy="17" r="3"></circle><circle cx="18" cy="17" r="3"></circle><path d="M6 17l4-8h5l3 8M9 9h5"></path>',
  бег:     '<circle cx="13" cy="4" r="2"></circle><path d="M6 20l4-5-2-4 4-3 3 4 3 1"></path>',
  сон:     '<path d="M4 18v-5a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v5"></path><path d="M2 18h20M7 9V6h10v3"></path>',
  бланк:   '<rect x="5" y="3" width="14" height="18" rx="3"></rect><path d="M9 8h6M9 12h6M9 16h3"></path>',
  скрепка: '<path d="M20 11l-8.5 8.5a4.5 4.5 0 0 1-6.4-6.4L13 4.8a3 3 0 0 1 4.2 4.2l-8 8a1.5 1.5 0 0 1-2.1-2.1l7.6-7.6"></path>',
  настройки:'<circle cx="12" cy="12" r="3"></circle><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.3.9a7 7 0 0 0-1.7-1L14.5 3h-5l-.4 2.4a7 7 0 0 0-1.7 1L5.1 5.5l-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.3-.9a7 7 0 0 0 1.7 1l.4 2.4h5l.4-2.4a7 7 0 0 0 1.7-1l2.3.9 2-3.5-2-1.5c.1-.3.1-.7.1-1z"></path>',
};
const икона = (имя, размер) => `<svg viewBox="0 0 24 24" ${размер ? `style="width:${размер}px;height:${размер}px"` : ''}>${ИКОНКИ[имя] || ''}</svg>`;

/* ───────── язык: словарь assets/i18n.js, недостающий ключ берётся из русского ───────── */
const раскодПуть = п => { try { return decodeURIComponent(п); } catch (e) { return п; } };
let ЯЗЫК = 'ru';
try { ЯЗЫК = localStorage.getItem('hh-lang') || 'ru'; } catch (e) {}
if (!['ru', 'en', 'pl'].includes(ЯЗЫК)) ЯЗЫК = 'ru';
/* английский и польский есть только у листа врача: остальные страницы переведены не полностью,
   и после просмотра сводки на английском главная показывала бы смесь языков */
if (!/врач/i.test(раскодПуть(location.pathname))) ЯЗЫК = 'ru';
const язык = () => ЯЗЫК;
/** T('ключ') · T('ключ', {n: 5}) — в шаблоне {имя} заменяется значением */
function T(ключ, пар) {
  const сл = глобал.I18N || {ru: {}};
  const дан = глобал.I18N_DATA || {};   // переводы из данных (показатели, события) — приходят с site.json
  let s = (дан[ЯЗЫК] && дан[ЯЗЫК][ключ]) != null ? дан[ЯЗЫК][ключ]
        : (сл[ЯЗЫК] && сл[ЯЗЫК][ключ]) != null ? сл[ЯЗЫК][ключ]
        : (сл.ru && сл.ru[ключ]) != null ? сл.ru[ключ] : ключ;
  if (пар) s = s.replace(/\{([^{}]+)\}/g, (_, k) => (пар[k] != null ? пар[k] : '{' + k + '}'));
  return s;
}
/** название показателя и группы на языке врача, с откатом на русское из данных */
const Tимя = имя => T('показатель.' + имя) === 'показатель.' + имя ? имя : T('показатель.' + имя);
const Tгруппа = г => T('группа.' + г) === 'группа.' + г ? г : T('группа.' + г);
const Tключ = (префикс, имя) => T(префикс + '.' + имя) === префикс + '.' + имя ? имя : T(префикс + '.' + имя);
function сменитьЯзык(л) {
  ЯЗЫК = ['ru', 'en', 'pl'].includes(л) ? л : 'ru';
  try { localStorage.setItem('hh-lang', ЯЗЫК); } catch (e) {}
  document.documentElement.lang = ЯЗЫК;
  document.dispatchEvent(new CustomEvent('смена-языка'));
}
document.documentElement.lang = ЯЗЫК;

/* ───────── тема ───────── */
const root = document.documentElement;
(function () {
  const q = new URLSearchParams(location.search).get('theme');
  let t = null;
  try { t = localStorage.getItem('hh-theme'); } catch (e) {}
  if (q === 'dark' || q === 'light') t = q;
  if (!t && matchMedia('(prefers-color-scheme: dark)').matches) t = 'dark';
  root.dataset.coreuiTheme = t === 'dark' ? 'dark' : 'light';
})();
const тёмная = () => root.dataset.coreuiTheme === 'dark';

/* ───────── форматирование ───────── */
const ЛОКАЛЬ = () => ЯЗЫК === 'en' ? 'en-GB' : ЯЗЫК === 'pl' ? 'pl-PL' : 'ru-RU';
const fmt = (v, d = 1) => (v == null || v === '' || Number.isNaN(v))
  ? '—' : Number(v).toLocaleString(ЛОКАЛЬ(), {minimumFractionDigits: d, maximumFractionDigits: d});
/** число без лишних нулей: 1.0117 → 1,01 · 105 → 105 */
const чис = v => {
  if (v == null || v === '' || Number.isNaN(Number(v))) return '—';
  const n = Number(v);
  const d = Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 1 ? 2 : 3;
  return n.toLocaleString(ЛОКАЛЬ(), {maximumFractionDigits: d});
};
const знак = (v, d) => (v > 0 ? '+' : '') + (d == null ? v : fmt(v, d));
const датаRu = s => s ? `${s.slice(8,10)}.${s.slice(5,7)}.${s.slice(0,4)}` : '—';
const МЕСЯЦЫ_ВСЕ = {
  ru: {к: ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'],
       п: ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']},
  en: {к: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
       п: ['January','February','March','April','May','June','July','August','September','October','November','December']},
  pl: {к: ['sty','lut','mar','kwi','maj','cze','lip','sie','wrz','paź','lis','gru'],
       п: ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia']},
};
const МЕСЯЦЫ = МЕСЯЦЫ_ВСЕ.ru.к;
const МЕСЯЦЫ_ПОЛН = МЕСЯЦЫ_ВСЕ.ru.п;
const мес = () => МЕСЯЦЫ_ВСЕ[ЯЗЫК] || МЕСЯЦЫ_ВСЕ.ru;
const датаКратко = s => s ? `${+s.slice(8,10)} ${мес().к[+s.slice(5,7)-1]}` : '—';
const датаКраткоГод = s => s ? `${датаКратко(s)} ${s.slice(2,4)}` : '—';
const датаПолн = s => s ? `${+s.slice(8,10)} ${мес().п[+s.slice(5,7)-1]} ${s.slice(0,4)}` : '—';
const склон = (n, a, b, c) => {
  const m = Math.abs(n) % 100;
  if (m >= 11 && m <= 14) return c;
  const k = m % 10;
  return k === 1 ? a : (k >= 2 && k <= 4) ? b : c;
};
const дней = (a, b) => Math.round((new Date(b.slice(0,10)) - new Date(a.slice(0,10))) / 864e5);
const экран = s => String(s == null ? '' : s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ───────── единицы: показываем по-русски, считаем в исходных ───────── */
const ЕДИНИЦЫ = {
  'mg/dl':'мг/дл', 'mg/l':'мг/л', 'g/dl':'г/дл', 'g/l':'г/л', 'g/ml':'г/мл',
  'tys/µl':'тыс/мкл', 'mln/µl':'млн/мкл', 'mln/ml':'млн/мл', 'mln':'млн',
  'ng/ml':'нг/мл', 'ng/dl':'нг/дл', 'pg/ml':'пг/мл', 'µg/dl':'мкг/дл',
  'µIU/ml':'мкМЕ/мл', 'mIU/ml':'мМЕ/мл', 'U/l':'Ед/л', 'IU/l':'МЕ/л',
  'mmol/l':'ммоль/л', 'mmol/L':'ммоль/л', 'µmol/L':'мкмоль/л', 'µmol/l':'мкмоль/л',
  'nmol/l':'нмоль/л', 'mmol/mol':'ммоль/моль', 'ml/min/1,73m2':'мл/мин/1,73 м²',
  'mm/h':'мм/ч', 'fl':'фл', 'pg':'пг', 'ml':'мл', 'um':'мкм', 'um/s':'мкм/с', 'Hz':'Гц',
  /* те же единицы в других написаниях, встречаются в бланках разных лабораторий */
  'k/µl':'тыс/мкл', 'k/ul':'тыс/мкл', 'x10^3/µl':'тыс/мкл', '10^3/µl':'тыс/мкл',
  'm/µl':'млн/мкл', 'm/ul':'млн/мкл', 'x10^6/µl':'млн/мкл', '10^6/µl':'млн/мкл',
  'u/l':'Ед/л', 'iu/l':'МЕ/л', 'ug/dl':'мкг/дл', 'uiu/ml':'мкМЕ/мл',
};
const ед = u => {
  const k = (u || '').trim();
  if (!k) return '';
  if (ЯЗЫК !== 'ru') {
    const п = T('ед.' + k);
    if (п !== 'ед.' + k) return п;
  }
  return ЕДИНИЦЫ[k] || ЕДИНИЦЫ[k.toLowerCase()] || k;
};

/* ───────── статусы: четыре цвета и серый, других нет ───────── */
const СТАТУСЫ = {
  'выше': {класс:'bad',  текст:'выше'},
  'ниже': {класс:'low',  текст:'ниже'},
  'норма':{класс:'ok',   текст:'норма'},
  '—':    {класс:'none', текст:'нет нормы'},
};
const чип = (флаг, подпись) => {
  const s = СТАТУСЫ[флаг] || СТАТУСЫ['—'];
  return `<span class="hh-chip ${s.класс}">${экран(подпись || s.текст)}</span>`;
};
/** референс человеческой строкой */
const рефТекст = (реф, единица) => {
  const [a, b] = реф || [null, null];
  const е = единица ? ' ' + экран(ед(единица)) : '';
  if (a != null && b != null) return `${чис(a)}–${чис(b)}${е}`;
  if (b != null) return `${T('реф.до')} ${чис(b)}${е}`;
  if (a != null) return `${T('реф.от')} ${чис(a)}${е}`;
  return T('реф.нет');
};
/** полоса «где на шкале»: серый трек, лавандовый отрезок нормы, точка в цвет статуса */
const полоса = (значение, реф, флаг) => {
  const [a, b] = реф || [null, null];
  if (значение == null || (a == null && b == null)) return '<span class="hh-muted" style="font-size:12px">—</span>';
  const lo = a != null ? a : b * 0.5, hi = b != null ? b : a * 1.5;
  const ширина = (hi - lo) || Math.abs(hi) || 1;
  const мин = Math.min(lo - ширина * 0.55, значение), макс = Math.max(hi + ширина * 0.55, значение);
  const px = v => Math.max(0, Math.min(100, (v - мин) / (макс - мин) * 100));
  const цвет = флаг === 'выше' ? 'var(--hh-bad)' : флаг === 'ниже' ? 'var(--hh-low)'
    : флаг === 'норма' ? 'var(--hh-ok)' : 'var(--hh-muted)';
  return `<span class="hh-bar" title="норма ${рефТекст(реф)}">
    <i style="left:${px(lo)}%;right:${100 - px(hi)}%"></i>
    <b style="left:${px(значение)}%;background:${цвет}"></b></span>`;
};

/* ───────── графики ───────── */
const cssv = v => getComputedStyle(root).getPropertyValue(v).trim();
const _cc = document.createElement('canvas').getContext('2d');
/** прозрачность через canvas: в тёмной теме CoreUI отдаёт rgb() с дробями, hex-суффиксы ломаются */
function withA(col, a) {
  _cc.fillStyle = col; const h = _cc.fillStyle;
  if (h[0] === '#') return `rgba(${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)},${a})`;
  const m = h.match(/rgba?\(([^)]+)\)/); if (!m) return col;
  const [r, g, b] = m[1].split(',').map(x => x.trim());
  return `rgba(${r},${g},${b},${a})`;
}
const тема = () => ({
  text: cssv('--hh-text'), muted: cssv('--hh-muted'), line: cssv('--hh-line'),
  card: cssv('--hh-card'), inset: cssv('--hh-inset'), tag: cssv('--hh-tag'),
  accent: cssv('--hh-accent'), accentDark: cssv('--hh-accent-dark'),
  black: cssv('--hh-black'), bad: cssv('--hh-bad'), warn: cssv('--hh-warn'),
  ok: cssv('--hh-ok'), low: cssv('--hh-low'),
});
const tipOpts = () => {
  const t = тема();
  return {backgroundColor: t.black, padding: 10, titleFont: {weight: '600'},
    displayColors: false, cornerRadius: 10, bodyColor: '#fff', titleColor: '#fff'};
};
const графики = {};
const убить = id => { if (графики[id]) { графики[id].destroy(); delete графики[id]; } };

let тултипы = [];
function обновитьТултипы() {
  тултипы.forEach(t => { try { t.dispose(); } catch (e) {} });
  тултипы = [...document.querySelectorAll('[data-coreui-toggle="tooltip"]')]
    .map(el => new coreui.Tooltip(el, {container: 'body'}));
}

/* ───────── каркас: верхние таблетки, левая рейка, подвал ───────── */
function каркас(данные) {
  const текущая = document.body.dataset.page || 'index';
  const обёртка = document.querySelector('.hh-page');
  /* лист, открытый по ссылке врача: остальные страницы закрыты паролем, вести туда незачем,
     личное фото пациента врачу тоже не показываем */
  const толькоЛист = !!данные.врач;
  if (толькоЛист) document.body.classList.add('hh-только-лист');

  обёртка.insertAdjacentHTML('afterbegin', толькоЛист ? `
<div class="hh-nav no-print">
  <span class="hh-brand">${T('врач.титул')}</span>
  <div class="hh-nav-right">
    <span class="hh-muted hh-upd">${T('врач.обновлено', {дата: датаRu(данные.обновлено)})}</span>
    <button class="hh-ico" id="печатьBtn" title="${T('кнопка.печать')}">${икона('печать')}</button>
    <button class="hh-ico" id="темаBtn" title="${T('кнопка.тема')}">${икона(тёмная() ? 'солнце' : 'луна')}</button>
  </div>
</div>` : `
<div class="hh-nav no-print">
  <a class="hh-brand" href="index.html">Центр здоровья</a>
  <div class="hh-nav-scroll">
    ${СТРАНИЦЫ.map(s => `<a class="hh-pill ${s.id === текущая ? 'active' : ''}" href="${s.файл}"><span class="hh-pill-ico">${икона(s.иконка)}</span>${s.имя}</a>`).join('')}
    ${СКОРО.map(s => `<span class="hh-pill hh-soon" title="Появится на этапе «${s.этап}»">${s.имя}<small>${s.этап}</small></span>`).join('')}
  </div>
  <div class="hh-nav-right">
    <span class="hh-period" id="периодШапки"></span>
    <span class="hh-muted hh-upd">Обновлено ${датаRu(данные.обновлено)}</span>
    <button class="hh-ico" id="печатьBtn" title="Печать или PDF">${икона('печать')}</button>
    <button class="hh-ico" id="темаBtn" title="Тёмная / светлая тема">${икона(тёмная() ? 'солнце' : 'луна')}</button>
    <img class="hh-avatar" src="data:," data-защищено="assets/media/аватар.jpg" alt="Станислав">
  </div>
</div>`);

  обёртка.insertAdjacentHTML('beforeend', `
<div class="hh-foot hh-muted">
  <span>Данные обновлены ${датаRu(данные.обновлено)} · анализов ${данные.анализы.даты.length} дат,
    замеров тела ${данные.тело.length}, WHOOP по ${датаRu((данные.whoop_сводка || {}).последняя_дата)}</span>
  <span>Не медицинский совет: страницы показывают данные рядом с нормой</span>
</div>`);

  if (глобал.HH_подгрузитьЗащищённые) глобал.HH_подгрузитьЗащищённые();
  document.getElementById('печатьBtn').onclick = () => window.print();
  document.getElementById('темаBtn').onclick = () => {
    root.dataset.coreuiTheme = тёмная() ? 'light' : 'dark';
    try { localStorage.setItem('hh-theme', root.dataset.coreuiTheme); } catch (e) {}
    document.getElementById('темаBtn').innerHTML = икона(тёмная() ? 'солнце' : 'луна');
    document.dispatchEvent(new CustomEvent('смена-темы'));
  };
}

/* ───────── состояние страницы в адресе ─────────
   Как на WHOOP: пишем через history.replaceState (location.hash заставил бы страницу прыгать
   к якорю и забивал бы историю «назад»), читаем один раз при открытии. */
const раскод = s => { try { return decodeURIComponent(s); } catch (e) { return s; } };
/* кириллицу оставляем читаемой, кодируем только то, что ломает разбор */
const код = s => String(s).replace(/[%&=#\s+]/g, encodeURIComponent);
/** #a=1&b=два&флаг → {a:'1', b:'два', флаг:''} */
function хеш() {
  const пары = {};
  location.hash.slice(1).split('&').filter(Boolean).forEach(ч => {
    const i = ч.indexOf('=');
    пары[раскод(i < 0 ? ч : ч.slice(0, i))] = i < 0 ? '' : раскод(ч.slice(i + 1));
  });
  return пары;
}
/** {a:'1', пусто:null, флаг:true} → #a=1&флаг=1 без записи в историю; пустые и false пропускаются */
function вХеш(пары) {
  const s = Object.entries(пары)
    .filter(([, v]) => v != null && v !== '' && v !== false)
    .map(([k, v]) => `${код(k)}=${код(v === true ? '1' : v)}`).join('&');
  history.replaceState(null, '', s ? '#' + s : location.pathname + location.search);
}

/* ───────── даты для расчётов ───────── */
const вISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
/** '2026-09-01' + 7 → '2026-09-08' (в местном времени, без ухода на день назад через UTC) */
const сдвигДаты = (iso, дн) => { const d = new Date(iso.slice(0, 10) + 'T00:00:00'); d.setDate(d.getDate() + дн); return вISO(d); };
/** «1–5 сентября 2026, 5 дней» · «20 августа — 5 сентября 2026, 17 дней» · «1 сентября 2026» */
function периодСобытия(e) {
  const от = e.дата, до = e.дата_конец || '';
  if (!до || до === от) return датаПолн(от);
  const [y1, m1, d1] = от.split('-'), [y2, m2, d2] = до.split('-');
  const мп = мес().п;
  const s = y1 === y2 && m1 === m2 ? `${+d1}–${+d2} ${мп[+m1 - 1]} ${y1}`
    : y1 === y2 ? `${+d1} ${мп[+m1 - 1]} — ${+d2} ${мп[+m2 - 1]} ${y1}`
    : `${датаПолн(от)} — ${датаПолн(до)}`;
  const n = дней(от, до) + 1;
  return `${s}, ${n} ${склон(n, 'день', 'дня', 'дней')}`;
}

/* ───────── карточка события поверх страницы ─────────
   Один компонент на главной, «Связях» и WHOOP: что было, сколько длилось,
   и что рядом — анализы и замеры ±7 дней, браслет во время события против недели до него. */
let ДАННЫЕ = null;
const ТИП_СОБЫТИЯ = {болезнь: 'Болезнь', поездка: 'Поездка', чекап: 'Чекап', добавка: 'Добавка или препарат',
  лекарство: 'Препарат', спорт: 'Спорт', визит: 'Визит к врачу', давление: 'Давление', питание: 'Питание', прочее: 'Событие'};
const ЦВЕТ_СОБЫТИЯ = {болезнь: 'var(--hh-bad)', поездка: 'var(--hh-accent)', чекап: 'var(--hh-ok)', добавка: 'var(--hh-warn)',
  лекарство: 'var(--hh-warn)', спорт: 'var(--hh-low)', визит: 'var(--hh-ok)', давление: 'var(--hh-accent-dark)', питание: 'var(--hh-warn)'};
const цветСобытия = тип => ЦВЕТ_СОБЫТИЯ[тип] || 'var(--hh-muted)';

function закрытьСобытие() {
  const о = document.getElementById('событиеОверлей');
  if (о) о.remove();
  document.removeEventListener('keydown', escСобытия);
}
function escСобытия(e) { if (e.key === 'Escape') закрытьСобытие(); }

function карточкаСобытия(e) {
  const д = ДАННЫЕ;
  if (!д || !e) return;
  закрытьСобытие();
  const от = e.дата, до = e.дата_конец || e.дата;
  const окноОт = сдвигДаты(от, -7), окноДо = сдвигДаты(до, 7);
  const ср = a => { const v = a.filter(x => x != null); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };

  const сдачи = (д.анализы.сдачи || []).filter(с => с.дата >= окноОт && с.дата <= окноДо)
    .sort((a, b) => a.дата.localeCompare(b.дата));
  const замеры = (д.тело || []).filter(b => b.дата.slice(0, 10) >= окноОт && b.дата.slice(0, 10) <= окноДо);
  const дни = ((д.whoop || {}).дни || []).filter(x => x.главный);
  const вовремя = дни.filter(x => x.дата >= от && x.дата <= до);
  const доНего = дни.filter(x => x.дата >= сдвигДаты(от, -7) && x.дата < от);
  const строкиWhoop = [];
  if (вовремя.length && доНего.length) {
    const пара = (имя, взять, ед, знаков, лучшеВыше) => {
      const a = ср(вовремя.map(взять)), b = ср(доНего.map(взять));
      if (a == null || b == null) return;
      const хуже = лучшеВыше ? a < b : a > b;
      const заметно = Math.abs(a - b) / Math.max(Math.abs(b), 1) > 0.05;
      строкиWhoop.push(`<div class="hh-between"><span>${имя}</span><span><b style="color:${заметно ? (хуже ? 'var(--hh-bad)' : 'var(--hh-ok)') : 'inherit'}">${fmt(a, знаков)}</b>
        ${ед} <span class="hh-muted">· неделей раньше ${fmt(b, знаков)}</span></span></div>`);
    };
    пара('Восстановление', x => x.recovery, '%', 0, true);
    пара('HRV (вариабельность пульса)', x => x.hrv, 'мс', 0, true);
    пара('Сон за ночь', x => x.сон && x.сон.всего != null ? x.сон.всего / 60 : null, 'ч', 1, true);
  }

  const блок = (заголовок, содержимое) => `<div class="hh-group" style="margin-top:6px">${заголовок}</div>
    <div style="display:flex;flex-direction:column;gap:6px;font-size:13px">${содержимое}</div>`;
  const пусто = текст => `<div class="hh-muted" style="font-size:12px">${текст}</div>`;

  document.body.insertAdjacentHTML('beforeend', `
<div class="hh-overlay no-print" id="событиеОверлей">
  <div class="hh-card hh-dialog hh-event" role="dialog" aria-modal="true" aria-labelledby="событиеЗаголовок">
    <div class="hh-between" style="align-items:flex-start">
      <div style="min-width:0">
        <span class="hh-chip" style="background:color-mix(in srgb,${цветСобытия(e.тип)} 18%,transparent);color:${цветСобытия(e.тип)}">${экран(ТИП_СОБЫТИЯ[e.тип] || e.тип)}</span>
        <div class="hh-h" id="событиеЗаголовок" style="margin-top:8px">${экран(e.заголовок)}</div>
        <div class="hh-sub">${экран(периодСобытия(e))}${e.источник ? ' · источник: ' + экран(e.источник) : ''}</div>
      </div>
      <button class="hh-ico hh-event-close" id="событиеЗакрыть" title="Закрыть (Esc)" aria-label="Закрыть">${икона('крест')}</button>
    </div>
    ${(() => { const оп = (e.описание || '').replace(/\s*Подробн[а-яё]+ саммери:[^\n]*?\.md\.?/i, '').trim(); return оп && оп !== e.заголовок.trim() + '.' ? `<div style="font-size:13px;line-height:1.55">${экран(оп)}</div>` : ''; })()}
    <div class="hh-sub" style="margin-top:4px">Что было рядом: ${датаКратко(окноОт)} — ${датаКратко(окноДо)}, ±7 дней</div>
    ${блок('Анализы', сдачи.map(с => `<a class="hh-alert" style="align-items:center;padding:9px 12px"
        href="анализы.html#вид=лента&дата=${код(с.дата)}"><span class="dot" style="background:${с.отклонений ? 'var(--hh-bad)' : 'var(--hh-ok)'};margin-top:0"></span>
        <div style="flex:1;min-width:0"><b>${датаПолн(с.дата)} · ${экран(с.лаборатория)}</b>
        <small>${с.показателей} ${склон(с.показателей, 'показатель', 'показателя', 'показателей')} · ${с.отклонений ? с.отклонений + ' вне нормы' : 'всё в норме'}</small></div>
        ${икона('вперёд', 16)}</a>`).join('') || пусто('Анализы в эти дни не сдавались.'))}
    ${блок('Замеры тела', замеры.map(b => `<a class="hh-alert" style="align-items:center;padding:9px 12px"
        href="тело.html#замер=${код(b.дата.slice(0, 10))}&блок=динамика"><div style="flex:1;min-width:0"><b>${датаПолн(b.дата.slice(0, 10))}</b>
        <small>вес ${fmt(b.вес_кг, 1)} кг · жир ${fmt(b.жир_пр, 1)} % · ${экран((b.прибор || 'весы').replace(/ \(.*\)/, ''))}</small></div>${икона('вперёд', 16)}</a>`).join('')
        || пусто('Замеров тела в эти дни не было.'))}
    ${блок(`Браслет WHOOP · ${вовремя.length} ${склон(вовремя.length, 'день', 'дня', 'дней')} события против недели до него`,
        строкиWhoop.join('') || пусто('Данных браслета за эти дни нет.'))}
    ${строкиWhoop.length ? `<div class="hh-muted" style="font-size:11px">Совпало по времени, не причина. Цифры — средние за дни события и за 7 дней перед ним.</div>` : ''}
  </div>
</div>`);
  const о = document.getElementById('событиеОверлей');
  о.addEventListener('click', ev => { if (ev.target === о) закрытьСобытие(); });
  document.getElementById('событиеЗакрыть').onclick = закрытьСобытие;
  document.addEventListener('keydown', escСобытия);
  document.getElementById('событиеЗакрыть').focus();
}

/* ───────── левая рейка = оглавление текущей страницы ─────────
   Страница помечает свои блоки атрибутом data-toc="Название" (и data-toc-icon), рейка
   собирает видимые, подсвечивает тот, что сейчас на экране, и плавно к нему прокручивает.
   Меньше трёх блоков — рейки нет, и слева не остаётся пустой полосы. */
let наблюдательРейки = null;
function оглавление() {
  const стр = document.querySelector('.hh-page');
  if (!стр) return;
  const блоки = [...document.querySelectorAll('[data-toc]')].filter(el => el.getClientRects().length);
  let рейка = document.getElementById('оглавление');
  if (наблюдательРейки) { наблюдательРейки.disconnect(); наблюдательРейки = null; }
  if (блоки.length < 3) {
    if (рейка) рейка.remove();
    стр.classList.remove('hh-has-rail');
    пересчётРейки = null;
    return;
  }
  if (!рейка) {
    рейка = document.createElement('nav');
    рейка.id = 'оглавление';
    рейка.className = 'hh-rail hh-toc no-print';
    рейка.setAttribute('aria-label', 'Оглавление страницы');
    document.body.appendChild(рейка);
  }
  стр.classList.add('hh-has-rail');
  рейка.innerHTML = блоки.map((el, i) => {
    const имя = el.dataset.toc;
    return `<button class="hh-ico" data-i="${i}" data-name="${экран(имя)}" aria-label="${экран(имя)}">${икона(el.dataset.tocIcon || 'список')}</button>`;
  }).join('') + `<a class="hh-ico hh-rail-last" href="данные.html" data-name="Источники данных" aria-label="Источники данных">${икона('настройки')}</a>`;
  const кнопки = [...рейка.querySelectorAll('button[data-i]')];
  const отметить = i => кнопки.forEach((b, j) => b.classList.toggle('active', j === i));
  /* после клика подсветка держится на выбранном пункте, пока идёт плавная прокрутка:
     блоки в соседних колонках начинаются на одной высоте, и без этого загорелся бы сосед */
  let закреп = -1, закрепДо = 0;
  кнопки.forEach(b => b.onclick = () => {
    закреп = +b.dataset.i; закрепДо = Date.now() + 1200;
    отметить(закреп);
    блоки[закреп].scrollIntoView({block: 'start', behavior: 'smooth'});
  });
  /* активный — последний блок, чей верх уже поднялся выше трети экрана; у самого низа страницы — последний видимый.
     IntersectionObserver будит пересчёт при входе блоков в экран, прокрутка — страхует, если его колбэки
     придерживает браузер (фоновая вкладка, панель превью). Позиции берём из getBoundingClientRect. */
  пересчётРейки = () => {
    if (Date.now() < закрепДо) { отметить(закреп); return; }
    const линия = innerHeight * 0.3;
    /* блоки стоят и колонками рядом, поэтому берём тот, чей верх ближе всего к линии сверху */
    let i = 0, лучший = -Infinity;
    блоки.forEach((el, j) => { const в = el.getBoundingClientRect().top; if (в <= линия && в > лучший + 1) { лучший = в; i = j; } });
    if (scrollY < 10) i = 0;
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) {
      блоки.forEach((el, j) => { if (el.getBoundingClientRect().top < innerHeight) i = Math.max(i, j); });
    }
    отметить(i);
  };
  наблюдательРейки = new IntersectionObserver(() => пересчётРейки(), {threshold: [0, 0.5, 1]});
  блоки.forEach(el => наблюдательРейки.observe(el));
  пересчётРейки();
}
let пересчётРейки = null, таймерРейки = 0;
addEventListener('scroll', () => {
  if (!пересчётРейки || таймерРейки) return;
  таймерРейки = setTimeout(() => { таймерРейки = 0; if (пересчётРейки) пересчётРейки(); }, 60);
}, {passive: true});

/* ───────── данные: fetch по HTTP, скрипт-обёртка при file:// ───────── */
/* ───────── данные опубликованной сборки ─────────
   У Стаса это site.json целиком. По ссылке врача — отдельный срез data/врач.json: там только
   то, что рисует лист, без дневника WHOOP и лишних разделов. Спермограмма лежит третьим файлом
   под своим ключом: он попадает в ссылку, только если Стас включил галочку. */
async function зашифрованные() {
  const HHC = глобал.HHC;
  if (!HHC.режимВрача) {
    const д = await HHC.json('data/site.json');
    const к = д.ключи || {};
    HHC.ключ(2, к.файлы);          // бланки
    HHC.ключ(4, к.репро);          // бланки спермограммы
    return д;
  }
  const д = await HHC.json('data/врач.json');
  HHC.ключ(2, (д.ключи || {}).файлы);
  if (HHC.естьРепро) {
    try { влить(д, await HHC.json('data/врач-плюс.json')); }
    catch (e) { д.репроНеОткрылась = e.message; }
  }
  return д;
}

/** Вливает срез спермограммы в основной: показатели, сдачи, даты, категории. */
function влить(д, плюс) {
  const А = д.анализы, П = (плюс || {}).анализы || {};
  Object.assign(А.показатели, П.показатели || {});
  А.сдачи = А.сдачи.concat(П.сдачи || []).sort((a, b) => a.дата.localeCompare(b.дата));
  А.даты = [...new Set(А.даты.concat(П.даты || []))].sort();
  (П.категории || []).forEach(к => { if (!А.категории.includes(к)) А.категории.push(к); });
  д.естьРепро = true;
}

function данные() {
  const запасной = () => new Promise((ок, нет) => {
    if (глобал.SITE) return ок(глобал.SITE);
    const s = document.createElement('script');
    s.src = 'data/site.js';
    s.onload = () => глобал.SITE ? ок(глобал.SITE) : нет(new Error('data/site.js без данных'));
    s.onerror = () => нет(new Error('не удалось загрузить data/site.js'));
    document.head.appendChild(s);
  });
  if (глобал.HH_ENC && глобал.HHC) return зашифрованные();
  if (location.protocol === 'file:') return запасной();
  return fetch('data/site.json')
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .catch(запасной);
}

/* ───────── оригиналы бланков ─────────
   В репозитории это обычный файл, в опубликованной сборке — зашифрованный blob.
   Вкладку открываем сразу по клику (иначе браузер посчитает её всплывающей и закроет),
   адрес подставляем после расшифровки. */
function оригинал(путь) {
  if (!(глобал.HH_ENC && глобал.HHC)) { глобал.open(путь, '_blank', 'noopener'); return; }
  const w = глобал.open('', '_blank');   // окно открываем до расшифровки, иначе браузер его закроет
  глобал.HHC.blobURL(путь)
    .then(u => {
      if (w) { w.location = u; return; }
      location.href = u;                 // всплывающие окна запрещены — открываем в этой вкладке
    })
    .catch(e => {
      if (w) w.document.write('Не открылось: ' + экран(e.message));
      else alert('Не открылось: ' + e.message);
    });
}
/** originals/<год>/<файл>; HEIC при копировании стал JPG, поэтому подменяем расширение */
const путьОригинала = (дата, файл) =>
  'originals/' + дата.slice(0, 4) + '/' + файл.replace(/\.(heic|heif)$/i, '.jpg');

/* ссылка для врача: адрес с #врач открывает сводку сразу после пароля */
(function () {
  let хэш = location.hash || '', файл = location.pathname.split('/').pop() || '';
  try { хэш = decodeURIComponent(хэш); файл = decodeURIComponent(файл); } catch (e) {}
  if (хэш.startsWith('#врач') && файл.toLowerCase() !== 'врач.html')
    location.replace('врач.html' + location.hash);
})();

/** Точка входа страницы: грузит данные, ставит каркас, зовёт отрисовку. */
function старт(отрисовать) {
  данные()
    .then(д => {
      глобал.I18N_DATA = д.перевод || {};
      ДАННЫЕ = д;
      Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
      Chart.defaults.font.size = 12;
      Chart.defaults.color = тема().muted;
      каркас(д);
      /* место под рейку отводим до отрисовки: иначе графики успевают снять ширину без неё
         и распирают сетку. После отрисовки оглавление() уточнит — вдруг видимых блоков меньше трёх */
      if (document.querySelectorAll('[data-toc]').length >= 3) document.querySelector('.hh-page').classList.add('hh-has-rail');
      отрисовать(д);
      обновитьТултипы();
      оглавление();
      const заново = () => { Chart.defaults.color = тема().muted; отрисовать(д); обновитьТултипы(); оглавление(); };
      document.addEventListener('смена-темы', заново);
      document.addEventListener('смена-языка', заново);
    })
    .catch(e => {
      document.querySelector('.hh-page').insertAdjacentHTML('beforeend',
        `<div class="hh-card" style="padding:22px">
          <div class="hh-h">Данные не загрузились</div>
          <div class="hh-sub">${экран(e.message)}. Собери их командой <code>python3 build/build.py</code> и открой страницу заново.</div>
        </div>`);
    });
}

глобал.H = {СТРАНИЦЫ, икона, ИКОНКИ, T, Tимя, Tгруппа, Tключ, язык, сменитьЯзык, оригинал, путьОригинала, fmt, чис, знак, ед, датаRu, датаКратко, датаКраткоГод, датаПолн,
  склон, дней, экран, чип, рефТекст, полоса, СТАТУСЫ, withA, тема, tipOpts, графики, убить, тёмная,
  обновитьТултипы, старт, данные, хеш, вХеш, вISO, сдвигДаты, периодСобытия, карточкаСобытия,
  закрытьСобытие, цветСобытия, ТИП_СОБЫТИЯ, оглавление};
})(window);

/* ───────── защищённые картинки (аватар) ─────────
   В сборке src подменён на data:, настоящий путь в data-защищено; грузим через расшифровку. */
(function (глобал) {
  function подгрузить(scope) {
    if (!(глобал.HH_ENC && глобал.HHC)) return;
    (scope || document).querySelectorAll('img[data-защищено]').forEach(img => {
      if (img.dataset.загружено) return;
      img.dataset.загружено = '1';
      глобал.HHC.blobURL(img.dataset.защищено)
        .then(u => { img.src = u; })
        .catch(() => {
          // расшифровать не вышло (например, пароль сессии потерян) — вместо битой картинки инициалы
          const зам = document.createElement('span');
          зам.className = (img.className + ' hh-avatar-fallback').trim();
          зам.setAttribute('style', img.getAttribute('style') || '');
          зам.textContent = 'СТ';
          img.replaceWith(зам);
        });
    });
  }
  function запустить() {
    подгрузить();
    new MutationObserver(() => подгрузить()).observe(document.body, {childList: true, subtree: true});
  }
  // в зашифрованной сборке страница переписывается через document.write, и DOMContentLoaded
  // к моменту выполнения скрипта уже мог пройти — тогда запускаемся сразу
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', запустить);
  else запустить();
  глобал.HH_подгрузитьЗащищённые = подгрузить;
})(window);
