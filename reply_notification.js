require('chromedriver')
const webdriver = require('selenium-webdriver')
const By = webdriver.By
const until = webdriver.until

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build()

var username = process.argv[2]
var password = process.argv[3]

driver.get('https://www.v2ex.com/signin')
driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[1]/td[2]/input')).sendKeys(username)
driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[2]/td[2]/input')).sendKeys(password)
driver.findElement(By.xpath('//*[@id="Main"]/div[2]/div[2]/form/table/tbody/tr[3]/td[2]/input[2]')).click()
driver.get('https://www.v2ex.com/')
driver.findElement(By.xpath('//*[@id="Rightbar"]/div[2]/div[4]/a')).getText().then(function (text) {
  var unreadNum = Number(text.split(" ")[0])
  console.log(unreadNum)
//   if (unreadNum > 0) {

//   }
})

// driver.wait(until.titleIs('webdriver - Google Search'), 1000)
// driver.quit()

// function sendMail(params) {
    
// }