// Import cookie functions
import { SetCookie, GetCookie } from '../../Cookies/cookies.js';

// Debug: Check if cookies are enabled
console.log('Cookies enabled:', navigator.cookieEnabled);

let PasswordMatch = false;
let PasswordFormat = false;
let UsernameAvai = false;


/**
 * DOM EVENT LISTENERS
 * Handle UI toggling between login and registration forms
 */
document.getElementById("show-register").addEventListener("click", () => {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("register-box").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", () => {
    document.getElementById("register-box").style.display = "none";
    document.getElementById("login-box").style.display = "block";
});

/**
 * LOGIN FORM HANDLING
 * Validates and processes login form submission
 */
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    
    if (!email || !password) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please fill in all fields.'
        });
        return;
    }
    
    Login(email, password);
});

/**
 * PROFILE PICTURE PREVIEW
 * Handles image upload and preview functionality
 */
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

/**
 * REGISTRATION FORM HANDLING
 * Validates and processes registration form submission
 */
document.getElementById("register-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    // Collect form data
    const formData = {
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        middlename: document.getElementById("middlename").value,
        sfx: document.getElementById("suffix").value,
        STR: document.getElementById("street").value,
        BRGY: document.getElementById("barangay").value,
        CTY: document.getElementById("city").value,
        PROV: document.getElementById("province").value,
        Email: document.getElementById("register-email").value,
        FB: document.getElementById("register-fb").value,
        SID: 3,
        UID: 1,
        User: document.getElementById("Username-register").value,
        Pass: document.getElementById("password-register").value,
        ConfirmPass: document.getElementById("confirm-register").value
    };
    
    // Validate passwords match
    if (PasswordMatch == false || PasswordFormat == false) {
        return;
    }
    
    // Handle profile picture upload
    let Profile = null;
    const profileInput = document.getElementById('profile-picture');
    
    try {
        if (profileInput.files.length > 0) {
            // Convert file to Base64
            Profile = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(profileInput.files[0]);
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = error => reject(error);
            });
        }
        
        // Process registration
        await IDS(
            formData.firstname, formData.lastname, formData.middlename, formData.sfx,
            formData.HN, formData.LN, formData.STR, formData.BRGY, formData.CTY, formData.PROV,
            formData.SID, formData.UID, formData.User, formData.Pass, formData.Email, formData.FB, Profile
        );

    } catch (error) {
        console.error('Registration error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.message || 'An error occurred during registration.'
        });
    }
});

/**
 * STRONG PASSWORD CHECK
 * Check if the Password matches with the rules
*/
document.getElementById('password-register').addEventListener('input', function() {

    const password = this.value;
    const Message = document.getElementById('passmessage');
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


    if(password.length < 8){
        Message.textContent = "Passwords must be at least 8 characters long";
        PasswordFormat = false;       
    } else if (!passwordRegex.test(password)) {
        Message.textContent = "Password must include at least one uppercase letter, one lowercase letter, and one number.";
        PasswordFormat = false;
    } else {
        Message.textContent = "";
        PasswordFormat = true;
    }
});

/**
 * CONFIRM PASSWORD CHECK
 * Check if the Password matches with the confirm password
*/
document.getElementById('confirm-register').addEventListener('input', function() {
    const Cpassword = this.value;
    const Opassword = document.getElementById("password-register").value;
    const Message = document.getElementById('confirmmessage');

    if(Cpassword !== Opassword){
        Message.textContent = "Password and Confirm Password dont match";
        PasswordMatch = false;
    } else {
        Message.textContent = "";
        PasswordMatch = true;
    }
});

/**
 * LOGIN FUNCTION
 * Sends login credentials to server and handles response
 * @param {string} US - Username or email
 * @param {string} PA - Password
 */
function Login(US, PA) {
    const CookieValue = crypto.randomUUID(); //This dont work as IP Address

    fetch('patient_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ USEREMAIL: US, PASS: PA,COOKIE: CookieValue})
    })
    .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
    })
    .then(data => {
        if (data.status === 'success') {
            console.log('Welcome: ', CookieValue);
            SetCookie("CookieValue", 24, CookieValue);
            SetCookie("patientID", 24, data.Acc.PatID);
            window.location.href = '../../ANG CLIENT 1.2/clientIndex/index.html';
        } else {
            throw new Error(data.message || 'Login failed');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Incorrect Password or Email'
        });
    });
}


document.getElementById('Username-register').addEventListener('input', function () {
    const Username = this.value;
    const Message = document.getElementById('Usermessage');


    fetch('patient_login.php')
        .then(response => response.json())
        .then(data => {
            let found = false;
            data.forEach(item => {
                if (Username === item.ACC) {
                    found = true;
                    UsernameAvai = false;
                    Message.textContent = "This Username is Not Available";
                }
            });

            if (!found && Username !== '') {
                UsernameAvai = true;    
                Message.textContent = "";
            }
        });
});


/**
 * ADDRESS DROPDOWN POPULATION
 * Handles dynamic population of location dropdowns
 */
function Address() {
    // Global storage for location data
    let MunDataGlobal = [];
    let BarangayDataGlobal = [];
    
    const ProvinceSelect = document.getElementById("province");
    const CitySelect = document.getElementById("city");
    const BarangaySelect = document.getElementById("barangay");
    
    // Initialize dropdowns
    const initDropdowns = () => {
        ProvinceSelect.innerHTML = '<option value="">Select a Province</option>';
        CitySelect.innerHTML = '<option value="">Select a City</option>';
        BarangaySelect.innerHTML = '<option value="">Select a Barangay</option>';
        
        CitySelect.disabled = true;
        BarangaySelect.disabled = true;
    };
    
    initDropdowns();
    
    // Fetch all JSON address data
    Promise.all([
        fetch('../../Extensions/JSON_ADDRESS/table_region.json').then(res => res.json()),
        fetch('../../Extensions/JSON_ADDRESS/table_province.json').then(res => res.json()),
        fetch('../../Extensions/JSON_ADDRESS/table_municipality.json').then(res => res.json()),
        fetch('../../Extensions/JSON_ADDRESS/table_barangay.json').then(res => res.json())
    ])
    .then(([regionData, ProvinceData, MunData, BarangayData]) => {
        // Store data globally
        MunDataGlobal = MunData;
        BarangayDataGlobal = BarangayData;
        
        // Populate provinces (region_id 5)
        ProvinceData.forEach(province => {
            if (province.province_name && province.region_id == 5) {
                const option = document.createElement("option");
                option.value = province.province_name;
                option.textContent = province.province_name;
                option.dataset.provinceId = province.province_id;
                ProvinceSelect.appendChild(option);
            }
        });
        
        // Province change handler
        ProvinceSelect.addEventListener("change", function() {
            const selectedProvinceName = this.value;
            const selectedProvinceOption = Array.from(this.options).find(option => option.value === selectedProvinceName);
            const selectedProvinceId = selectedProvinceOption ? selectedProvinceOption.dataset.provinceId : null;
            
            // Reset dependent dropdowns
            CitySelect.innerHTML = '<option value="">Select a City</option>';
            BarangaySelect.innerHTML = '<option value="">Select a Barangay</option>';
            CitySelect.disabled = !selectedProvinceId;
            BarangaySelect.disabled = true;
            
            if (selectedProvinceId) {
                // Populate cities based on selected province
                const filteredCities = MunDataGlobal.filter(city => city.province_id == selectedProvinceId);
                filteredCities.forEach(city => {
                    const option = document.createElement("option");
                    option.value = city.municipality_name;
                    option.textContent = city.municipality_name;
                    option.dataset.municipalityId = city.municipality_id;
                    CitySelect.appendChild(option);
                });
            }
        });
        
        // City change handler
        CitySelect.addEventListener("change", function() {
            const selectedCityName = this.value;
            const selectedCityOption = Array.from(this.options).find(option => option.value === selectedCityName);
            const selectedCityId = selectedCityOption ? selectedCityOption.dataset.municipalityId : null;
            
            // Reset barangay dropdown
            BarangaySelect.innerHTML = '<option value="">Select a Barangay</option>';
            BarangaySelect.disabled = !selectedCityId;
            
            if (selectedCityId) {
                // Populate barangays based on selected city
                const filteredBarangays = BarangayDataGlobal.filter(barangay => barangay.municipality_id == selectedCityId);
                filteredBarangays.forEach(barangay => {
                    const option = document.createElement("option");
                    option.value = barangay.barangay_name;
                    option.textContent = barangay.barangay_name;
                    option.dataset.barangayId = barangay.barangay_id;
                    BarangaySelect.appendChild(option);
                });
            }
        });
    })
    .catch(error => {
        console.error('Error fetching address data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Data Loading Error',
            text: 'Unable to load address information. Please refresh the page.'
        });
    });
}

/**
 * ADD NAME TO DATABASE
 * @param {string} First - First name
 * @param {string} Last - Last name
 * @param {string} Middle - Middle name (optional)
 * @param {string} Suffix - Name suffix (optional)
 * @returns {Promise} - Promise resolving to name ID
 */
function AddName(First, Last, Middle, Suffix) {
    // Validate required fields
    if (!First || !Last) {
        throw new Error("First name and last name are required");
    }
    
    return fetch('patient_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            FN: First,
            LN: Last,
            MN: Middle || "",
            SFX: Suffix || ""
        })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.name && data.name.status === 'success') {
            return data.name.nameID;
        } else {
            throw new Error(data.name?.message || 'Error adding name information');
        }
    });
}

/**
 * ADD ADDRESS TO DATABASE
 * @param {string} H - House number
 * @param {string} L - Lot number
 * @param {string} S - Street
 * @param {string} B - Barangay
 * @param {string} C - City
 * @param {string} P - Province
 * @returns {Promise} - Promise resolving to address ID
 */
function AddAddress(S, B, C, P) {
    return fetch('patient_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Str: S, 
            Brgy: B, 
            Cit: C, 
            Prov: P
        })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.Address && data.Address.status === 'success') {
            return data.Address.AddressID;
        } else {
            throw new Error(data.Address?.message || 'Error adding address information');
        }
    });
}

/**
 * ADD ACCOUNT TO DATABASE
 * @param {number} SID - Status ID
 * @param {number} UID - User type ID
 * @param {string} User - Username
 * @param {string} Pass - Password
 * @param {string} Email - Email address
 * @param {string} Profile - Base64 encoded profile picture
 * @returns {Promise} - Promise resolving to account ID
 */
function AddAccount(SID, UID, User, Pass, Email, Profile,FB) {
    return fetch('patient_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.account && data.account.status === 'success') {
            return data.account.accountID;
        } else {
            throw new Error(data.account?.message || 'Error adding account information');
        }
    });
}

/**
 * MAIN REGISTRATION PROCESS
 * Coordinates all registration steps
 * @param {...any} args - Registration form data
 */
async function IDS(firstname, lastname, middlename, sfx, HN, LN, STR, BRGY, CTY, PROV, SID, UID, User, Pass, Email, FB, Profile) {
    // Get additional patient details
    const additionalData = {
        gender: document.getElementById("gender").value,
        Contact: document.getElementById("phone").value,
        age: document.getElementById("age").value,
        DOB: document.getElementById("dob").value,
    };

    try {
        // Sequential processing of dependent operations
        const NameIDs = await AddName(firstname, lastname, middlename, sfx);
        const AddressIDs = await AddAddress(STR, BRGY, CTY, PROV);
        const AccountID = await AddAccount(SID, UID, User, Pass, Email, Profile);
        
        // Add patient record with collected IDs
        await AddPatient(
            NameIDs, AddressIDs, AccountID,
            additionalData.gender, additionalData.DOB, 
            additionalData.age, FB, additionalData.Contact
        );
        
        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Your account has been created. Please check your email to confirm your account.'
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload(); // Reload only after OK is clicked
            }
        });        

    } catch (error) {
        console.error("Registration process error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.message || 'An error occurred during registration.'
        });
    }
}

/**
 * ADD PATIENT TO DATABASE
 * Creates patient record with collected information
 * @param {number} NameIDs - Name ID
 * @param {number} AddressIDs - Address ID
 * @param {number} AccountID - Account ID
 * @param {string} gender - Gender
 * @param {string} DOB - Date of birth
 * @param {number} age - Age
 * @param {string} Facebook - Facebook profile URL
 * @param {string} Contact - Contact number
 */
function AddPatient(NameIDs, AddressIDs, AccountID, gender, DOB, age, Facebook, Contact) {
    return fetch('patient_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            NID: NameIDs,
            AddID: AddressIDs,
            ACCID: AccountID,
            Gen: gender,
            DOB: DOB,
            Age: age,
            FB: Facebook,
            CN: Contact
        })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (!data || data.error) {
            throw new Error(data?.message || 'Error creating patient record');
        }
        return data;
    });
}

// Initialize address selection functionality
Address();