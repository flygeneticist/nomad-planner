// setup Mongo collection
Destinations = new Mongo.Collection("destinations");
Expenses = new Mongo.Collection("expenses");
Countries = new Mongo.Collection("countries");
Cities = new Mongo.Collection("cities");


if (Meteor.isServer) {
  Meteor.publish("destinations", function () {
    return Destinations.find({}, {sort: {dateStart: 1}});
  });

  Meteor.publish("expenses", function () {
    return Expenses.find({});
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
  // Meteor.subscribe("stats");

  Template.body.helpers({
    destinations: function () {
      return Destinations.find({});
    },
    expenses: function () {
      return Expenses.find({});
    },
    stats: function () {
      return stats = [{
        totDay: statDay, // Destinations.find({}, {_id: 0, duration: 1}).length,
        totCountry: statCtry, //Destinations.find({}).distinct('country', true).length
        totFlight: Expenses.find({category: 'Flight'}).count(),
        totCost: statCost
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
      var cost = calcBudgetCost(budget, city, duration);

      Meteor.call("addDestination", country, city, budget, dateStart, dateEnd, duration);
      Meteor.call("addExpense", city, cost);

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

      Meteor.call("addExpense", city, cost, category, title);

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
         long: "dddd MM.DD.YYYY HH:mm"
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
    return Meteor.call("longCtryName", ctryId);
  });

  UI.registerHelper("getCityName", function (cityId) {
    return Meteor.call("longCityName", cityId);
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

  addExpense:function (city, cost, category, title) {
    if (category === undefined) { category = 'Base Living Costs'; }
    if (title === undefined) { title = Cities.findOne({id: city})['name']; }
    Expenses.insert({
      tripLeg: 'placeholder',
      title: title,
      category: category,
      cost: cost,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },

  calcBudgetCost: function (budgetLvl, cityId, duration) {
    var cost = Cities.findOne({id: cityId});
    if (budgetLvl == 'high') {
      cost = cost["costHigh"];
    } else {
      cost = cost["costLow"];
    }
    return cost*duration;
  },

  delDest: function (taskId) {
    Destinations.remove(taskId);
  },

  delExpen: function (taskId) {
    Expenses.remove(taskId);
  },

  longCtryName: function (id) {
    return Countries.findOne({id: id})['name'];
  },

  longCityName: function (id) {
    return Cities.findOne({id: id})['name'];
  }
});
