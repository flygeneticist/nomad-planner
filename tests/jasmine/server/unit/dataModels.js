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
