"use strict";

// This file needs to be edited to comment out
// rooms you want to join

// TODO - move to lib/ dir?

var AppConfig = require('../config/AppConfig');

// var Bonfires = require('../lib/app/Bonfires');

// from the webapp
// users enter the rooms with a topic=XXX url
// we find a matching room here with that topic
// and redirect them

/*
 * Returns a prefixed room(s) with a common channel name.
 * e.g. <code>prefixChannelName("FreeCodeCamp", ["Help", "Bonfire"]);</code>
 * would output <code>["FreeCodeCamp/Help", "FreeCodeCamp/Bonfire"]</code>
 * and <code>prefixChannelName("FreeCodeCamp", "DataScience"]);</code>
 * would output <code>"FreeCodeCamp/DataScience"</code>
 *
 * @param {string} name Channel name in Gitter
 * @param {string|Array<string>} roomNames List of room names or a single room name
 * @return {string|Array<string>} The prefixed string or array of string
 */
function prefixChannelName(name, roomNames) {
    if (roomNames instanceof Array) {
        return roomNames.map(function (room) {
            return name + '/' + room;
        });
    }
    return name + '/' + roomNames;
}

var RoomData;

// TODO - read this from the JSON file
var bonfireTopics = [
    "bonfires",
    "Pair Program on Bonfires",
    "Meet Bonfire",
    "Reverse a String",
    "Factorialize a Number",
    "Check for Palindromes",
    "Find the Longest Word in a String",
    "Title Case a Sentence",
    "Return Largest Numbers in Arrays",
    "Confirm the Ending",
    "Repeat a string repeat a string",
    "Truncate a string",
    "Chunky Monkey",
    "Slasher Flick",
    "Mutations",
    "Falsey Bouncer",
    "Where art thou",
    "Seek and Destroy",
    "Where do I belong",
    "Sum All Numbers in a Range",
    "Diff Two Arrays",
    "Roman Numeral Converter",
    "Search and Replace",
    "Pig Latin",
    "DNA Pairing",
    "Missing letters",
    "Boo who",
    "Sorted Union",
    "Convert HTML Entities",
    "Spinal Tap Case",
    "Sum All Odd Fibonacci Numbers",
    "Sum All Primes",
    "Smallest Common Multiple",
    "Finders Keepers",
    "Drop it",
    "Steamroller",
    "Binary Agents",
    "Everything Be True",
    "Arguments Optional"
];

var bonfireDashedNames = [
    "bonfire-meet-bonfire",
    "bonfire-reverse-a-string",
    "bonfire-factorialize-a-number",
    "bonfire-check-for-palindromes",
    "bonfire-find-the-longest-word-in-a-string",
    "bonfire-title-case-a-sentence",
    "bonfire-return-largest-numbers-in-arrays",
    "bonfire-confirm-the-ending",
    "bonfire-repeat-a-string-repeat-a-string",
    "bonfire-truncate-a-string",
    "bonfire-chunky-monkey",
    "bonfire-slasher-flick",
    "bonfire-mutations",
    "bonfire-falsey-bouncer",
    "bonfire-where-art-thou",
    "bonfire-seek-and-destroy",
    "bonfire-where-do-i-belong",
    "bonfire-sum-all-numbers-in-a-range",
    "bonfire-diff-two-arrays",
    "bonfire-roman-numeral-converter",
    "bonfire-search-and-replace",
    "bonfire-pig-latin",
    "bonfire-dna-pairing",
    "bonfire-missing-letters",
    "bonfire-boo-who",
    "bonfire-sorted-union",
    "bonfire-convert-html-entities",
    "bonfire-spinal-tap-case",
    "bonfire-sum-all-odd-fibonacci-numbers",
    "bonfire-sum-all-primes",
    "bonfire-smallest-common-multiple",
    "bonfire-finders-keepers",
    "bonfire-drop-it",
    "bonfire-steamroller",
    "bonfire-binary-agents",
    "bonfire-everything-be-true",
    "bonfire-arguments-optional",
    "bonfire-make-a-person",
    "bonfire-map-the-debris",
    "bonfire-pairwise",
    "bonfire-validate-us-telephone-numbers",
    "bonfire-symmetric-difference",
    "bonfire-exact-change",
    "bonfire-inventory-update",
    "bonfire-no-repeats-please",
    "bonfire-friendly-date-ranges"
];

var fccOfficialChatRooms = [
    "FreeCodeCamp/40PlusDevs",
    "FreeCodeCamp/Beta",
    "FreeCodeCamp/BookClub",
    "FreeCodeCamp/CodeReview",
    "FreeCodeCamp/CodingJobs",
    "FreeCodeCamp/CoreTeam",
    "FreeCodeCamp/CurriculumDevelopment",
    "FreeCodeCamp/DataScience",
    "FreeCodeCamp/Design",
    "FreeCodeCamp/FreeCodeCamp",
    "FreeCodeCamp/HalfWayClub",
    "FreeCodeCamp/Help",
    "FreeCodeCamp/HelpBasejumps",
    "FreeCodeCamp/HelpBonfires",
    "FreeCodeCamp/HelpZiplines",
    "FreeCodeCamp/Issues",
    "FreeCodeCamp/LetsPair",
    "FreeCodeCamp/LiveCoding",
    "FreeCodeCamp/News",
    "FreeCodeCamp/NonprofitProjects",
    "FreeCodeCamp/PairProgrammingWomen",
    "FreeCodeCamp/TeamViewer",
    "FreeCodeCamp/Welcome",
    "FreeCodeCamp/Wiki",
    "FreeCodeCamp/YouCanDoThis"
];

var fccCasualChatRooms = [
    'FreeCodeCamp/Business',
    'FreeCodeCamp/GameDev',
    'FreeCodeCamp/Gaming',
    'FreeCodeCamp/Hardware',
    'FreeCodeCamp/Music',
    'FreeCodeCamp/Photography',
    'FreeCodeCamp/Saving',
    'FreeCodeCamp/SelfImprovement',
    'FreeCodeCamp/Sports',
    'FreeCodeCamp/TVandMovies'
];

var fccCityChatRooms = [
    "FreeCodeCamp/Aarhus",
    "FreeCodeCamp/AbuDhabi",
    "FreeCodeCamp/Accra",
    "FreeCodeCamp/Adelaide",
    "FreeCodeCamp/Ahmedabad",
    "FreeCodeCamp/Aichi",
    "FreeCodeCamp/Albany",
    "FreeCodeCamp/Albuquerque",
    "FreeCodeCamp/Algiers",
    "FreeCodeCamp/Allahabad",
    "FreeCodeCamp/Almeria",
    "FreeCodeCamp/Amman",
    "FreeCodeCamp/Amsterdam",
    "FreeCodeCamp/Anacortes",
    "FreeCodeCamp/Ankara",
    "FreeCodeCamp/AnnArbor",
    "FreeCodeCamp/Apucarana",
    "FreeCodeCamp/Aracaju",
    "FreeCodeCamp/Asheville",
    "FreeCodeCamp/Asuncion",
    "FreeCodeCamp/Athens",
    "FreeCodeCamp/AthensOH",
    "FreeCodeCamp/Atlanta",
    "FreeCodeCamp/Auckland",
    "FreeCodeCamp/Aurora",
    "FreeCodeCamp/Austin",
    "FreeCodeCamp/Bacau",
    "FreeCodeCamp/Bakersfield",
    "FreeCodeCamp/Baku",
    "FreeCodeCamp/Baltimore",
    "FreeCodeCamp/Bandung",
    "FreeCodeCamp/Bangkok",
    "FreeCodeCamp/Barcelona",
    "FreeCodeCamp/Barranquilla",
    "FreeCodeCamp/Beirut",
    "FreeCodeCamp/Belem",
    "FreeCodeCamp/Belgrade",
    "FreeCodeCamp/Belize",
    "FreeCodeCamp/BelizeCity",
    "FreeCodeCamp/Bellingham",
    "FreeCodeCamp/BeloHorizonte",
    "FreeCodeCamp/Bengaluru",
    "FreeCodeCamp/Berlin",
    "FreeCodeCamp/Bhaktapur",
    "FreeCodeCamp/Bhubaneswar",
    "FreeCodeCamp/Bijeljina",
    "FreeCodeCamp/Birmingham",
    "FreeCodeCamp/BirminghamAlabama",
    "FreeCodeCamp/Bishkek",
    "FreeCodeCamp/Bismarck",
    "FreeCodeCamp/BloomingtonIN",
    "FreeCodeCamp/BloomingtonNormal",
    "FreeCodeCamp/BloomingtonNormal",
    "FreeCodeCamp/Bogota",
    "FreeCodeCamp/Boise",
    "FreeCodeCamp/Boston",
    "FreeCodeCamp/Boulder",
    "FreeCodeCamp/Brasilia",
    "FreeCodeCamp/Bratislava",
    "FreeCodeCamp/Brighton",
    "FreeCodeCamp/Brisbane",
    "FreeCodeCamp/Brno",
    "FreeCodeCamp/Brussels",
    "FreeCodeCamp/BryanCollegeStation",
    "FreeCodeCamp/Bucaramanga",
    "FreeCodeCamp/Bucharest",
    "FreeCodeCamp/Budapest",
    "FreeCodeCamp/BuenosAires",
    "FreeCodeCamp/Buffalo",
    "FreeCodeCamp/BuryStEdmunds",
    "FreeCodeCamp/Busan",
    "FreeCodeCamp/Bydgoszcz",
    "FreeCodeCamp/Cairo",
    "FreeCodeCamp/Calgary",
    "FreeCodeCamp/Cali",
    "FreeCodeCamp/Campinas",
    "FreeCodeCamp/Canberra",
    "FreeCodeCamp/CapeCod",
    "FreeCodeCamp/CapeTown",
    "FreeCodeCamp/Caracas",
    "FreeCodeCamp/Cardiff",
    "FreeCodeCamp/Casablanca",
    "FreeCodeCamp/CentralMississippi",
    "FreeCodeCamp/ChampaignUrbana",
    "FreeCodeCamp/Charlotte",
    "FreeCodeCamp/Chattanooga",
    "FreeCodeCamp/Chennai",
    "FreeCodeCamp/Chernivtsi",
    "FreeCodeCamp/ChiangMai",
    "FreeCodeCamp/Chicago",
    "FreeCodeCamp/Christchurch",
    "FreeCodeCamp/Christchurch",
    "FreeCodeCamp/Cincinnati",
    "FreeCodeCamp/Clarksville",
    "FreeCodeCamp/Cleveland",
    "FreeCodeCamp/Cluj",
    "FreeCodeCamp/Coimbatore",
    "FreeCodeCamp/Colombo",
    "FreeCodeCamp/ColoradoSprings",
    "FreeCodeCamp/Columbus",
    "FreeCodeCamp/Coventry",
    "FreeCodeCamp/Cuenca",
    "FreeCodeCamp/Curitiba",
    "FreeCodeCamp/DallasFortWorth",
    "FreeCodeCamp/DallasFortWorth",
    "FreeCodeCamp/Delhi",
    "FreeCodeCamp/Denver",
    "FreeCodeCamp/Derby",
    "FreeCodeCamp/DesMoines",
    "FreeCodeCamp/Detroit",
    "FreeCodeCamp/Dhaka",
    "FreeCodeCamp/Dnipropetrovsk",
    "FreeCodeCamp/Doha",
    "FreeCodeCamp/Dubai",
    "FreeCodeCamp/Dublin",
    "FreeCodeCamp/Durango",
    "FreeCodeCamp/EastBay",
    "FreeCodeCamp/EastBay",
    "FreeCodeCamp/EastBay",
    "FreeCodeCamp/Edinburgh",
    "FreeCodeCamp/Edmonton",
    "FreeCodeCamp/ElPaso",
    "FreeCodeCamp/Evansville",
    "FreeCodeCamp/FCCLosAngeles",
    "FreeCodeCamp/Farmville",
    "FreeCodeCamp/Fayetteville",
    "FreeCodeCamp/Ferizaj",
    "FreeCodeCamp/Firenze",
    "FreeCodeCamp/Florianopolis",
    "FreeCodeCamp/Folsom",
    "FreeCodeCamp/FortCollins",
    "FreeCodeCamp/Frankfort",
    "FreeCodeCamp/Frankfurt",
    "FreeCodeCamp/Freehold",
    "FreeCodeCamp/Fresno",
    "FreeCodeCamp/Fuengirola",
    "FreeCodeCamp/GainesvilleFL",
    "FreeCodeCamp/Galveston",
    "FreeCodeCamp/Geneva",
    "FreeCodeCamp/Glendora",
    "FreeCodeCamp/Goettingen",
    "FreeCodeCamp/Granada",
    "FreeCodeCamp/GrandRapids",
    "FreeCodeCamp/Guadalajara",
    "FreeCodeCamp/Guarapuava",
    "FreeCodeCamp/GuatemalaCity",
    "FreeCodeCamp/Guntur",
    "FreeCodeCamp/Gurgaon",
    "FreeCodeCamp/Hagerstown",
    "FreeCodeCamp/Halifax",
    "FreeCodeCamp/Hamburg",
    "FreeCodeCamp/HamptonRoads",
    "FreeCodeCamp/Hanoi",
    "FreeCodeCamp/Harcourt",
    "FreeCodeCamp/Hartford",
    "FreeCodeCamp/Hermosillo",
    "FreeCodeCamp/Hickory",
    "FreeCodeCamp/HoChiMinhCity",
    "FreeCodeCamp/Hobart",
    "FreeCodeCamp/HongKong",
    "FreeCodeCamp/Houston",
    "FreeCodeCamp/Hove",
    "FreeCodeCamp/Huntsville",
    "FreeCodeCamp/Hyderabad",
    "FreeCodeCamp/Iasi",
    "FreeCodeCamp/IdahoFalls",
    "FreeCodeCamp/Indianapolis",
    "FreeCodeCamp/Ipswich",
    "FreeCodeCamp/Irkutsk",
    "FreeCodeCamp/Isfahan",
    "FreeCodeCamp/Islamabad",
    "FreeCodeCamp/Istanbul",
    "FreeCodeCamp/IvanoFrankivsk",
    "FreeCodeCamp/Izmir",
    "FreeCodeCamp/JacksonMS",
    "FreeCodeCamp/Jacksonville",
    "FreeCodeCamp/Jaffna",
    "FreeCodeCamp/Jaipur",
    "FreeCodeCamp/Jakarta",
    "FreeCodeCamp/Jerusalem",
    "FreeCodeCamp/JoaoPessoa",
    "FreeCodeCamp/Johannesburg",
    "FreeCodeCamp/Juarezchi",
    "FreeCodeCamp/Kaduna",
    "FreeCodeCamp/Kalamazoo",
    "FreeCodeCamp/Kampala",
    "FreeCodeCamp/KansasCity",
    "FreeCodeCamp/Karachi",
    "FreeCodeCamp/Kathmandu",
    "FreeCodeCamp/Kemerovo",
    "FreeCodeCamp/Kerch",
    "FreeCodeCamp/Kiev",
    "FreeCodeCamp/KingstonON",
    "FreeCodeCamp/Knoxville",
    "FreeCodeCamp/Koeln",
    "FreeCodeCamp/Kolkata",
    "FreeCodeCamp/Kosovo",
    "FreeCodeCamp/Kozhikode",
    "FreeCodeCamp/Krasnodar",
    "FreeCodeCamp/KryvyiRih",
    "FreeCodeCamp/KualaLumpur",
    "FreeCodeCamp/LaCrosse",
    "FreeCodeCamp/LaPaz",
    "FreeCodeCamp/Lae",
    "FreeCodeCamp/Lagos",
    "FreeCodeCamp/Lahore",
    "FreeCodeCamp/Lakeland",
    "FreeCodeCamp/LasCruces",
    "FreeCodeCamp/LasVegas",
    "FreeCodeCamp/Lawrence",
    "FreeCodeCamp/Leesburg",
    "FreeCodeCamp/Leesville",
    "FreeCodeCamp/Lehi",
    "FreeCodeCamp/Lexington",
    "FreeCodeCamp/Lima",
    "FreeCodeCamp/Limassol",
    "FreeCodeCamp/Lindsay",
    "FreeCodeCamp/Lisbon",
    "FreeCodeCamp/LittleRock",
    "FreeCodeCamp/London",
    "FreeCodeCamp/LosAlamos",
    "FreeCodeCamp/Louisville",
    "FreeCodeCamp/Luanda",
    "FreeCodeCamp/Lubbock",
    "FreeCodeCamp/Lviv",
    "FreeCodeCamp/Madison",
    "FreeCodeCamp/Madrid",
    "FreeCodeCamp/Manchester",
    "FreeCodeCamp/Manila",
    "FreeCodeCamp/Melbourne",
    "FreeCodeCamp/MexicoCity",
    "FreeCodeCamp/Miami",
    "FreeCodeCamp/Milan",
    "FreeCodeCamp/Milwaukee",
    "FreeCodeCamp/Minneapolis",
    "FreeCodeCamp/Minsk",
    "FreeCodeCamp/MississippiGulfCoast",
    "FreeCodeCamp/Missoula",
    "FreeCodeCamp/Modesto",
    "FreeCodeCamp/Monterrey",
    "FreeCodeCamp/Montevideo",
    "FreeCodeCamp/Montgomery",
    "FreeCodeCamp/Montreal",
    "FreeCodeCamp/Moosejaw",
    "FreeCodeCamp/MorganCity",
    "FreeCodeCamp/Moscow",
    "FreeCodeCamp/MossPoint",
    "FreeCodeCamp/Multan",
    "FreeCodeCamp/Mumbai",
    "FreeCodeCamp/Munich",
    "FreeCodeCamp/Mysore",
    "FreeCodeCamp/Nairobi",
    "FreeCodeCamp/Napoli",
    "FreeCodeCamp/Nashik",
    "FreeCodeCamp/Nashville",
    "FreeCodeCamp/NewBrunswick",
    "FreeCodeCamp/NewHaven",
    "FreeCodeCamp/NewOrleans",
    "FreeCodeCamp/NewPaltz",
    "FreeCodeCamp/NewWestminster",
    "FreeCodeCamp/NewYorkCity",
    "FreeCodeCamp/Nicosia",
    "FreeCodeCamp/Noida",
    "FreeCodeCamp/NorthMississippi",
    "FreeCodeCamp/NorthPlatte",
    "FreeCodeCamp/NorthernArizona",
    "FreeCodeCamp/NorthernArizona",
    "FreeCodeCamp/NorthernArizona",
    "FreeCodeCamp/NorthernArizona",
    "FreeCodeCamp/OklahomaCity",
    "FreeCodeCamp/Olympia",
    "FreeCodeCamp/Omaha",
    "FreeCodeCamp/OrangeCounty",
    "FreeCodeCamp/Orlando",
    "FreeCodeCamp/Ottawa",
    "FreeCodeCamp/PanamaCity",
    "FreeCodeCamp/Parana",
    "FreeCodeCamp/Paris",
    "FreeCodeCamp/Pasadena",
    "FreeCodeCamp/Pasto",
    "FreeCodeCamp/Penang",
    "FreeCodeCamp/Perth",
    "FreeCodeCamp/Perugia",
    "FreeCodeCamp/Philadelphia",
    "FreeCodeCamp/Phoenix",
    "FreeCodeCamp/Phoenix",
    "FreeCodeCamp/Phoenix",
    "FreeCodeCamp/Pittsburgh",
    "FreeCodeCamp/Poitiers",
    "FreeCodeCamp/Pondicherry",
    "FreeCodeCamp/Portland",
    "FreeCodeCamp/Porto",
    "FreeCodeCamp/PortoAlegre",
    "FreeCodeCamp/Prague",
    "FreeCodeCamp/Pristina",
    "FreeCodeCamp/Providence",
    "FreeCodeCamp/Provo",
    "FreeCodeCamp/Puebla",
    "FreeCodeCamp/Pune",
    "FreeCodeCamp/Quibdo",
    "FreeCodeCamp/Raleigh",
    "FreeCodeCamp/Ranchi",
    "FreeCodeCamp/Reading",
    "FreeCodeCamp/Recife",
    "FreeCodeCamp/RedmondOR",
    "FreeCodeCamp/Reno",
    "FreeCodeCamp/RiceLake",
    "FreeCodeCamp/Richmond",
    "FreeCodeCamp/RiodeJaneiro",
    "FreeCodeCamp/RiversideCA",
    "FreeCodeCamp/RochesterNY",
    "FreeCodeCamp/Roma",
    "FreeCodeCamp/Rotterdam",
    "FreeCodeCamp/Sacramento",
    "FreeCodeCamp/SaintGeorge",
    "FreeCodeCamp/SaintLouis",
    "FreeCodeCamp/SaintPaul",
    "FreeCodeCamp/Salamanca",
    "FreeCodeCamp/SalisburyMD",
    "FreeCodeCamp/SaltLakeCity",
    "FreeCodeCamp/Salvador",
    "FreeCodeCamp/SanAntonio",
    "FreeCodeCamp/SanBernardino",
    "FreeCodeCamp/SanDiego",
    "FreeCodeCamp/SanFrancisco",
    "FreeCodeCamp/SanJose",
    "FreeCodeCamp/SanJoseCostaRica",
    "FreeCodeCamp/SanJuan",
    "FreeCodeCamp/SanLuisObispo",
    "FreeCodeCamp/SantaBarbara",
    "FreeCodeCamp/SantaCruz",
    "FreeCodeCamp/Santiago",
    "FreeCodeCamp/SantoDomingo",
    "FreeCodeCamp/SaoPaulo",
    "FreeCodeCamp/Savannah",
    "FreeCodeCamp/Seattle",
    "FreeCodeCamp/Seoul",
    "FreeCodeCamp/Shanghai",
    "FreeCodeCamp/Sheffield",
    "FreeCodeCamp/Sidoarjo",
    "FreeCodeCamp/SierraVista",
    "FreeCodeCamp/Singapore",
    "FreeCodeCamp/Skopje",
    "FreeCodeCamp/Solo",
    "FreeCodeCamp/SouthBend",
    "FreeCodeCamp/Spartanburg",
    "FreeCodeCamp/Srinagar",
    "FreeCodeCamp/StCloud",
    "FreeCodeCamp/StrokeOnTrent",
    "FreeCodeCamp/Struga",
    "FreeCodeCamp/Stuttgart",
    "FreeCodeCamp/Surabaya",
    "FreeCodeCamp/Surrey",
    "FreeCodeCamp/Sydney",
    "FreeCodeCamp/SydneyNS",
    "FreeCodeCamp/Taipei",
    "FreeCodeCamp/Tallahassee",
    "FreeCodeCamp/Tallinn",
    "FreeCodeCamp/Tampa",
    "FreeCodeCamp/Tashkent",
    "FreeCodeCamp/Tegucigalpa",
    "FreeCodeCamp/Tehran",
    "FreeCodeCamp/TelAviv",
    "FreeCodeCamp/Temecula",
    "FreeCodeCamp/Thessaloniki",
    "FreeCodeCamp/Ticino",
    "FreeCodeCamp/Tijuana",
    "FreeCodeCamp/Timisoara",
    "FreeCodeCamp/Tirana",
    "FreeCodeCamp/Tokyo",
    "FreeCodeCamp/TomsRiver",
    "FreeCodeCamp/Torino",
    "FreeCodeCamp/Toronto",
    "FreeCodeCamp/TriCitiesWashington",
    "FreeCodeCamp/Trivandrum",
    "FreeCodeCamp/Trojmiasto",
    "FreeCodeCamp/Trojmiasto",
    "FreeCodeCamp/Trojmiasto",
    "FreeCodeCamp/Tucson",
    "FreeCodeCamp/Tulsa",
    "FreeCodeCamp/Tunis",
    "FreeCodeCamp/UniversityCenter",
    "FreeCodeCamp/Valdosta",
    "FreeCodeCamp/Valencia",
    "FreeCodeCamp/Vancouver",
    "FreeCodeCamp/Victoria",
    "FreeCodeCamp/Vilnius",
    "FreeCodeCamp/VirginiaBeach",
    "FreeCodeCamp/Vitoria",
    "FreeCodeCamp/Vladivostok",
    "FreeCodeCamp/Warrington",
    "FreeCodeCamp/Warsaw",
    "FreeCodeCamp/WashingtonDC",
    "FreeCodeCamp/Waterford",
    "FreeCodeCamp/Wichita",
    "FreeCodeCamp/Winnipeg",
    "FreeCodeCamp/Wuerzburg",
    "FreeCodeCamp/Yangon",
    "FreeCodeCamp/Yaounde",
    "FreeCodeCamp/Yekaterinburg",
    "FreeCodeCamp/Yerevan",
    "FreeCodeCamp/Zagreb",
    "FreeCodeCamp/Znojmo",
    "FreeCodeCamp/Zurich"
];

var camperBotChatRooms = [
    "camperbot/HelpZiplines",
    "camperbot/devteam",
    "camperbot/testing"
];

/* ADD YOUR CHAT ROOMS HERE */
var otherChatRooms = [
    "dcsan/botzy",
    "dcsan/gitterbot"
];

// @TODO Refactor into a room generator function
var camperBotRooms = [].concat.apply([], [
    camperBotChatRooms,
    fccOfficialChatRooms,
    fccCityChatRooms,
    fccCasualChatRooms,
    otherChatRooms
]).map(function (room) {
    return {
        name: room
    };
});

var BotRoomData = {

    // this controls which rooms you can access
    YOUR_GITHUB_ID: [
        // change this to be a room your user is already in
        {
            title: "bothelp",
            name: "YOUR_GITHUB_ID/testing",
            icon: "question",
            topics: ["chitchat", "bots", "bot-development", "camperbot"]
        },

        {
            title: "bothelp",
            name: "bothelp/testing",
            icon: "question",
            topics: ["chitchat", "bots", "bot-development", "camperbot"]
        }
    ],

    // this is the demobot that ships with the app
    demobot: [{
        title: "demobot",
        name: "demobot/test",
        icon: "star",
        topics: ["getting started"]
    }],

    // developer bot
    bothelp: [

        {
            title: "bothelp",
            name: "bothelp/testing",
            icon: "question",
            topics: ["chitchat", "bots", "bot-development", "camperbot"]
        },

        {
            title: "HelpBonfires",
            icon: "fire",
            name: "bothelp/HelpBonfires",
            topics: bonfireTopics
        },

        {
            title: "camperbot/localdev",
            name: "camperbot/localdev"
        },

        {
            title: "bothelpDM",
            name: "bothelp",
        },

        {
            title: "GeneralChat",
            name: "bothelp/GeneralChat",
        },

        // {
        //     title: "DataScience",
        //     name: "FreeCodeCamp/DataScience",
        //     topics: ["general", "DataScience"]
        // },

        {
            title: "PrivateRoomTest",
            name: "bothelp/PrivateRoomTest",
            topics: ["general", "intros"]
        },

        {
            title: "EdaanDemo",
            name: "egetzel/demo",
            topics: ['egdemo']
        },

        // Bonfire single rooms

        {
            name: "bothelp/bonfire-factorialize-a-number",
            topics: ['bonfire factorialize a number'],
            isBonfire: true,
        },

    ],

    camperbot: camperBotRooms

};

var botname = null;

bonfireDashedNames.map(function (bfName) {
    var room = {
        name: "camperbot/" + bfName,
        isBonfire: true
    };
    BotRoomData.camperbot.push(room);
});

BotRoomData.camperbot.map(function (room) {
    room.title = room.title || room.name.split("/")[1];
    if (room.isBonfire) {
        //room.entry = "FreeCodeCamp/HelpBonfires",
        room.entry = "camperbot/testing";
        room.topic = room.title;
    }
});

RoomData = {
    rooms: function (botname) {
        botname = botname || AppConfig.getBotName();
        return BotRoomData[botname];
    },

    defaultRoom: function () {
        return RoomData.rooms().rooms[0];
    }

};

module.exports = RoomData;
