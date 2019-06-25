const functions = require('firebase-functions');
const request = require('request-promise');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
//const LINE_UID = '66e9ed429392cee6e12326c7bf16621c';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer C+InCMmS3GgAAf/jDgNWM8+AGMjMtCdlBV13AKIr8kPItCX4MR/xMufZq4lZYM0niaKqBvrUYP/bBsUOgPCvY5AXCjokHWCNjAWGv8wXLrEvGUh12vfFwB3rVv/UFFTl9gKcrjSoToBBUJurzK05+AdB04t89/1O/w1cDnyilFU=`
};



exports.LineBotPush = functions.https.onRequest((req, res) => {
    return request.get({
      uri: `https://api.openweathermap.org/data/2.5/weather?units=metric&type=accurate&zip=10330,th&appid=8cf9365482564805269c48596eaa4c3d`,
      json: true
    }).then((response) => {
      const message = `City: ${response.name}\nWeather: ${response.weather[0].description}\nTemperature: ${response.main.temp}`;
      return push(res, message);
    }).catch((error) => {
      return res.status(500).send(error);
    });
  });

const reply = (bodyResponse) => {
    return request.post({
      // eslint-disable-next-line no-template-curly-in-string
      uri: `${LINE_MESSAGING_API}/reply`,
      headers: LINE_HEADER,
      body: JSON.stringify({
        replyToken: bodyResponse.events[0].replyToken,
        messages: [
          {
            type: `text`,
            text: bodyResponse.events[0].message.text
          }
        ]
      })
    });
  };

  const push = (res,userId, msg) => {
    return request.post({
      uri: `${LINE_MESSAGING_API}/push`,
      headers: LINE_HEADER,
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: `text`,
            text: msg
          }
        ]
      })
    }).then(() => {
      return res.status(200).send(`Done`);
    }).catch((error) => {
      return Promise.reject(error);
    });
  }