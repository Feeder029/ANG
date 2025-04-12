//COOKIES FOR SECURITY
function SetCookie(name, hours, value){
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000); // Convert hours to milliseconds
    let expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function DeleteCookie(name){
    // Set the cookie with an expiration date in the past to delete it
    SetCookie(name, -1, ""); // -1 will expire the cookie
}

function GetCookie(name){
    const cDecoded = decodeURIComponent(document.cookie);
    const Carray = cDecoded.split("; ");
    let result = null;
    console.log(Carray);

    Carray.forEach(Element=>{
        if(Element.indexOf(name)==0){
            result = Element.substring(name.length + 1); 
        }
    })
    return result; 
}

export { GetCookie };
export { DeleteCookie };
export { SetCookie };
