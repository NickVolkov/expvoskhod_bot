const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot("6488968964:AAH3BcpwYYZ6Pr6uUeUG3HJKfY_IExkIqGA", {
  polling: true,
});

const options = {
  0: [
    { text: "Экспедиция Восход приветствует тебя на борту!" },
    {
      text: "Ты уже сделал пресейв нашего нового трека?🔥 https://band.link/korni_single",
      options: [
        [{ text: "Канеш! 😎", callback_data: "1" }],
        [{ text: "Еще не успел", callback_data: "2" }],
      ],
    },
  ],
  1: [
    {
      text: "Тоочно?",
      options: [
        [{ text: "Даа!", callback_data: "3" }],
        [{ text: "Нет, я врунишка", callback_data: "2" }],
      ],
    },
  ],
  2: [
    {
      text: "Нуштоооош ты? Давай уже сделаем! https://band.link/korni_single",
    },
    {
      text: "Получилось?",
      options: [
        [{ text: "Ага, уже в нетерпении", callback_data: "3" }],
        [{ text: "Нет, звёзды не сходятся", callback_data: "4" }],
      ],
      timeout: 10000,
    },
  ],
  3: [
    {
      timeout: 2000,
      text: "Мы рады официально посвятить тебя в наш клуб Любителей\nМузыки и Путешествий!\nСпасибо, что ты с нами. Держи набор стикеров",
    },
    { text: "*сообщение с гивом стикерпаков*", timeout: 5000 },
  ],
  4: [
    {
      text: "У тебя все получится! https://band.link/korni_single",
    },
    {
      text: "Ура?",
      options: [
        [{ text: "Ура", callback_data: "3" }],
        [{ text: "Нет, я передумал", callback_data: "5" }],
      ],
      timeout: 10000,
    },
  ],
  5: [
    {
      text: "бот присылает стикер «Мы увидимся когда в небе догорит звезда»",
    },
  ],
};

function releaseMessages(props, message, bot) {
  for (option of props) {
    const reply = [
      message.chat.id,
      option.text,
      {
        reply_to_message_id: message.message_id,
        reply_markup: {
          selective: true,
          inline_keyboard: option.options,
        },
      },
    ];

    if (option.timeout) {
      setTimeout(() => {
        bot.sendMessage(...reply);
      }, option.timeout);
    } else {
      bot.sendMessage(...reply);
    }
  }
}

function start() {
  bot.on("message", async (message) => {
    releaseMessages(options[0], message, bot);
  });

  bot.on("callback_query", (message) => {
    releaseMessages(options[message.data], message.message, bot);
  });

  bot.on("polling_error", console.log);
}

start();
