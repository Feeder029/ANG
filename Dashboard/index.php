<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../Dashboard/login.css?v=1.0.1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
</head>
<body>
    

    <div class="container">
        <div class="form-box login">  

            <form action="">
                <h1>Login</h1>
                <div class="input-box">
                    <input type="text" placeholder="Username" id="User" required>
                    <i class="fa-solid fa-user"></i>
                </div>
                <div class="input-box">
                    <input type="password" id="password" placeholder="Password" required>
                    <i id="hidepassword" class="fa-solid fa-eye-slash"></i>
                </div>
                <div class="forgot-link">
                    <a href="#">Forgot password?</a>
                </div>
            
                <button type="submit" class="btn" id="login-btn">Login</button>
            </form>

        </div>

        <div class="form-box register">  

            <form action="">
                <h1>Register</h1>
                <div class="input-box">
                    <input type="email" id="reg-email" placeholder="Email" required>
                    <i class="fa-solid fa-envelope"></i>
                </div>
                <div class="input-box">
                    <input type="text" id="reg-username" placeholder="Username" required>
                    <i class="fa-solid fa-user"></i>
                </div>
                <div class="input-box">
                    <input type="password" id="reg-password" placeholder="Password" required>
                    <i class="fa-solid fa-lock"></i>
                </div>
                

                
               
                <button type="submit" class="btn" id="register-btn">Register</button>
            </form>
        </div>

        <div class="toggle-box">
            <div class="toggle-panel toggle-left">
                <h1>Hello!</h1>
                <p>Don't have an account?</p>
                <button class="btn register-btn">Register</button>
            </div>

            <div class="toggle-panel toggle-right">
                <h1>Welcome Back!</h1>
                <p>Already have an account?</p>
                <button class="btn login-btn">Login</button>
            </div>
        </div>
    </div>

    <script src="../Dashboard/login.js?v=1.0.1"></script>
</body>
</html>