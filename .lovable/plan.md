

# Адмін-панель для управління новинами

Створимо захищену адмін-панель для створення, редагування та видалення новин з візуальним редактором і SEO-полями. Доступ тільки для вашого акаунту.

---

## Що ви отримаєте

1. **Сторінка /admin/news** -- список усіх новин (включно з telegram) з кнопками "Редагувати" та "Видалити"
2. **Сторінка /admin/news/new** -- створення нової новини
3. **Сторінка /admin/news/:id/edit** -- редагування існуючої новини
4. **Візуальний редактор** -- textarea з попереднім переглядом тексту
5. **SEO-поля** -- meta title та meta description для кожної новини
6. **Захист доступу** -- тільки ваш акаунт може керувати новинами

---

## Етапи реалізації

### 1. База даних -- таблиця ролей та SEO-поля

**Таблиця `user_roles`** для безпечної перевірки адміна:

```text
user_roles
+---------+------+----------+
| user_id | role | id       |
+---------+------+----------+
| uuid FK | enum | uuid PK  |
+---------+------+----------+
```

- Enum `app_role`: admin, moderator, user
- Функція `has_role(user_id, role)` з SECURITY DEFINER
- Ваш акаунт одразу отримає роль admin

**Нові колонки в таблиці `news`:**
- `meta_title` (text, nullable) -- SEO заголовок
- `meta_description` (text, nullable) -- SEO опис

**Оновлені RLS-політики для `news`:**
- INSERT: дозволено тільки адмінам (`has_role(auth.uid(), 'admin')`)
- UPDATE: дозволено тільки адмінам
- DELETE: дозволено тільки адмінам
- SELECT: залишається публічним

### 2. Компоненти адмін-панелі

**`src/pages/admin/AdminNews.tsx`** -- список новин:
- Таблиця з усіма новинами (title, slug, published_at, source)
- Кнопки: "Створити", "Редагувати", "Видалити" (з підтвердженням)
- Фільтр по telegram_sent

**`src/pages/admin/AdminNewsEditor.tsx`** -- редактор новини:
- Поле "Заголовок" (title)
- Поле "Slug" (автогенерація з заголовка, можна змінити)
- Textarea для контенту з попереднім переглядом (whitespace-pre-line як на сторінці новини)
- Поле "URL зображення" (image_url)
- Дата публікації (published_at)
- Чекбокс "Для Telegram" (telegram_sent)
- SEO-секція: meta_title, meta_description
- Кнопки: "Зберегти", "Скасувати"

**`src/components/admin/AdminGuard.tsx`** -- захист маршрутів:
- Перевіряє чи користувач авторизований
- Перевіряє наявність ролі admin через запит до `user_roles`
- Якщо не адмін -- перенаправляє на головну

### 3. Маршрутизація

Додати в App.tsx:
- `/admin/news` -- список новин
- `/admin/news/new` -- створення
- `/admin/news/:id/edit` -- редагування

### 4. SEO-інтеграція

Оновити `NewsArticle.tsx`:
- Використовувати `meta_title` та `meta_description` якщо вони заповнені
- Fallback на поточну логіку (title та перші 150 символів контенту)

---

## Технічні деталі

### Безпека

- Роль admin зберігається в окремій таблиці `user_roles` (не в profiles)
- Перевірка ролі через SECURITY DEFINER функцію `has_role()` -- запобігає рекурсії RLS
- RLS-політики на `news` використовують `has_role()` для INSERT/UPDATE/DELETE
- Таблиця `user_roles` захищена RLS -- тільки адміни бачать ролі

### Генерація slug

Транслітерація українського тексту в URL-friendly slug:
- "Магнітна буря G2" -> "magnitna-burya-g2"
- Якщо slug вже існує -- додається суфікс "-2", "-3" тощо

### Файли що будуть створені/змінені

- Створити: `src/pages/admin/AdminNews.tsx`
- Створити: `src/pages/admin/AdminNewsEditor.tsx`
- Створити: `src/components/admin/AdminGuard.tsx`
- Змінити: `src/App.tsx` (додати маршрути)
- Змінити: `src/pages/NewsArticle.tsx` (SEO-поля)
- Міграція: user_roles, has_role(), SEO-колонки в news, оновлені RLS

