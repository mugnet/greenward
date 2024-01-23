redirect()

function route(slug) {
    return window.location.href = slug + ".html"
}

function redirect() {
    var isAuthenticated = sessionStorage.getItem('user-info')

    if (isAuthenticated === null || isAuthenticated === '') {
        this.route('index')
    }

    if (isAuthenticated.user_type === 0) {
        this.route('staff')

    } else {
        this.route('admin')
    }

}

function logout() {
    sessionStorage.removeItem('user-info')
    this.route('index')
}