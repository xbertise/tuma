var $ = require('cheerio');
var request = require('request');
var fs = require('fs');

var domains = [];
domains.push('http://suchen.mobile.de/auto/volkswagen-passat-diesel-kombi.html?useCase=MiniSearch&isSearchRequest=true&maxPrice=10000&minFirstRegistrationDate=2005-01-01&maxMileage=125000&ambitCountry=DE&zipcode=20249&zipcodeRadius=200&__lp=1&scopeId=C&sortOption.sortBy=price.consumerGrossEuro&makeModelVariant1.makeId=25200&makeModelVariant1.modelId=25%2C4&makeModelVariant1.searchInFreetext=false&makeModelVariant2.searchInFreetext=false&makeModelVariant3.searchInFreetext=false&fuels=DIESEL&transmissions=MANUAL_GEAR&negativeFeatures=EXPORT&categories=EstateCar&lang=de&frequence=DAILY');
domains.push('http://suchen.mobile.de/auto/volkswagen-passat-diesel-kombi.html?useCase=MiniSearch&isSearchRequest=true&maxPrice=10000&minFirstRegistrationDate=2005-01-01&maxMileage=125000&ambitCountry=DE&zipcode=50739&zipcodeRadius=100&__lp=2&scopeId=C&sortOption.sortBy=price.consumerGrossEuro&makeModelVariant1.makeId=25200&makeModelVariant1.modelId=25%2C4&makeModelVariant1.searchInFreetext=false&makeModelVariant2.searchInFreetext=false&makeModelVariant3.searchInFreetext=false&fuels=DIESEL&transmissions=MANUAL_GEAR&negativeFeatures=EXPORT&categories=EstateCar&lang=de&frequence=DAILY');
domains.push('http://suchen.mobile.de/auto/volkswagen-passat-diesel-kombi.html?useCase=MiniSearch&isSearchRequest=true&maxPrice=10000&minFirstRegistrationDate=2005-01-01&maxMileage=125000&ambitCountry=DE&zipcode=44795&zipcodeRadius=100&__lp=1&scopeId=C&sortOption.sortBy=price.consumerGrossEuro&makeModelVariant1.makeId=25200&makeModelVariant1.modelId=25%2C4&makeModelVariant1.searchInFreetext=false&makeModelVariant2.searchInFreetext=false&makeModelVariant3.searchInFreetext=false&fuels=DIESEL&transmissions=MANUAL_GEAR&negativeFeatures=EXPORT&categories=EstateCar&lang=de&frequence=DAILY');
domains.push('http://suchen.mobile.de/auto/ford-focus-diesel-kombi.html?useCase=RefineSearch&minFirstRegistrationDate=2011-01-01&__lp=6&scopeId=C&sortOption.sortBy=price.consumerGrossEuro&makeModelVariant1.makeId=9000&makeModelVariant1.modelId=20&makeModelVariant1.searchInFreetext=false&makeModelVariant2.searchInFreetext=false&makeModelVariant3.searchInFreetext=false&fuels=DIESEL&maxPrice=10000&ambitCountry=DE&zipcode=20249&zipcodeRadius=100&transmissions=MANUAL_GEAR&negativeFeatures=EXPORT&maxMileage=125000&categories=EstateCar&lang=de');
domains.push('http://suchen.mobile.de/auto/skoda-octavia-diesel-kombi.html?useCase=MiniSearch&isSearchRequest=true&maxPrice=10000&minFirstRegistrationDate=2005-01-01&maxMileage=125000&ambitCountry=DE&zipcode=20249&zipcodeRadius=200&__lp=10&scopeId=C&sortOption.sortBy=price.consumerGrossEuro&makeModelVariant1.makeId=22900&makeModelVariant1.modelId=10&makeModelVariant1.searchInFreetext=false&makeModelVariant2.searchInFreetext=false&makeModelVariant3.searchInFreetext=false&fuels=DIESEL&transmissions=MANUAL_GEAR&negativeFeatures=EXPORT&categories=EstateCar&lang=de&frequence=DAILY');
domains.push('http://suchen.mobile.de/auto/skoda-octavia-diesel-kombi.html?useCase=MiniSearch&isSearchRequest=true&maxPrice=10000&minFirstRegistrationDate=2006-01-01&maxMileage=125000&ambitCountry=DE&zipcode=44795&zipcodeRadius=100&__lp=2&scopeId=C&sortOption.sortBy=price.consumerGrossEuro&makeModelVariant1.makeId=22900&makeModelVariant1.modelId=10&makeModelVariant1.searchInFreetext=false&makeModelVariant2.searchInFreetext=false&makeModelVariant3.searchInFreetext=false&fuels=DIESEL&transmissions=MANUAL_GEAR&negativeFeatures=EXPORT&categories=EstateCar&lang=de&frequence=DAILY');
domains.push('http://suchen.mobile.de/auto/skoda-octavia-diesel-kombi.html?useCase=MiniSearch&isSearchRequest=true&maxPrice=10000&minFirstRegistrationDate=2006-01-01&maxMileage=125000&ambitCountry=DE&zipcode=50739&zipcodeRadius=100&__lp=2&scopeId=C&sortOption.sortBy=price.consumerGrossEuro&makeModelVariant1.makeId=22900&makeModelVariant1.modelId=10&makeModelVariant1.searchInFreetext=false&makeModelVariant2.searchInFreetext=false&makeModelVariant3.searchInFreetext=false&fuels=DIESEL&transmissions=MANUAL_GEAR&negativeFeatures=EXPORT&categories=EstateCar&lang=de&frequence=DAILY');
fs.writeFile('cars.txt', '');
pages = 0;
function gotHTML(err, resp, html) {
    if (err)
        return console.error(err);
    var parsedHTML = $.load(html);
    // get all img tags and loop over them
    var content = [];
    parsedHTML('div.normalAd').map(function (i, li) {
        //var href = $(li).attr('href');
        //if (!href.match('.jpg')) return;
        var vehicle = $(li).children('div.vehicleDetailsMain');
        var link = vehicle.attr('data-href');
        var title = vehicle.children('div.listEntryTitle').children('a').text().trim();
        var mileage = vehicle.children('div.rightSideColumns').children('div.mileage').text().trim();
        mileage = mileage.replace(/ km/gi,'');
        var ez = vehicle.children('div.rightSideColumns').children('div.firstRegistration').text().trim();
        ez = ez.replace(/EZ&nbsp;|EZ /,'');
        var vendorType = vehicle.children('div.rightSideColumns').children('div.vendorType').text().trim();
        var price = vehicle.children('div.rightSideColumns').children('div.priceBoxWrapper').children('div.priceBox').children('.priceGross').text().trim();
        price = price.replace(/ EUR| (Brutto)*/,'');
        var location = vehicle.children('.descriptions').children('.vehicleLocation').text().trim();
        location = location.replace(/DE - /,'');
        var string = title + ';' + mileage + ';' + price + ';' + ez + ';' + vendorType + ';' + location + ';' + link + ';';

        var descs = vehicle.children('.descriptions').children('.description').children('div').map(function (i, elem) {
//            console.log($(elem));
//            return;
                string += $(this).text().trim() + ';';
        });
        content.push(string + '\n');
        fs.appendFile('cars.txt', string + '\n');
    });
    var next = parsedHTML('a.page-next').attr('href');
    if (undefined !== next) {
        request(next, gotHTML);
    }
    var randomIndex = Math.floor(Math.random() * content.length)
    console.log(++pages + ' Seiten durchsucht.');
    //fs.appendFile('cars.txt', content);

}
domains.forEach(function (domain) {
    request(domain, gotHTML);
});