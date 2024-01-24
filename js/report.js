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


 function openViewModal(button) {
   // Get the row associated with the clicked button
   var row = button.closest('tr');

   // Get data from the row
   var nodeNum = row.cells[1].innerText;
   var soundValue = row.cells[2].innerText;
   var flameValue = row.cells[3].innerText;
   var smokeValue = row.cells[4].innerText;
   var dateTime = row.cells[5].innerText;

   // Update the modal with data from the selected row
   document.getElementById('nodeView').value = nodeNum;
   document.getElementById('soundView').value = soundValue;
   document.getElementById('fireView').value = flameValue;
   document.getElementById('smokeView').value = smokeValue;
   document.getElementById('datetimeView').value = dateTime;

   // Open the "View Report" modal
   var viewReportModal = new bootstrap.Modal(document.getElementById('viewReportModal'));
   viewReportModal.show();
 }

 // var userNo = 0;
             var tbody = document.getElementById('tbody1');
             var num = 0;

             function AddItemToTable(nodeNum, Sound, Flame, Smoke, dateTime){
                 let trow = document.createElement('tr');
                 let td1 = document.createElement('td'); 
                 let td2 = document.createElement('td'); 
                 let td3 = document.createElement('td'); 
                 let td4 = document.createElement('td'); 
                 let td5 = document.createElement('td'); 
                 let td6 = document.createElement('td');
                 let td7 = document.createElement('td');

                 td1.innerHTML =++ num;
                 td2.innerHTML = nodeNum;
                 td3.innerHTML = getSoundText(Sound);
                 td4.innerHTML = getFlameText(Flame);
                 td5.innerHTML = getSmokeText(Smoke);
                 td6.innerHTML = dateTime;
                 

                 let editButton = document.createElement('button');
                 editButton.className = 'btn btn-primary btn-sm ';
                 editButton.innerHTML = 'View';
                 editButton.addEventListener('click', function () {
                        
                   openViewModal(this);

                     });

                 td7.appendChild(editButton);

                 trow.appendChild(td1);
                 trow.appendChild(td2);
                 trow.appendChild(td3);
                 trow.appendChild(td4);
                 trow.appendChild(td5);
                 trow.appendChild(td6);
                 trow.appendChild(td7);

                 tbody.appendChild(trow);
             }

             function getSmokeText(value) {
                 if (value >= 39 && value <= 49) {
                     return '<span style="color: orange;">' + value + ' %' + '</span>';
                 } else if (value >= 50) {
                     return '<span style="color: red;">' + value + ' %' +'</span>';
                 } else {
                     return value + " %";
                 }
             }

             function getSoundText(value) {
                 if (value >= 64 && value <= 85) {
                     return '<span style="color: orange;">' + value + ' dB' + '</span>';
                 } else if (value > 85) {
                     return '<span style="color: red;">' + value + ' dB' +'</span>';
                 } else {
                     return value + " dB";
                 }
             }

             function getFlameText(value) {
                 if (value === 1) {
                     return '<span style="color: red;">Fire Detected</span>';
                 } else {
                     return 'No Fire Detected';
                 }
             }

             function AddAllItemsToTable(TheReport){
                 num=0;
                 TheReport.sort(function (a, b) {
                 var dateA = new Date(a.dateTime);
                 var dateB = new Date(b.dateTime);
                 return dateB - dateA;
             });

                 tbody.innerHTML="";

                 TheReport.forEach(element => {
                     AddItemToTable(element.NodeNumber, element.SoundSensor, element.FlameSensor, element.SmokeSensor, element.dateTime);
                     
                 });
             }


           //  window.filterTable = function(){
           //         // Get the selected date from the input
           //         var filterDate = document.getElementById('filterDateInput').value;

           //         // If the filter date is not empty
           //         if (filterDate) {
           //             // Convert the selected date to a JavaScript Date object
           //             var selectedDate = new Date(filterDate);

           //             // Filter the rows based on the selected date
           //             var rows = tbody.getElementsByTagName('tr');
           //             for (var i = 0; i < rows.length; i++) {
           //                 var rowDate = new Date(rows[i].getElementsByTagName('td')[5].innerHTML); // Assuming the date is in the 5th column (index 4)
                           
           //                 // Compare the date and hide/show the row accordingly
           //                 if (rowDate.toDateString() === selectedDate.toDateString()) {
           //                     rows[i].style.display = '';
           //                 } else {
           //                     rows[i].style.display = 'none';
           //                 }
           //             }
           //         } else {
           //             // If the filter date is empty, show all rows
           //             var rows = tbody.getElementsByTagName('tr');
           //             for (var i = 0; i < rows.length; i++) {
           //                 rows[i].style.display = '';
           //             }
           //         }
           //     }




           window.filterTable = function () {
   // Get the selected date from the input
   var filterDate = document.getElementById('filterDateInput').value;

   // If the filter date is not empty
   if (filterDate) {
       // Convert the selected date to a JavaScript Date object
       var selectedDate = new Date(filterDate);

       // Filter the rows based on the selected date
       var rows = tbody.getElementsByTagName('tr');
       var visibleRows = 0; // Counter for visible rows

       for (var i = 0; i < rows.length; i++) {
           var rowDate = new Date(rows[i].getElementsByTagName('td')[5].innerHTML); // Assuming the date is in the 6th column (index 5)

           // Compare the date and hide/show the row accordingly
           if (rowDate.toDateString() === selectedDate.toDateString()) {
               rows[i].style.display = '';
               visibleRows++;
               // Update the row number for visible rows
               rows[i].getElementsByTagName('td')[0].innerHTML = visibleRows;
           } else {
               rows[i].style.display = 'none';
           }
       }
   } else {
       // If the filter date is empty, show all rows
       var rows = tbody.getElementsByTagName('tr');
       for (var i = 0; i < rows.length; i++) {
           rows[i].style.display = '';
           // Update the row number for all rows
           rows[i].getElementsByTagName('td')[0].innerHTML = i + 1;
       }
   }
}



             function GetAllDataOnce(){
                 const dbref = ref(db);

                 get(child(dbref, "Reports"))
                 .then((snapshot)=>{
                     var reports = [];

                     // snapshot.forEach(childSnapshot=>{
                     //     users.push(childSnapshot.val());
                     // });

                     snapshot.forEach(childSnapshot => {
                     // const user = childSnapshot.val();
                     // user.uid = childSnapshot.key; // Add UID to the user object
                     reports.push(childSnapshot.val());
                 });
                   
                     AddAllItemsToTable(reports);
                 })
                 .catch((error) => {
                 console.error("Error getting data: ", error);
                 });
             }

             function GetAllDataRealTime(){
                 const dbref = ref(db,'Reports');

                 onValue(dbref,(snapshot)=>{
                     var reports = [];

                 // snapshot.forEach(childSnapshot=>{
                 //     users.push(childSnapshot.val());
                 // });

                 snapshot.forEach(childSnapshot => {
                 // const user = childSnapshot.val();
                 // user.uid = childSnapshot.key; // Add UID to the user object
                 reports.push(childSnapshot.val());
                 });

                 // Apply filtering if a date is selected
                 var filterDate = document.getElementById('filterDateInput').value;
                 if (filterDate) {
                     var selectedDate = new Date(filterDate);
                     reports = reports.filter(report => {
                         var rowDate = new Date(report.dateTime);
                         return rowDate.toDateString() === selectedDate.toDateString();
                     });
                 }
               
                 AddAllItemsToTable(reports);

                 })
             }



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
                 displayFirebaseDataGPS23();
             };




             
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






            let editProfileForm = document.getElementById('editProfileForm');
            let phoneEditProfile = document.getElementById('editphoneProfile');

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
              // console.log(error.message);
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
                          // console.log("Password reset email sent!");
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
                      // console.log(emailProfile);
                       // Handle the case where email is missing or invalid
                   }
                   });