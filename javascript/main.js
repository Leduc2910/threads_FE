let pop_up = document.getElementById("popup_option");
let pop_up_button = document.getElementById("popup_button");
document.addEventListener("click", function (event) {

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

const modalElement = document.getElementById("modal_create");
const newThreadElement = document.getElementById("new_thread");
const navCreate = document.getElementById("navCreate");
document.addEventListener("click", function (event) {
    let isClickInsideModal = newThreadElement.contains(event.target);
    let isClickInNavCreate = navCreate.contains(event.target);
    if (!isClickInsideModal && !isClickInNavCreate) {
        closeModal();
    }
});

function openModal() {
    modalElement.classList.add("open_modal_create")
    document.body.classList.add("turn-off-scroll");
}

function closeModal() {
    document.getElementById('editableParagraph').innerHTML = '';
    if (document.getElementById('create_img') != null) {
        document.getElementById('create_img').remove();
    }
    modalElement.classList.remove("open_modal_create")
    document.body.classList.remove("turn-off-scroll");
    document.getElementById('postThread').style.backgroundColor= '#b2b2b2';
    document.getElementById('postThread').disabled= true;
}

function getTimeDiff(createTime) {
    let currentTime = new Date().getTime();
    let postTime = new Date(createTime).getTime();
    let diffTimeInSeconds = Math.floor((currentTime - postTime) / 1000);

    if (diffTimeInSeconds >= 86400) {
        return Math.floor(diffTimeInSeconds / 86400) + ' ngày';
    } else if (diffTimeInSeconds >= 3600) {
        return Math.floor(diffTimeInSeconds / 3600) + ' giờ';
    } else if (diffTimeInSeconds >= 60) {
        return Math.floor(diffTimeInSeconds / 60) + ' phút';
    } else {
        return diffTimeInSeconds + ' giây';
    }
}

// document.addEventListener("click", function (event) {
//
//     // Kiểm tra xem sự kiện click có xuất phát từ popup hay không
//     let isClickInsideModal = modal_create.contains(event.target);
//
//     // Nếu không phải là click bên trong popup, đóng popup
//     if (!isClickInsidePopup) {
//         modal_create.classList.remove("modal_create_open");
//     }
// });