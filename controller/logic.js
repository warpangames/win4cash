const Usermodel = require("../models/usermodel.model.js");
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid');
const Batmodel = require("../models/Batmodel.model.js");
const Result = require("../models/Result.model.js");
const Admin = require("../models/Admin.model.js");
const Return = require("../models/Return.model.js")
const guestUsermodel = require("../models/Guestuser.model.js");
const guestBatmodel = require("../models/GuestBat.model.js")


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
const minDataForguest = [];

const DataforAdmin = {
    "blue": blue,
    "red": red,
    "green": green,
    "Big": bignumber,
    "Small": smallnumber,
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "7": 0,
    "8": 0,
    "9": 0,
    "userdata": []

}
// console.log("min data", minData)

let IncomingResult = {
    color: "",
    number: "",
    BS: ""

}

const IncomingResultfromAdmin = async (req, res) => {
    // console.log("this data for admin side", req.body)
    IncomingResult.color = req.body.color,
        IncomingResult.number = req.body.number,
        IncomingResult.BS = req.body.Bs

    res.status(200).json("Result Sends sucessfully! ")
}

const AdminSending = async (req, res) => {
    // console.log(DataforAdmin,'manual')
    res.json(DataforAdmin);

}

const UserData = async (req, res) => {

    // console.log("req.body", req.body)

    const Incomingaccesstoken = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer", "")
    // // console.log(req.header("Authorization")?.replace("Bearer",""))
    const Inguestid = req.cookies.guestid

    if (Incomingaccesstoken) {
        const Decodedtoken = jwt.verify(Incomingaccesstoken, process.env.ACCESS_TOKEN_KEY);
        const id = Decodedtoken?.id;
        const Username = Decodedtoken?.Username;

        const user = await Usermodel.findById(id)
        if (user.wallet >= req.body.Ammount) {
      console.log(  typeof(req.body.Ammount))
      console.log(  typeof(user.wallet))

            user.wallet -= (req.body.Ammount);

            await user.save().then(() => {
                // console.log("ammount debited sucessfully !")
                // console.log(user.wallet)
            })
            console.log(  user.wallet,typeof(user.wallet))


            const Data = {
                Username: Username,
                Ammount: req.body.Ammount,
                Batoption: req.body.batoption,
                choose: req.body.choose,
            }
            minData.push(Data);
            DataforAdmin.userdata = minData;
            // console.log(minData,"this is min data");

            const Batoption = req.body.batoption;
            if (Batoption == "color") {
                // console.log("batoption is color")
                if ("blue" == req.body.choose) {
                    // console.log("choose color is blue")
                    blue = blue + parseInt(req.body.Ammount);
                    DataforAdmin["blue"] = parseInt(req.body.Ammount) + DataforAdmin["blue"]

                }
                else if ("red" == req.body.choose) {

                    red += parseInt(req.body.Ammount);
                    // console.log(red)
                    DataforAdmin["red"] += req.body.Ammount

                }
                else {
                    green += parseInt(req.body.Ammount);
                    DataforAdmin["green"] += req.body.Ammount

                    // console.log(green);
                }
            }

            else if (Batoption === "Bs") {
                if (req.body.choose === "Bignumber") {
                    bignumber += parseInt(req.body.Ammount);
                    DataforAdmin["Big"] += req.body.Ammount


                } else {
                    smallnumber += parseInt(req.body.Ammount);
                    DataforAdmin["Small"] += req.body.Ammount

                }
            } else if (Batoption === "number") {
                // console.log(req.body.Ammount)
                // console.log(typeof req.body.Ammount)
                // console.log("type of choose of ", typeof req.body.choose);
                // console.log(numberValues[req.body.choose])
                numberValues[req.body.choose] += req.body.Ammount;
                DataforAdmin[req.body.choose] += req.body.Ammount;

            }
            res.send('true')
        }
        else{
            res.send('false')

        }
    }
    else if (Inguestid) {

        const user = await guestUsermodel.findOne({ guestid: Inguestid })
        // console.log("here is guestr user", user)
        const wallet = user.wallet;
        // console.log(wallet)
        await guestUsermodel.updateOne({ guestid: Inguestid }, { $set: { wallet: parseFloat(wallet) - parseFloat(req.body.Ammount) } })
        // console.log("katqa gya")
        const Data = {
            guestid: Inguestid,
            Ammount: req.body.Ammount,
            Batoption: req.body.batoption,
            choose: req.body.choose,
        }
        minDataForguest.push(Data);
    }
    else {
        res.json("unexpecated token ! login again");
    }
    // console.log(DataforAdmin);
    // console.log(numberValues);

    // res.send('true')
}

const clearMinData = () => {
    minData.length = 0; // Clear the array
    minDataForguest.length = 0;
    blue = red = green = bignumber = smallnumber = 0;
    Object.keys(numberValues).forEach(key => numberValues[key] = 0);
    Object.keys(DataforAdmin).forEach(key => DataforAdmin[key] = 0);
    Object.keys(IncomingResult).forEach(key => IncomingResult[key] = "");

};
// countdown logic for 
let last_seconds;

const countdownTimer = () => {
    const countdownDuration = 2 * 60 * 1000; // 5 minutes in milliseconds

    // Synchronization point: start of the day in UTC
    const syncPoint = new Date();
    syncPoint.setUTCHours(0, 0, 0, 0);

    const calculateRemainingTime = () => {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - syncPoint.getTime();
        const remainingTime = countdownDuration - (elapsedTime % countdownDuration);
        return Math.round(remainingTime / 1000); // in seconds
    };

    const intervalId = setInterval(async () => {
        const remainingTimeInSeconds = calculateRemainingTime();

        if (remainingTimeInSeconds > 0) {
            let minutes = Math.floor(remainingTimeInSeconds / 60);
            let seconds = remainingTimeInSeconds % 60;
            if (remainingTimeInSeconds == 9) {
                // console.log("hey i am nine")
                await ResultFunction()
            }
            last_seconds = seconds
            // // console.log(last_seconds)
            // updateCallback(last_seconds);
            // console.log(`remaining time: ${minutes}:${seconds}`);
        } else {
            clearInterval(intervalId);
            // console.log('Countdown finished. Sending results to frontend...');
            // Generate and store results
            const latestResults = {
                message: 'Countdown finished',
                timestamp: new Date()
            };
            // console.log(latestResults);
            clearMinData();
            // console.log("Previous Data Cleared");
            countdownTimer(); // Restart the countdown
        }
    }, 1000);
};



const handleUpdate = (updatedSeconds) => {
    // console.log("Updated last second:", updatedSeconds);
};

countdownTimer();
// console.log("last second",last_seconds)
let colorresult;
let result = "";
const nobat = ["blue", "red", "green"];
const Bs_arr = ["Big", "Small"]
let Bsresult = "";
var id;
// console.log(id)
var maxValueNumber;
const ResultFunction = async () => {

    var uid = await generateUniqueId();
    id = uid
    // console.log(id)

    // console.log(blue, red, green);
    // let maxValueNumber;

    function areAllUsernamesSame(array) {
        if (array.length === 0) return false;

        const firstUsername = array[0].Username;

        for (let i = 1; i < array.length; i++) {
            if (array[i].Username !== firstUsername) {
                return false;
            }
        }
        return true;
    }

    if (IncomingResult.color == "" && IncomingResult.BS == "") {
        // console.log("code with auto")


        if (minData.length > 1) {

            const check = areAllUsernamesSame(minData)
            console.log(check)
            if (check) {
                console.log("all user same")

                const random = Math.floor(Math.random() * 1001);
                // console.log(minData)
                // console.log(minData.length)
                if (random >= 300) {
                    for (let i = 0; i < minData.length; i++) {
                        // console.log(minData[i])
                        if (minData[i].Batoption == "color") {

                            result = minData[i].choose

                            // for others 
                            if (!maxValueNumber) {
                                function areAllValuesSame(obj) {
                                    const values = Object.values(obj);
                                    return values.every(v => v === values[0]);
                                }
                                function generateRandomKeyValue(obj) {
                                    // console.log("all number is same")
                                    const keys = Object.keys(obj);
                                    var randomKey = keys[Math.floor(Math.random() * keys.length)];
                                    random_key = randomKey
                                    // console.log(random_key)
                                }

                                if (areAllValuesSame(numberValues)) {
                                    let key;
                                    generateRandomKeyValue(numberValues)
                                    maxValueNumber = random_key;
                                    // // console.log(minValueNumber)

                                }
                                else {

                                    function findMaxValueNumber(mapping) {
                                        let maxNumber = null;
                                        let maxValue = -Infinity;

                                        for (let number in mapping) {
                                            if (mapping[number] > maxValue) {
                                                maxValue = mapping[number];
                                                maxNumber = number;
                                            }
                                        }

                                        return maxNumber;
                                    }

                                    maxValueNumber = findMaxValueNumber(numberValues);
                                }
                            }
                            if (Bsresult != "") {

                                if (bignumber != smallnumber) {
                                    const BSresult = Math.max(bignumber, smallnumber)
                                    if (BSresult == bignumber) {
                                        Bsresult = "Big"
                                    }
                                    else {
                                        Bsresult = "Small"
                                    }
                                }
                                else {
                                    Bsresult = Bs_arr[Math.floor(Math.random() * 2)];

                                }
                            }

                        }
                        else if (minData[i].Batoption == "number") {
                            maxValueNumber = minData[i].choose
                            if (Bsresult != "") {
                                Bsresult = Bs_arr[Math.floor(Math.random() * 2)];
                            }
                            if (result != "") {
                                result = nobat[Math.floor(Math.random() * 3)];
                            }


                        }
                        else if (minData[i].Batoption == "Bs") {
                            Bigsmallresult = minData[i].choose
                            if (Bigsmallresult == "big") {
                                Bsresult = "Big"
                            }
                            else {
                                Bsresult = "Small"
                            }
                            if (result) {
                                result = nobat[Math.floor(Math.random() * 3)];
                            }
                            if (!maxValueNumber) {
                                function areAllValuesSame(obj) {
                                    const values = Object.values(obj);
                                    return values.every(v => v === values[0]);
                                }
                                function generateRandomKeyValue(obj) {
                                    // console.log("all number is same")
                                    const keys = Object.keys(obj);
                                    var randomKey = keys[Math.floor(Math.random() * keys.length)];
                                    random_key = randomKey
                                    // console.log(random_key)
                                }

                                if (areAllValuesSame(numberValues)) {
                                    let key;
                                    generateRandomKeyValue(numberValues)
                                    maxValueNumber = random_key;
                                    // // console.log(minValueNumber)

                                }
                                else {

                                    function findMaxValueNumber(mapping) {
                                        let maxNumber = null;
                                        let maxValue = -Infinity;

                                        for (let number in mapping) {
                                            if (mapping[number] > maxValue) {
                                                maxValue = mapping[number];
                                                maxNumber = number;
                                            }
                                        }

                                        return maxNumber;
                                    }

                                    maxValueNumber = findMaxValueNumber(numberValues);
                                }
                            }

                        }

                    }




                }
                else {
                    result = nobat[Math.floor(Math.random() * 3)];
                    const random = Math.floor(Math.random() * 11);
                    maxValueNumber = random
                    Bsresult = Bs_arr[Math.floor(Math.random() * 2)];

                   
                }

            }
            else {
                console.log("all user are different")
                if (blue === red && red === green) {
                    result = nobat[Math.floor(Math.random() * 3)];
                    console.log("when all is same", result);


                } else {
                    colorresult = Math.max(blue, red, green);

                    if (colorresult === blue) {
                        result = "blue";
                    } else if (colorresult === red) {
                        result = "red";
                    } else {
                        result = "green";
                    }
                }

                function areAllValuesSame(obj) {
                    const values = Object.values(obj);
                    return values.every(v => v === values[0]);
                }
                function generateRandomKeyValue(obj) {
                    // console.log("all number is same")
                    const keys = Object.keys(obj);
                    var randomKey = keys[Math.floor(Math.random() * keys.length)];
                    random_key = randomKey
                    // console.log(random_key)
                }

                if (areAllValuesSame(numberValues)) {
                    let key;
                    generateRandomKeyValue(numberValues)
                    maxValueNumber = random_key;

                }
                else {

                    function findMaxValueNumber(mapping) {
                        let maxNumber = null;
                        let maxValue = -Infinity;

                        for (let number in mapping) {
                            if (mapping[number] > maxValue) {
                                maxValue = mapping[number];
                                maxNumber = number;
                            }
                        }

                        return maxNumber;
                    }

                    maxValueNumber = findMaxValueNumber(numberValues);
                }


                if (bignumber != smallnumber) {
                    const BSresult = Math.max(bignumber, smallnumber)
                    if (BSresult == bignumber) {
                        Bsresult = "Big"
                    }
                    else {
                        Bsresult = "Small"
                    }
                }
                else {
                    Bsresult = Bs_arr[Math.floor(Math.random() * 2)];

                }

               console.log("result dif",result,maxValueNumber,Bsresult)

            }
           
        }

        else if (minData.length == 1) {
            // console.log(minData)
            const random = Math.floor(Math.random() * 1001);
            // console.log("random for length 1",random)
            if (random >= 400) {
                if (minData[0].Batoption == "color") {

                    result = minData[0].choose
                    Bsresult = Bs_arr[Math.floor(Math.random() * 2)];
                    function areAllValuesSame(obj) {
                        const values = Object.values(obj);
                        return values.every(v => v === values[0]);
                    }
                    function generateRandomKeyValue(obj) {
                        // console.log("all number is same")
                        const keys = Object.keys(obj);
                        var randomKey = keys[Math.floor(Math.random() * keys.length)];
                        random_key = randomKey
                        // console.log(random_key)
                    }

                    // if (areAllValuesSame(numberValues)) {
                    let key;
                    generateRandomKeyValue(numberValues)
                    maxValueNumber = random_key;
                    // // console.log(minValueNumber)

                    // }


                }
                else if (minData[0].Batoption == "number") {
                    maxValueNumber = minData[0].choose
                    Bsresult = Bs_arr[Math.floor(Math.random() * 2)];
                    result = nobat[Math.floor(Math.random() * 3)];
                    // console.log(maxValueNumber)

                }
                else {
                    Bsresult = minData[0].choose
                    function areAllValuesSame(obj) {
                        const values = Object.values(obj);
                        return values.every(v => v === values[0]);
                    }
                    function generateRandomKeyValue(obj) {
                        // console.log("all number is same")
                        const keys = Object.keys(obj);
                        var randomKey = keys[Math.floor(Math.random() * keys.length)];
                        random_key = randomKey
                        // console.log(random_key)
                    }

                    if (areAllValuesSame(numberValues)) {
                        let key;
                        generateRandomKeyValue(numberValues)
                        maxValueNumber = random_key;
                        // // console.log(minValueNumber)

                    }
                    result = nobat[Math.floor(Math.random() * 3)];

                }
                // var id = generateUniqueId();
                // // console.log("unique id in result",id)
                // await Result.create({
                //     Number: maxValueNumber,
                //     Color: result,
                //     Bs: Bsresult,
                //     Uid: id

                // })
            }
            else {
                Bsresult = Bs_arr[Math.floor(Math.random() * 2)];
                result = nobat[Math.floor(Math.random() * 3)];
                function generateRandomKeyValue(obj) {
                    // console.log("all number is same")
                    const keys = Object.keys(obj);
                    var randomKey = keys[Math.floor(Math.random() * keys.length)];
                    random_key = randomKey
                    // console.log(random_key)
                }


                let key;
                generateRandomKeyValue(numberValues)
                maxValueNumber = random_key;
                // // console.log(minValueNumber)



            }
        }

        else {
            if (blue === red && red === green) {
                result = nobat[Math.floor(Math.random() * 3)];
                // console.log("when all is same", result);


            } else {
                colorresult = Math.max(blue, red, green);

                if (colorresult === blue) {
                    result = "blue";
                } else if (colorresult === red) {
                    result = "red";
                } else {
                    result = "green";
                }
            }

            function areAllValuesSame(obj) {
                const values = Object.values(obj);
                return values.every(v => v === values[0]);
            }
            function generateRandomKeyValue(obj) {
                // console.log("all number is same")
                const keys = Object.keys(obj);
                var randomKey = keys[Math.floor(Math.random() * keys.length)];
                random_key = randomKey
                // console.log(random_key)
            }

            if (areAllValuesSame(numberValues)) {
                let key;
                generateRandomKeyValue(numberValues)
                maxValueNumber = random_key;
                // // console.log(minValueNumber)

            }
            else {

                function findMaxValueNumber(mapping) {
                    let maxNumber = null;
                    let maxValue = -Infinity;

                    for (let number in mapping) {
                        if (mapping[number] > maxValue) {
                            maxValue = mapping[number];
                            maxNumber = number;
                        }
                    }

                    return maxNumber;
                }

                maxValueNumber = findMaxValueNumber(numberValues);
            }


            if (bignumber != smallnumber) {
                const BSresult = Math.max(bignumber, smallnumber)
                if (BSresult == bignumber) {
                    Bsresult = "Big"
                }
                else {
                    Bsresult = "Small"
                }
            }
            else {
                Bsresult = Bs_arr[Math.floor(Math.random() * 2)];

            }



        }
        console.log("unique id for resutl", id)
        await Result.create({
            Number: maxValueNumber,
            Color: result,
            Bs: Bsresult,
            Uid: id
        })
        console.log("result sucessfully add",{
            Number: maxValueNumber,
            Color: result,
            Bs: Bsresult,
            Uid: id
        })
    }
    else {
        // const id = generateUniqueId();
        console.log("unique id for result ", id)
        await Result.create({
            Number: IncomingResult.number,
            Color: IncomingResult.color,
            Bs: IncomingResult.BS,
            Uid: id

        })
    }

    resultApi()

}






const resultApi = async () => {

    if (IncomingResult.color == "" && IncomingResult.BS == "") {


        let maindata = [];
        let maindataforguest = [];

        try {
            if (minData.length > 0) {

                // console.log("max",maxValueNumber)

                const dataWithIds = await Promise.all(minData.map(async (data) => {
                    let status = 'loss';
                    const trimmedChoose = data.choose.trim().toLowerCase();
                    const trimmedResult = result.trim().toLowerCase();

                    try {


                        if ((data.Batoption === 'color') && (trimmedChoose === trimmedResult)) {
                            status = 'won';
                            const Data = await Return.ColorX.findOne();
                            const X = Data.color;
                            const total_adding_ammount = X * data.Ammount;
                            const updatevalueof = await Usermodel.updateOne({ Username: data.Username }, { $inc: { wallet: total_adding_ammount } })
                            // console.log(updatevalueof)

                            // console.log("x color", X)
                        } if (data.Batoption === 'number' && (data.choose) == maxValueNumber) {
                            status = 'won';
                            const Data = await Return.NumberX.findOne().sort({ _id: -1 });
                            const X = Data[data.choose];
                            const total_adding_ammount = X * data.Ammount;
                            const updatevalueof = await Usermodel.updateOne({ Username: data.Username }, { $inc: { wallet: total_adding_ammount } })
                            // // console.log(user.wallet)

                            // console.log("x number", X)

                        } if (data.Batoption === 'Bs' &&
                            ((data.choose == 'big' && Bsresult == "Big") ||
                                (data.choose == 'small' && Bsresult == "Small"))) {
                            // console.log(Bsresult)
                            status = 'won';
                            const Data = await Return.BgX.findOne();
                            const X = Bsresult == "Big" ? Data.big : Data.small;
                            const total_adding_ammount = X * data.Ammount;
                            const updatevalueof = await Usermodel.updateOne({ Username: data.Username }, { $inc: { wallet: total_adding_ammount } })

                            // // console.log('Big/Small amount credited successfully!', user.wallet);

                            // console.log("x bg", X)

                        }
                        // // console.log("final waller", user.wallet)
                        // console.log("id when save data in database",id)
                        return { ...data, Uid: id, status: status };
                    } catch (error) {
                        console.error('Error crediting money:', error.message);
                        return { ...data, Uid: id, status: status }; // Ensure data is still returned even if an error occurs
                    }
                }));
                // console.log(dataWithIds)
                maindata = dataWithIds;
                 console.log("maindata",maindata);
                await Batmodel.insertMany(maindata);
                console.log("Data successfully inserted into the database.");
                // minData.length = 0; // Clear the array
                // minDataForguest.length = 0;
                // blue = red = green = bignumber = smallnumber = 0;
                clearMinData();
            } else {
                // console.log("No data to insert.");
            }
        } catch (error) {
            console.error("Error inserting data into the database:", error);
        }




    }

    else {
        let maindata = [];

        try {

            if (minData.length > 0) {
                const dataWithIds = await Promise.all(minData.map(async (data) => {
                    let status = 'loss';
                    const trimmedChoose = data.choose.trim().toLowerCase();
                    const trimmedResult = IncomingResult.color.trim().toLowerCase();

                    try {


                        if ((data.Batoption === 'color') && (trimmedChoose === trimmedResult)) {
                            status = 'won';
                            const Data = await Return.ColorX.findOne();
                            const X = Data.color;
                            const total_adding_ammount = X * data.Ammount;
                            await Usermodel.updateOne({ Username: data.Username }, { $inc: { wallet: total_adding_ammount } })


                            // console.log("x color", X)
                        } if (data.Batoption === 'number' && (data.choose) == IncomingResult.number) {
                            status = 'won';
                            const Data = await Return.NumberX.findOne().sort({ _id: -1 });
                            const X = Data[data.choose];
                            const total_adding_ammount = X * data.Ammount;
                            await Usermodel.updateOne({ Username: data.Username }, { $inc: { wallet: total_adding_ammount } })


                            // console.log("x number", X)

                        } if (data.Batoption === 'Bs' &&
                            ((data.choose == 'big' && "big" == IncomingResult.BS) ||
                                (data.choose == 'small' && "small" == IncomingResult.BS))) {
                            status = 'won';
                            const Data = await Return.BgX.findOne();
                            const X = IncomingResult.BS == "Big" ? Data.big : Data.small;
                            const total_adding_ammount = X * data.Ammount;
                            await Usermodel.updateOne({ Username: data.Username }, { $inc: { wallet: total_adding_ammount } })
                            // // console.log('Big/Small amount credited successfully!', user.wallet);

                            // console.log("x bg", X)

                        }
                        // console.log("final waller", user.wallet)
                        return { ...data, Uid: id, status: status };
                    } catch (error) {
                        console.error('Error crediting money:', error.message);
                        return { ...data, Uid: id, status: status }; // Ensure data is still returned even if an error occurs
                    }
                }));

                // console.log(dataWithIds);
                await Batmodel.insertMany(dataWithIds);
                // console.log("Data successfully inserted into the database.");
            } else {
                // console.log("No data to insert.");
            }

        }


        catch (error) {
            console.error("Error inserting data into the database:", error);
        }


    }


}

const UserResult = async (req, res) => {
    const Incomingaccesstoken = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer", "")


    if (Incomingaccesstoken) {
        var Decodedtoken = jwt.verify(Incomingaccesstoken, process.env.ACCESS_TOKEN_KEY);
        var userid = Decodedtoken?.id;
        var Username = Decodedtoken?.Username;

        // console.log(req.cookies)
        // console.log(Decodedtoken)


        const Lastresult = await Result.findOne({Uid:id});
        console.log(Lastresult);

        // const Unqiue_id = Lastresult.Uid;
        console.log(id);
        const userresult = await Batmodel.find({ Uid: id, Username: Username })
        const resultObject = userresult.map((item) => {
            return { Batoption: item.Batoption, choose: item.choose, Ammount: item.Ammount, stauts: item.status }

        })
         console.log("result object",resultObject)
         console.log(userresult)
        res.json({ resultObject, Lastresult })



    }
    else {
        res.json("Token didn't get")
    }

}





const slothistory = async (req, res) => {
    try {
        const data = await Result.find().limit(25).sort({ createdAt:-1 })
        console.log(data)
        res.json(data)
    } catch (error) {
        // console.log(error)
    }
}

const GuestLogin = async (req, res) => {
    const generateUniqueId = () => {
        let id = Math.abs(parseInt(uuidv4().replace(/-/g, ''), 16)).toString().slice(0, 7);
        // Ensure the ID is 7 digits
        while (id.length < 7) {
            id = '0' + id;
        }
        return id;
    };


    const guestid = generateUniqueId()
    let options = {
        httpOnly: true,
        secure: true,
        path: "/" // Corrected to lowercase "path"
    };

    await guestUsermodel.create({
        guestid: guestid
    })

    res.cookie("guestid", guestid, options).json("sucess");


}

module.exports = {
    UserData,
    resultApi,
    slothistory,
    AdminSending,
    IncomingResultfromAdmin,
    GuestLogin,
    UserResult
}