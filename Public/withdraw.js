let uniqueId;
let historyData = [];
let amt ;

const fromcontainer = document.querySelector('.bankdetails-container');
function handleDisplayForm(){
    fromcontainer.style.display = 'block';
}

async function withHistory(){
    const res = await axios.get('https://win4cash.in/user/withdraw/history');
    console.log(res,'history');
    if(res.data.length>0){
        historyData = res.data;
        populateTable(res.data);
      
        openPopup();
    }
   
}

withHistory();

let wallet ;
let bankStatus ;

async function getAllData(){
    const res = await axios.get('https://win4cash.in/Alldata');
    console.log(res,'allData')
    if(res.status===200){
        const walletContainer  = document.querySelector('.balance-data');
        walletContainer.innerHTML = res.data.userdata.wallet;
        wallet = res.data.userdata.wallet;
        bankStatus = res.data.userdata.bankdetail;
    }
}

getAllData();

async function getQr(){
    const res = await axios.get('https://win4cash.in/user/payment/qr');
    console.log(res,'qr')
    const bufferData = res.data.data.data;

// Step 2: Convert the buffer data to a Uint8Array
const uint8Array = new Uint8Array(bufferData);

// Step 3: Convert the Uint8Array to a base64 string
const base64String = btoa(String.fromCharCode(...uint8Array));

// Step 4: Create the data URL
const contentType = res.data.contentType;
const imageURL = `data:${contentType};base64,${base64String}`;

console.log(imageURL);

const qrImg = document.getElementById('qr-img')
qrImg.src = imageURL;


   }
   getQr();

async function handleWithdraw(){
    const widthd = document.getElementById('widthdraw');
    amt = widthd.value;
    if(wallet<amt){
        alert('Amount must be less than wallet');
        return;
    }

    if(amt<10000){
        alert('Amount must be greater than 10,000 rupees or try after 24 hours');
        return;
    }

    if(!bankStatus){
        alert('please add bank details');
        return;
    }
    if(historyData.length>0){
        alert('First Pay the GST of requested Withdraw Amount');
        return;
    }
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
      }
      
    uniqueId = generateUniqueId();
    openPopup();
//    const container = document.querySelector('.gst-container');
//    container.style.display = 'block';
   

    const res = await axios.post('https://win4cash.in/user/withdraw/ammount',{reqammount:amt,uniqueId});
    console.log(res,'res')
    if(res.status==200){
        widthd.value = '';
        getAllData();
        withHistory();
    }


}

async function handlePayment(){
    const inpt = document.getElementById('amount');
   const  gstammount = inpt.value;
   const Transcation_id1 = document.getElementById('txn');
   const Trancation_id  = Transcation_id1.value;
    // if(gstammount<100){
    //     alert('Amount must be greater than 100 rupees');
    //     return;
    // }
    // console.log(gstammount,Transcation_id,'hekko')
    console.log(gstammount,'amount')
    const res = await axios.post('https://win4cash.in/user/withdraw/second',{gstammount,Trancation_id,uniqueId});
    console.log(res,'res')
    inpt.value = '';
    Transcation_id1.value = '';
    closePopup();
    }

async function handleBankDetails(e){
     e.preventDefault();
    const Accountno = document.getElementById('AccountNumber').value;
    const bankname = document.getElementById('Bank-Name').value;
    const fullname = document.getElementById('Name').value;
    const phoneno = document.getElementById('Phone').value;
    const IFSC  = document.getElementById('IFSC').value;
    console.log(Accountno,bankname,fullname,phoneno,IFSC)
     const res = await axios.post('https://win4cash.in/user/bankdetail',{Accountno,bankname,fullname,phoneno,IFSC});
    if(res.status==200){
        fromcontainer.style.display = 'none';
        getAllData();

    }

}

function formatTime(timeString) {
    const date = new Date(timeString);
    
    // Format the date components
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    // Format the time components
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
  
    // Construct the formatted time string
    const formattedTime = `${day} ${month} ${year}, ${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  
    return formattedTime;
  }
  

function populateTable(data) {
    const tbody = document.querySelector("#historyTable");
    tbody.innerHTML = ""; // Clear existing tbody content
    
    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${item.Username}</td>
      <td>${formatTime(item.createdAt)}</td>
        <td>${item.Requestedammount}</td>
        <td>${item.satuts}</td>
      `;
      tbody.appendChild(row);
    });
  }


  function openPopup() {
    // const amountContainer  = document.getElementById('gst-amount');
    // let gst = amt ? (amt*18)/100 : (historyData[0].Requestedammount*18)/1000;
    // amountContainer.innerHTML = gst;
    document.getElementById('popupOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
}

function closePopup() {
    document.getElementById('popupOverlay').style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling when popup is closed
}


  
  // Call the function with your data array to populate the table
 