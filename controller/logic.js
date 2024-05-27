const Usermodel = require("../models/usermodel.model.js");
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid');
const Batmodel = require("../models/Batmodel.model.js");
const Result = require("../models/Result.model.js");
const Admin = require("../models/Admin.model.js");
const Return = require("../models/Return.model.js")


// unqire id genrate 
const generateUniqueId = () => {
    let id = Math.abs(parseInt(uuidv4().replace(/-/g, ''), 16)).toString().slice(0, 7);
    // Ensure the ID is 7 digits
    while (id.length < 7) {
        id = '0' + id;
    }
    return id;
};


let blue = 0;
let red = 0;
let green = 0;
let bignumber = 0;
let smallnumber = 0;

let numberValues = {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 0,
    "9": 0
}

const minData = []
const DataforAdmin = {
    "blue":blue,
    "red":red,
    "green":green,
    "Big":bignumber,
    "Small":smallnumber,
    "0":0,
    "1":0,
    "2":0,
    "3":0,
    "4":0,
    "5":0,
    "7":0,
    "8":0,
    "9":0

}


const AdminSending = async (req,res)=>{

}

const UserData = async (req, res) => {

    const Incomingaccesstoken = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer", "")
    // console.log(req.header("Authorization")?.replace("Bearer",""))

    if (Incomingaccesstoken) {
        const Decodedtoken = jwt.verify(Incomingaccesstoken, process.env.ACCESS_TOKEN_KEY);
        const id = Decodedtoken?.id;
        const Username = Decodedtoken?.Username;

        console.log(id)
        const user = await Usermodel.findById(id)
        user.wallet -= req.body.Ammount;

        user.save().then(() => {
            console.log("ammount debited sucessfully !")
        })


        const Data = {
            Username: Username,
            Ammount: req.body.Ammount,
            Batoption: req.body.batoption,
            choose: req.body.choose,
        }
        minData.push(Data);
        console.log(minData);
        const Batoption = req.body.batoption;
        if (Batoption == "color") {
            console.log("batoption is color")
            if ("blue" == req.body.choose) {
                console.log("choose color is blue")
                blue = blue + parseInt(req.body.Ammount);
                DataforAdmin["blue"] = parseInt(req.body.Ammount)+DataforAdmin["blue"]

            }
            else if ("red" == req.body.choose) {

                red += parseInt(req.body.Ammount);
                console.log(red)
                DataforAdmin["red"] += req.body.Ammount

            }
            else {
                green += parseInt(req.body.Ammount);
                DataforAdmin["green"] += req.body.Ammount

                console.log(green);
            }
        }
        // if (Batoption == "Bs") {
        //     if (req.body.choose == "big") {
        //         bignumber += parseInt(req.body.Ammount);

        //     }
        //     else {
        //         smallnumber += parseInt(req.body.Ammount);
        //     }

        // }
        //  console.log(blue)
        else if (Batoption === "Bs") {
            if (req.body.choose === "Bignumber") {
                bignumber += parseInt(req.body.Amount);
                DataforAdmin["Big"] += req.body.Ammount


            } else {
                smallnumber += parseInt(req.body.Amount);
                DataforAdmin["Small"] += req.body.Ammount

            }
        } else if (Batoption === "number") {
            console.log(req.body.Ammount)
            console.log(typeof req.body.Ammount)
            console.log("type of choose of ",typeof req.body.choose);
            console.log(numberValues[req.body.choose])
            numberValues[req.body.choose] += req.body.Ammount;
            DataforAdmin[req.body.choose] += req.body.Ammount;

            // console.log(numberValues);
        }
        // console.log(numberValues);

    }
    else {
        res.json("unexpecated token ! login again");
    }
   console.log(DataforAdmin);
   console.log(numberValues);

    res.send('true')
}

const clearMinData = () => {
    minData.length = 0; // Clear the array
    blue = red = green = bignumber = smallnumber = 0;
    Object.keys(numberValues).forEach(key => numberValues[key] = 0);
};
// countdown logic for 

const countdownTimer = () => {
    const countdownDuration = 1 * 60 * 1000; // 5 minutes in milliseconds

    // Synchronization point: start of the day in UTC
    const syncPoint = new Date();
    syncPoint.setUTCHours(0, 0, 0, 0);

    const calculateRemainingTime = () => {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - syncPoint.getTime();
        const remainingTime = countdownDuration - (elapsedTime % countdownDuration);
        return Math.round(remainingTime / 1000); // in seconds
    };

    const intervalId = setInterval(() => {
        const remainingTimeInSeconds = calculateRemainingTime();

        if (remainingTimeInSeconds > 0) {
            let minutes = Math.floor(remainingTimeInSeconds / 60);
            let seconds = remainingTimeInSeconds % 60;
            // console.log(`remaining time: ${minutes}:${seconds}`);
        } else {
            clearInterval(intervalId);
            console.log('Countdown finished. Sending results to frontend...');
            // Generate and store results
            const latestResults = {
                message: 'Countdown finished',
                timestamp: new Date()
            };
            console.log(latestResults);
            clearMinData();
            console.log("Previous Data Cleared");
            countdownTimer(); // Restart the countdown
        }
    }, 1000);
};



countdownTimer();







const result = async (req, res) => {

    const Incomingaccesstoken = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer", "")
    // console.log(req.header("Authorization")?.replace("Bearer",""))


    const Decodedtoken = jwt.verify(Incomingaccesstoken, process.env.ACCESS_TOKEN_KEY);
    const userid = Decodedtoken?.id;
    const Username = Decodedtoken?.Username;

    console.log(req.cookies)
    console.log(Decodedtoken)





    // let result = "";
    // const colorresult = Math.min(blue,red,green);
    // if(colorresult==blue){
    //     result= "blue"
    // }
    // else if(colorresult == red){
    //     result= "red"
    // }
    // else{
    //     result = "green"
    // }

    let colorresult;
    let result = "";
    const nobat = [blue, red, green];
    console.log(blue, red, green);

    // const Adminauto = await Admin.findOne();
    // const auto = Admin.Auto
    // if (auto) {
        if (blue === red && red === green) {
            colorresult = nobat[Math.floor(Math.random() * 3)];
            console.log("when all is same", colorresult);

            if (colorresult === blue) {
                result = "blue";
            } else if (colorresult === red) {
                result = "red";
            } else {
                result = "green";
            }
        } else {
            // Find the minimum value among blue, red, and green
            colorresult = Math.min(blue, red, green);

            if (colorresult === blue) {
                result = "blue";
            } else if (colorresult === red) {
                result = "red";
            } else {
                result = "green";
            }
        }
        function findMinValueNumber(mapping) {
            let minNumber = null;
            let minValue = Infinity;

            for (let number in mapping) {
                if (mapping[number] < minValue) {
                    minValue = mapping[number];
                    minNumber = number;
                }
            }

            return minNumber;
        }

        // Find and log the number with the minimum value
        const minValueNumber = findMinValueNumber(numberValues);
        console.log(numberValues)
        console.log(minValueNumber);

        let Bsresult = "";
        const BSresult = Math.min(bignumber, smallnumber)
        if (BSresult == bignumber) {
            Bsresult = "Big"
        }
        else {
            Bsresult = "Small"
        }

        console.log({ Bsresult, BSresult })
        const id = generateUniqueId();
        await Result.create({
            Number: minValueNumber,
            Color: result,
            Bs: Bsresult,
            Uid: id

        })

        let maindata = [];

        try {
            if (minData.length > 0) {

                const dataWithIds = minData.map(data => {
                    let status = 'loss';

                    const trimmedChoose = data.choose.trim().toLowerCase();
                    const trimmedResult = result.trim().toLowerCase();

                    if ((data.Batoption === 'color') && (trimmedChoose === trimmedResult)) {
                        status = 'won';
                        Return.ColorX.findOne().then((Data)=>{
                            console.log("data from colorx",Data)
                            const X = Data.color;
                            try {
                                console.log(userid)
                                Usermodel.findById(userid).then((user) =>{
                                    console.log("user", user)

                                if (!user) {
                                    throw new Error('User not found');
                                }
                                // let result = minData.find(obj => obj.Username === user.Username)
                                console.log(result)
                                user.wallet += X * (data.Ammount);

                                user.save().then(() => {
                                    console.log('Money credited successfully!');

                                })
                                    .catch((err) => console.log(err));
                                })
                                

                            }
                            catch (error) {
                                console.error('Error crediting money:', error.message);
                            }

                        })

                    } else if (data.Batoption === 'number' && (data.choose) === minValueNumber) {
                        status = 'won';
                        Return.NumberX.findOne().limit(1).sort({_id:-1}).then((Data)=>{
                            // let result = Data.find(obj => obj.Username === user.Username)
                                const X = Data[data.choose]

                                try {
                                    console.log(userid)
                                    Usermodel.findById(userid).then((user) =>{
                                        console.log("user", user)

                                    if (!user) {
                                        throw new Error('User not found');
                                    }
                                    // let result = minData.find(obj => obj.Username === user.Username)
                                    console.log(result)
                                    user.wallet += X * (data.Ammount);

                                    user.save().then(() => {
                                        console.log('Money credited successfully!');

                                    })
                                        .catch((err) => console.log(err));
                                    })
                                    

                                }
                                catch (error) {
                                    console.error('Error crediting money:', error.message);
                                }


                        })





                    } else if (data.Batoption === 'Bs' &&
                        ((data.choose == 'big' && Bsresult == "Big") ||
                            (data.choose == 'small' && Bsresult == "Small"))) {
                        status = 'won';
                        if (Bsresult == "Big") {
                            Return.BgX.findOne().then((DATA) => {
                                const X = DATA.big
                                try {
                                    console.log(userid)
                                    Usermodel.findById(userid).then((user) =>{
                                        console.log("user", user)

                                    if (!user) {
                                        throw new Error('User not found');
                                    }
                                    // let result = minData.find(obj => obj.Username === user.Username)
                                    // nconsole.log(result)
                                    user.wallet += parseInt(X) * (data.Ammount);
                                    console.log(user.wallet);

                                    user.save().then(() => {
                                        console.log('Money credited successfully!');

                                    })
                                        .catch((err) => console.log(err));
                                    })
                                    

                                }
                                catch (error) {
                                    console.error('Error crediting money:', error.message);
                                }


                            })

                        }
                        if (Bsresult == "Small") {
                            Return.BgX.find().then((DATA) => {
                                const X = DATA.BatXsmall
                                try {
                                    console.log(userid)
                                    Usermodel.findById(userid).then((user) =>{
                                        console.log("user", user)

                                    if (!user) {
                                        throw new Error('User not found');
                                    }
                                    // let result = minData.find(obj => obj.Username === user.Username)
                                    // console.log(result);
                                    user.wallet += parseInt(X) * (data.Ammount);
                                    console.log(user.wallet);

                                    user.save().then(() => {
                                        console.log('Money credited successfully!');

                                    })
                                        .catch((err) => console.log(err));
                                    })
                                    

                                }
                                catch (error) {
                                    console.error('Error crediting money:', error.message);
                                }


                            })

                        }
                    }

                    console.log("Final status:", status);


                    // return { ...data, Uid: id, status:status };
                    return { ...data, Uid: id, status: status };

                });
                console.log(dataWithIds)
                maindata = dataWithIds;

                await Batmodel.insertMany(dataWithIds);
                console.log("Data successfully inserted into the database.");
            } else {
                console.log("No data to insert.");
            }
        } catch (error) {
            console.error("Error inserting data into the database:", error);
        }
        // for (const item of maindata) {
        //     if (item.status === 'won') {
        //         try {
        //             console.log(userid)
        //             const user = await Usermodel.findById(userid)
        //             console.log("user", user)

        //             if (!user) {
        //                 throw new Error('User not found');
        //             }
        //             let result = minData.find(obj => obj.Username === user.Username)
        //             console.log(result)
        //             user.wallet += 2 * (result.Ammount);

        //             await user.save();

        //             console.log('Money credited successfully!');
        //         }
        //         catch (error) {
        //             console.error('Error crediting money:', error.message);
        //         }
        //     }
        // }
        res.json({
            color: result,
            number: minValueNumber,
            BS: Bsresult
        })

    }

// }




const slothistory = async (req, res) => {
    try {
        const data = await Result.find().limit(25).sort({ _id: -1 })
        // console.log(data)
        res.json(data)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    UserData,
    result,
    slothistory
}

