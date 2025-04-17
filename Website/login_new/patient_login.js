import { SetCookie } from '../../Cookies/cookies.js';
import { GetCookie } from '../../Cookies/cookies.js';

console.log(navigator.cookieEnabled);


document.getElementById("show-register").addEventListener("click", function() {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("register-box").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", function() {
    document.getElementById("register-box").style.display = "none";
    document.getElementById("login-box").style.display = "block";
});

// Login Form Validation
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    if (email === "" || password === "") {
        alert("Please fill in all fields.");
    } else {
        Login(email,password);
    }
});

document.getElementById('profile-picture').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImage = document.getElementById('preview-image');
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// Register Form Validation
document.getElementById("register-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const middlename = document.getElementById("middlename").value;
    const sfx = document.getElementById("suffix").value;
    const HN = document.getElementById("house").value;
    const LN = document.getElementById("lot").value;
    const STR = document.getElementById("street").value;
    const BRGY = document.getElementById("barangay").value;
    const CTY = document.getElementById("city").value;
    const PROV = document.getElementById("province").value;
    const Email = document.getElementById("register-email").value;
    const SID = 5;
    const UID = 1;
    const User = document.getElementById("Username-register").value;
    const Pass = document.getElementById("password-register").value;
    const profileInput = document.getElementById('profile-picture');
    let Profile = null;

if (profileInput.files.length > 0) {
    // Use FileReader to convert the file to Base64
    const reader = new FileReader();
    reader.readAsDataURL(profileInput.files[0]);
    
    // You need to wait for the FileReader to finish reading
    Profile = await new Promise((resolve) => {
        reader.onload = () => {
            // Get only the Base64 data part (remove the data:image/xxx;base64, prefix)
            const base64Data = reader.result.split(',')[1];
            
            resolve(base64Data);
        };
    });
}


    IDS(firstname, lastname, middlename, sfx, HN, LN, STR, BRGY, CTY, PROV,SID,UID,User,Pass,Email,Profile);

});



function Login(US,PA){
    fetch('patient_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            USEREMAIL: US,
            PASS: PA
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Welcome:', data.Acc.Username);
            window.location.href = '../../ANG CLIENT 1.2/clientIndex/index.html';  // This will navigate to a new URL
            SetCookie("ACCID",6,data.Acc.AccID);
            console.log(GetCookie("ACCID"));
        } else {
            console.error('Login failed:', data.message);
            alert("Incorrect Password or Email");
        }
    });
}

// For Address Dropdown Values
function Address() {
    let MunDataGlobal = []; // To store municipality data for later use
    let BarangayDataGlobal = []; // To store barangay data for later use

    //Fetch all of the JSON values
    Promise.all([
        fetch('../../Extensions/JSON_ADDRESS/table_region.json').then(res => res.json()),
        fetch('../../Extensions/JSON_ADDRESS/table_province.json').then(res => res.json()),
        fetch('../../Extensions/JSON_ADDRESS/table_municipality.json').then(res => res.json()),
        fetch('../../Extensions/JSON_ADDRESS/table_barangay.json').then(res => res.json())
    ])
    .then(([regionData, ProvinceData, MunData, BarangayData]) => {
        const ProvinceSelect = document.getElementById("province"); 
        const CitySelect = document.getElementById("city"); 
        const BarangaySelect = document.getElementById("barangay"); 

        // Save municipality and barangay data globally for later use
        MunDataGlobal = MunData;
        BarangayDataGlobal = BarangayData;

        ProvinceSelect.innerHTML = '<option value="">Select a Province</option>';
        CitySelect.innerHTML = '<option value="">Select a City</option>';
        BarangaySelect.innerHTML = '<option value="">Select a Barangay</option>';

        CitySelect.disabled = true;
        BarangaySelect.disabled = true;

        // Populate provinces
        ProvinceData.forEach(province => {
            if (province.province_name && province.region_id == 5) {
                const option = document.createElement("option");
                option.value = province.province_name; // Use province_name as value
                option.textContent = province.province_name;
                option.dataset.provinceId = province.province_id; // Store ID as data attribute
                ProvinceSelect.appendChild(option);
            }
        });

        // Event: When Province changes, populate cities
        ProvinceSelect.addEventListener("change", function () {
            const selectedProvinceName = this.value;
            const selectedProvinceOption = Array.from(this.options).find(option => option.value === selectedProvinceName);
            const selectedProvinceId = selectedProvinceOption ? selectedProvinceOption.dataset.provinceId : null;
            
            CitySelect.innerHTML = '<option value="">Select a City</option>';
            BarangaySelect.innerHTML = '<option value="">Select a Barangay</option>';
            CitySelect.disabled = true;
            BarangaySelect.disabled = true;

            if (selectedProvinceId) {
                const filteredCities = MunDataGlobal.filter(city => city.province_id == selectedProvinceId);
                filteredCities.forEach(city => {
                    const option = document.createElement("option");
                    option.value = city.municipality_name; // Use municipality_name as value
                    option.textContent = city.municipality_name;
                    option.dataset.municipalityId = city.municipality_id; // Store ID as data attribute
                    CitySelect.appendChild(option);
                });

                CitySelect.disabled = false;
            }
        });

        // Event: When City changes, populate barangays
        CitySelect.addEventListener("change", function(){
            const selectedCityName = this.value;
            const selectedCityOption = Array.from(this.options).find(option => option.value === selectedCityName);
            const selectedCityId = selectedCityOption ? selectedCityOption.dataset.municipalityId : null;
            
            BarangaySelect.innerHTML = '<option value="">Select a Barangay</option>';
            BarangaySelect.disabled = true;

            if (selectedCityId) {
                const filteredBarangays = BarangayDataGlobal.filter(barangay => barangay.municipality_id == selectedCityId);
                filteredBarangays.forEach(barangay => {
                    const option = document.createElement("option");
                    option.value = barangay.barangay_name; // Use barangay_name as value
                    option.textContent = barangay.barangay_name;
                    option.dataset.barangayId = barangay.barangay_id; // Store ID as data attribute
                    BarangaySelect.appendChild(option);
                });

                BarangaySelect.disabled = false;
            }
        });
    })
    .catch(error => console.error('Error fetching address data:', error));
}

//Add the Name to the Database
function AddName(First, Last, Middle, Suffix) {
    // Ensure all values exist and are not empty
    if (!First || !Last) {
        alert("Error: First name and last name are required");
        return;
    }
    
    // Use empty string for optional fields if they're undefined
    const middleName = Middle || "";
    const suffix = Suffix || "";
    
    return fetch('patient_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            FN: First,
            LN: Last,
            MN: middleName,
            SFX: suffix
        })
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Full response data:", data);
        
        if (data.name && data.name.status === 'success') {
            return data.name.nameID;
        } else {
            const errorMsg = data.name ? data.name.message : 
                             (data.message || 'An error occurred while adding name information.');
            alert('Error: ' + errorMsg);
            throw new Error(errorMsg);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Error: An error occurred while processing your request.');
        throw error;
    });
}

//Add the Address to the Database
function AddAddress(H,L,S,B,C,P){
    return fetch('patient_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            HNo : H, 
            LNo : L, 
            Str : S, 
            Brgy : B, 
            Cit : C, 
            Prov : P
        })
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Full response data:", data);
        
        if (data.Address && data.Address.status === 'success') {
            return data.Address.AddressID;
        } else {
            const errorMsg = data.Address ? data.Address.message : 
                             (data.message || 'An error occurred while adding Address information.');
            alert('Error: ' + errorMsg);
            throw new Error(errorMsg);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Error: An error occurred while processing your request.');
    });
}

//Add the Account to the Database
function AddAccount(SID, UID, User, Pass, Email, Profile) {
    return fetch('patient_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            SID: SID,
            UID: UID,
            User: User,
            Pass: Pass,
            Email: Email,
            Profile: Profile
        })
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Full response data:", data);    
        if (data.account && data.account.status === 'success') {
            return data.account.accountID; // Match the field name from PHP
        } else {
            const errorMsg = data.account ? data.account.message : 
                             (data.message || 'An error occurred while adding Account information.');
            alert('Error: ' + errorMsg); // Fixed typo: 'Errorr' → 'Error'
            throw new Error(errorMsg);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Error: An error occurred while processing your request.');
    });
}
//Get the ID Values
async function IDS(firstname, lastname, middlename, sfx, HN, LN, STR, BRGY, CTY, PROV, SID,UID,User,Pass,Email,Profile) {

    const gender = document.getElementById("gender").value;
    const Contact = document.getElementById("phone").value;
    const age = document.getElementById("age").value;
    const DOB = document.getElementById("dob").value;
    const Facebook = " ";

    try {
        const NameIDs = await AddName(firstname, lastname, middlename, sfx);

        const AddressIDs = await AddAddress(HN, LN, STR, BRGY, CTY, PROV);

        const AccountID = await AddAccount(SID,UID,User,Pass,Email,Profile);

        AddPatient(NameIDs,AddressIDs,AccountID,gender,DOB,age,Facebook,Contact);

    } catch (error) {
        console.error("Error during IDS function:", error);
    }
}

function AddPatient(NameIDs,AddressIDs,AccountID,gender,DOB,age,Facebook,Contact){
    fetch('patient_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            NID : NameIDs, 
            AddID : AddressIDs, 
            ACCID : AccountID, 
            Gen : gender, 
            DOB : DOB, 
            Age : age,
            FB : Facebook,
            CN : Contact
        })
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Full response data:", data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Error: An error occurred while processing your request.');
    });
}

Address();
