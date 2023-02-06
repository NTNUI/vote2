const countryCodes = [
  {
    land: "Afghanistan",
    kode: "93",
  },
  {
    land: "Albania",
    kode: "355",
  },
  {
    land: "Algerie",
    kode: "213",
  },
  {
    land: "Andorra",
    kode: "376",
  },
  {
    land: "Angola",
    kode: "244",
  },
  {
    land: "Anguilla (Leeward-øyene)",
    kode: "1264",
  },
  {
    land: "Antigua & Barbuda (Leewardøyene)",
    kode: "1268",
  },
  {
    land: "Argentina",
    kode: "54",
  },
  {
    land: "Armenia",
    kode: "374",
  },
  {
    land: "Aruba",
    kode: "297",
  },
  {
    land: "Ascension",
    kode: "247",
  },
  {
    land: "Aserbajdsjan",
    kode: "994",
  },
  {
    land: "Australia",
    kode: "61",
  },
  {
    land: "Bahamas",
    kode: "1242",
  },
  {
    land: "Bahrain",
    kode: "973",
  },
  {
    land: "Bangladesh",
    kode: "880",
  },
  {
    land: "Barbados",
    kode: "1246",
  },
  {
    land: "Belgia",
    kode: "32",
  },
  {
    land: "Belize",
    kode: "501",
  },
  {
    land: "Benin",
    kode: "229",
  },
  {
    land: "Bermuda",
    kode: "1441",
  },
  {
    land: "Bhutan",
    kode: "975",
  },
  {
    land: "Bolivia",
    kode: "591",
  },
  {
    land: "Bosnia-Hercegovina",
    kode: "387",
  },
  {
    land: "Botswana",
    kode: "267",
  },
  {
    land: "Brasil",
    kode: "55",
  },
  {
    land: "Brunei",
    kode: "673",
  },
  {
    land: "Bulgaria",
    kode: "359",
  },
  {
    land: "Burkina Faso",
    kode: "226",
  },
  {
    land: "Burundi",
    kode: "257",
  },
  {
    land: "Canada",
    kode: "1",
  },
  {
    land: "Cayman-øyene",
    kode: "1345",
  },
  {
    land: "Chile",
    kode: "56",
  },
  {
    land: "Colombia",
    kode: "57",
  },
  {
    land: "Cook-øyene",
    kode: "682",
  },
  {
    land: "Costa Rica",
    kode: "506",
  },
  {
    land: "Cuba",
    kode: "53",
  },
  {
    land: "Danmark",
    kode: "45",
  },
  {
    land: "De Forente Arabiske Emirater",
    kode: "971",
  },
  {
    land: "De Nederlandske Antiller",
    kode: "599",
  },
  {
    land: "Den Demokratiske Republikk Kongo (Zaire)",
    kode: "243",
  },
  {
    land: "Den Dominikanske Republikk",
    kode: "1809",
  },
  {
    land: "Den Sentralafrikanske Rep.",
    kode: "236",
  },
  {
    land: "Diego Garcia",
    kode: "246",
  },
  {
    land: "Djibouti",
    kode: "253",
  },
  {
    land: "Dominica (Winward-øyene)",
    kode: "1767",
  },
  {
    land: "Ecuador",
    kode: "593",
  },
  {
    land: "Egypt",
    kode: "20",
  },
  {
    land: "Ekvatorial-Guinea",
    kode: "240",
  },
  {
    land: "El Salvador",
    kode: "503",
  },
  {
    land: "Elfenbenskysten",
    kode: "225",
  },
  {
    land: "England",
    kode: "44",
  },
  {
    land: "Eritrea",
    kode: "291",
  },
  {
    land: "Estland",
    kode: "372",
  },
  {
    land: "Etiopia",
    kode: "251",
  },
  {
    land: "Falklandsøyene",
    kode: "500",
  },
  {
    land: "Fiji",
    kode: "679",
  },
  {
    land: "Filippinene",
    kode: "63",
  },
  {
    land: "Finland",
    kode: "358",
  },
  {
    land: "Frankrike",
    kode: "33",
  },
  {
    land: "Fransk Guyana",
    kode: "594",
  },
  {
    land: "Fransk Polynesia",
    kode: "689",
  },
  {
    land: "Færøyene",
    kode: "298",
  },
  {
    land: "Gabon",
    kode: "241",
  },
  {
    land: "Gambia",
    kode: "220",
  },
  {
    land: "Gaza & Khan Younes",
    kode: "9708",
  },
  {
    land: "Georgia",
    kode: "995",
  },
  {
    land: "Ghana",
    kode: "233",
  },
  {
    land: "Gibraltar",
    kode: "350",
  },
  {
    land: "Grenada (Winwardøyene)",
    kode: "1473",
  },
  {
    land: "Grønland",
    kode: "299",
  },
  {
    land: "Guadelope",
    kode: "590",
  },
  {
    land: "Guam",
    kode: "671",
  },
  {
    land: "Guatemala",
    kode: "502",
  },
  {
    land: "Guinea",
    kode: "224",
  },
  {
    land: "Guinea Bissau",
    kode: "245",
  },
  {
    land: "Guyana",
    kode: "592",
  },
  {
    land: "Haiti",
    kode: "509",
  },
  {
    land: "Hellas",
    kode: "30",
  },
  {
    land: "Holland",
    kode: "31",
  },
  {
    land: "Honduras",
    kode: "504",
  },
  {
    land: "Hong Kong",
    kode: "852",
  },
  {
    land: "Hviterussland",
    kode: "375",
  },
  {
    land: "India",
    kode: "91",
  },
  {
    land: "Indonesia",
    kode: "62",
  },
  {
    land: "Irak",
    kode: "964",
  },
  {
    land: "Iran",
    kode: "98",
  },
  {
    land: "Irland",
    kode: "353",
  },
  {
    land: "Island",
    kode: "354",
  },
  {
    land: "Israel",
    kode: "972",
  },
  {
    land: "Italia",
    kode: "39",
  },
  {
    land: "Jamaica",
    kode: "1876",
  },
  {
    land: "Japan",
    kode: "81",
  },
  {
    land: "Jomfruøyene - Brit.",
    kode: "1284",
  },
  {
    land: "Jomfruøyene - US",
    kode: "1340",
  },
  {
    land: "Jordan",
    kode: "962",
  },
  {
    land: "Kambodia",
    kode: "855",
  },
  {
    land: "Kamerun",
    kode: "237",
  },
  {
    land: "Kapp Verde-øyene",
    kode: "238",
  },
  {
    land: "Kazakhstan",
    kode: "7",
  },
  {
    land: "Kenya",
    kode: "254",
  },
  {
    land: "Kina (folkerep.)",
    kode: "86",
  },
  {
    land: "Kirghistan",
    kode: "996",
  },
  {
    land: "Kiribati",
    kode: "686",
  },
  {
    land: "Komorene",
    kode: "269",
  },
  {
    land: "Kongo",
    kode: "242",
  },
  {
    land: "Korea, Nord",
    kode: "850",
  },
  {
    land: "Korea, Sør",
    kode: "82",
  },
  {
    land: "Kosovo",
    kode: "383",
  },
  {
    land: "Kroatia",
    kode: "385",
  },
  {
    land: "Kuwait",
    kode: "965",
  },
  {
    land: "Kypros (Nord)",
    kode: "357",
  },
  {
    land: "Kypros (Sør)",
    kode: "357",
  },
  {
    land: "Laos",
    kode: "856",
  },
  {
    land: "Latvia",
    kode: "371",
  },
  {
    land: "Lesotho",
    kode: "266",
  },
  {
    land: "Libanon",
    kode: "961",
  },
  {
    land: "Liberia",
    kode: "231",
  },
  {
    land: "Libya",
    kode: "218",
  },
  {
    land: "Liechtenstein",
    kode: "41",
  },
  {
    land: "Litauen",
    kode: "370",
  },
  {
    land: "Luxembourg",
    kode: "352",
  },
  {
    land: "Macau",
    kode: "853",
  },
  {
    land: "Madagaskar",
    kode: "261",
  },
  {
    land: "Makedonia",
    kode: "389",
  },
  {
    land: "Malawi",
    kode: "265",
  },
  {
    land: "Malaysia",
    kode: "60",
  },
  {
    land: "Maldivene",
    kode: "960",
  },
  {
    land: "Mali",
    kode: "223",
  },
  {
    land: "Malta",
    kode: "356",
  },
  {
    land: "Marokko",
    kode: "212",
  },
  {
    land: "Marshalløyene",
    kode: "692",
  },
  {
    land: "Martinique",
    kode: "596",
  },
  {
    land: "Mauritania",
    kode: "222",
  },
  {
    land: "Mauritius",
    kode: "230",
  },
  {
    land: "Mexico",
    kode: "52",
  },
  {
    land: "Midway",
    kode: "808",
  },
  {
    land: "Mikronesia",
    kode: "691",
  },
  {
    land: "Moldova",
    kode: "373",
  },
  {
    land: "Monaco",
    kode: "377",
  },
  {
    land: "Mongolia",
    kode: "976",
  },
  {
    land: "Montserrat (Leeward-øyene)",
    kode: "1664",
  },
  {
    land: "Mosambik",
    kode: "258",
  },
  {
    land: "Myanmar (Burma)",
    kode: "95",
  },
  {
    land: "Namibia",
    kode: "264",
  },
  {
    land: "Nauru",
    kode: "674",
  },
  {
    land: "Nederland",
    kode: "31",
  },
  {
    land: "Nepal",
    kode: "977",
  },
  {
    land: "New Zealand",
    kode: "64",
  },
  {
    land: "Nicaragua",
    kode: "505",
  },
  {
    land: "Niger",
    kode: "227",
  },
  {
    land: "Nigeria",
    kode: "234",
  },
  {
    land: "Niue",
    kode: "683",
  },
  {
    land: "Norge",
    kode: "47",
  },
  {
    land: "Norfolk-øyene",
    kode: "672",
  },
  {
    land: "Ny Caledonia",
    kode: "687",
  },
  {
    land: "Oman",
    kode: "968",
  },
  {
    land: "Pakistan",
    kode: "92",
  },
  {
    land: "Palau",
    kode: "608",
  },
  {
    land: "Palestina",
    kode: "970",
  },
  {
    land: "Panama",
    kode: "507",
  },
  {
    land: "Papua - Ny Guinea",
    kode: "675",
  },
  {
    land: "Paraguay",
    kode: "595",
  },
  {
    land: "Peru",
    kode: "51",
  },
  {
    land: "Polen",
    kode: "48",
  },
  {
    land: "Portugal",
    kode: "351",
  },
  {
    land: "Puerto Rico",
    kode: "1787",
  },
  {
    land: "Quatar",
    kode: "974",
  },
  {
    land: "Reunion",
    kode: "262",
  },
  {
    land: "Romania",
    kode: "40",
  },
  {
    land: "Russland",
    kode: "7",
  },
  {
    land: "Rwanda",
    kode: "250",
  },
  {
    land: "Saipan",
    kode: "1670",
  },
  {
    land: "Salomon-øyene",
    kode: "677",
  },
  {
    land: "Samoa - US",
    kode: "684",
  },
  {
    land: "Samoa - West",
    kode: "685",
  },
  {
    land: "San Marino",
    kode: "378",
  },
  {
    land: "Sao Tome & Principe",
    kode: "239",
  },
  {
    land: "Satellitt-Emast",
    kode: "88213",
  },
  {
    land: "Satellitt-GlobalStar",
    kode: "8818",
  },
  {
    land: "Satellitt-Inmarsat A",
    kode: "870-4",
  },
  {
    land: "Satellitt-Inmarsat B/M",
    kode: "870-4",
  },
  {
    land: "Satellitt-Iridium 8816",
    kode: "8816",
  },
  {
    land: "Satellitt-Iridium 8817",
    kode: "8817",
  },
  {
    land: "Satellitt-MCP",
    kode: "88232",
  },
  {
    land: "Satellitt-Thuarya",
    kode: "88216",
  },
  {
    land: "Saudi Arabia",
    kode: "966",
  },
  {
    land: "Senegal",
    kode: "221",
  },
  {
    land: "Serbia og Montenegro",
    kode: "381",
  },
  {
    land: "Seychellene",
    kode: "248",
  },
  {
    land: "Sierra Leone",
    kode: "232",
  },
  {
    land: "Singapore",
    kode: "65",
  },
  {
    land: "Slovakia",
    kode: "421",
  },
  {
    land: "Slovenia",
    kode: "386",
  },
  {
    land: "Somalia",
    kode: "252",
  },
  {
    land: "Spania",
    kode: "34",
  },
  {
    land: "Sri Lanka",
    kode: "94",
  },
  {
    land: "St. Helena",
    kode: "290",
  },
  {
    land: "St. Kitts & Nevis (Leeward-øyene)",
    kode: "1869",
  },
  {
    land: "St. Lucia (Winward-øyene)",
    kode: "1758",
  },
  {
    land: "St. Pierre & Miquelon",
    kode: "508",
  },
  {
    land: "St. Vincent (Winward-øyene)",
    kode: "1809",
  },
  {
    land: "Storbritannia",
    kode: "44",
  },
  {
    land: "Sudan",
    kode: "249",
  },
  {
    land: "Surinam",
    kode: "597",
  },
  {
    land: "Sveits",
    kode: "41",
  },
  {
    land: "Sverige",
    kode: "46",
  },
  {
    land: "Swaziland",
    kode: "268",
  },
  {
    land: "Syria",
    kode: "963",
  },
  {
    land: "Sør-Afrika Republikken",
    kode: "27",
  },
  {
    land: "Sør-Sudan",
    kode: "211",
  },
  {
    land: "Tadzjikistan",
    kode: "992",
  },
  {
    land: "Taiwan",
    kode: "886",
  },
  {
    land: "Tanzania",
    kode: "255",
  },
  {
    land: "Thailand",
    kode: "66",
  },
  {
    land: "Togo",
    kode: "228",
  },
  {
    land: "Tonga",
    kode: "676",
  },
  {
    land: "Trinidad & Tobago",
    kode: "1868",
  },
  {
    land: "Tristan da Cunha",
    kode: "2908",
  },
  {
    land: "Tsjad",
    kode: "235",
  },
  {
    land: "Tsjekkia",
    kode: "420",
  },
  {
    land: "Tunisia",
    kode: "216",
  },
  {
    land: "Turcs- & Caicos-øyene",
    kode: "1649",
  },
  {
    land: "Turkmenistan",
    kode: "993",
  },
  {
    land: "Tuvalu",
    kode: "688",
  },
  {
    land: "Tyrkia",
    kode: "90",
  },
  {
    land: "Tyskland",
    kode: "49",
  },
  {
    land: "Uganda",
    kode: "256",
  },
  {
    land: "Ukraina",
    kode: "380",
  },
  {
    land: "Ungarn",
    kode: "36",
  },
  {
    land: "Uruguay",
    kode: "598",
  },
  {
    land: "USA",
    kode: "1",
  },
  {
    land: "Uzbekistan",
    kode: "998",
  },
  {
    land: "Vanuatu",
    kode: "678",
  },
  {
    land: "Venezuela",
    kode: "58",
  },
  {
    land: "Vietnam",
    kode: "84",
  },
  {
    land: "Yemen",
    kode: "967",
  },
  {
    land: "Zambia",
    kode: "260",
  },
  {
    land: "Zimbabwe",
    kode: "263",
  },
  {
    land: "Østerrike",
    kode: "43",
  },
];

export default countryCodes;
