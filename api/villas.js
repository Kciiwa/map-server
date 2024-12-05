// const express = require("express");
// const { Client } = require("@notionhq/client");
// require("dotenv").config();
// const cors = require("cors");

// const app = express();
// app.use(cors());
// const port = process.env.PORT || 5000;

// // Инициализация клиента Notion
// const notion = new Client({
//   auth: "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", // Лучше использовать переменную окружения для ключа API
// });

// // Эндпоинт для получения данных о виллах
// app.get("/api/villas", async (req, res) => {
//   try {
//     const databaseId = "148822df79338003abedd7cf4258a02c"; // Заменить на ID твоей базы данных

//     // Запрос к базе данных Notion
//     const response = await notion.databases.query({
//       database_id: databaseId,
//     });

//     console.log("Response from Notion:", JSON.stringify(response, null, 2));

//     const formattedData = response.results.map((item) => ({
//       name: item.properties.name.title[0].text.content, // Имя объекта
//       id: item.properties.ID.unique_id.number, // ID объекта
//       location: item.properties.location.rich_text[0].text.content, // Ссылка на локацию
//       coordinates: item.properties.coordinates.rich_text[0].text.content, // Координаты
//       availability: item.properties.доступность.checkbox, // Доступность
//     }));

//     console.log(formattedData);

//     // Отправка данных на фронтенд
//     res.json(formattedData);
//   } catch (error) {
//     console.error("Error fetching villas:", error);
//     res
//       .status(500)
//       .json({ message: "Internal Server Error", error: error.message });
//   }
// });

// // Запуск сервера
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

// api/villas.js
const { Client } = require("@notionhq/client");
const cors = require("cors");

const notion = new Client({
  auth: process.env.NOTION_API_KEY, // используем переменную окружения для ключа API
});

// Инициализация CORS
const allowedOrigins = [
  "https://phuket-map-tatyanas-projects-28495ff0.vercel.app/", // Ваш фронтенд
];

const options = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = async (req, res) => {
  // Применение CORS
  cors(options)(req, res, async () => {
    try {
      const databaseId = "148822df79338003abedd7cf4258a02c"; // ID базы данных

      // Запрос к базе данных Notion
      const response = await notion.databases.query({
        database_id: databaseId,
      });

      const formattedData = response.results.map((item) => ({
        name: item.properties.name.title[0].text.content, // Имя объекта
        id: item.properties.ID.unique_id.number, // ID объекта
        location: item.properties.location.rich_text[0].text.content, // Ссылка на локацию
        coordinates: item.properties.coordinates.rich_text[0].text.content, // Координаты
        availability: item.properties.доступность.checkbox, // Доступность
      }));

      // Отправка данных на фронтенд
      res.status(200).json(formattedData);
    } catch (error) {
      console.error("Error fetching villas:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  });
};
