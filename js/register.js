  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getDatabase, set, ref, get, child, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
  import { getAuth, createUserWithEmailAndPassword, deleteUser, signOut, reauthenticateWithCredential, EmailAuthProvider, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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
  const db = getDatabase(app);
  const auth = getAuth(app);

  // const admin = require('firebase-admin');

  // Initialize the Firebase Admin SDK
  // admin.initializeApp();

  let fname = document.getElementById('firstName');
  let lname = document.getElementById('lastName');
  let emailInp = document.getElementById('emailInp');
  let phone = document.getElementById('phone');
  let passwordInp = document.getElementById('passwordInp');
  let MainForm = document.getElementById('MainForm');
  let editUserForm = document.getElementById('editUserForm');
  let editUserbtn = document.getElementById('editUser');
  let editProfileForm = document.getElementById('editProfileForm');

  let phoneEditUser = document.getElementById('editphone');
  let phoneEditProfile = document.getElementById('editphoneProfile');

  let RegisterUser = evt=>{
      evt.preventDefault();

      // Check if password and confirm password match
      if (passwordInp.value !== cpassword.value) {
          alert("Passwords do not match");
          return;
      }

      // Check if the phone number is more than 11 numeric digits
      if (!/^\d{11}$/.test(phone.value)) {
          alert("Phone number should consist of 11 numeric digits");
          return;
      }

      createUserWithEmailAndPassword(auth, emailInp.value, passwordInp.value)
      .then((credentials)=>{

          set(ref(db, 'users/' + credentials.user.uid), {
              firstname: fname.value.toUpperCase(),
              lastname: lname.value.toUpperCase(),
              email: emailInp.value,
              phone: phone.value,
              user_type: 0,
              // last_login: Date.now()
              last_login: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
              
          })
          .then(()=>{


               // Save phone number in the 'contactNumber' backup node
               set(ref(db, 'contactNumber/' + credentials.user.uid), {
                  phone: phone.value
              })
                  .then(() => {
                      // Alert user created successfully
                      alert('User created successfully!');
                      let addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));
                      addUserModal.hide();

                      location.reload();
                  })
                  .catch((error) => {
                      alert(error.message);
                     // console.log(error.code);
                     // console.log(error.message);
                  });

          // // Alert user created successfully
          // alert('User created successfully!');
          // let addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));
          // addUserModal.hide();

          // location.reload();
          })
          .catch((error)=>{
          alert(error.message);
         // console.log(error.code);
         // console.log(error.message);
      })


      })
      .catch((error)=>{
          alert(error.message);
         // console.log(error.code);
         // console.log(error.message);
      })
  }

  MainForm.addEventListener('submit', RegisterUser);
 


  // userTable script
  let userUid, fName, lName, Email, Phone;

  function editUser(uid, fname, lname, email, phone) {
  // Add your logic for editing the user with the given UID
  //alert('Edit button clicked for user with UID: ' + uid);
  
   // Populate data in the modal form
  //   let userUid =  document.getElementById('uidUser').value = uid;
  //   let fName =  document.getElementById('editfirstName').value = fname;
  //   let lName =  document.getElementById('editlastName').value = lname;
  //   let Email =  document.getElementById('editemailInp').value = email;
  //   let Phone =  document.getElementById('editphone').value = phone;
      
      userUid = document.getElementById('uidUser').value = uid;
      fName = document.getElementById('editfirstName').value = fname;
      lName = document.getElementById('editlastName').value = lname;
      Email = document.getElementById('editemailInp').value = email;
      Phone = document.getElementById('editphone').value = phone;
      
      let editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
      editUserModal.show();
}

function deleteuser(uid) {
  // Add your logic for deleting the user with the given UID
  // alert('Delete button clicked for user with UID: ' + uid);
  // // userUid = uid;
  // DeleteUser(uid);
  if (confirm("Are you sure you want to delete this user?")) {
  // alert('Delete button clicked for user with UID: ' + uid);
  DeleteUser(uid);
}

}

  var userNo = 0;
              var tbody = document.getElementById('tbody1');

              function AddItemToTable(uid, fname, lname, email, phone, last_login){
                  let trow = document.createElement('tr');
                  let td1 = document.createElement('td'); 
                  let td2 = document.createElement('td'); 
                  let td3 = document.createElement('td'); 
                  let td4 = document.createElement('td'); 
                  let td5 = document.createElement('td'); 
                  let td6 = document.createElement('td'); 
                  let td7 = document.createElement('td'); 

                  td1.innerHTML=++ userNo;
                  td2.innerHTML = fname;
                  td3.innerHTML = lname;
                  td4.innerHTML = email;
                  td5.innerHTML = phone;
                  td6.innerHTML = last_login;

                  // Create Edit button
                  // let editButton = document.createElement('button');
                  // editButton.className = 'btn btn-warning btn-sm mx-2';
                  // editButton.innerHTML = 'Edit';
                  // editButton.addEventListener('click', function (id) {
                  //     //Add logic for Edit button click
                  //     alert('Edit button clicked for user with ID: ' + id);
                  // });

                  // Create Delete button
                  // let deleteButton = document.createElement('button');
                  // deleteButton.className = 'btn btn-danger btn-sm ';
                  // deleteButton.innerHTML = 'Delete';
                  // deleteButton.addEventListener('click', function (id) {
                  //     // Add logic for Delete button click
                  //     alert('Delete button clicked for user with ID: ' + id);
                  // });
                  
                   // Create Edit button
                  let editButton = document.createElement('button');
                  editButton.className = 'btn btn-warning btn-sm mx-2';
                  editButton.innerHTML = 'Edit';
                  editButton.addEventListener('click', function () {
                      //editUser(uid); // Pass the UID when the Edit button is clicked
                      // let uid = this.dataset.uid;
                      // openEditUserModal(uid);
                      let uid = this.dataset.uid;
                      let fname = this.dataset.fname;
                      let lname = this.dataset.lname;
                      let email = this.dataset.email;
                      let phone = this.dataset.phone;

                      editUser(uid, fname, lname, email, phone);
                  });

                      editButton.dataset.uid = uid;
                      editButton.dataset.fname = fname;
                      editButton.dataset.lname = lname;
                      editButton.dataset.email = email;
                      editButton.dataset.phone = phone;

                  // Create Delete button
                  let deleteButton = document.createElement('button');
                  deleteButton.className = 'btn btn-danger btn-sm ';
                  deleteButton.innerHTML = 'Delete';
                  deleteButton.addEventListener('click', function () {
                      deleteuser(uid); // Pass the UID when the Delete button is clicked
                      // DeleteUser();
                  });

                  // Append buttons to action td
                  td7.appendChild(editButton);
                  td7.appendChild(deleteButton);
                  
                  trow.appendChild(td1);
                  trow.appendChild(td2);
                  trow.appendChild(td3);
                  trow.appendChild(td4);
                  trow.appendChild(td5);
                  trow.appendChild(td6);
                  trow.appendChild(td7); 

                  tbody.appendChild(trow);
              }

              function AddAllItemsToTable(TheUser){
                  userNo=0;
                  tbody.innerHTML="";

                  // Sort the users based on the most recent login
                  TheUser.sort((a, b) => new Date(b.last_login) - new Date(a.last_login));

                  TheUser.forEach(element => {
                      AddItemToTable(element.uid, element.firstname, element.lastname, element.email, element.phone, element.last_login);
                      
                  });
              }



              function GetAllDataOnce(){
                  const dbref = ref(db);

                  get(child(dbref, "users"))
                  .then((snapshot)=>{
                      var users = [];

                      // snapshot.forEach(childSnapshot=>{
                      //     users.push(childSnapshot.val());
                      // });

                      snapshot.forEach(childSnapshot => {
                      const user = childSnapshot.val();
                      user.uid = childSnapshot.key; // Add UID to the user object
                      users.push(user);
                  });

                      AddAllItemsToTable(users);
                  })
                  .catch((error) => {
                  console.error("Error getting data: ", error);
                  });
              }

              function GetAllDataRealTime(){
                  const dbref = ref(db,'users');

                  onValue(dbref,(snapshot)=>{
                      var users = [];

                  // snapshot.forEach(childSnapshot=>{
                  //     users.push(childSnapshot.val());
                  // });

                  snapshot.forEach(childSnapshot => {
                  const user = childSnapshot.val();
                  user.uid = childSnapshot.key; // Add UID to the user object
                  users.push(user);
                  });

                  AddAllItemsToTable(users);

                  })
              }




      //         //alert even in this page start

      //         const fireAlertAudio = document.getElementById('fireAlertAudio');
      

      // window.displayFirebaseDataSound = function() {
      //     // Function to read data from Firebase and display it in the h3 tag
      //     // function displayFirebaseDataSound() {
      //         const soundAlertModal = new bootstrap.Modal(document.getElementById('soundAlert'));
      //         // const h3Element = document.getElementById('soundData');
      //         // const soundAlertCard = document.getElementById('soundalertCard');
      //         // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();

      //         // console.log('Selected Node sound:', selectedNodeVal);

      //         // const soundPath = `Nodes/${selectedNodeVal}/SoundSensor`;
      //         // console.log('Firebase Path sound:', soundPath);
      //     // Assuming 'your_data_path' is the path to the data in your Firebase
      //     // const Sound = ref(db, 'Nodes/Node1/SoundSensor');
      //     const Sound = ref(db, "Nodes/Node1/SoundSensor");
          
          
      //     onValue(Sound, (snapshot) => {
      //     const data = snapshot.val();
      //     if (data !== null) {
              
      //         // h3Element.innerText = data + " " + "dB"; // Update the content of the h3 tag

      //         if(data < 64){
      //             // soundAlertModal.show();
      //             // soundAlertCard.style.backgroundColor = '';
      //             soundAlertModal.hide();
      //             fireAlertAudio.pause();
      //             fireAlertAudio.currentTime = 0;

      //             // document.body.style.backgroundColor = 'yellow';
      //         }else if( data >= 64 && data <= 85 ){
      //             soundAlertModal.show();
      //             // document.body.style.backgroundColor = 'yellow';
      //             // soundAlertCard.style.backgroundColor = 'orange';

      //              // Check if the audio is paused or has ended
      //              if (fireAlertAudio.paused || fireAlertAudio.ended) {
      //                 // Play the audio and set up the loop
      //                 fireAlertAudio.play();
      //                 fireAlertAudio.addEventListener('ended', function () {
      //                     this.currentTime = 0;
      //                     this.play();
      //                 });
      //             }

      //         }else if(data > 85){
      //             soundAlertModal.show();
      //             // soundAlertModal.hide();
      //             // document.body.style.backgroundColor = '';
      //             // soundAlertCard.style.backgroundColor = 'red';

      //              // Check if the audio is paused or has ended
      //              if (fireAlertAudio.paused || fireAlertAudio.ended) {
      //                 // Play the audio and set up the loop
      //                 fireAlertAudio.play();
      //                 fireAlertAudio.addEventListener('ended', function () {
      //                     this.currentTime = 0;
      //                     this.play();
      //                 });
      //             }

      //         }
              
      //     } else {
      //         // h3Element.innerText = 'No data available';
      //         // document.body.style.backgroundColor = '';
      //     }
      //     }, (error) => {
      //         console.error('Error getting data from Firebase:', error);
      //     });

      //     }

          

      //     // function displayFirebaseDataFlame() {
      //     window.displayFirebaseDataFlame = function() {
              
      //         const fireAlertModal = new bootstrap.Modal(document.getElementById('fireAlert'));
      //         // const h3Element = document.getElementById('flameData');
      //         // const fireAlertCard = document.getElementById('firealertCard');
      //         // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();

      //         // console.log('Selected Node fire:', selectedNodeVal);

      //         // const firePath = `Nodes/${selectedNodeVal}/FlameSensor`;
              
      //         // console.log('Firebase Path sound:', firePath);

      //     // Assuming 'your_data_path' is the path to the data in your Firebase
      //     const Flame = ref(db, "Nodes/Node1/FlameSensor");
           
      //     onValue(Flame, (snapshot) => {
      //     const data = snapshot.val();
      //     if (data !== null) {
      //         if (data === 0) {
      //         // h3Element.innerText = 'No fire detected';
      //         // // document.body.style.backgroundColor = '';
      //         // fireAlertCard.style.backgroundColor = '';
      //         fireAlertModal.hide();
      //         fireAlertAudio.pause();
      //         fireAlertAudio.currentTime = 0;

      //         } else if (data === 1) {
      //             // h3Element.innerText = 'Fire detected! Take immediate action.';
      //             // You can also trigger additional actions/alerts here
      //             fireAlertModal.show();
                  
      //             // Check if the audio is paused or has ended
      //             if (fireAlertAudio.paused || fireAlertAudio.ended) {
      //                 // Play the audio and set up the loop
      //                 fireAlertAudio.play();
      //                 fireAlertAudio.addEventListener('ended', function () {
      //                     this.currentTime = 0;
      //                     this.play();
      //                 });
      //             }
      //             // fireAlertCard.style.backgroundColor = 'red';
      //             // document.body.style.backgroundColor = 'red';
      //         } else {
      //             // h3Element.innerText = 'Invalid data received';
      //             // fireAlertCard.style.backgroundColor = '';
      //         }

      //     } else {
      //         // h3Element.innerText = 'No data available';
      //         // fireAlertCard.style.backgroundColor = '';
      //     }
      //     }, (error) => {
      //         console.error('Error getting data from Firebase:', error);
      //     });

      //     }


      //     window.displayFirebaseDataSmoke = function() {
      //     // function displayFirebaseDataSmoke() {
      //         // const h3Element = document.getElementById('smokeData');
      //         // const smokeAlertCard = document.getElementById('smokealertCard');
      //         // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();
      //         // const smokePath = `Nodes/${selectedNodeVal}/SmokeSensor`;

      //         // console.log('Selected Node smoke:', selectedNodeVal);
      //         // console.log('Firebase Path sound:', smokePath);
      //         const smokeAlertModal = new bootstrap.Modal(document.getElementById('smokeAlert'));
      //     // Assuming 'your_data_path' is the path to the data in your Firebase
      //     const Smoke = ref(db, "Nodes/Node1/SmokeSensor");

      //     onValue(Smoke, (snapshot) => {
      //     const data = snapshot.val();
      //     if (data !== null) {
      //         // h3Element.innerText = data + " " + "%"; // Update the content of the h3 tag
      //         if(data < 39){
      //             // smokeAlertCard.style.backgroundColor = '';
      //             smokeAlertModal.hide();
      //             fireAlertAudio.pause();
      //             fireAlertAudio.currentTime = 0;

      //         }else if(data >= 39 && data < 50){
      //             // smokeAlertCard.style.backgroundColor = 'orange';
      //             smokeAlertModal.show();
      //             // Check if the audio is paused or has ended
      //             if (fireAlertAudio.paused || fireAlertAudio.ended) {
      //                 // Play the audio and set up the loop
      //                 fireAlertAudio.play();
      //                 fireAlertAudio.addEventListener('ended', function () {
      //                     this.currentTime = 0;
      //                     this.play();
      //                 });
      //             }

      //         }else if(data >= 50){
      //             // smokeAlertCard.style.backgroundColor = 'red';
      //             smokeAlertModal.show();
      //             // Check if the audio is paused or has ended
      //             if (fireAlertAudio.paused || fireAlertAudio.ended) {
      //                 // Play the audio and set up the loop
      //                 fireAlertAudio.play();
      //                 fireAlertAudio.addEventListener('ended', function () {
      //                     this.currentTime = 0;
      //                     this.play();
      //                 });
      //             }

      //         }


      //     } else {
      //         // h3Element.innerText = 'No data available';
      //     }
      //     }, (error) => {
      //         console.error('Error getting data from Firebase:', error);
      //     });

      //     }
      //     //alert even in this page end


             //alert even in this page start
      const fireAlertAudio = document.getElementById('fireAlertAudio');
      

      window.displayFirebaseDataSound = function() {
          // Function to read data from Firebase and display it in the h3 tag
          // function displayFirebaseDataSound() {
              const soundAlertModal = new bootstrap.Modal(document.getElementById('soundAlert'));
              // const h3Element = document.getElementById('soundData');
              // const soundAlertCard = document.getElementById('soundalertCard');
              // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();

              // console.log('Selected Node sound:', selectedNodeVal);

              // const soundPath = `Nodes/${selectedNodeVal}/SoundSensor`;
              // console.log('Firebase Path sound:', soundPath);
          // Assuming 'your_data_path' is the path to the data in your Firebase
          // const Sound = ref(db, 'Nodes/Node1/SoundSensor');
          const Sound = ref(db, "Nodes/Node1/SoundSensor");
          
          
          onValue(Sound, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
              
              // h3Element.innerText = data + " " + "dB"; // Update the content of the h3 tag

              if(data < 64){
                  // soundAlertModal.show();
                  // soundAlertCard.style.backgroundColor = '';
                  soundAlertModal.hide();
                  fireAlertAudio.pause();
                  fireAlertAudio.currentTime = 0;

                  // document.body.style.backgroundColor = 'yellow';
              }else if( data >= 64 && data <= 85 ){
                  soundAlertModal.show();
                  // document.body.style.backgroundColor = 'yellow';
                  // soundAlertCard.style.backgroundColor = 'orange';

                   // Check if the audio is paused or has ended
                   if (fireAlertAudio.paused || fireAlertAudio.ended) {
                      // Play the audio and set up the loop
                      fireAlertAudio.play();
                      fireAlertAudio.addEventListener('ended', function () {
                          this.currentTime = 0;
                          this.play();
                      });
                  }

              }else if(data > 85){
                  soundAlertModal.show();
                  // soundAlertModal.hide();
                  // document.body.style.backgroundColor = '';
                  // soundAlertCard.style.backgroundColor = 'red';

                   // Check if the audio is paused or has ended
                   if (fireAlertAudio.paused || fireAlertAudio.ended) {
                      // Play the audio and set up the loop
                      fireAlertAudio.play();
                      fireAlertAudio.addEventListener('ended', function () {
                          this.currentTime = 0;
                          this.play();
                      });
                  }

              }
              
          } else {
              // h3Element.innerText = 'No data available';
              // document.body.style.backgroundColor = '';
          }
          }, (error) => {
              console.error('Error getting data from Firebase:', error);
          });

          }

          

          // function displayFirebaseDataFlame() {
          window.displayFirebaseDataFlame = function() {
              
              const fireAlertModal = new bootstrap.Modal(document.getElementById('fireAlert'));
              // const h3Element = document.getElementById('flameData');
              // const fireAlertCard = document.getElementById('firealertCard');
              // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();

              // console.log('Selected Node fire:', selectedNodeVal);

              // const firePath = `Nodes/${selectedNodeVal}/FlameSensor`;
              
              // console.log('Firebase Path sound:', firePath);

          // Assuming 'your_data_path' is the path to the data in your Firebase
          const Flame = ref(db, "Nodes/Node1/FlameSensor");
           
          onValue(Flame, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
              if (data === 0) {
              // h3Element.innerText = 'No fire detected';
              // // document.body.style.backgroundColor = '';
              // fireAlertCard.style.backgroundColor = '';
              fireAlertModal.hide();
              fireAlertAudio.pause();
              fireAlertAudio.currentTime = 0;

              } else if (data === 1) {
                  // h3Element.innerText = 'Fire detected! Take immediate action.';
                  // You can also trigger additional actions/alerts here
                  fireAlertModal.show();
                  
                  // Check if the audio is paused or has ended
                  if (fireAlertAudio.paused || fireAlertAudio.ended) {
                      // Play the audio and set up the loop
                      fireAlertAudio.play();
                      fireAlertAudio.addEventListener('ended', function () {
                          this.currentTime = 0;
                          this.play();
                      });
                  }
                  // fireAlertCard.style.backgroundColor = 'red';
                  // document.body.style.backgroundColor = 'red';
              } else {
                  // h3Element.innerText = 'Invalid data received';
                  // fireAlertCard.style.backgroundColor = '';
              }

          } else {
              // h3Element.innerText = 'No data available';
              // fireAlertCard.style.backgroundColor = '';
          }
          }, (error) => {
              console.error('Error getting data from Firebase:', error);
          });

          }


          window.displayFirebaseDataSmoke = function() {
          // function displayFirebaseDataSmoke() {
              // const h3Element = document.getElementById('smokeData');
              // const smokeAlertCard = document.getElementById('smokealertCard');
              // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();
              // const smokePath = `Nodes/${selectedNodeVal}/SmokeSensor`;

              // console.log('Selected Node smoke:', selectedNodeVal);
              // console.log('Firebase Path sound:', smokePath);
              const smokeAlertModal = new bootstrap.Modal(document.getElementById('smokeAlert'));
          // Assuming 'your_data_path' is the path to the data in your Firebase
          const Smoke = ref(db, "Nodes/Node1/SmokeSensor");

          onValue(Smoke, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
              // h3Element.innerText = data + " " + "%"; // Update the content of the h3 tag
              if(data < 39){
                  // smokeAlertCard.style.backgroundColor = '';
                  smokeAlertModal.hide();
                  fireAlertAudio.pause();
                  fireAlertAudio.currentTime = 0;

              }else if(data >= 39 && data < 50){
                  // smokeAlertCard.style.backgroundColor = 'orange';
                  smokeAlertModal.show();
                  // Check if the audio is paused or has ended
                  if (fireAlertAudio.paused || fireAlertAudio.ended) {
                      // Play the audio and set up the loop
                      fireAlertAudio.play();
                      fireAlertAudio.addEventListener('ended', function () {
                          this.currentTime = 0;
                          this.play();
                      });
                  }

              }else if(data >= 50){
                  // smokeAlertCard.style.backgroundColor = 'red';
                  smokeAlertModal.show();
                  // Check if the audio is paused or has ended
                  if (fireAlertAudio.paused || fireAlertAudio.ended) {
                      // Play the audio and set up the loop
                      fireAlertAudio.play();
                      fireAlertAudio.addEventListener('ended', function () {
                          this.currentTime = 0;
                          this.play();
                      });
                  }

              }


          } else {
              // h3Element.innerText = 'No data available';
          }
          }, (error) => {
              console.error('Error getting data from Firebase:', error);
          });

          }



          window.displayFirebaseDataGPS11 = function() {
          // function displayFirebaseDataGPS() {
              // const h3Element = document.getElementById('GPS');
              const mapLinkElement = document.getElementById('mapLink11');
              // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();
              const mapPath = `Nodes/Node1/mapLink`;

              // console.log('Selected Node gps:', selectedNodeVal);
              // console.log('Firebase Path sound:', mapPath);

          // Assuming 'your_data_path' is the path to the data in your Firebase
          const gps = ref(db, mapPath);

          onValue(gps, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
              mapLinkElement.href = data;
              // h3Element.innerText = data;
          } else {
              mapLinkElement.href = '#';
          }
          }, (error) => {
              console.error('Error getting data from Firebase:', error);
          });

          }

          window.displayFirebaseDataGPS12 = function() {
          // function displayFirebaseDataGPS() {
              // const h3Element = document.getElementById('GPS');
              const mapLinkElement = document.getElementById('mapLink12');
              // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();
              const mapPath = `Nodes/Node1/mapLink`;

              // console.log('Selected Node gps:', selectedNodeVal);
              // console.log('Firebase Path sound:', mapPath);

          // Assuming 'your_data_path' is the path to the data in your Firebase
          const gps = ref(db, mapPath);

          onValue(gps, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
              mapLinkElement.href = data;
              // h3Element.innerText = data;
          } else {
              mapLinkElement.href = '#';
          }
          }, (error) => {
              console.error('Error getting data from Firebase:', error);
          });

          }

          window.displayFirebaseDataGPS13 = function() {
          // function displayFirebaseDataGPS() {
              // const h3Element = document.getElementById('GPS');
              const mapLinkElement = document.getElementById('mapLink13');
              // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();
              const mapPath = `Nodes/Node1/mapLink`;

              // console.log('Selected Node gps:', selectedNodeVal);
              // console.log('Firebase Path sound:', mapPath);

          // Assuming 'your_data_path' is the path to the data in your Firebase
          const gps = ref(db, mapPath);

          onValue(gps, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
              mapLinkElement.href = data;
              // h3Element.innerText = data;
          } else {
              mapLinkElement.href = '#';
          }
          }, (error) => {
              console.error('Error getting data from Firebase:', error);
          });

          }




           //alert for NODE 1 even in this page end



           //ALERT FOR NODE 2

           window.displayFirebaseDataSound2 = function() {
          // Function to read data from Firebase and display it in the h3 tag
          // function displayFirebaseDataSound() {
              const soundAlertModal = new bootstrap.Modal(document.getElementById('soundAlert2'));
              // const h3Element = document.getElementById('soundData');
              // const soundAlertCard = document.getElementById('soundalertCard');
              // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();

              // console.log('Selected Node sound:', selectedNodeVal);

              // const soundPath = `Nodes/${selectedNodeVal}/SoundSensor`;
              // console.log('Firebase Path sound:', soundPath);
          // Assuming 'your_data_path' is the path to the data in your Firebase
          // const Sound = ref(db, 'Nodes/Node1/SoundSensor');
          const Sound = ref(db, "Nodes/Node2/SoundSensor");
          
          
          onValue(Sound, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
              
              // h3Element.innerText = data + " " + "dB"; // Update the content of the h3 tag

              if(data < 64){
                  // soundAlertModal.show();
                  // soundAlertCard.style.backgroundColor = '';
                  soundAlertModal.hide();
                  fireAlertAudio.pause();
                  fireAlertAudio.currentTime = 0;

                  // document.body.style.backgroundColor = 'yellow';
              }else if( data >= 64 && data <= 85 ){
                  soundAlertModal.show();
                  // document.body.style.backgroundColor = 'yellow';
                  // soundAlertCard.style.backgroundColor = 'orange';

                   // Check if the audio is paused or has ended
                   if (fireAlertAudio.paused || fireAlertAudio.ended) {
                      // Play the audio and set up the loop
                      fireAlertAudio.play();
                      fireAlertAudio.addEventListener('ended', function () {
                          this.currentTime = 0;
                          this.play();
                      });
                  }

              }else if(data > 85){
                  soundAlertModal.show();
                  // soundAlertModal.hide();
                  // document.body.style.backgroundColor = '';
                  // soundAlertCard.style.backgroundColor = 'red';

                   // Check if the audio is paused or has ended
                   if (fireAlertAudio.paused || fireAlertAudio.ended) {
                      // Play the audio and set up the loop
                      fireAlertAudio.play();
                      fireAlertAudio.addEventListener('ended', function () {
                          this.currentTime = 0;
                          this.play();
                      });
                  }

              }
              
          } else {
              // h3Element.innerText = 'No data available';
              // document.body.style.backgroundColor = '';
          }
          }, (error) => {
              console.error('Error getting data from Firebase:', error);
          });

          }

          

          // function displayFirebaseDataFlame() {
          window.displayFirebaseDataFlame2 = function() {
              
              const fireAlertModal = new bootstrap.Modal(document.getElementById('fireAlert2'));
              // const h3Element = document.getElementById('flameData');
              // const fireAlertCard = document.getElementById('firealertCard');
              // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();

              // console.log('Selected Node fire:', selectedNodeVal);

              // const firePath = `Nodes/${selectedNodeVal}/FlameSensor`;
              
              // console.log('Firebase Path sound:', firePath);

          // Assuming 'your_data_path' is the path to the data in your Firebase
          const Flame = ref(db, "Nodes/Node2/FlameSensor");
           
          onValue(Flame, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
              if (data === 0) {
              // h3Element.innerText = 'No fire detected';
              // // document.body.style.backgroundColor = '';
              // fireAlertCard.style.backgroundColor = '';
              fireAlertModal.hide();
              fireAlertAudio.pause();
              fireAlertAudio.currentTime = 0;

              } else if (data === 1) {
                  // h3Element.innerText = 'Fire detected! Take immediate action.';
                  // You can also trigger additional actions/alerts here
                  fireAlertModal.show();
                  
                  // Check if the audio is paused or has ended
                  if (fireAlertAudio.paused || fireAlertAudio.ended) {
                      // Play the audio and set up the loop
                      fireAlertAudio.play();
                      fireAlertAudio.addEventListener('ended', function () {
                          this.currentTime = 0;
                          this.play();
                      });
                  }
                  // fireAlertCard.style.backgroundColor = 'red';
                  // document.body.style.backgroundColor = 'red';
              } else {
                  // h3Element.innerText = 'Invalid data received';
                  // fireAlertCard.style.backgroundColor = '';
              }

          } else {
              // h3Element.innerText = 'No data available';
              // fireAlertCard.style.backgroundColor = '';
          }
          }, (error) => {
              console.error('Error getting data from Firebase:', error);
          });

          }


          window.displayFirebaseDataSmoke2 = function() {
          // function displayFirebaseDataSmoke() {
              // const h3Element = document.getElementById('smokeData');
              // const smokeAlertCard = document.getElementById('smokealertCard');
              // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();
              // const smokePath = `Nodes/${selectedNodeVal}/SmokeSensor`;

              // console.log('Selected Node smoke:', selectedNodeVal);
              // console.log('Firebase Path sound:', smokePath);
              const smokeAlertModal = new bootstrap.Modal(document.getElementById('smokeAlert2'));
          // Assuming 'your_data_path' is the path to the data in your Firebase
          const Smoke = ref(db, "Nodes/Node2/SmokeSensor");

          onValue(Smoke, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
              // h3Element.innerText = data + " " + "%"; // Update the content of the h3 tag
              if(data < 39){
                  // smokeAlertCard.style.backgroundColor = '';
                  smokeAlertModal.hide();
                  fireAlertAudio.pause();
                  fireAlertAudio.currentTime = 0;

              }else if(data >= 39 && data < 50){
                  // smokeAlertCard.style.backgroundColor = 'orange';
                  smokeAlertModal.show();
                  // Check if the audio is paused or has ended
                  if (fireAlertAudio.paused || fireAlertAudio.ended) {
                      // Play the audio and set up the loop
                      fireAlertAudio.play();
                      fireAlertAudio.addEventListener('ended', function () {
                          this.currentTime = 0;
                          this.play();
                      });
                  }

              }else if(data >= 50){
                  // smokeAlertCard.style.backgroundColor = 'red';
                  smokeAlertModal.show();
                  // Check if the audio is paused or has ended
                  if (fireAlertAudio.paused || fireAlertAudio.ended) {
                      // Play the audio and set up the loop
                      fireAlertAudio.play();
                      fireAlertAudio.addEventListener('ended', function () {
                          this.currentTime = 0;
                          this.play();
                      });
                  }

              }


          } else {
              // h3Element.innerText = 'No data available';
          }
          }, (error) => {
              console.error('Error getting data from Firebase:', error);
          });

          }


          window.displayFirebaseDataGPS21 = function() {
          // function displayFirebaseDataGPS() {
              // const h3Element = document.getElementById('GPS');
              const mapLinkElement = document.getElementById('mapLink21');
              // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();
              const mapPath = `Nodes/Node2/mapLink`;

              // console.log('Selected Node gps:', selectedNodeVal);
              // console.log('Firebase Path sound:', mapPath);

          // Assuming 'your_data_path' is the path to the data in your Firebase
          const gps = ref(db, mapPath);

          onValue(gps, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
              mapLinkElement.href = data;
              // h3Element.innerText = data;
          } else {
              mapLinkElement.href = '#';
          }
          }, (error) => {
              console.error('Error getting data from Firebase:', error);
          });

          }

          window.displayFirebaseDataGPS22 = function() {
          // function displayFirebaseDataGPS() {
              // const h3Element = document.getElementById('GPS');
              const mapLinkElement = document.getElementById('mapLink22');
              // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();
              const mapPath = `Nodes/Node2/mapLink`;

              // console.log('Selected Node gps:', selectedNodeVal);
              // console.log('Firebase Path sound:', mapPath);

          // Assuming 'your_data_path' is the path to the data in your Firebase
          const gps = ref(db, mapPath);

          onValue(gps, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
              mapLinkElement.href = data;
              // h3Element.innerText = data;
          } else {
              mapLinkElement.href = '#';
          }
          }, (error) => {
              console.error('Error getting data from Firebase:', error);
          });

          }

          window.displayFirebaseDataGPS23 = function() {
          // function displayFirebaseDataGPS() {
              // const h3Element = document.getElementById('GPS');
              const mapLinkElement = document.getElementById('mapLink23');
              // const selectedNodeVal = document.getElementById('selectedNode').innerText.trim();
              const mapPath = `Nodes/Node2/mapLink`;

              // console.log('Selected Node gps:', selectedNodeVal);
              // console.log('Firebase Path sound:', mapPath);

          // Assuming 'your_data_path' is the path to the data in your Firebase
          const gps = ref(db, mapPath);

          onValue(gps, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
              mapLinkElement.href = data;
              // h3Element.innerText = data;
          } else {
              mapLinkElement.href = '#';
          }
          }, (error) => {
              console.error('Error getting data from Firebase:', error);
          });

          }

           //alert NODE 2 even in this page end






              // window.onload = GetAllDataRealTime;
              window.onload = function () {
                  GetAllDataRealTime();
                  displayFirebaseDataSound();
                  displayFirebaseDataFlame();
                  displayFirebaseDataSmoke();
                  displayFirebaseDataGPS11();
                  displayFirebaseDataGPS12();
                  displayFirebaseDataGPS13();
                  displayFirebaseDataSound2();
                  displayFirebaseDataFlame2();
                  displayFirebaseDataSmoke2();
                  displayFirebaseDataGPS21();
                  displayFirebaseDataGPS22();
                  displayFirebaseDataGPS23();1232220
              
              };

              function UpdateUser(event){
                  event.preventDefault();

                  // Check if the phone number is more than 11 numeric digits
                  if (!/^\d{11}$/.test(phoneEditUser.value)) {
                      alert("Phone number should consist of 11 numeric digits");
                      return;
                  }
                  
                  update(ref(db, 'users/' + document.getElementById('uidUser').value), {
              firstname: document.getElementById('editfirstName').value.toUpperCase(),
              lastname: document.getElementById('editlastName').value.toUpperCase(),
              phone: document.getElementById('editphone').value,             
              })

              //let uid = document.getElementById('uidUser').value;
              // update(ref(db, 'users/' + userUid), {
              // firstname: fName,
              // lastname: lName,
              // phone: Phone,  
              // })
              .then(()=>{

                  update(ref(db, 'contactNumber/' + document.getElementById('uidUser').value), {
                  phone: document.getElementById('editphone').value,             
                  })

              // Alert user updated successfully
              alert('User updated successfully!');
              let editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
              editUserModal.hide();

              location.reload();
              })
              .catch((error)=>{
              alert(error.message);
              //console.log(error.code);
              //console.log(error.message);
              })

               }

               editUserForm.addEventListener('submit', UpdateUser);
              //  editUserbtn.addEventListener('submit', UpdateUser);



              function DeleteUser(uid){
                  // event.preventDefault();  
 
                  remove(ref(db, 'users/' + uid))
                // Use the deleteUser function to delete the user by UID
              .then(()=>{
                  remove(ref(db, 'contactNumber/' + uid))

              alert('User deleted successfully!');
              location.reload();
              })
              .catch((error)=>{
              alert(error.message);
              //console.log(error.code);
              //console.log(error.message);
              })

              

               }



               auth.onAuthStateChanged((user) => {
              if (user) {
                  // User is signed in
                  const uid = user.uid;

                  // Event listener for the "UserProfile" link click
                  document.getElementById('UserProfile').addEventListener('click', () => {
                      // Reference to the user's data in the Realtime Database (Assuming 'users' is your node name)
                      const userRef = ref(db, 'users/' + uid);

                      // Fetch the user data
                      get(userRef).then((snapshot) => {
                          const userData = snapshot.val();
                          if (userData) {
                              // Populate the form fields with the user data
                              document.getElementById('uidProfile').value = uid;
                              document.getElementById('editfirstNameProfile').value = userData.firstname;
                              document.getElementById('editlastNameProfile').value = userData.lastname;
                              document.getElementById('editemailInpProfile').value = userData.email;
                              document.getElementById('editphoneProfile').value = userData.phone;
                          } else {
                              console.log("User not found");
                              // Handle the case when the user is not found
                          }
                      }).catch((error) => {
                          //console.log("Error getting user information:", error);
                          // Handle the error
                      });
                  });
              } else {
                  // User is signed out
                  // Handle signed-out state, if needed
              }
          });


          //funtion to update user profile
          function UpdateUserProfile(event){
                  event.preventDefault();

                  // Check if the phone number is more than 11 numeric digits
                  if (!/^\d{11}$/.test(phoneEditProfile.value)) {
                      alert("Phone number should consist of 11 numeric digits");
                      return;
                  }
                  
                  update(ref(db, 'users/' + document.getElementById('uidProfile').value), {
              firstname: document.getElementById('editfirstNameProfile').value.toUpperCase(),
              lastname: document.getElementById('editlastNameProfile').value.toUpperCase(),
              phone: document.getElementById('editphoneProfile').value,             
              })

              //let uid = document.getElementById('uidUser').value;
              // update(ref(db, 'users/' + userUid), {
              // firstname: fName,
              // lastname: lName,
              // phone: Phone,  
              // })
              .then(()=>{

                  update(ref(db, 'contactNumber/' + document.getElementById('uidProfile').value), {
                  phone: document.getElementById('editphoneProfile').value,             
                  })

              // Alert user updated successfully
              alert('Profile updated successfully!');
              let editUserProfileModal = new bootstrap.Modal(document.getElementById('userProfileModal'));
              editUserProfileModal.hide();

              location.reload();
              })
              .catch((error)=>{
              alert(error.message);
              //console.log(error.code);
              //console.log(error.message);
              })
          
          }
               

               editProfileForm.addEventListener('submit', UpdateUserProfile);
              //  editUserbtn.addEventListener('submit', UpdateUser);




              //send reset password link through EMAIL Profile
             

              document.getElementById('resetPasswordLink').addEventListener('click', function() {
                  event.preventDefault();
                  // Remove the readonly attribute temporarily
                  document.getElementById('editemailInpProfile').removeAttribute('readonly');

                  let emailProfile = document.getElementById('editemailInpProfile').value;

              if (emailProfile) {
                  sendPasswordResetEmail(auth, emailProfile)
                  .then(() => {
                      // Password reset email sent!
                      alert('Password reset email sent successfully!');
                      //console.log("Password reset email sent!");
                      // location.reload();
                      // Handle success, e.g., show a success message to the user
                  })
                  .catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      console.error("Error sending password reset email:", errorCode, errorMessage);
                      alert(`Error sending password reset email: ${errorCode} - ${errorMessage}`);
                      // Handle error, e.g., show an error message to the user
                  });
              } else {
                  console.error("Invalid or missing email address.");
                  alert("Invalid or missing email address.");
                  //console.log(emailProfile);
                  // Handle the case where email is missing or invalid
              }
              });


              //reset password user
              document.getElementById('resetUserPassword').addEventListener('click', function() {
                  event.preventDefault();
                  // Remove the readonly attribute temporarily
                  document.getElementById('editemailInp').removeAttribute('readonly');

                  let emailUser = document.getElementById('editemailInp').value;

              if (emailUser) {
                  sendPasswordResetEmail(auth, emailUser)
                  .then(() => {
                      // Password reset email sent!
                      alert('Password reset email sent successfully!');
                      //console.log("Password reset email sent!");
                      // location.reload();
                      // Handle success, e.g., show a success message to the user
                  })
                  .catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      console.error("Error sending password reset email:", errorCode, errorMessage);
                      alert(`Error sending password reset email: ${errorCode} - ${errorMessage}`);
                      // Handle error, e.g., show an error message to the user
                  });
              } else {
                  console.error("Invalid or missing email address.");
                  alert("Invalid or missing email address.");
                  //console.log(emailUser);
                  // Handle the case where email is missing or invalid
              }
              });
