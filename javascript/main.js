let pop_up = document.getElementById("popup_option");
let pop_up_button = document.getElementById("popup_button");
document.addEventListener("click", function(event) {

    // Kiểm tra xem sự kiện click có xuất phát từ popup hay không
    let isClickInsidePopup = pop_up.contains(event.target);
    let isClickButton = pop_up_button.contains(event.target);

    // Nếu không phải là click bên trong popup, đóng popup
    if (!isClickInsidePopup && !isClickButton) {
        closePopup();
    }
});
function openPopup() {
    pop_up.classList.add("open_popup");
}
function closePopup() {
    pop_up.classList.remove("open_popup");
}