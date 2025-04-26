import { GetCookie } from '../../Cookies/cookies.js';


function Profiles(){
    const patientId = GetCookie('patientID');
    console.log("Your Number: " +patientId)

    fetch('profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ PatientID: patientId })
    })
    .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
    })
    .then(data => {
        let display = "";

        if (data.status === 'success') {
            // Create image source using the base64 data from the API
            const imgSrc = data.Patient.Profile ? 
                          `data:image/jpeg;base64,${data.Patient.Profile}` : 
                          "../img/posa.jpg"; // Fallback to default image if no profile
                          
        
            display += `
            <div class="profile-left">
                <div class="profile-image">
                    <img src="${imgSrc}" id="profile" alt="Profile Picture">
                </div>
                <button class="change-profile-btn">CHANGE PROFILE</button>

                <div class="profile-field">
                    <div class="field-label">EMAIL:</div>
                    <input type="text" class="field-input" id="email" value="${data.Patient.Email}" readonly>
                </div>

                <div class="profile-field">
                    <div class="field-label">FACEBOOK ACCOUNT:</div>
                    <input type="text" class="field-input" id="FB" value="${data.Patient.FacebookAccount}" readonly>
                </div>

                <div class="profile-field">
                    <div class="field-label">CONTACT NUMBER:</div>
                    <input type="text" class="field-input" id="contact" value="${data.Patient.ContactNo}"  readonly>
                </div>
            </div>

            <div class="profile-right">
                <div class="form-row">
                    <div class="form-group">
                        <div class="field-label">FIRST NAME:</div>
                        <input type="text" class="field-input" id="FN" value="${data.Patient.FirstName}" readonly>
                    </div>
                    <div class="form-group">
                        <div class="field-label">LAST NAME:</div>
                        <input type="text" class="field-input" id="LN" value="${data.Patient.LastName}" readonly>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <div class="field-label">MIDDLE NAME:</div>
                        <input type="text" class="field-input" id="MN" value="${data.Patient.MiddleName}" readonly>
                    </div>
                    <div class="form-group">
                        <div class="field-label">SUFFIX:</div>
                        <input type="text" class="field-input" id="SFX" value="${data.Patient.Suffix}" readonly>
                    </div>
                </div>

                <div class="form-row">
            <div class="form-group">
                 <div class="field-label">GENDER</div>
                 <select id="gender" class="dropdown-select">
                  <option value="" disabled>Select Gender</option>
                  <option value="male" ${data.Patient.Gender.toLowerCase() === 'male' ? 'selected' : ''}>Male</option>
                  <option value="female" ${data.Patient.Gender.toLowerCase() === 'female' ? 'selected' : ''}>Female</option>
                  <option value="other" ${data.Patient.Gender.toLowerCase() === 'other' ? 'selected' : ''}>Other</option>
                 </select>
                </div>

                    <div class="form-group">
                        <div class="field-label">AGE:</div>
                        <input type="text" class="field-input" id="age" value="${data.Patient.Age}" readonly>
                    </div>
                    <div class="form-group">
                        <div class="field-label">DATE OF BIRTH</div>
                        <div class="date-input">
                            <input type="text" class="field-input" id="dob" value="${data.Patient.DOB}" readonly>
                            <span class="calendar-icon">📅</span>
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <div class="field-label" id="street">STREET</div>
                        <input type="text" class="field-input" value="${data.Patient.Street}" readonly>
                    </div>
                </div>

                <div class="form-row">
                <div class="form-group">
                  <div class="field-label" id="barangay">BARANGAY</div>
                  <select class="dropdown-select">
                   <option value="${data.Patient.Barangay}" selected>${data.Patient.Barangay}</option>
                  </select>
                </div>
                <div class="form-group">
                 <div class="field-label">CITY</div>
                <select class="dropdown-select" id="city">
                  <option value="${data.Patient.City}" selected>${data.Patient.City}</option>
                 </select>
                </div>
               <div class="form-group" id="province">
               <div class="field-label">PROVINCE</div>
                <select class="dropdown-select">
                 <option value="${data.Patient.Province}" selected>${data.Patient.Province}</option>
                </select>
               </div>
                </div>
            </div>`;
        
            document.getElementById('profile-content').innerHTML = display; // Add to the HTML


            let edit = document.querySelector('#edit');
            let save = document.querySelector('#save');
            let query = document.querySelectorAll('.field-input'); // Select elements with class field-input
            let profile = extractProfileData() ;


            edit.onclick = () => {
            edit.style.display = "none"; 
            save.style.display = "block"; 
            query.forEach(input => {
             input.removeAttribute('readonly');
            });
            }

            save.onclick = () => {
                UpdateProfile();
                edit.style.display = "block"; 
                save.style.display = "none"; 
                query.forEach(input => {
                    input.readOnly = true;
                });
                
            }
        
            console.log('Welcome:'+data.message);
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Something Went Wrong!',
            text: ''
        });
    });
}

function UpdateProfile() {
    // First extract the profile data from form
    const profileData = extractProfileData();
    const PatientID = GetCookie('patientID');
    
    // Show confirmation dialog before updating
    Swal.fire({
        icon: 'question',
        title: 'Are you sure?',
        text: 'Do you want to update your profile?',
        showCancelButton: true,
        confirmButtonText: 'Yes, Update',
        cancelButtonText: 'No, Cancel',
        reverseButtons: true
    }).then(result => {
        if (result.isConfirmed) {
            // Proceed with the update if confirmed
            fetch('profile.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Datas: profileData, ID: PatientID })
            })
            .then(res => {
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.status == "Success") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Profile Updated',
                        text: data.message
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Profile Not Updated',
                        text: data.message
                    });
                }
            })
            .catch(error => {
                console.error('Update error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Something Went Wrong!',
                    text: 'Unable to update your profile. Please try again later.'
                });
            });
        } else {
            // User canceled the action
            Swal.fire({
                icon: 'info',
                title: 'Update Canceled',
                text: 'Your profile was not updated.'
            });
        }
    });
}



function extractProfileData() {
    let profileData = {
      // Left column data
      email: document.getElementById('email').value,
      facebookAccount: document.getElementById('FB').value,
      contactNumber: document.getElementById('contact').value,
      
      // Right column data
      firstName: document.getElementById('FN').value,
      lastName: document.getElementById('LN').value,
      middleName: document.getElementById('MN').value,
      suffix: document.getElementById('SFX').value,
      gender: document.getElementById('gender').value,
      age: document.getElementById('age').value,
      dateOfBirth: document.getElementById('dob').value,
      
      // Address data
      street: document.querySelector('#street + input').value,
      barangay: document.querySelector('#barangay + select').value,
      city: document.getElementById('city').value,
      province: document.querySelector('#province select').value,
      
      // Profile image
      profileImageSrc: document.getElementById('profile').src
    };
    
    return profileData;
  }
  

Profiles();