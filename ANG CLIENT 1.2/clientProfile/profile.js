import { GetCookie } from '../../Cookies/cookies.js';

function Profiles(){
    const patientId = GetCookie('PatientID');
    
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
                    <img src="${imgSrc}" alt="Profile Picture">
                </div>
                <button class="change-profile-btn">CHANGE PROFILE</button>

                <div class="profile-field">
                    <div class="field-label">EMAIL:</div>
                    <input type="text" class="field-input" value="${data.Patient.Email}" readonly>
                </div>

                <div class="profile-field">
                    <div class="field-label">FACEBOOK ACCOUNT:</div>
                    <input type="text" class="field-input" value="${data.Patient.FacebookAccount}" readonly>
                </div>

                <div class="profile-field">
                    <div class="field-label">CONTACT NUMBER:</div>
                    <input type="text" class="field-input" value="${data.Patient.ContactNo}"  readonly>
                </div>
            </div>

            <div class="profile-right">
                <div class="form-row">
                    <div class="form-group">
                        <div class="field-label">FIRST NAME:</div>
                        <input type="text" class="field-input" value="${data.Patient.FirstName}" readonly>
                    </div>
                    <div class="form-group">
                        <div class="field-label">LAST NAME:</div>
                        <input type="text" class="field-input" value="${data.Patient.LastName}" readonly>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <div class="field-label">MIDDLE NAME:</div>
                        <input type="text" class="field-input" value="${data.Patient.MiddleName}" readonly>
                    </div>
                    <div class="form-group">
                        <div class="field-label">SUFFIX:</div>
                        <input type="text" class="field-input" value="${data.Patient.Suffix}" readonly>
                    </div>
                </div>

                <div class="form-row">
            <div class="form-group">
                 <div class="field-label">GENDER</div>
                 <select class="dropdown-select">
                  <option value="" disabled>Select Gender</option>
                  <option value="male" ${data.Patient.Gender.toLowerCase() === 'male' ? 'selected' : ''}>Male</option>
                  <option value="female" ${data.Patient.Gender.toLowerCase() === 'female' ? 'selected' : ''}>Female</option>
                  <option value="other" ${data.Patient.Gender.toLowerCase() === 'other' ? 'selected' : ''}>Other</option>
                 </select>
                </div>

                    <div class="form-group">
                        <div class="field-label">AGE:</div>
                        <input type="text" class="field-input" value="${data.Patient.Age}" readonly>
                    </div>
                    <div class="form-group">
                        <div class="field-label">DATE OF BIRTH</div>
                        <div class="date-input">
                            <input type="text" class="field-input" value="${data.Patient.DOB}" readonly>
                            <span class="calendar-icon">📅</span>
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <div class="field-label">STREET</div>
                        <input type="text" class="field-input" value="${data.Patient.Street}" readonly>
                    </div>
                </div>

                <div class="form-row">
                <div class="form-group">
                  <div class="field-label">BARANGAY</div>
                  <select class="dropdown-select">
                   <option value="${data.Patient.Barangay}" selected>${data.Patient.Barangay}</option>
                  </select>
                </div>
                <div class="form-group">
                 <div class="field-label">CITY</div>
                <select class="dropdown-select">
                  <option value="${data.Patient.City}" selected>${data.Patient.City}</option>
                 </select>
                </div>
               <div class="form-group">
               <div class="field-label">PROVINCE</div>
                <select class="dropdown-select">
                 <option value="${data.Patient.Province}" selected>${data.Patient.Province}</option>
                </select>
               </div>
                </div>
            </div>`;
        
            document.getElementById('profile-content').innerHTML = display; // Add to the HTML
        
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

Profiles();