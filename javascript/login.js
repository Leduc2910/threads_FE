function showLoginPage() {
    if(localStorage.getItem("currentUser") != null) {
        showHome();
    } else {
        let html = `    <div id="login">
        <img id="banner" src="elements/banner_login.png" width="1785px" height="510px"/>
        <div class="login_form">
            <span id="title_form">Đăng nhập bằng tài khoản i gờ</span>
            <input class="account_input" type="text" id="username" placeholder="Tên người dùng">
            <input class="account_input" type="password" id="password" placeholder="Mật khẩu">
            <button onclick='login()' class="login_button">Đăng nhập</button>
            <div class="horizon-rule">
                <hr>
                <span>hoặc</span>
                <hr>
            </div>
            <button class="second_button" onclick="showRegisterPage()">Tạo tài khoản mới</button>
        </div>
        <div id="footer">
            <span class="year">Ⓒ 2024</span>
            <a href="#" class="terms">Điều khoản của Threads</a>
            <a href="#" class="privacy">Chính sách quyền riêng tư</a>
            <a href="#" class="cookie">Chính sách cookie</a>
            <a href="#" class="report">Báo cáo sự cố</a>
        </div>
    </div>`
        document.getElementById("wrapper").innerHTML = html;
    }
}
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let user = {
        username : username,
        password : password
    }
    axios.post(`http://localhost:8080/users/login`, user).then(function (response) {
        let currentUser = response.data;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        showHome()
    }).catch(function (error) {
        console.log(error.response.data)
    })
}
function logout() {
    localStorage.clear();
    showLoginPage();
}
function showRegisterPage() {
    let html = `  <div id="login">
        <img id="banner" src="elements/banner_login.png" width="1785px" height="510px"/>
        <div class="login_form">
            <span id="title_form">Đăng ký tài khoản mới</span>
            <input class="account_input" type="text" id="username" placeholder="Tên người dùng">
            <input class="account_input" type="password" id="password" placeholder="Mật khẩu">
            <input class="account_input" type="text" id="name" placeholder="Tên hiển thị">
            <input class="account_input" type="text" id="birthday" placeholder="dd/MM/yyyy">
            <button onclick='register()' class="login_button">Đăng ký</button>
            <div class="horizon-rule">
                <hr>
                <span>hoặc</span>
                <hr>
            </div>
            <button class="second_button" onclick="showLoginPage()">Đã có tài khoản</button>
        </div>
        <div id="footer">
            <span class="year">Ⓒ 2024</span>
            <a href="#" class="terms">Điều khoản của Threads</a>
            <a href="#" class="privacy">Chính sách quyền riêng tư</a>
            <a href="#" class="cookie">Chính sách cookie</a>
            <a href="#" class="report">Báo cáo sự cố</a>
        </div>
    </div>`;
    document.getElementById("wrapper").innerHTML = html;
}
function register() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let name = document.getElementById("name").value;
    let birthday = document.getElementById("birthday").value;
    let user  = {
        username : username,
        password : password,
        name : name,
        birthday : birthday
    }
    axios.post('http://localhost:8080/users/register', user).then(function (response) {
        showLoginPage();
    }).catch(function (error) {
        console.log(error)
    });
}

showLoginPage();
