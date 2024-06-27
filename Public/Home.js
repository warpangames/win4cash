const amountContainer = document.querySelectorAll('.amount-box');
// const multipleContainer  = document.querySelectorAll('.multiple-val');
const quantityContainer  = document.querySelector('.quantity-val');
const popup  = document.querySelector('.popup');
const colorContainer = document.querySelector('.color-container');
const betContainer  = document.querySelector('.slected-bet');
const finalBetContainer = document.querySelector('.final-bet');
const timer = document.querySelector('.time');
const numberBetBhav = document.querySelectorAll('.bet-bhav-number');
const colorBetBhav = document.querySelectorAll('.color-bhav');
const BsBhav = document.querySelectorAll('.Bs-bhav');
const BsInfoImg = document.querySelector('.Bs-Info');
const BsInfo = document.querySelector('.bs-InfoData');
const popup1 = document.querySelector('.popup1');
const liveUser = document.getElementById('live-user');
const inpt = document.getElementById('BetInput');
const AnimationTimer = document.querySelector('.AnimationTimer');


// console.log(BsInfoImg,BsInfo);
// BsInfoImg.addEventListener('click',(e)=>{
//     e.stopPropagation();
//     console.log('jk')
//     BsInfo.style.display = 'block';
// })
// document.addEventListener('click',()=>{
//     console.log('jk')
//     BsInfo.style.display = 'none';
// })
// BsInfoImg.addEventListener('mouseout',()=>{
//     console.log('jk')
//     BsInfo.style.display = 'none';
// })

let Amount = 1;
let Quantity = 1;
let initial = true;
let AvailableAmount ;
let firstHit = true ;
let betHistoryData;
let slotHistoryData;
let returnData ;
let isLogin = false;
let balance;
let remainingTime;
let slotResult;
let userBets;

async function getAllData(){
    const res = await axios.get('http://localhost:7000/Alldata');
    console.log(res,'allData')
    if(res.status===200){
        const walletContainer  = document.querySelector('#balance-data');
        const username = document.querySelector('.user-name');
        walletContainer.innerHTML = res.data.userdata.wallet;
        AvailableAmount = res.data.wallet;
        isLogin = res.data.Islogin;
        balance = res.data.userdata.wallet;
        username.innerHTML = res.data.userdata.Username
    }
}

getAllData();

// console.log(inpt,finalBetContainer,'hehehe1')



document.addEventListener('DOMContentLoaded', (event) => {
   
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        }
    }

    // Event handler
    const handleChange = () => {
       amountContainer.forEach(item=>{
        item.style.backgroundColor='#D9D9D9';
        item.style.color='black';
       })
        finalBetContainer.innerHTML = inpt.value;
    };

    // Add the input event listener with debounce
    inpt.addEventListener('input', debounce(handleChange, 300));
});


function handleProfile(){
   if(isLogin){
    window.location.href = '/user/Profile';
   }
   else{
    popup1.style.display = 'block';
   }
}

function handleWithdraw(){
    if(isLogin){
    window.location.href = '/user/withdraw';
    }
    else{
        popup1.style.display = 'block';
       }
}

function handleDeposit(){
    if(isLogin){
        window.location.href = '/user/Payment';
    }
    else{
        popup1.style.display = 'flex';
    }
}

async function getHistory(){
    const res1  = await axios.get('http://localhost:7000/user/history');
    betHistoryData = res1.data;
    console.log(betHistoryData)
    const res2 = await axios.get('http://localhost:7000/bathistory');
    slotHistoryData = res2.data;
    populateTable(slotHistoryData,['Uid','Color' ,'Number','Bs']);
    const res3 = await axios.get('http://localhost:7000/returnx');
    returnData = res3.data;
    console.log(returnData,'return');
    const returnContainer  = document.querySelectorAll('.bet-return');
    const colorreturn = document.querySelectorAll('.color-return');
    const bsreturn = document.querySelectorAll('.bs-return');
    colorreturn.forEach((val,index)=>{
        val.innerHTML = `${returnData.color.color}X`
    })
    bsreturn.forEach((val,index)=>{
        if(index===0)
        val.innerHTML = `${returnData.bg.big}X`;

        if(index===1)
            val.innerHTML = `${returnData.bg.small}X`;

    })
    returnContainer.forEach((val,index)=>{
        val.innerHTML = `${returnData.number[index]}X`
    })
    console.log(res3,'res3');
    console.log(res1, 'userHistory');
    console.log(res2, 'betHistory');

}

getHistory();

function getCookie(cookieName) {
    let cookieString = document.cookie;
    let cookies = cookieString.split(';');
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim(); 

        if(cookie.startsWith(cookieName + "=")) {
            let parts = cookie.split('=');
            return parts[1]; 
        }
    }

    return null;
}

function cookieExists(cookieName) {
    let cookieString = document.cookie;
    let cookies = cookieString.split(';');

    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim(); 

        if(cookie.startsWith(cookieName + "=")) {
            return true; // Cookie found
        }
    }

    return false;
}



// function handlemultiple(element,val){
//     const bet = getCookie('betType');
//     Quantity = val;
//     multipleContainer.forEach(item=>{
//         item.style.backgroundColor='#D9D9D9';
//         item.style.color='black';
//     })
//     element.style.backgroundColor='red';
//     element.style.color = 'white';
//     handleBet(bet);
//    }

   function handleQunatity(val){
    const bet = getCookie('betType');
   if(val===-1){
    if( Quantity<1){
        Quantity = 1;
    }
    else Quantity--;
   }
   else{
    Quantity++;
   }
   console.log(Quantity,'quantity')
   handleBet(bet);
   }

   function handleAmount(element,val){
    const bet = getCookie('betType');
    console.log(bet,'cookies')
    Amount = val;
    amountContainer.forEach(item=>{
        item.style.backgroundColor='#D9D9D9';
        item.style.color='black';
    })
    element.style.backgroundColor='red';
    element.style.color = 'white';
    handleBet(bet);
   }



const historyButtons  = document.querySelectorAll('.history-button'); 
historyButtons.forEach((item)=>{
    item.addEventListener('click',()=>{
        historyButtons.forEach(val=>{
        val.classList.remove('active-history');
        })
        item.classList.add('active-history');
    })
})

function removeDecimal(number) {
    if(number){
        let cleanedStr = number.replace('.', '');
        return cleanedStr;
    }
   
  }


function populateTable(data, keysToShow) {
    const tableBody = document.querySelector('#myTable');
    const tableHead = document.querySelector('#tableHead');
    tableBody.innerHTML = '';
    tableHead.innerHTML = ''; // Clear existing table headers

    if (data) {
        console.log(data)
        // Create table headers based on keys to show
        const headRow = document.createElement('tr');
        keysToShow.forEach(key => {
            const headCell = document.createElement('th');
            headCell.textContent = key;
            headRow.appendChild(headCell);
        });
        tableHead.appendChild(headRow);

        // Populate table body with data
        data.forEach(obj => {
            const row = document.createElement('tr');
            row.classList.add('history-row');
        //    row.style.color = obj.Color;
            keysToShow.forEach(key => {
                const cell = document.createElement('td');
                cell.classList.add('table-column');
                if(key==='Uid'){
                    cell.textContent = removeDecimal(obj[key]);
                }
              else if(key==='Color'){
                   
                    cell.innerHTML = `<div style='width:15px;height:15px;border-radius:50%; background-color:${obj[key]};margin:auto'></div>`;
                }
               else if (key === 'Number') {

                    cell.textContent = obj[key]; // Convert integer to string for 'number' key
                } else {
                    cell.textContent = obj[key] || ''; // If key not present in object, set empty string
                }
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
    }
}

console.log(betHistoryData,slotHistoryData,'kahfsiuh')

// populateTable(dataArray);
function handleHistoryClick(data){
    if(data==='bet')
    populateTable(slotHistoryData,['Uid','Color' ,'Number','Bs']);
else
populateTable(betHistoryData,['Uid','Batoption','Ammount','choose','status']);
}

function findReturn(val){
  if(val==='0'||val==='1'||val==='2'||val==='3'||val==='4'||val==='5'||val==='6'||val==='7'||val==='8'||val==='9'){
    let intVal = parseInt(val);
    return returnData.number[intVal];
  }
  else if(val==='big'){
    return returnData.bg.big;
  }
  else if(val==='small'){
    return returnData.bg.small;
  }
  else{
    return returnData.color.color;
  }
}

function handleBet(val,type=false){
    if(balance>=300000){
        alert('Enjoy your Game After 24 Hours , Best of Luck !');
        return;
    }
    console.log(numberBetBhav,'betbhav');
    if(type&&initial){
        amountContainer[0].style.backgroundColor='red';
        // multipleContainer[0].style.backgroundColor='red';
        amountContainer[0].style.color='white';
        // multipleContainer[0].style.color='white';
      
    }

    console.log(type,initial,remainingTime,'ho')

    if(type&&initial&&remainingTime>=10){
        popup.classList.toggle('active');
    }

    


    numberBetBhav.forEach((item,index)=>{
       
        item.innerHTML ='';
    
})

BsBhav.forEach((item,index)=>{
   
        item.innerHTML = '';
    
    
})

colorBetBhav.forEach((item,index)=>{
   
        item.innerHTML = '';

    
    
})




    initial = false;
   
    document.cookie = `betType=${val}`;
    popup.style.display = 'block';
   
    colorContainer.style.background = val==='green'?'linear-gradient(180deg, #0EB200 0%, #064C00 100%)':val==='blue'?'linear-gradient(180deg, #2838CD 0%, #141C67 100%)':val==='red'?'linear-gradient(180deg, #FF0000 0%, #990000 100%)':val==='0'||val==='1'||val=='2'||val=='3'||val=='4'||val==='5'||val==='6'||val==='7'||val==='8'||val==='9'?'radial-gradient(50% 345.95% at 50% 50%, #FFD700 0%, #A18800 100%)':val==='big'?'linear-gradient(180deg, #C342FF 0%, #440088 100%)':'linear-gradient(180deg, #00FFF0 0%, #006889 100%)';
    betContainer.innerHTML=val;
    quantityContainer.innerHTML = Quantity;
    const finalBet = Amount*Quantity;
    finalBetContainer.innerHTML = finalBet;

    inpt.value = finalBet;

    const returnAmt = finalBet*findReturn(val);
   if(val==='0'||val==='1'||val==='2'||val==='3'||val==='4'||val==='5'||val==='6'||val==='7'||val==='8'||val==='9'){
    console.log('step1');
    let intVal = parseInt(val);
    let totalReturn = 0;
    for(let key in returnData.number){
        if(key!=intVal && key>=0 && key<=9){
            console.log(key,intVal,'dj')
            totalReturn = totalReturn + returnData.number[key];
        }
    }
    console.log(totalReturn,'step2');
    numberBetBhav.forEach((item,index)=>{
        if(index===intVal){
            item.innerHTML = `+${returnAmt}`;
        }
        else{
            // item.innerHTML = `-${((returnAmt*returnData.number[index])/totalReturn).toFixed(2)}`;
            item.innerHTML = `-${finalBet}`;
        }
    })
   }

    if(val==='red'){
        colorBetBhav.forEach((item,index)=>{
            if(index===0){
                item.innerHTML = `+${returnAmt}`;
            }
            else{
                // item.innerHTML = `-${returnAmt/2}`;
                item.innerHTML = `-${finalBet}`;
            }
            
        })
    }
    if(val==='green'){
        colorBetBhav.forEach((item,index)=>{
            if(index===1){
                item.innerHTML = `+${returnAmt}`;
            }
            else{
                // item.innerHTML = `-${returnAmt/2}`;
                item.innerHTML = `-${finalBet}`;
            }
            
        })
    }
    if(val==='blue'){
        colorBetBhav.forEach((item,index)=>{
            if(index===2){
                item.innerHTML = `+${returnAmt}`;
            }
            else{
                // item.innerHTML = `-${returnAmt/2}`;
                item.innerHTML = `-${finalBet}`;
            }
            
        })
   }

   if(val==='small'){
    BsBhav.forEach((item,index)=>{
        if(index===0){
            item.innerHTML = `+${returnAmt}`;
        }
        else{
            item.innerHTML = `-${finalBet}`;
        }
        
    })
}

if(val==='big'){
    BsBhav.forEach((item,index)=>{
        if(index===1){
            item.innerHTML = `+${returnAmt}`;
        }
        else{
            item.innerHTML = `-${finalBet}`;
        }
        
    })
}
 

}
function handleCancleBet(){
    initial = true;
     Amount = 1;
     Quantity = 1;
    //  multipleContainer.forEach(item=>{
    //     item.style.backgroundColor='#D9D9D9';
    //     item.style.color='black';
    // })
    amountContainer.forEach(item=>{
        item.style.backgroundColor='#D9D9D9';
        item.style.color='black';
    })
    amountContainer[0].style.backgroundColor='red';
    // multipleContainer[0].style.backgroundColor='red';
    amountContainer[0].style.color='white';
    // multipleContainer[0].style.color='white';

    numberBetBhav.forEach((item,index)=>{
       
            item.innerHTML ='';
        
    })

    BsBhav.forEach((item,index)=>{
       
            item.innerHTML = '';
        
        
    })

    colorBetBhav.forEach((item,index)=>{
       
            item.innerHTML = '';

        
        
    })

    // popup.style.display = 'none';
    popup.classList.remove('active');
    inpt.value = '';
}


async function handleSubmit(){
    const bet = getCookie('betType');
    let batoption;
    if(bet==='0'||bet==='1'||bet==='2'||bet==='3'||bet==='4'||bet==='5'||bet==='6'||bet==='7'||bet==='8'||bet==='9'){
        batoption = 'number';
    }
    if(bet==='green'||bet==='blue'||bet==='red'){
        batoption = 'color';
    }

    if(bet==='big'||bet==='small'){
        batoption = 'Bs';
    }
    let choose = bet;
    let Ammount ;

    if(inpt.value){
        Ammount = inpt.value;
    }

    else{
        Ammount = Amount*Quantity;
    }

    console.log(Ammount,'Ammount');

    if(balance<Ammount){
        alert('Insufficient Balance')
        return;
    }

    if(Ammount<50){
        alert('Amount must be greater than 50 rupees');
        return;
    }

    balance = balance - Ammount;

    const res  = await axios.post('http://localhost:7000/user/bat',{batoption,choose,Ammount});
    console.log(res,'res');
    betHistoryData.unshift({
        Ammount:Ammount,
        Batoption:batoption,
        Uid:'Panding',
        choose:choose,
        status:'panding'
    })
    inpt.value = '';
    populateTable(betHistoryData,['Uid','Batoption','Ammount','choose','status']);
    handleCancleBet();
    getAllData();
}


function calculateRemainingTime() {
    const countdownDuration = 2 * 60; // 5 minutes in seconds

    // Synchronization point: start of the day in UTC
    const syncPoint = new Date();
    syncPoint.setUTCHours(0, 0, 0, 0);

    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - syncPoint.getTime()) / 1000; // in seconds
    let remainingTime = countdownDuration - (elapsedTime % countdownDuration);

    // Add 4 seconds to initial time but don't display it
    // remainingTime += 4;


    return Math.round(remainingTime); // in seconds
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

    return formattedTime;
}

 function startCountdown(initialTime) {
     remainingTime = initialTime;
    const countdownInterval = setInterval(async () => {
        // Display the remaining time
        const formattedTime = formatTime(remainingTime);
        // console.log('Remaining Time:', formattedTime);
        timer.innerHTML = formattedTime;
        // remainingTime = 5
        if (remainingTime <= 10) {
            AnimationTimer.innerHTML = formattedTime;
            // Add a class to the 'main' div to make it unclickable
            const mainDiv = document.querySelector('.CompleteBet');
            popup.classList.remove('active');
            inpt.value = '';
            mainDiv.classList.add('unclickable');
            initial = true;
            // console.log(mainDiv,remainingTime,'hehehe');
            if(firstHit){
              
                firstHit = false;
                numberBetBhav.forEach((item,index)=>{
       
                    item.innerHTML ='';
                
            })
        
            BsBhav.forEach((item,index)=>{
               
                    item.innerHTML = '';
                
                
            })
        
            colorBetBhav.forEach((item,index)=>{
               
                    item.innerHTML = '';
        
                
                
            })
            }
           

        }
        else{
            
                const mainDiv = document.querySelector('.CompleteBet');
                mainDiv.classList.remove('unclickable');
                AnimationTimer.innerHTML = "";
            
        }
        // Decrease remaining time by 1 second
        remainingTime--;

            console.log(remainingTime,firstHit,'aqwd')
        if(remainingTime == 5 && !firstHit){
            console.log('saasd')
            const res = await axios.get('http://localhost:7000/user/result');
            console.log(res,'final data');
            slotResult = res.data.Lastresult;
            userBets = res.data.resultObject;
            if(userBets.length>0){
                showResultPopup();
            }
        }

        // Check if remaining time is 0
        if (remainingTime <= 0) {
            remainingTime = 2 * 60;
            firstHit = true;
            getHistory();
            getAllData();
            // window.location.reload();
        }
    }, 1000);

    return countdownInterval;
}


    const initialTime = calculateRemainingTime();
    startCountdown(initialTime);

    function closePopup() {
        document.getElementById('popup').style.display = 'none';
    }

    function login() {
        window.location.href = 'user/login';
    }

    // function getRandomNumber(min, max) {
    //     const val =  Math.floor(Math.random() * (max - min + 1)) + min;
    //     liveUser.innerHTML = val;
    // }

    // getRandomNumber(1000,5000);


    let currentNumber = Math.floor(Math.random() * 501) + 1000; 
        function updateNumber() {
            const change = Math.floor(Math.random() * 30) + 1; 
            const increase = Math.random() < 0.5; 

            if (increase) {
                currentNumber += change;
            } else {
                currentNumber -= change;
            }

            if (currentNumber < 1000) {
                currentNumber = 1000;
            } else if (currentNumber > 1500) {
                currentNumber = 1500;
            }

            document.getElementById('randomNumber').textContent = currentNumber;
        }

        document.getElementById('randomNumber').textContent = currentNumber;

        setInterval(updateNumber, 5000);


        document.getElementById('openRulesBtn').addEventListener('click', function() {
            document.getElementById('rulesPopup').style.display = 'block';
        });
        
        document.getElementById('closeBtn').addEventListener('click', function() {
            document.getElementById('rulesPopup').style.display = 'none';
        });
        
        window.addEventListener('click', function(event) {
            if (event.target == document.getElementById('rulesPopup')) {
                document.getElementById('rulesPopup').style.display = 'none';
            }
        });

        function openWhatsAppChat() {
            var phoneNumber = "9649504608"; // Replace with the actual phone number
            var url = "https://wa.me/" + phoneNumber;
            window.open(url, '_blank');
        }


       
            const resultPopup = document.getElementById('resultPopup');
            const closeResultPopup = document.getElementById('closePopup');
      
            // Sample data to simulate the game result
            // const slotResult = {
            //   number: 7,
            //   color: "Red",
            //   Bs: "Big"
            // };
      
            // const userBets = [
            //   { Type: "Color", Choose: "Red", status: "Win" },
            //   { Type: "Number", Choose: 5, status: "Lose" },
            //   { Type: "Big/Small", Choose: "Big", status: "Win" }
            // ];
      
            // Function to show the popup with result
            const showResultPopup = () => {
              document.getElementById('slotNumber').textContent = slotResult.Number;
              document.getElementById('slotColor').textContent = slotResult.Color;
              document.getElementById('slotBs').textContent = slotResult.Bs;
      
              const userBetsContainer = document.getElementById('userBets');
              userBetsContainer.innerHTML = '';
              
              userBets.forEach(bet => {
                const betDiv = document.createElement('div');
                betDiv.classList.add('user-bet', 'animate__animated', 'animate__fadeInUp');
                betDiv.innerHTML = `
                  <p>${bet.Batoption}</p>
                  <p>${bet.choose}</p>
                  <p class="${bet.stauts === 'won' ? 'win' : 'lose'}">${bet.stauts}</p>
                `;
                userBetsContainer.appendChild(betDiv);
              });
              
              resultPopup.style.display = 'flex';
              resultPopup.classList.add('animate__fadeIn');
              document.querySelector('.popup-content').classList.add('animate__zoomIn');
            };
      
            // Event listener to close the popup
            closeResultPopup.addEventListener('click', () => {
              resultPopup.classList.remove('animate__fadeIn');
              resultPopup.classList.add('animate__fadeOut');
              document.querySelector('.popup-content').classList.remove('animate__zoomIn');
              document.querySelector('.popup-content').classList.add('animate__zoomOut');
      
              setTimeout(() => {
                resultPopup.style.display = 'none';
                resultPopup.classList.remove('animate__fadeOut');
                document.querySelector('.popup-content').classList.remove('animate__zoomOut');
              }, 1000);
            });
      
            // Simulate the result popup display after some event
            // setTimeout(showResultPopup, 2000); // Show popup after 2 seconds for demo
          


    
   



