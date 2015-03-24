"use strict";
describe("Country", function () {
    it("should be created with a name", function () {
        spyOn(Countries, "insert").and.callFake(function (doc, callback) {
            // simulate async return of id = "1";
            callback(null, "1");
        });
        var country = new Country(null, "Litchenstein");
        expect(country.name).toBe("Litchenstein");
    });
});

describe("City", function () {
    it("should be created with a minimum of a name and country", function () {
        spyOn(Cities, "insert").and.callFake(function (doc, callback) {
            callback(null, "1");
        });
        var city = new City(null,"Chiang Mai","Thailand");
        // expect(city.city).toBe("Chiang Mai");
        expect(city.country).toBe("Thailand");
    });
    it("should not be active unless it has costs for apartment,hostel,hotel,expat", function () {
        spyOn(Cities, "insert").and.callFake(function (doc, callback) {
            callback(null, "1");
        });
        var city = new City(null, "Chiang Mai","Thailand",300,10,20);
        expect(city.active).toBe(false);
    });
});

describe("Destination", function () {
    it("should be created with a country,city,dateStart,dateEnd,duration", function (){
        spyOn(Destinations, "insert").and.callFake(function (doc, callback) {
            callback(null, "1");
        });
        var destination = new Destination(null, "Thailand", "Chiang Mai", "12/01/2015", "12/31/2015");
        expect(destination.city).toBe("Chiang Mai");
        expect(destination.dateStart).toEqual(new Date("12/01/2015"));
        expect(destination.dateEnd).toEqual(new Date("12/31/2015"));
        expect(destination.duration).toBe(30); // calculated from start and end dates
    });
});

describe("Expense", function () {
    it("should be created with a tripLeg,category,cost,title", function (){
        spyOn(Expenses, "insert").and.callFake(function (doc, callback) {
            callback(null, "1");
        });
        var expense = new Expense(null, "1234", "Flight", "235.56", "BKK to PAR");
        expect(expense.tripLeg).toEqual("1234");
        expect(expense.cost).toBe(235.56);
        expect(expense.title).toEqual("BKK to PAR");
        expect(expense.category).toEqual("Flight");
    });
    // it("should have default category if none given", function (){
    //     spyOn(Destinations, "insert").and.callFake(function (doc, callback) {
    //         callback(null, "1");
    //     });
    //     var expense = new Expense(null,"general", "235.56", "Flight", "BKK to PAR");
        // expect(expense.title).toBe("Base Living Costs");
        // expect(expense.category).toBe("Base Living Costs");
    // });
});
