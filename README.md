# Random musical parameter generator

[![Netlify Status](https://api.netlify.com/api/v1/badges/8fc41265-496f-42ab-8bc3-dd35a5b7f885/deploy-status)](https://app.netlify.com/sites/musical-parameters/deploys)

See [docs](https://htmlpreview.github.io?https://github.com/music-practice-tools/musical-parameters/blob/master/public/docs/index.html) for operating info.

## How to Update the Set of Parameters

- Edit [this page](https://github.com/music-practice-tools/musical-parameters/blob/master/src/parameters.yaml) by clicking the pencil icon on right of heading

![image](https://user-images.githubusercontent.com/618922/180992308-613a18b1-6cdd-4a46-9385-e7f0010ea7f4.png)

- makechanges - carefull with formatting, especially spaces and indenting!
- Commit your changes

![image](https://user-images.githubusercontent.com/618922/180992619-e5b9ad34-6361-4540-b614-4108edc4eeee.png)

- Wait for the Netlifyt status on [README page](https://github.com/music-practice-tools/musical-parameters) to say "success" - takes a few minutes and may require a page refresh

![image](https://user-images.githubusercontent.com/618922/180992783-b96ef061-e719-4136-b173-52dfc7fe111b.png)

- Refesh the app [web page](https://parameters.musicpracticetools.net/) - if you have "installed" you might need to reload it somehow. Ctrl+F5 works on desktop browsers

## Requirements

Randomly generate a set of musical parameters as the basis for practice / composition

- tonal centre
- parent mode type
- tempo
- genre
- ?rhythm?

eg

- D
- Melodic minor
- 98bpm
- latin
- ?4/4?

Each individual parameter or all can be regenerated.

Fixed list of values for each parameter

Work on Android phone - portrait only to start is OK

## Architecture

- Static
- Vanilla
- PWA
- Mobile first
- vitejs
- Netlify hosting
- Domain parameters.musicpracticetools.net
- no tests
