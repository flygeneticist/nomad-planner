Meteor.publish("destinations", function () {
  return Destinations.find({}, {sort: {dateStart: 1}});
});

Meteor.publish("expenses", function () {
  return Expenses.find({}, {sort: {tripLeg: 1, category: 1}});
});

Meteor.publish("countries", function () {
  return Countries.find({}, {sort: {name: 1}});
});

Meteor.publish("cities", function () {
  return Cities.find({active: true});
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

Meteor.methods({
  addDestination: function (country, cityId, dateStart, dateEnd, duration) {
    Destinations.insert({
      country: country,
      city: cityId,
      dateStart: dateStart,
      dateEnd: dateEnd,
      duration: duration,
      createdAt: new Date(),
      user: Meteor.user()
    });
  },

  addExpense:function (city, cost, tripLegId, category, title) {
    if (category === undefined) { category = 'Base Living Costs'; }
    if (title === undefined) { title = Cities.findOne({city: city})['city']; }
    Expenses.insert({
      tripLeg: tripLegId,
      title: title,
      category: category,
      cost: parseFloat(cost),
      createdAt: new Date(),
      user: Meteor.user()
    });
  },

  delDest: function (taskId) {
    Destinations.remove(taskId);
  },

  delExpen: function (taskId) {
    Expenses.remove(taskId);
  },

  findOneDest: function (ctry, cty, duration, user) {
    Destinations.findOne({country: ctry, city: cty, duration: duration, user: user})['_id'];
  }
});
