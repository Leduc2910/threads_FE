function showHome() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    let html =`<h1>${currentUser.username}</h1><button onclick="logout()">logout</button>`;
    document.getElementById("wrapper").innerHTML = html;
}