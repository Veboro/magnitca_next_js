

## Favicon з PWA-іконки

Використаємо вже наявну іконку `pwa-icon-192.png` як favicon сайту.

### Що зміниться

- В `index.html` буде додано (або оновлено) тег `<link rel="icon">`, що вказуватиме на `/pwa-icon-192.png`.
- Старий `favicon.ico` залишиться як fallback, але браузери віддадуть перевагу PNG-версії.

### Технічні деталі

В `<head>` секції `index.html` додається рядок:

```html
<link rel="icon" type="image/png" sizes="192x192" href="/pwa-icon-192.png" />
```

Один файл змінюється: `index.html`.

