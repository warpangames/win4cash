const amountContainer = document.querySelectorAll('.amount-box');
const multipleContainer  = document.querySelectorAll('.multiple-val');
const quantityContainer  = document.querySelector('.quantity-val');
const popup  = document.querySelector('.popup');
const colorContainer = document.querySelector('.color-container');
const betContainer  = document.querySelector('.slected-bet');
const finalBetContainer = document.querySelector('.final-bet');
const timer = document.querySelector('.timer-box');
let Amount = 1;
let Quantity = 1;
let initial = true;
let AvailableAmount ;
let firstHit = true ;
let betHistoryData;
let slotHistoryData;
let returnData ;

async function getAllData(){
    const res = await axios.get('https://win4cash.in/Alldata');
    if(res.status===200){
        const walletContainer  = document.querySelector('#balance-data');
        walletContainer.innerHTML = res.data.wallet;
        AvailableAmount = res.data.wallet;
    }
}

getAllData();

async function getHistory(){
    const res1  = await axios.get('https://win4cash.in/user/history');
    betHistoryData = res1.data;
    const res2 = await axios.get('https://win4cash.in/bathistory');
    slotHistoryData = res2.data;
    populateTable(slotHistoryData,['Uid','Color' ,'Number','Bs']);
    const res3 = await axios.get('https://win4cash.in/returnx');
    returnData = res3.data;
    const returnContainer  = document.querySelectorAll('.bet-return');
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



function handlemultiple(element,val){
    const bet = getCookie('betType');
    Quantity = val;
    multipleContainer.forEach(item=>{
        item.style.backgroundColor='#D9D9D9';
        item.style.color='black';
    })
    element.style.backgroundColor='red';
    element.style.color = 'white';
    handleBet(bet);
   }

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

// const dataArray1 = [
//     { column1: 'Value 1A', column2: 'Value 1B', column3: 'Value 1C' },
//     { column1: 'Value 2A', column2: 'Value 2B', column3: 'Value 2C' },
// ];

// const dataArray2 = [
//     { column1: 'Value 3A', column2: 'Value 3B', column3: 'Value 3C' },
//     { column1: 'Value 4A', column2: 'Value 4B', column3: 'Value 4C' },
// ];


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
            keysToShow.forEach(key => {
                const cell = document.createElement('td');
                cell.classList.add('table-column');
                if (key === 'Number') {

                    cell.textContent = obj[key].toString(); // Convert integer to string for 'number' key
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
    const numberBetBhav = document.querySelectorAll('.bet-bhav-number');
    console.log(numberBetBhav,'betbhav');
    if(type&&initial){
        amountContainer[0].style.backgroundColor='red';
        multipleContainer[0].style.backgroundColor='red';
        amountContainer[0].style.color='white';
        multipleContainer[0].style.color='white';
    }

    initial = false;
   
    document.cookie = `betType=${val}`;
    console.log(popup,'hello')
    popup.style.display = 'block';
    colorContainer.style.background = val==='green'?'linear-gradient(180deg, #0EB200 0%, #064C00 100%)':val==='blue'?'linear-gradient(180deg, #2838CD 0%, #141C67 100%)':val==='red'?'linear-gradient(180deg, #FF0000 0%, #990000 100%)':val==='0'||val==='1'||val=='2'||val=='3'||val=='4'||val==='5'||val==='6'||val==='7'||val==='8'||val==='9'?'radial-gradient(50% 345.95% at 50% 50%, #FFD700 0%, #A18800 100%)':val==='big'?'linear-gradient(180deg, #C342FF 0%, #440088 100%)':'linear-gradient(180deg, #00FFF0 0%, #006889 100%)';
    betContainer.innerHTML=val;
    quantityContainer.innerHTML = Quantity;
    const finalBet = Amount*Quantity;
    finalBetContainer.innerHTML = finalBet;
    const returnAmt = finalBet*findReturn(val);
   console.log(returnAmt,'returnAmt');
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
            item.innerHTML = `-${((returnAmt*returnData.number[index])/totalReturn).toFixed(2)}`;
        }
    })
   }

}

function handleCancleBet(){
    console.log('hello')
    initial = true;
     Amount = 1;
     Quantity = 1;
     multipleContainer.forEach(item=>{
        item.style.backgroundColor='#D9D9D9';
        item.style.color='black';
    })
    amountContainer.forEach(item=>{
        item.style.backgroundColor='#D9D9D9';
        item.style.color='black';
    })
    amountContainer[0].style.backgroundColor='red';
    multipleContainer[0].style.backgroundColor='red';
    amountContainer[0].style.color='white';
    multipleContainer[0].style.color='white';

    popup.style.display = 'none';
}


async function handleSubmit(){
    console.log('hello1')
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
    let Ammount = Amount*Quantity;

    if(AvailableAmount<Ammount){
        alert('Insufficient Balance')
        return;
    }

    const res  = await axios.post('https://win4cash.in/user/bat',{batoption,choose,Ammount});
    console.log(res,'res')
    handleCancleBet();
    getAllData();
}


function calculateRemainingTime() {
    const countdownDuration = 1 * 60; // 5 minutes in seconds

    // Synchronization point: start of the day in UTC
    const syncPoint = new Date();
    syncPoint.setUTCHours(0, 0, 0, 0);

    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - syncPoint.getTime()) / 1000; // in seconds
    let remainingTime = countdownDuration - (elapsedTime % countdownDuration);

    // Add 4 seconds to initial time but don't display it
    remainingTime += 4;

    return Math.round(remainingTime); // in seconds
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

    return formattedTime;
}

 function startCountdown(initialTime) {
    let remainingTime = initialTime;
    const countdownInterval = setInterval(async () => {
        // Display the remaining time
        const formattedTime = formatTime(remainingTime);
        // console.log('Remaining Time:', formattedTime);
        timer.innerHTML = formattedTime;
        if (remainingTime <= 10) {
            // Add a class to the 'main' div to make it unclickable
            const mainDiv = document.querySelector('.main');
            mainDiv.classList.add('unclickable');
            // console.log(mainDiv,remainingTime,'hehehe');
            if(firstHit){
                const res = await axios.get('https://win4cash.in/user/result');
                console.log(res,'final data')
                firstHit = false;
            }
           

        }
        else{
            
                const mainDiv = document.querySelector('.main');
                mainDiv.classList.remove('unclickable');
            
        }
        // Decrease remaining time by 1 second
        remainingTime--;

        // Check if remaining time is 0
        if (remainingTime <= 0) {
            remainingTime = 1 * 60;
            firstHit = true;
            window.location.reload();
        }
    }, 1000);

    return countdownInterval;
}


    const initialTime = calculateRemainingTime();
    startCountdown(initialTime);
