require('phantomjs-prebuilt')
// require('chromedriver')
const webdriver = require('selenium-webdriver')
const winston = require('winston')
const By = webdriver.By
const until = webdriver.until
const later = require('later')
const nodemailer = require('nodemailer')
const driver = new webdriver.Builder()
    .forBrowser('phantomjs')
    .build()

var username = process.argv[2]
var password = process.argv[3]
var sendEmailSmtp = process.argv[4]
var sendEmail = process.argv[5]
var sendEmailPassword = process.argv[6]
var receiveEmail = process.argv[7]

var textNotification = later.parse.text('every 20 min')

var checkInSchedule = {
  schedules:
  [
        {h: [17], m: [0]}
  ]
}

login()

function login () {
  driver.get('https://www.v2ex.com/signin')
  driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[1]/td[2]/input')).sendKeys(username)
  driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[2]/td[2]/input')).sendKeys(password)
  driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[3]/td[2]/input[2]')).click()
  driver.get('https://www.v2ex.com/')
}

var timerNotification = later.setInterval(getNotification, textNotification)
var timerCheckIn = later.setInterval(checkIn, checkInSchedule)

function getNotification () {
  driver.navigate().refresh()
  driver.findElement(By.xpath('//*[@id="Rightbar"]/div[2]/div[4]/a')).getText().then(function (text) {
    var unreadNum = Number(text.split(' ')[0])
    // console.log(unreadNum)
    if (unreadNum > 0) {
      sendMail(sendEmailSmtp, sendEmail, sendEmailPassword, receiveEmail, 'notification!')
    } else {

    }
  }).catch(() => login())
}

function checkIn () {
  login()
  driver.findElement(By.xpath('//*[@id="Rightbar"]/div[4]/div/a')).click().catch(() => login())
  driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/input')).click().catch(() => login())
  driver.get('https://www.v2ex.com/')
  // console.log('Check in')
  sendMail(sendEmailSmtp, sendEmail, sendEmailPassword, receiveEmail, 'checkIn!')
}

// driver.wait(until.titleIs('webdriver - Google Search'), 1000)
// driver.quit()

function sendMail (sendEmailSmtp, email, password, receiveEmail, emailText) {
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
    subject: 'V2EX!', // Subject line
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
