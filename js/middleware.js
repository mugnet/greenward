redirect()


function route(slug) {
    return window.location.href = slug + ".html"
}

function redirect() {
    var isAuthenticated = sessionStorage.getItem('user-info');

    if (isAuthenticated) {
        var userInfo = JSON.parse(isAuthenticated);

        var destination = "index.html"; // Default destination

        if (userInfo.user_type === 0) {
           // window.location.href = "staff.html";
            destination = "staff.html";
        } else if (userInfo.user_type === 1) {
           // window.location.href = "admin.html";
            destination = "admin.html";
        }else{
            window.location.href = destination;
        }

         // Check if the current page name is not the same as the destination
         var currentPage = window.location.pathname.split('/').pop();
         if (currentPage !== destination) {
             window.location.href = destination;
         }


    } else {
        window.location.href = "index.html";
        console.error('User not authenticated');
    }
}

function logout() {
    sessionStorage.removeItem('user-info')
    // this.route('index')
    window.location.href = "index.html";

}

