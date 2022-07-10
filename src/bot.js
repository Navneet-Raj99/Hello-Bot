// DISCORDJS_BOT_TOKEN=OTMxOTMwMDU3ODM5MDg3NzE3.YeLlgA.adBZPClrXcJx86fnKr5DkRhcmEk
require("dotenv").config({ path: __dirname + "/../.env" });

const chalk = require("chalk");
const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client();

const pre = "$";
let moviearray = [];
let dmoviearray = [];
let quotearray = [];
const fetchApi = async (city) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=971f693332cf3dab245d6a47a97492fe`;
  const response = await fetch(url);
  const japi = await response.json();
  return japi.main.temp;
};
const fetchquote = async () => {
  const urlq = `https://zenquotes.io/api/quotes`;
  const responseq = await fetch(urlq);
  const japiq = await responseq.json();
  console.log(parseInt(Math.random() * 10));
  let num = parseInt(Math.random() * 10);
  quotearray = [];
  quotearray.push({
    quote: japiq[num].q,
    author: japiq[num].a,
  });
  console.log(quotearray[0].quote);
};
async function fetchmovie() {
  const movieURL = "https://imdb-api.com/en/API/Top250Movies/k_wcn5f13w";
  // const movieURL='https://imdb-api.com/en/API/Top250Movies/k_8mqzp8sq';
  const responsemovie = await fetch(movieURL);
  const japimovie = await responsemovie.json();
  japimovie.items.forEach((e) => {
    moviearray.push({
      title: e.title,
      imdb: e.imDbRating,
    });
  });

}
async function fetchname(movie) {
  const moviesURL = `https://imdb-api.com/en/API/SearchMovie/k_wcn5f13w/${movie}`;
  // const movieURL='https://imdb-api.com/en/API/Top250Movies/k_8mqzp8sq';
  try {
    const dresponsemovie = await fetch(moviesURL);
    const djapimovie = await dresponsemovie.json();
    console.log(djapimovie.results[0].id);
    return djapimovie.results[0].id;

  } catch (error) {
    console.log("Error");
    return error;
  }
}
async function getimdb(movie) {
  const imdbURL = `https://imdb-api.com/en/API/Wikipedia/k_wcn5f13w/${movie}`;
  // const movieURL='https://imdb-api.com/en/API/Top250Movies/k_8mqzp8sq';
  const imdbresponsemovie = await fetch(imdbURL);
  const imdbjapimovie = await imdbresponsemovie.json();
  if (imdbjapimovie.plotShort == null) {
    return "Nothing possible Found";
  } else {
    return imdbjapimovie.plotShort.plainText;
  }
}

client.on("ready", () => {
  console.log(chalk.blue("Discord Bot Joined"));
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  console.log(message.author.username);
  if (
    message.content === "hello" ||
    message.content === "hi" ||
    message.content === "Hello" ||
    message.content === "Hi"
  ) {
    message.reply(`Hello ${message.author.username}`);
  }

  if (message.content.startsWith(pre)) {
    let [command, ...remaining] = message.content
      .trim()
      .substring(pre.length)
      .split("-");

    if (command === "fetch") {
      let i = 0;
      for (i = 0; i < remaining.length; i = i + 1) {
        message.reply(await fetchApi(remaining[i]));
      }
    }
    if (command === "top") {
      await fetchmovie();
      moviearray.slice(0, 15).forEach((element) => {
        console.log(element.title);
        if (element.title == remaining[0]) {
          message.reply(
            "**Title**-" + element.title + " **iMDB**-" + element.imdb
          );
        }
      });
    }
    if (command === "sad") {
      await fetchquote();
      message.channel.send(
        "**Quote**-" +
        quotearray[0].quote +
        ". " +
        "**Author**" +
        quotearray[0].author
      );
    }

    if (command === "dd") {
      message.reply(await fetchname(remaining[0]));
    }
    if (command == "imdb") {
      function truncate(str, no_words) {
        return str.split(" ").splice(0, no_words).join(" ");
      }

      let tt = await fetchname(remaining[0]);
      message.reply(
        "**Short Plot-** " +
        truncate(await getimdb(tt), 180) +
        "\n" +
        "**Request Made By-**" +
        message.author.username
      );
    }
  }
});

client.login(process.env.DISCORD_AUTH_TOKEN);
