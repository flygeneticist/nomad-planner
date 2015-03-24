// setup Mongo collection
Destinations = new Mongo.Collection("destinations");
Expenses = new Mongo.Collection("expenses");
Countries = new Mongo.Collection("countries");
Cities = new Mongo.Collection("cities");
Categories = new Mongo.Collection("categories");

Country = function (id, name) {
    this._id = id;
    this._name = name;
};

Country.prototype = {
    get id() { return this._id; },
    get name() { return this._name; },
    set name(value) { this._name = value; }
};

City = function (id, city, country, nomadApartment, hostel, hotel, expat, coworking) {
    this._id = id;
    this.city = city;
    this.country = country;
    this.nomadApartment = typeof nomadApartment !== "undefined" ? nomadApartment : 0;
    this.hostel = typeof hostel !== "undefined" ? hostel : 0;
    this.lowendHotel = typeof hotel !== "undefined" ? hotel : 0;
    this.expat = typeof expat !== "undefined" ? expat : 0;
    this.coworking = typeof coworking !== "undefined" ? coworking : 0;
    this.active = (nomadApartment>0 && hostel>0 && hotel>0 && expat>0) ? true : false;
};

City.prototype = {
    get id() { return this._id; },
    get city() { return this._city; },
    set city(value) { this._city = value; },
    get country() { return this._country; },
    set country(value) { this._country = value; },
    get nomadApartment() { return this._nomadApartment; },
    set nomadApartment(value) { this._nomadApartment = value; },
    get hostel() { return this._hostel; },
    set hostel(value) { this._hostel = value; },
    get lowendHotel() { return this._lowendHotel; },
    set lowendHotel(value) { this._lowendHotel = value; },
    get coworking() { return this._coworking; },
    set coworking(value) { this._coworking = value; },
    get expat() { return this._expat; },
    set expat(value) { this._expat = value; },
    get active() { return this._active; },
    set active(value) { this._active = value; },
};

Destination = function (id, country, city, dateStart, dateEnd) {
    this._id = id;
    this.city = city;
    this.country = country;
    this.dateStart = new Date(dateStart);
    this.dateEnd = new Date(dateEnd);
    this.duration = Math.floor(this.dateEnd - this.dateStart) / (1000*60*60*24);
    this.createdOn = new Date();
};

Destination.prototype = {
    get id() { return this._id },
    get city() { return this._city; },
    set city(value) { this._city = value; },
    get country() { return this._country; },
    set country(value) { this._country = value; },
    get dateStart() { return this._dateStart; },
    set dateStart(value) { this._dateStart = value; },
    get dateEnd() { return this._dateEnd; },
    set dateEnd(value) { this._dateEnd = value; },
    get duration() { return this._duration; },
    set duration(value) { this._duration = value; },
    get createdOn() { return this._createdOn; },
    set createdOn(value) { this._createdOn = value; }
};

Expense = function (id, tripLeg, category, cost, title) {
    this._id = id;
    this._tripLeg = tripLeg;
    this._category = category;
    this._cost = parseFloat(cost);
    this._title = title;
    this._createdOn = new Date();
};

Expense.prototype = {
    get id() { return this._id },
    get title() { return this._title; },
    set title(value) { this._title = value; },
    get tripLeg() { return this._tripLeg; },
    set tripLeg(value) { this._tripLeg = value; },
    get cost() { return this._cost; },
    set cost(value) { this._cost = value; },
    get category() { return this._category; },
    set category(value) { this._category = value; },
    get createdOn() { return this._createdOn; },
    set createdOn(value) { this._createdOn = value; }
}
