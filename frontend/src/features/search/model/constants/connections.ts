// "use client";

// import * as signalR from "@microsoft/signalr";

// // 1. Создаем объект подключения, указывая тот самый адрес с бека
// export const connection = new signalR.HubConnectionBuilder()
//   .withUrl("http://185.221.198.70:5093/search-hub")
//   .withAutomaticReconnect() // Чтобы само переподключалось, если инет моргнет
//   .build();

// console.log(connection);

// // 2. Запускаем соединение
// connection
//   .start()
//   .then(() => {
//     console.log("Connected!");

//     connection.invoke("JoinRoom");
//   })
//   .catch((err) => console.error(err));

// // 3. Подписываемся на события (слушаем бек)
// // roomID
// connection.on("SettingUpConnection", (message) => {
//   console.log("Пришло сообщение из RabbitMQ через сокет:", message);
// });

// // result
// // 3. Подписываемся на события (слушаем бек)
// connection.on("ReceiveSearchResult", (message) => {
//   console.log("Пришло сообщение из RabbitMQ через сокет:", message);
// });
