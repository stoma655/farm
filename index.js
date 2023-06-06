const { Cluster } = require('puppeteer-cluster');
const puppeteer = require('puppeteer');

(async () => {
    // создание кластера, который обрабатывает 10 параллельных браузеров
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_BROWSER,
        maxConcurrency: 10,
    });

    // Определение функции обработчика заданий
    await cluster.task(async ({ page, data: { userAgent, device } }) => {
        // Установка строки агента пользователя
        await page.setUserAgent(userAgent);

        // Имитация устройства
        if (device) {
            await page.emulate(device);
        }

        // Ваш код для входа на страницу сайта и выполнения других действий
        await page.goto('https://www.example.com');

        // Ждем 1 минуту
        await page.waitForTimeout(60000);

        // Прокрутка страницы вниз
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        // Ждем еще 30 секунд
        await page.waitForTimeout(30000);

        // Прокрутка страницы вверх
        await page.evaluate(() => {
            window.scrollTo(0, 0);
        });

        // Ждем еще 30 секунд
        await page.waitForTimeout(30000);

        // Закрытие страницы
        await page.close();
    });

    // Очередь ваших заданий с разными строками агента пользователя и устройствами
    cluster.queue({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3', device: null });
    cluster.queue({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1', device: puppeteer.devices['iPhone 6'] });
    cluster.queue({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9', device: null });
    // ...

    // Ожидание завершения всех заданий и закрытие кластера
    await cluster.idle();
    await cluster.close();
})();