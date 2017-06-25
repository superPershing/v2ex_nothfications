require('phantomjs-prebuilt')
// require('chromedriver')
const webdriver = require('selenium-webdriver')
// const winston = require('winston')
const By = webdriver.By
// const until = webdriver.until
const later = require('later')
const nodemailer = require('nodemailer')
const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build()

var username = process.argv[2]
var password = process.argv[3]
var sendEmailSmtp = process.argv[4]
var sendEmail = process.argv[5]
var sendEmailPassword = process.argv[6]
var receiveEmail = process.argv[7]

// var textNotification = later.parse.text('every 10 min')
// 有可能致使签到和检查通知同时操作，导致登录时重复发送用户名或密码，造成登录失败。
var notificationSchedule = {
  schedules:
  [
    {m: [0, 10, 20, 30, 40, 50]}
  ]
}

var checkInSchedule = {
  schedules:
  [
        {h: [6], m: [25]}
  ]
}

login()
function login () {
  driver.get('https://www.v2ex.com/signin')
  driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[1]/td[2]/input')).clear().then(() => {
    console.log(username)
    driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[1]/td[2]/input')).sendKeys(username)
  })
  driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[2]/td[2]/input')).clear().then(() => {
    console.log(password)
    driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[2]/td[2]/input')).sendKeys(password)
  })
  driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[3]/td[2]/input[2]')).click()
}

var timerNotification = later.setInterval(getNotification, notificationSchedule)
var timerCheckIn = later.setInterval(checkIn, checkInSchedule)

function getNotification () {
  login()
  driver.navigate().refresh()
  driver.findElement(By.xpath('//*[@id="Rightbar"]/div[2]/div[4]/strong/a')).getText().then(function (text) {
    var unreadNum = Number(text.split(' ')[0])
    console.log(unreadNum)
    if (unreadNum > 0) {
      driver.findElement(By.xpath('//*[@id="Rightbar"]/div[2]/div[4]/strong/a')).click().then(() => {
        var message = 'V2EX notification unread'
        // for (var unreadId = 3; unreadId < unreadNum + 3; ++unreadId) {
        //   driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[' + unreadId + ']/table/tbody/tr/td[2]/span/a[1]/strong')).getText().then((text) => {
        //     var temp = text + '在'
        //     message += temp
        //   })
        // }
        sendMail(sendEmailSmtp, sendEmail, sendEmailPassword, receiveEmail, unreadNum + ' V2EX notification unread!', message)
      })
    }
    driver.get('https://www.v2ex.com/')
  }).catch(() => driver.get('https://www.v2ex.com/'))
}

function checkIn () {
  login()
  driver.findElement(By.xpath('//*[@id="Rightbar"]/div[4]/div/a')).click()
  driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/input')).click().then(() => {
    sendMail(sendEmailSmtp, sendEmail, sendEmailPassword, receiveEmail, 'V2EX checkIn', 'V2EX checkIn')
    // TODO: 获得具体信息
  })
  console.log('check in')
  driver.get('https://www.v2ex.com/')
}

// driver.wait(until.titleIs('webdriver - Google Search'), 1000)
// driver.quit()

function sendMail (sendEmailSmtp, email, password, receiveEmail, subjectText, emailText) {
  let transporter = nodemailer.createTransport({
    host: sendEmailSmtp,
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
      user: email,
      pass: password
    }
  })

// setup email data with unicode symbols
  let mailOptions = {
    from: '<' + email + '>', // sender address
    to: receiveEmail, // list of receivers
    subject: subjectText, // Subject line
    text: emailText, // plain text body
    html: '<b>' + emailText + '</b>' // html body
  }

// send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
  })
}
