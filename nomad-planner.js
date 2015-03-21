// setup Mongo collection
Destinations = new Mongo.Collection("destinations");
Expenses = new Mongo.Collection("expenses");
Countries = new Mongo.Collection("countries");
Cities = new Mongo.Collection("cities");
Categories = new Mongo.Collection("categories");

if (Meteor.isServer) {
  Meteor.publish("destinations", function () {
    return Destinations.find({}, {sort: {dateStart: 1}});
  });

  Meteor.publish("expenses", function () {
    return Expenses.find({});
  });

  Meteor.publish("countries", function () {
    return Countries.find({}, {sort: {name: 1}});
  });

  Meteor.publish("cities", function () {
    return Cities.find({}, {sort: {name: 1}});
  });

  Meteor.publish("categories", function () {
    return Categories.find({}, {sort: {name: 1}});
  });

  // Meteor.publish("stats", function (){
  //   var statDay = Destinations.aggregate([{$group: {_id: null, totalDay: {$sum: "$duration"}}}]);
  //   var statCtry = Destinations.aggregate([{$group: {_id: {country: "$country"}, count: {$sum: 1}}}]);
  //   var statCost = Expenses.aggregate([{$group: {_id: null, totalCost: {$sum: "$cost"}}}]);

  //   return stats = [{
  //     totDay: statDay, // Destinations.find({}, {_id: 0, duration: 1}).length,
  //     totCountry: statCtry, //Destinations.find({}).distinct('country', true).length
  //     totFlight: Expenses.find({category: 'Flight'}).count(),
  //     totCost: statCost
  //   }];
  // });
}


if (Meteor.isClient) {
  Meteor.subscribe("destinations");
  Meteor.subscribe("expenses");
  Meteor.subscribe("countries");
  Meteor.subscribe("cities");
  Meteor.subscribe("categories");
  // Meteor.subscribe("stats");

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
      return Cities.find({});
    },
    stats: function () {
      return stats = [{
        totDay: 0, // Destinations.find({}, {_id: 0, duration: 1}).length,
        totCountry: 0, //Destinations.find({}).distinct('country', true).length
        totFlight: Expenses.find({category: 'Flight'}).count(),
        totCost: 0
      }];
    }
  });

  Template.body.events({
    // 'click button': function () {
    //   // increment the counter when button is clicked
    //   Session.set('counter', Session.get('counter') + 1);
    // }
    // 'onchange #country': function () {
    //   console.log(event.target.country.value);
    // },

    'submit #destForm': function (event) {
      var country = parseInt(event.target.country.value);
      var city = parseInt(event.target.city.value);
      var budget = event.target.budget.value;
      var dateStart = new Date(event.target.dateStart.value);
      var dateEnd = new Date(event.target.dateEnd.value);
      var duration = Math.floor(dateEnd - dateStart) / (1000*60*60*24);
      Meteor.call("addDestination", country, city, budget, dateStart, dateEnd, duration);

      var tripLegId = Destinations.findOne({country: country, city: city, budget: budget})['_id'];
      var cost = calcBudgetCost(budget, city, duration);
      Meteor.call("addExpense", city, cost, tripLegId);

      event.target.country.value = "";
      event.target.city.value = "";
      event.target.budget.value = "";
      event.target.dateStart.value = "";
      event.target.dateEnd.value = "";
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

  UI.registerHelper("getCountryName", function (ctryId) {
    return Countries.findOne({id: ctryId})['name'];
  });

  UI.registerHelper("getCityName", function (cityId) {
    return Cities.findOne({id: cityId})['name'];
  });

  UI.registerHelper("parseCurrency", function (money) {
    return parseFloat(money).toFixed(2);
  });
}

Meteor.methods({
  addDestination: function (ctry, city, budget, dateStart, dateEnd, duration) {
    Destinations.insert({
      country: ctry,
      city: city,
      budget: budget,
      dateStart: dateStart,
      dateEnd: dateEnd,
      duration: duration,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },

  addExpense:function (city, cost, tripLegId, category, title) {
    if (category === undefined) { category = 'Base Living Costs'; }
    if (title === undefined) { title = Cities.findOne({id: city})['name']; }
    Expenses.insert({
      tripLeg: tripLegId,
      title: title,
      category: category,
      cost: cost,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },

  delDest: function (taskId) {
    Destinations.remove(taskId);
  },

  delExpen: function (taskId) {
    Expenses.remove(taskId);
  }
});


function calcBudgetCost (budgetLvl, cityId, duration) {
    var cost = Cities.findOne({id: cityId});
    if (budgetLvl == 'high') {
      cost = cost["costHigh"];
    } else {
      cost = cost["costLow"];
    }
    return cost*duration;
}
