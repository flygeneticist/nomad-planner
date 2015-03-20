// setup Mongo collection
Destinations = new Mongo.Collection("destinations");
Expenses = new Mongo.Collection("expenses");
Statistics = new Mongo.Collection("statistics");


if (Meteor.isClient) {
  Template.body.helpers({
    destinations: function () {
      return Destinations.find({}, {sort: {dateStart: -1}});
    },
    expenses: function () {
      return Expenses.find({});
    },
    statistics: function () {
      return Statistics.find({});
    }
  });

  Template.body.events({
    // 'click button': function () {
    //   // increment the counter when button is clicked
    //   Session.set('counter', Session.get('counter') + 1);
    // }
  });
}
