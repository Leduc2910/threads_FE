function showHome() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    let html = `<div class="header">
        <div class="logo">
            <svg aria-label="Threads" class="x1ypdohk x13dflua x11xpdln xk4oym4 xus2keu"
                 fill="var(--barcelona-primary-icon)" height="32px" role="img" viewBox="0 0 192 192" width="32px"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>
            </svg>
        </div>
        <div class="my-navbar">
            <div class="fun-home">
                <button onclick="getAllThread()"><i class="fa-solid fa-house" style="color: black"></i></button>
            </div>
            <div class="fun-search">
                <button><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <div class="fun-new">
                <button onclick="openModal()" id="navCreate"><i class="fa-regular fa-pen-to-square"></i></button>
            </div>
            <div class="fun-activity">
                <button><i class="fa-regular fa-heart"></i></button>
            </div>
            <div class="fun-profile">
                <button onclick="getProfile(${currentUser.id})"><i class="fa-regular fa-user"></i></button>
            </div>
        </div>
        <div class="option">
            <div class="button_option">
                <button onclick="openPopup()" id="popup_button"><i class="fa-solid fa-bars"></i></button>
            </div>
            <div class="popup_option" id="popup_option">
                <div class="mode">
                    <button>Giao diện</button>
                </div>
                <div class="setting">
                    <button>Cài đặt</button>
                </div>
                <div class="saved">
                    <button>Đã lưu</button>
                </div>
                <div class="liked">
                    <button>Lượt thích của bạn</button>
                </div>
                <div class="report-error">
                    <button>Báo cáo sự cố</button>
                </div>
                <div class="logout">
                    <button onclick="logout()">Đăng xuất</button>
                </div>
            </div>
        </div>
    </div>
    <div class="main-content" id="main-content">
    </div>
    <div class="change-content">
        <button>Đang theo dõi <i class="fa-solid fa-repeat"></i></button>
    </div>
    <div class="modal_create" id="modal_create">
        <div class="new_thread" id="new_thread">
            <div class="create_title"><span>Thread mới</span></div>
            <div class="frame_create" id="frame_create">
                <div class="create_top">
                    <div class="create_topleft">
                        <img src="/elements/${currentUser.avatar}" alt="">
                    </div>
                    <div class="create_topright">
                        <div class="create_username"><span>${currentUser.username}</span></div>
                        <div class="create_content"><p oninput="isInputContent()" id="editableParagraph" class="editable" contentEditable="true"></p>
                        </div>
                        <div class="create_img" id="contain_create_img"></div>
                        <div class="create_fun">
                            <div class="fun_img">
                                <label for="file-upload" class="custom-file-upload">
                                <i class="fa-regular fa-images"></i></label>
                                <input type="file" multiple id="file-upload" onchange="preImage(event)">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="create_bottom">
                    <div class="create_bottomleft">
                        <span>Người theo dõi bạn có thể trả lời</span></div>
                    <div class="create_bottomright">
                        <button onclick="createThread()" id="postThread" disabled>Đăng</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
       `;
    getAllThread();
    document.getElementById("wrapper").innerHTML = html;
}


