for ve2x notifications  
 - v2ex回复或其他消息提醒
 - 自动签到领取铜币  
usage:  
```
>> git clone git@github.com:superPershing/v2ex_notifications.git
>> cd v2ex_notifications
>> npm install
>> node reply_notification.js "username" "password" "sendEmailSmtp" "senderEmail" "senderEmailPassowrd" "receiverEmail"
```
依次为用户名，密码，发送邮件的smtp，发送邮件地址，发送邮件的密码，接收邮件的地址。  
也可以使用[pm2](http://pm2.keymetrics.io/)等部署在服务器端长期运行。  
Not Finished.  
TODO:  
 - get notification's detail
  
吐槽：later.js默认是UTC时区