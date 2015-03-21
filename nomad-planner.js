// setup Mongo collection
Destinations = new Mongo.Collection("destinations");
Expenses = new Mongo.Collection("expenses");
Countries = new Mongo.Collection("countries");
Cities = new Mongo.Collection("cities");

if (Meteor.isClient) {
  Template.body.helpers({
    destinations: function () {
      return Destinations.find({}, {sort: {dateStart: 1}});
    },
    expenses: function () {
      return Expenses.find({});
    },
    stats: function () {
      return stats = [{
        totDay: 0, // Destinations.find({}, {_id: 0, duration: 1}).length,
        totCountry: 0, //Destinations.find({}).distinct('country', true).length
        totFlight: (Expenses.find({category: 'Flight'}).length),
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
      var cost = calcBudgetCost(budget, city, duration);

      addDestination(country, city, budget, dateStart, dateEnd, duration);
      addExpense(city, cost);

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

      addExpense(city, cost, category, title);

      event.target.city.value = "";
      event.target.cost.value = "";
      event.target.category.value = "";
      event.target.title.value = "";
      return false;
    },

    'click #delDest': function () {
      Destinations.remove(this._id);
    },

    'click #delExpen': function () {
      Expenses.remove(this._id);
    }
  });
}


function addDestination (ctry, city, budget, dateStart, dateEnd, duration) {
  Destinations.insert({
    country: ctry,
    city: city,
    budget: budget,
    dateStart: dateStart,
    dateEnd: dateEnd,
    duration: duration,
    createdAt: new Date()
  });
}

function addExpense (city, cost, category, title) {
  if (category === undefined) { category = 'Base Living Costs'; }
  if (title === undefined) { title = Cities.findOne({id: city})['name']; }
  Expenses.insert({
    tripLeg: 'placeholder',
    title: title,
    category: category,
    cost: cost
  });
}

function calcBudgetCost (budgetLvl, cityId, duration) {
  var cost = Cities.findOne({id: cityId});
  if (budgetLvl == 'high') {
    cost = cost["costHigh"];
  } else {
    cost = cost["costLow"];
  }
  return cost*duration;
}

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
  return Countries.findOne({id: ctryId})['name'];
});

UI.registerHelper("getCityName", function (ctyId) {
  return Cities.findOne({id: ctyId})['name'];
});

UI.registerHelper("parseCurrency", function (money) {
  return parseFloat(money).toFixed(2);
});
