/* Расшифровка на стороне браузера для опубликованной сборки (dist/).
   Подключается только туда: build/encrypt.py дописывает этот скрипт в <head> каждой страницы
   и ставит window.HH_ENC = 1. В рабочем репозитории файла нет в разметке, страницы читают
   data/site.json напрямую.

   Схема та же, что у openssl enc -aes-256-cbc -pbkdf2: «Salted__» + соль 8 байт + шифротекст.
   Первый байт соли — код ключа, которым файл зашифрован:
     1 пароль сайта · 2 ключ бланков · 3 ключ врача · 4 ключ спермограммы.
   Так браузер не гадает и не перебирает: прочитал соль — знает, чем расшифровывать.

   Откуда берутся ключи:
     • пароль сайта или ключ врача из ссылки кладёт в sessionStorage обёртка страницы;
     • ключ бланков приходит внутри расшифрованных данных (app.js зовёт HHC.ключ(2, …)).
   Каждый ключ выводится один раз за загрузку страницы и держится в памяти: PBKDF2 на
   200 000 итераций стоит примерно четверть секунды, делать это на каждый PDF незачем. */
(function (глобал) {
'use strict';

const ITER = 200000;
const САЙТ = 1, ФАЙЛЫ = 2, ВРАЧ = 3, РЕПРО = 4;

const пароли = {};        // код → строка-пароль
const выведенные = {};    // код → Promise с {aes, iv}

function изСессии(имя) {
  try { return sessionStorage.getItem(имя); } catch (e) { return null; }
}

/* Режим врача: страницу открыли по ссылке с ключом, пароля сайта нет и не будет. */
const режимВрача = изСессии('hh-режим') === 'врач';
const сессия = изСессии('hh-pw');
if (сессия) пароли[режимВрача ? ВРАЧ : САЙТ] = сессия;
const репро = изСессии('hh-pw-репро');
if (репро) пароли[РЕПРО] = репро;

/** Добавить ключ, пришедший внутри данных (ключ бланков, а у Стаса — и ключи врача). */
function ключ(код, пароль) {
  if (!пароль || пароли[код] === пароль) return;
  пароли[код] = пароль;
  delete выведенные[код];
}

async function материал(код, соль) {
  const пв = пароли[код];
  if (!пв) throw new Error(код === РЕПРО
    ? 'Этот раздел в ссылку не включён'
    : 'Ключ потерян, обнови страницу');
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(пв), 'PBKDF2', false, ['deriveBits']);
  const bits = new Uint8Array(await crypto.subtle.deriveBits(
    {name: 'PBKDF2', salt: соль, iterations: ITER, hash: 'SHA-256'}, km, 384));
  return {
    aes: await crypto.subtle.importKey('raw', bits.slice(0, 32), {name: 'AES-CBC'}, false, ['decrypt']),
    iv: bits.slice(32, 48),
    соль: соль.join(','),
  };
}

/** Расшифровать один файл. Возвращает ArrayBuffer. */
async function байты(url) {
  const r = await fetch(url + '.enc');
  if (!r.ok) throw new Error('не найден ' + url + '.enc');
  const raw = new Uint8Array(await r.arrayBuffer());
  if (new TextDecoder().decode(raw.slice(0, 8)) !== 'Salted__') throw new Error('не наш формат: ' + url);
  const соль = raw.slice(8, 16);
  const код = соль[0] || САЙТ;
  /* соль у всех файлов одного ключа общая (encrypt.py шифрует их одним вызовом),
     поэтому ключ выводится один раз; если соль другая — выводим заново */
  if (!выведенные[код]) выведенные[код] = материал(код, соль);
  let k = await выведенные[код];
  if (k.соль !== соль.join(',')) k = await материал(код, соль);
  return crypto.subtle.decrypt({name: 'AES-CBC', iv: k.iv}, k.aes, raw.slice(16));
}

const текст = async url => new TextDecoder().decode(await байты(url));
const json = async url => JSON.parse(await текст(url));

const МИМЕ = {pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
              heic: 'image/heic', json: 'application/json', js: 'text/javascript'};

/** Blob-адрес расшифрованного файла: по нему PDF и фото открываются во вкладке. */
async function blobURL(url) {
  const расш = (url.split('.').pop() || '').toLowerCase();
  const buf = await байты(url);
  return URL.createObjectURL(new Blob([buf], {type: МИМЕ[расш] || 'application/octet-stream'}));
}

глобал.HHC = {байты, текст, json, blobURL, ключ, режимВрача, естьРепро: !!репро,
              пароль: () => пароли[режимВрача ? ВРАЧ : САЙТ] || null};
})(window);
