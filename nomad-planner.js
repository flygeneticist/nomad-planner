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
        totCountry: 0, //Destinations.find({}, {$group: { _id: "$country"}}).length,
        totFlight: 0, //Expenses.find({category: 'Flight'}).length,
        totCost: 0
      }];
    }
  });

  Template.body.events({
    // 'click button': function () {
    //   // increment the counter when button is clicked
    //   Session.set('counter', Session.get('counter') + 1);
    // }
    'onchange #country': function () {
      console.log(event.target.country.value);
    },

    'submit #destForm': function (event) {
      var country = event.target.country.value;
      var city = event.target.city.value;
      var budget = event.target.budget.value;
      var dateStart = new Date(event.target.dateStart.value);
      var dateEnd = new Date(event.target.dateEnd.value);

      addDestination(country, city, budget, dateStart, dateEnd);
      var cost = calcBudgetCost(budget, parseInt(city));
      addExpense(country, cost);

      event.target.country.value = "";
      event.target.city.value = "";
      event.target.budget.value = "";
      event.target.dateStart.value = "";
      event.target.dateEnd.value = "";
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


function addDestination (ctry, city, budget, dateStart, dateEnd) {
  Destinations.insert({
    country: ctry,
    city: city,
    budget: budget,
    dateStart: dateStart,
    dateEnd: dateEnd,
    duration: Math.floor(dateEnd - dateStart) / (1000*60*60*24),
    createdAt: new Date()
  });
}

function addExpense (ctry, cost, category) {
  if (typeof category === undefined) {
    category = 'base-costs';
  }

  Expenses.insert({
    tripLeg: 'placeholder',
    title: country + ' Cost of Living',
    category: category,
    cost: cost
  });
}

function calcBudgetCost (budgetLvl, cityId) {
  var cost = Cities.find({id: cityId})[0];
  if (budgetLvl == 'high') {
    cost = cost["costHigh"];
  } else {
    cost = cost["costLow"];
  }
  return cost;
}
