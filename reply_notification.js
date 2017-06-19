require('phantomjs-prebuilt')
const webdriver = require('selenium-webdriver')
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
var timerNotification = later.setInterval(getNotification, textNotification)

var checkInSchedule = {
    schedules:
    [
        {h: [10], m: [32]}
    ]
  }
var timerCheckIn = later.setInterval(checkIn, checkInSchedule)

driver.get('https://www.v2ex.com/signin')
driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[1]/td[2]/input')).sendKeys(username)
driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[2]/td[2]/input')).sendKeys(password)
driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[3]/td[2]/input[2]')).click()
driver.get('https://www.v2ex.com/')

function getNotification () {
  driver.navigate().refresh()
  driver.findElement(By.xpath('//*[@id="Rightbar"]/div[2]/div[4]/a')).getText().then(function (text) {
    var unreadNum = Number(text.split(' ')[0])
    console.log(unreadNum)
    if (unreadNum > 0) {
      sendMail(sendEmailSmtp, sendEmail, sendEmailPassword, receiveEmail)
    }
  })
}

function checkIn () {
  driver.get('https://www.v2ex.com/')
  driver.findElement(By.xpath('//*[@id="Rightbar"]/div[4]/div/a')).click()
  driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/input')).click()
  driver.get('https://www.v2ex.com/')
  sendMail(sendEmailSmtp, sendEmail, sendEmailPassword, receiveEmail)
}

// driver.wait(until.titleIs('webdriver - Google Search'), 1000)
// driver.quit()

function sendMail (email, password, receiveEmail) {
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
    subject: 'V2EX notification!', // Subject line
    text: 'V2EX notification', // plain text body
    html: '<b>V2EX notification</b>' // html body
  }

// send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
  })
}
