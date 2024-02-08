const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot("6488968964:AAH3BcpwYYZ6Pr6uUeUG3HJKfY_IExkIqGA", {
  polling: true,
});

const link = "\n\n[ТЫК](https://band.link/korni_single)\n\n 👇";

const options = {
  0: [
    { text: "Экспедиция Восход приветствует тебя на борту! 🌅" },
    {
      text: `Ты уже сделал пресейв нашего нового трека? 🔥${link}`,
      options: [
        [{ text: "Канеш! 😎", callback_data: "1" }],
        [{ text: "Еще не успел", callback_data: "2" }],
      ],
      timeout: 2500,
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
      text: `Нуштоооош ты? Давай уже сделаем\!${link}`,
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
      text: "Проверяю, секунду\\.\\.\\.",
    },
    {
      timeout: 5000,
      text: "Мы рады официально посвятить тебя в наш клуб Любителей Музыки и Путешествий!\nСпасибо, что ты с нами\\. Держи набор стикеров:",
    },
    {
      sticker:
        "CAACAgIAAxkBAAIBjmXFQoAdJ29Jhre9IFOhSxqD-UXdAAJySwAChVcoSj62Np6tS4iVNAQ",
      timeout: 6000,
    },
  ],
  4: [
    {
      text: `У тебя все получится\!${link}`,
    },
    {
      text: "Ура?",
      options: [
        [{ text: "Ура", callback_data: "3" }],
        [{ text: "Нет, я передумал 💩", callback_data: "5" }],
      ],
      timeout: 10000,
    },
  ],
  5: [
    {
      sticker:
        "CAACAgIAAxkBAAIBh2XFOQgUhJ-9iCKQcDlk-K2YQSo8AALBUAACvfMoSvxGzE_q7LBVNAQ",
    },
  ],
};

function getParameters(props, message) {
  if (props.sticker) {
    return [message.chat.id, props.sticker];
  } else {
    return [
      message.chat.id,
      props.text.replace(/\!/g, "\\!"),
      {
        parse_mode: "MarkdownV2",
        reply_markup: {
          selective: true,
          inline_keyboard: props.options,
        },
      },
    ];
  }
}

function releaseMessages(props, message, bot) {
  for (option of props) {
    const reply = getParameters(option, message);
    const isSticker = !!option.sticker;

    const send = () => {
      if (isSticker) {
        bot.sendSticker(...reply);
      } else {
        bot.sendMessage(...reply);
      }
    };

    if (option.timeout) {
      setTimeout(() => {
        send();
      }, option.timeout);
    } else {
      send();
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
