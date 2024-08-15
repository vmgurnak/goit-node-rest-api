The API Contacts

Сontacts

GET /api/contacts
http://localhost:3000/api/contacts
Повертає масив всіх контактів в json-форматі зі статусом 200

Parameters
Authorization - The token issued to the current user.

Responses
200 OK
401 Unauthorized
{
"message": "Not authorized"
}

GET /api/contacts/:id

Якщо контакт за id знайдений, повертає об'єкт контакту в json-форматі зі статусом 200
Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404

DELETE /api/contacts/:id

Якщо контакт за id знайдений і видалений, повертає об'єкт видаленого контакту в json-форматі зі статусом 200
Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404

POST /api/contacts

Отримує body в json-форматі з полями {name, email, phone}. Усі поля є обов'язковими
Якщо в body немає якихось обов'язкових полів (або передані поля мають не валідне значення), повертає json формату {"message": error.message} (де error.message - змістовне повідомлення з суттю помилки) зі статусом 400
Якщо body валідне, повертає новостворений об'єкт з полями {id, name, email, phone} і статусом 201

PUT /api/contacts/:id

Отримує body в json-форматі з будь-яким набором оновлених полів (name, email, phone)
Якщо запит на оновлення здійснено без передачі в body хоча б одного поля, повертає json формату {"message": "Body must have at least one field"} зі статусом 400
Передані в боді поля мають бути провалідовані
Якщо передані поля мають не валідне значення, повертає json формату {"message": error.message} (де error.message - змістовне повідомлення з суттю помилки) зі статусом 400
Якщо з body все добре, За результатом роботи функції повертає оновлений об'єкт контакту зі статусом 200.
Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404

PATCH /api/contacts/:contactId/favorite
Отримує параметр contactId
Отримує body в json-форматі c оновленням поля favorite
Якщо з body все добре, повертає оновлений об'єкт контакту і статусом 200.
В іншому випадку, повертає json з ключем {"message":"Not found"} і статусом 404

User

Registration request

POST /users/register
Content-Type: application/json
RequestBody: {
"email": "example@example.com",
"password": "examplepassword"
}

Registration validation error
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
"message": "Помилка від Joi або іншої бібліотеки валідації"
}

Registration conflict error
Status: 409 Conflict
Content-Type: application/json
ResponseBody: {
"message": "Email in use"
}

Registration success response
Status: 201 Created
Content-Type: application/json
ResponseBody: {
"user": {
"email": "example@example.com",
"subscription": "starter"
}
}

Login request

POST /users/login
Content-Type: application/json
RequestBody: {
"email": "example@example.com",
"password": "examplepassword"
}

Login validation error
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
"message": "Помилка від Joi або іншої бібліотеки валідації"
}

Login success response
Status: 200 OK
Content-Type: application/json
ResponseBody: {
"token": "exampletoken",
"user": {
"email": "example@example.com",
"subscription": "starter"
}
}

Login auth error
Status: 401 Unauthorized
ResponseBody: {
"message": "Email or password is wrong"
}

Logout request

POST /users/logout
Authorization: "Bearer {{token}}"

Logout unauthorized error
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
"message": "Not authorized"
}

Logout success response
Status: 204 No Content

Current user request

GET /users/current
Authorization: "Bearer {{token}}

Current user unauthorized error
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
"message": "Not authorized"
}

Current user success response
Status: 200 OK
Content-Type: application/json
ResponseBody: {
"email": "example@example.com",
"subscription": "starter"
}

# поновлення аватарки

PATCH /users/avatars

Content-Type: multipart/form-data
Authorization: "Bearer {{token}}"
RequestBody: завантажений файл

# Успішна відповідь

Status: 200 OK
Content-Type: application/json
ResponseBody: {
"avatarURL": "тут буде посилання на зображення"
}

# Неуспішна відповідь

Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
"message": "Not authorized"
}

Мідлвар для перевірки токена додано до всіх раутів, які захищені.
Middleware unauthorized error
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
"message": "Not authorized"
}

Налаштуй Express на роздачу статичних файлів з папки public.
При переході по такому URL браузер відобразить зображення. Shell http://locahost:<порт>/avatars/<ім'я файлу з розширенням>

Schemas

Contacts
{
name: {
type: String,
required: [true, 'Set name for contact'],
},
email: {
type: String,
},
phone: {
type: String,
},
favorite: {
type: Boolean,
default: false,
},
owner: {
type: mongoose.Schema.Types.ObjectId,
required: true,
ref: 'user',
},
},

User
{
password: {
type: String,
required: [true, 'Password is required'],
},
email: {
type: String,
required: [true, 'Email is required'],
unique: true,
},
subscription: {
type: String,
enum: ['starter', 'pro', 'business'],
default: 'starter',
},
token: {
type: String,
default: null,
},
avatarURL: {
type: String,
},
},
