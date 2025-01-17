# Native Multi AzuraCast Radio Player

This native Azuracast Player

### How to use

Git this repo: ```git@github.com:PeWe79/native-azuracast-player.git```

Edit ```index.html``` find and edit ```stations``` && upload to your server.

```bash
stations: [
  {
    name: "Your Station 1",
    hash: "radio_one",
    description: "",
    albumArt: "assets/img/radio_one.png",
    cover: "assets/img/radio_one.png",
    logo: "assets/img/radio_one.png",
    api: "https://your-azuracast-server.com/api/nowplaying/radio_one",
    stream_url: "https://your-azuracast-server.com/listen/radio_one/radio.mp3",
    server: "itunes",
    program: {
      time: "24/7",
      name: "Your Station 1",
      description: "AzuraCast",
    },
    social: {}
  },
  {
    name: "Your Station 2",
    hash: "radio_two",
    description: "",
    albumArt: "assets/img/radio_two.png",
    cover: "assets/img/radio_two.png",
    logo: "assets/img/radio_two.png",
    api: "https://your-azuracast-server.com/api/nowplaying/radio_two",
    stream_url: "https://your-azuracast-server.com/listen/radio_two/radio.mp3",
    server: "itunes",
    program: {
      time: "24/7",
      name: "Your Station 2",
      description: "AzuraCast",
    },
    social: {}
  },
  {
    name: "Your Station 3",
    hash: "radio_thre",
    description: "",
    albumArt: "assets/img/radio_thre.png",
    cover: "assets/img/radio_thre.png",
    logo: "assets/img/radio_thre.png",
    api: "https://your-azuracast-server.com/api/nowplaying/radio_thre",
    stream_url: "https://your-azuracast-server.com/listen/radio_thre/radio.mp3",
    server: "itunes",
    program: {
      time: "24/7",
      name: "Your Station 3",
      description: "AzuraCast",
    },
    social: {}
  }
]
```