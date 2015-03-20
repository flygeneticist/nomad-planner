// setup Mongo collection
Destinations = new Mongo.Collection("destinations");
Expenses = new Mongo.Collection("expenses");
Stats = new Mongo.Collection("stats");


if (Meteor.isClient) {
  Template.body.helpers({
    destination: function () {
      return Destinations.find({}, {sort: {dateStart: -1}});
    },
    expense: function () {
      return Expenses.find({}, {sort: {createdAt: -1}});
    },
    stats: function () {
      return Destinations.find({});
    }
  });

  Template.body.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
