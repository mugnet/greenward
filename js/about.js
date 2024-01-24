 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
 import { getDatabase, get, ref, child, set} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
 import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries


var appId = sessionStorage.getItem('appId')
if (appId === '' || appId === null ) {
    window.location.href = "redirect.php"
  }
  

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: sessionStorage.getItem('apiKey'),
  authDomain: sessionStorage.getItem('authDomain'),
  databaseURL: sessionStorage.getItem('databaseURL'),
  projectId: sessionStorage.getItem('projectId'),
  storageBucket: sessionStorage.getItem('storageBucket'),
  messagingSenderId: sessionStorage.getItem('messagingSenderId'),
  appId: sessionStorage.getItem('appId')
};

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getDatabase();
 const auth = getAuth(app);
 const dbref = ref(db);


 let emailInp = document.getElementById('emailInp');
 let passwordInp = document.getElementById('passwordInp');
 let loginForm = document.getElementById('loginForm');

 let SignInUser = evt => {
    // console.log("Form submitted");
     evt.preventDefault();

     const alertBox = document.getElementById('alertBox');

     signInWithEmailAndPassword(auth, emailInp.value, passwordInp.value)
         .then((credentials) => {
             get(child(dbref, 'users/' + credentials.user.uid))
                 .then((snapshot) => {
                     if (snapshot.exists) {
                         const user = snapshot.val();
                         sessionStorage.setItem('user-info', JSON.stringify({
                             firstname: user.firstname,
                             lastname: user.lastname,
                             phone: user.phone,
                             user_type: user.user_type,
                         }));
                         sessionStorage.setItem('user-creds', JSON.stringify(credentials.user));

                         // Check user_type and redirect accordingly
                         if (user.user_type === 0) {
                             window.location.href = 'staff.html';
                         } else {
                             window.location.href = 'admin.html';
                         }
                     } else {
                        //  console.log('User data not found in the database');
                         showAlert('User data not found in the database');
                         emailInp.value = '';
                         passwordInp.value = '';
                     }
                 })
                 .catch((error) => {
                    //  console.error('Error getting user data:', error);
                     showAlert('Authentication error: ' + error.message);
                     emailInp.value = '';
                     passwordInp.value = '';
                 });
         })
         .catch((error) => {
             if (error.code === 'auth/user-not-found') {
         showAlert('User not found. Please register.');
         emailInp.value = '';
         passwordInp.value = '';
         } else {
             showAlert('Authentication error: Email or password does not match!' );
             // showAlert('Authentication error: ' + error.message);
            //  console.log(error.code);
            //  console.log(error.message);
             passwordInp.value = '';
         }

         });
 }


 loginForm.addEventListener('submit', SignInUser);
 
 function showAlert(message) {
     const alertBox = document.getElementById('alertBox');
     alertBox.innerHTML = `
         <div class="alert alert-danger alert-dismissible fade show" role="alert">
             ${message}
             <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
         </div>
     `;
 }

  // Function to clear text fields
function clearTextFields() {
 document.getElementById('emailInp').value = '';
 document.getElementById('passwordInp').value = '';
}

// Attach the clearTextFields function to the modal's hidden.bs.modal event
document.getElementById('signInModal').addEventListener('hidden.bs.modal', function () {
 clearTextFields();
 // location.reload();
});
