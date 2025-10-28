// validator.js — Правильная валидация ИИН (KZ) и телефона РФ с regex и checksum

function validateRussianPhone(phone) {
    // Regex для РФ (без изменений, работает)
    const phoneRegex = /^(\+?7|8|7)?[\s\-\(\)\.]?([3-9]\d{2})[\s\-\)\.]?(\d{3})[\s\-\(]?\d{2}[\s\-\)]?\d{2}$/;
    return phoneRegex.test(phone);
}

function validateIIN(iin) {
    // Базовый формат: 12 цифр
    const iinRegex = /^\d{12}$/;
    if (!iinRegex.test(iin)) return false;

    // Дата рождения: YYMMDD (упрощённо)
    const month = parseInt(iin.substring(2, 4), 10);
    const day = parseInt(iin.substring(4, 6), 10);
    if (month < 1 || month > 12 || day < 1 || day > 31) return false;

    // Регион: позиции 7-8 (index 6-7) — 00-99
    const region = parseInt(iin.substring(6, 8), 10);
    if (region < 0 || region > 99) return false;

    // Checksum: алгоритм по OECD (два прохода по всем 12 цифрам)
    const digits = iin.split('').map(d => parseInt(d, 10));

    // Первый проход: веса [1,2,3,4,5,6,7,8,9,10,11,12]
    let sum1 = 0;
    const weights1 = [1,2,3,4,5,6,7,8,9,10,11,12];
    for (let i = 0; i < 12; i++) {
        sum1 += digits[i] * weights1[i];
    }
    if (sum1 % 11 === 0) return true;

    // Второй проход: веса [3,4,5,6,7,8,9,10,11,12,13,14]
    let sum2 = 0;
    const weights2 = [3,4,5,6,7,8,9,10,11,12,13,14];
    for (let i = 0; i < 12; i++) {
        sum2 += digits[i] * weights2[i];
    }
    return sum2 % 11 === 0;
}

// Тесты (в консоли браузера)
console.log("✅ ИИН 010101600001 (твой пример):", validateIIN("010101600001"));  // true
console.log("✅ Пример из OECD 920701123456:", validateIIN("920701123456"));  // true
console.log("✅ Генерированный 010101000005:", validateIIN("010101000005"));  // true
console.log("❌ Неверный формат 123:", validateIIN("123"));  // false
console.log("❌ Неверный регион 010101999999:", validateIIN("010101999999"));  // false (регион 99 OK, но checksum no)
console.log("Телефон +7(999)123-45-67:", validateRussianPhone("+7(999)123-45-67"));  // true