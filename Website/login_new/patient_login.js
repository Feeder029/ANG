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

// Register Form Validation
document.getElementById("register-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const gender = document.getElementById("gender").value;
    const email = document.getElementById("register-email").value;
    const phone = document.getElementById("phone").value;

    if (!firstname || !lastname || !gender || !email || !phone) {
        alert("Please fill in all required fields.");
    } else {
        alert("Registration Successful!");
    }
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


function Address() {
    let MunDataGlobal = []; // To store municipality data for later use
    let BarangayDataGlobal = []; // To store barangay data for later use

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
                option.value = province.province_id; // Use province_id for filtering
                option.textContent = province.province_name;
                ProvinceSelect.appendChild(option);
            }
        });

        // Event: When Province changes, populate cities
        ProvinceSelect.addEventListener("change", function () {
            const selectedProvinceId = this.value;
            CitySelect.innerHTML = '<option value="">Select a City</option>';
            BarangaySelect.innerHTML = '<option value="">Select a Barangay</option>';
            CitySelect.disabled = true;
            BarangaySelect.disabled = true;

            if (selectedProvinceId) {
                const filteredCities = MunDataGlobal.filter(city => city.province_id == selectedProvinceId);
                filteredCities.forEach(city => {
                    const option = document.createElement("option");
                    option.value = city.municipality_id; // Use ID for next filtering step
                    option.textContent = city.municipality_name;
                    CitySelect.appendChild(option);
                });

                CitySelect.disabled = false;
            }
        });

        // Event: When City changes, populate barangays
        CitySelect.addEventListener("change", function(){
            const selectedCityID = this.value;
            BarangaySelect.innerHTML = '<option value="">Select a Barangay</option>';
            BarangaySelect.disabled = true;

            if (selectedCityID) {
                const filteredBarangays = BarangayDataGlobal.filter(barangay => barangay.municipality_id == selectedCityID);
                filteredBarangays.forEach(barangay => {
                    const option = document.createElement("option");
                    option.value = barangay.barangay_id; // Use barangay_id as the value
                    option.textContent = barangay.barangay_name;
                    BarangaySelect.appendChild(option);
                });

                BarangaySelect.disabled = false;
            }
        });
    })
    .catch(error => console.error('Error fetching address data:', error));
}



Address();
