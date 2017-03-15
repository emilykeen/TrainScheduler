  var config = {
      apiKey: "AIzaSyDwGDZm1thh5eiu1GTu9zOQ2cY6bdU4yQ8",
      authDomain: "trainscheduler-1b4ec.firebaseapp.com",
      databaseURL: "https://trainscheduler-1b4ec.firebaseio.com",
      storageBucket: "trainscheduler-1b4ec.appspot.com",
      messagingSenderId: "767260025263"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#add-train").on("click", function(event) {
      event.preventDefault();

      var trainName = $("#name-input").val().trim();
      var destination = $("#Destination-input").val().trim();
      var firstTime = $("#first-time-input").val().trim();
      var frequency = $("#frequency-input").val().trim();
      var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
      var currentTime = moment();
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      var tRemainder = diffTime % frequency;
      var minutesTillTrain = frequency - tRemainder;
      var nextTrain = moment().add(minutesTillTrain, "minutes");
      var nextTrainFormatted = moment(nextTrain).format("hh:mm");

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


      $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
          frequency + "</td><td>" + nextTrainFormatted + "</td><td>" + minutesTillTrain + "</td></tr>");


  });