import { base_url } from "./config";
const angleredirecturl = localStorage.getItem("angleredirecturl");
const aliceredirecturl = localStorage.getItem("aliceredirecturl");
const upstoxredirecturl = localStorage.getItem("upstoxredirecturl");
const zerodharedirecturl = localStorage.getItem("zerodharedirecturl");




export const brokerContentMap = {



    1: [
        {
            HeadingTitle: "Angel",
            header: "Kindly follow these steps to link your demat account",
            step1: "Step 1 : Click below link and Login",
            LinkOne: "https://smartapi.angelbroking.com/",
            step2: "Step 2 : Enter your Details and the Redirect URL which is given below.",
            redirectUrl: angleredirecturl,

        }
    ],
    2: [
        {
            HeadingTitle: "Alice Blue",
            header: "Kindly follow these steps to link your demat account",
            step1: "Step 1 : Click below link and Login",
            LinkOne: "https://ant.aliceblueonline.com/?appcode=G9EOSWCEIF9ARCB",
            step2: "Step 2 : Enter your Details and the Redirect URL which is given below.",
            redirectUrl: aliceredirecturl,
        }
    ],
    3: [
        {
            HeadingTitle: "Kotak Neo",
            header: "Kindly follow these steps to link your demat account",
            step1: "Step 1 : Click below link and Login",
            LinkOne: "https://neo.kotaksecurities.com/Login",
            step2: "Step 2 : Enter your Details and the Redirect URL which is given below.",
            redirectUrl: "",
        },
    ],
    4: [
        {
            HeadingTitle: "Market Hub",
            header: "Kindly follow these steps to link your demat account",
            step1: "Step 1 : Click below link and Login",
            LinkOne: "https://neo.kotaksecurities.com/Login",
            step2: "Step 2 : Enter your Details and the Redirect URL which is given below.",
            redirectUrl: "",
        },
    ],

    5: [
        {
            HeadingTitle: "Zerodha",
            header: "Kindly follow these steps to link your demat account",
            step1: "Step 1 : Click below link and Login",
            LinkOne: "https://kite.trade/",
            step2: "Step 2 : Enter your Details and the Redirect URL which is given below.",
            redirectUrl: zerodharedirecturl,
        },
    ],
    6: [
        {
            HeadingTitle: "Upstox",
            header: "Kindly follow these steps to link your demat account",
            step1: "Step 1 : Click below link and Login",
            LinkOne: "https://account.upstox.com/developer/apps",
            step2: "Step 2 : Enter your Details and the Redirect URL which is given below.",
            redirectUrl: upstoxredirecturl,
        },
    ],
    7: [
        {
            HeadingTitle: "Dhan",
            header: "Kindly follow these steps to link your demat account",
            step1: "Step 1 : Click below link and Login",
            LinkOne: "https://dhan.co/",
            step2: "Step 2 : Enter your Details and the Redirect URL which is given below.",
            redirectUrl: "",

        },
    ],



};