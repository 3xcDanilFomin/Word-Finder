const readline = require("node:readline");
const WordExtractor = require("word-extractor");
const extractor = new WordExtractor();
const extracted = extractor.extract("voina-i-mir.docx");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let wordFrequency = new Map();

const printLine = () => {
    const arr = new Array(150).fill("-");
    console.log(arr.join(""));
};

console.log("Лабораторная работа № 5\nВыполнил: Фомин Д.A 090301-ПОВа-o23 ");
printLine();

const askForWord = () => {
    rl.question(
        `Введите слово не короче 3-x символов (или '0' для выхода): `,
        (str) => {
            if (str === "0") {
                console.log("Выход из программы.");
                printLine();
                rl.close();
                return;
            }
            if (str.length < 3) {
                console.log("Запрос должен быть не короче 3 символов.");
                printLine();
                askForWord();
                return;
            }
            const arr = [];
            for (let [word, count] of wordFrequency) {
                if (word.includes(str.toLowerCase())) {
                    arr.push([word, count]);
                }
            }
            arr.sort((a, b) => b[1] - a[1]);
            const twentyWords = Object.fromEntries(arr.slice(0, 20));
            if (!Object.keys(twentyWords).length) {
                printLine();
                console.log(
                    `Исходный текст не содержит слов включающих в себя подстроку "${str}"`
                );
                printLine();
            } else {
                printLine();
                console.log(twentyWords);
                printLine();
            }
            askForWord();
        }
    );
};

extracted
    .then((doc) => {
        const words = doc.getBody().match(/[а-яА-ЯёЁa-zA-Z0-9-]+/g);
        if (words) {
            const startTime = performance.now();
            words.forEach((word) => {
                let lowerCaseWord = word.toLowerCase();
                let count = wordFrequency.get(lowerCaseWord) || 0;
                wordFrequency.set(lowerCaseWord, count + 1);
            });
            const endTime = performance.now();
            console.log(
                `Время затраченное на обработку текста составляет: ${
                    endTime - startTime
                } мс`
            );
        } else {
            console.log("Нет слов для обработки.");
            printLine();
        }
        console.log(
            `Количество неповторяющихся слов в тексте: ${wordFrequency.size}`
        );
        printLine();
        askForWord();
    })
    .catch((error) => {
        console.error("Ошибка при извлечении текста:", error);
        printLine();
    });
