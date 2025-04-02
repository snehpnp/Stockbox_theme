import { base_url } from "./config";


export const brokerContentMap = {
    1: [
        {
            HeadingTitle: "Angel",
            disc1: "",
            disc2: "",
            disc3: "",
            describtion:
                "Kindly follow these steps to link your demat account with this Algo Software.",
            LinkOne: "https://smartapi.angelbroking.com/",
            LinkTwo: `${base_url}angelbroking/access_token?email=YOUR_PANEL_EMAIL`,
            link3: `e.g - ${base_url}angelbroking/access_token?email=ss@gmail.com`,
            Apicreate:
                "You will get API Secret Key and APP code, please Update them on your Profile in this software.",
            youTube: "https://www.youtube.com/watch?v=zI7FX-yUgyw",
            img1: "http://app.smartalgo.in/assets/dist/img/angel/angel1.png",
            img2: "http://app.smartalgo.in/assets/dist/img/angel/angel2.png",
            img3: "http://app.smartalgo.in/assets/dist/img/angel/angel3.png",
        }
    ],
    2: [
        {
            HeadingTitle: "Alice Blue",
            disc1: "",
            disc2: "",
            disc3: "",
            describtion:
                "Kindly follow these steps to link your demat account with this Algo Software.",
            LinkOne: "https://ant.aliceblueonline.com/?appcode=G9EOSWCEIF9ARCB",
            LinkTwo: `${base_url}AliceBlue`,
            link3: `${base_url}aliceblue/access_token?email=ss@gmail.com`,
            Apicreate:
                "You will get APP code and Secret Key, please Update them on your Profile in this software.",
            youTube: "https://www.youtube.com/watch?v=DEKgwveZ9eM",
            img1: "http://app.smartalgo.in/assets/dist/img/aliceblue/aliceblue1.png",
            img2: "http://app.smartalgo.in/assets/dist/img/aliceblue/aliceblue2.png",
            img3: "",
        }
    ],
    3: [
        {
            HeadingTitle: "Kotak Neo",
            disc1: "",
            disc2: "",
            disc3: "",
            describtion:
                "Please Update CONSUMER KEY, CONSUMER SECRET, USERNAME and TRADE API PASSWORD for all these details please contact with Kotak Neo broker then Submit And Login With Api Trading On...",
            LinkOne: "https://neo.kotaksecurities.com/Login",
            img1: "http://app.smartalgo.in/assets/dist/img/kotakneo/kotakneo.png",
            img3: "http://app.smartalgo.in/assets/dist/img/kotak/kotak2.png",
            Apicreate:
                "You will get Api Secret Key And App key please Update this detail in your Profile.",
        },
    ],
    4: [
        {
            HeadingTitle: "Market Hub",
            disc1: "",
            disc2: "",
            disc3: "",
            describtion:
                "Please Update CLIENT CODE , PASSWORD CODE And VERIFICATION CODE for all these details please contact with Market hub broker then Submit  And  Login With Api Trading On...",
            // LinkOne: "https://www.5paisa.com/developerapi/authorization",
            // LinkTwo: "encryption key 5 paisa :- vEhJgDxk3PJbRqhK5b2BrA80ez5aJY8x",
            // Apicreate:'you will get Api Secret Key And App id please Update this detail in your Profile...'
        },
    ],

    5: [
        {
            HeadingTitle: "Zerodha",
            disc1: "",
            disc2: "",
            disc3: "",
            describtion:
                "Kindly follow these steps to link your demat account with this Algo Software.",
            LinkOne: " https://kite.trade/",
            LinkTwo: `${base_url}zerodha/access_token?email=YOUR_PANEL_EMAIL`,
            link3: `e.g - ${base_url}zerodha/access_token?email=ss@gmail.com`,
            Apicreate:
                "You will get API Secret Key and APP code and Update them on your Profile in this software.",
        },
    ],
    6: [
        {
            HeadingTitle: "Upstox",
            disc1: "",
            disc2: "",
            disc3: "",
            describtion: `Click below link to generate API KEY and SECRET KEY after login to below page you will see New App button click on that button and put your Redirect URL in url field and continue after this process you will get your API and SECRET Keys`,
            LinkOne: "https://account.upstox.com/developer/apps",
            LinkTwo: `${base_url}upstox/access_token`,
            img1: "http://app.smartalgo.in/assets/dist/img/upstox/upstoxgenerateapikeyandsecretkey.png",
            img2: "http://app.smartalgo.in/assets/dist/img/upstox/upstoxredirecturl.png",
        },
    ],
    7: [
        {
            HeadingTitle: "Dhan",
            disc1: "",
            disc2: "",
            disc3: "",
            describtion: `For CLIENT ID and ACCESS TOKEN go to your My Profile Dhan and click on "DhanHQ Trading APIs & Access" to generate ACCESS TOKEN and also select 30 days validity to expiry for token, You will get your Client Id in Profile and Access Token DhanHQTrading APIs & Access.`,
            LinkOne: "https://dhan.co/",
            // LinkTwo: `${Config.broker_redirect_url}icicidirect/access_token`,
            img1: "http://app.smartalgo.in/assets/dist/img/dhan/dhanaccestoken.png",
        },
    ],



};