//adding api and initializing databse
  var config = {
      apiKey: "AIzaSyDwGDZm1thh5eiu1GTu9zOQ2cY6bdU4yQ8",
      authDomain: "trainscheduler-1b4ec.firebaseapp.com",
      databaseURL: "https://trainscheduler-1b4ec.firebaseio.com",
      storageBucket: "trainscheduler-1b4ec.appspot.com",
      messagingSenderId: "767260025263"
  };
  firebase.initializeApp(config);

  //setting databse to a varible

  var database = firebase.database();

//run event when button clicked
  $("#add-train").on("click", function(event) {
    //prevent refreshing of page when button pushed
      event.preventDefault();
      //grab form input values
      var trainName = $("#name-input").val().trim();
      var destination = $("#Destination-input").val().trim();
      var firstTime = $("#first-time-input").val().trim();
      var frequency = $("#frequency-input").val().trim();

      //convert first time to determine when the next time will be
      //subtract a year to work with the times
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      //format the current time 
      var currentTime = moment().format("HH:mm");
      //find the differenence in now and the first train time in minutes
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      // find the remainder of the difference in now and first time 
      var tRemainder = diffTime % frequency;
      //subtract remainder from the frequency. 
      var minutesTillTrain = frequency - tRemainder;
      //add mintuestill next train to the current time in minutes
      var nextTrain = moment().add(minutesTillTrain, "minutes");
      //format 
      var nextTrainFormatted = moment(nextTrain).format("HH:mm");

      var newTrain = {
          name: trainName,
          destination: destination,
          start: firstTime,
          frequency: frequency,
          nextTrainFormatted: nextTrainFormatted,
          minutesTillTrain: minutesTillTrain
      };
      database.ref().push(newTrain);

      console.log(newTrain.name);

      $("#name-input").val("");
      $("#Destination-input").val("");
      $("#first-time-input").val("");
      $("#frequency-input").val("");
      return false;

  });

  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

      trainName = childSnapshot.val().name;
      destination = childSnapshot.val().destination;
      firstTime = childSnapshot.val().start;
      frequency = childSnapshot.val().frequency;
      nextTrainFormatted = childSnapshot.val().nextTrainFormatted;
      minutesTillTrain = childSnapshot.val().minutesTillTrain;

      //nextTrainFormatted = moment(nextTrainFormatted).format("HHmm");


      $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
          frequency + "</td><td>" + nextTrainFormatted + "</td><td>" + minutesTillTrain + "</td></tr>");


  });