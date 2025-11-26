const cron = require("node-cron");  
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel.js")
const Borrow = require("../models/borrowModel.js")

const notifyUsers = () => {
    cron.schedule('*/30 * * * *', async () => {  // will send req after every 30 mins
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const borrowers = await Borrow.find({
                dueDate: {
                    $lt: oneDayAgo,
                },
                returnDate:null,
                notified:false,
            });
            for(const element of borrowers){
                if(element.user && element.user.email){
                    sendEmail({
                        email: element.user.email,
                        subject: "Book Return Reminder",
                        message: `Hello ${element.user.name},\n\nThis is a reminder that the book you borrowed is due for return today. Kindly return it on time to avoid any late fines.\n\nThank you,\nGoodLib Team`,
                    });
                    element.notified = true;
                    await element.save();
                }
            }
        } catch (error) {
            console.error("some error occured while notifying the users.", error);
        }
    });
};

module.exports = { notifyUsers };
