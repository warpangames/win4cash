const fromcontainer = document.querySelector('.bankdetails-container');
function handleDisplayForm(){
    fromcontainer.style.display = 'block';
}

async function withHistory(){
    const res = await axios.get('https://win4cash.in/user/withdraw/history');
    console.log(res,'history');
    populateTable(res.data);
}

withHistory();

let wallet ;
let bankStatus ;

async function getAllData(){
    const res = await axios.get('https://win4cash.in/Alldata');
    console.log(res,'allData')
    if(res.status===200){
        const walletContainer  = document.querySelector('.balance-data');
        walletContainer.innerHTML = res.data.wallet;
        wallet = res.data.wallet;
        bankStatus = res.data.bankdetail;
    }
}

getAllData();

async function handleWithdraw(){
    const widthd = document.getElementById('widthdraw');
    amt = widthd.value;
    if(wallet<amt){
        alert('Amount must be less than wallet');
        return;
    }

    if(amt<10){
        alert('Amount must be greater than 10 rupees');
        return;
    }

    if(!bankStatus){
        alert('please add bank details');
        return;
    }

    const res = await axios.post('https://win4cash.in/user/withdraw/ammount',{reqammount:amt});
    if(res.status==200){
        widthd.value = '';
        getAllData();
        withHistory();
    }


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
  
  const originalTime = "2024-05-30T18:57:23.984Z";
  const formattedTime = formatTime(originalTime);
  console.log(formattedTime); // Output: 30 May 2024, 6:57 PM
  

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
  
  // Call the function with your data array to populate the table
 