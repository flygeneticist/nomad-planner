Tracker.autorun(function () {
  Meteor.subscribe("destinations");
  Meteor.subscribe("expenses");
  Meteor.subscribe("countries");
  Meteor.subscribe("cities", Session.get("selectedCtry"));
  Meteor.subscribe("categories");
  // Meteor.subscribe("stats");
});

Template.body.helpers({
  destinations: function () {
    return Destinations.find({});
  },
  expenses: function () {
    return Expenses.find({});
  },
  categories: function () {
    return Categories.find({});
  },
  countries: function () {
    return Countries.find({});
  },
  cities: function () {
    if (typeof Session.get("selectedCtry") !== "undefined") {
      return Cities.find({country: Session.get("selectedCtry")}, {sort: {city: 1}});
    } else {
      return Cities.find({country: "Argentina"}, {sort: {city: 1}});
    }
  },
  stats: function () {
    return stats = [{
      totDay: 0, // Destinations.find({}, {_id: 0, duration: 1}).length,
      totCountry: 0, //Destinations.find({}).distinct('country', true).length
      totFlight: Expenses.find({category: 'Flight'}).count(),
      totCost: 0 //Meteor.call("totCost")
    }];
  }
});

Template.body.events({
  // 'click button': function () {
  //   // increment the counter when button is clicked
  //   Session.set('counter', Session.get('counter') + 1);
  // }
  'change #countryPicker': function (event) {
    var newCtry = $(event.target).val();
    Session.set('selectedCtry', newCtry);
  },

  'change #dateEnd': function (event) {
    var newDate = $(event.target).val();
    Session.set('selectedCtry', newCtry);
  },

  'change #dateStart': function (event) {
    var newDate = $(event.target).val();
    Session.set('selectedCtry', newCtry);
  },

  'submit #destForm': function (event) {
    var country = event.target.country.value;
    var city = event.target.city.value;
    var dateStart = new Date(event.target.dateStart.value);
    var dateEnd = new Date(event.target.dateEnd.value);
    var duration = Math.floor(dateEnd - dateStart) / (1000*60*60*24);
    Meteor.call("addDestination", country, city, dateStart, dateEnd, duration);

    var cost = calcCost(city, duration);
    var tripLegId = Meteor.call("findOneDest", country, city, duration, Meteor.userId());
    Meteor.call("addExpense", city, cost, tripLegId);

    event.target.country.value = "";
    event.target.city.value = "";
    event.target.dateStart.value = "";
    event.target.dateEnd.value = "";
    Session.set("selectedCtry", undefined);
    return false;
  },

  'submit #expenForm': function (event) {
    var city = undefined;
    var cost = parseFloat(event.target.cost.value).toFixed(2);
    var category = event.target.category.value;
    var title = event.target.title.value;
    var tripLegId = event.target.tripLeg.value;

    Meteor.call("addExpense", city, cost, tripLegId, category, title);

    event.target.city.value = "";
    event.target.cost.value = "";
    event.target.category.value = "";
    event.target.title.value = "";
    return false;
  },

  'click #delDest': function () {
    Meteor.call("delDest", this._id);
  },

  'click #delExpen': function () {
    Meteor.call("delExpen", this._id);
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

// Helper Functions Defined Below This Point
var DateFormats = {
       short: "MMMM DD, YYYY",
       long: "dddd MM.DD.YY HH:mm",
       superShort: "M.D.YY"
};

UI.registerHelper("formatDate", function (datetime, format) {
  if (moment) {
    // can use other formats like 'lll' too
    format = DateFormats[format] || format;
    return moment(datetime).format(format);
  }
  else {
    return datetime;
  }
});

UI.registerHelper("parseCurrency", function (money) {
  return parseFloat(money).toFixed(2);
});

// helper function for cost calculation with the given duration
function calcCost (city, duration) {
    var cost = Cities.findOne({city: city});
    var months = parseInt(duration/30);
    var remainder = duration%30;
    var total = 0;

    if (duration >= 275) { total = cost["expat"]*months;
    } else if (duration >= 60) {
      total = cost["nomadApartment"]*months;
    } else {
      total = cost["hostel"]*duration; }
    return total;
}
