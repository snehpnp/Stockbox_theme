const Admin = [
  {
    label: "Dashboard",
    icon: "LayoutDashboard",
    link: "/admin/dashboard",
    name: "Dashboard"
  },

  {
    label: "Client",
    icon: "Users",
    link: "/admin/client",
    name: "Client"
  },
  {
    label: "Client Request",
    icon: "UserPen",
    link: "/admin/clientrequest",
    name: "ClientRequest"
  },
  {
    label: "Free Trial Client",
    icon: "FileUser",
    link: "/admin/freeclient",
    name: "FreeTrialClient"
  },
  {
    label: "Employee",
    icon: "CircleUserRound",
    link: "/admin/staff",
    name: "Employee"
  },
  {
    label: "Plan",
    icon: "Rocket",
    children: [
      { label: "Package", icon: "Repeat2", link: "/admin/plan", name: "Package" },
      { label: "Segment", icon: "ScatterChart", link: "/admin/service", name: "Segment" },
      { label: "Category", icon: "ClipboardType", link: "/admin/category", name: "Category" },
      { label: "Free Trial Status", icon: "Boxes", link: "/admin/freetrialstatus", name: "FreeTrialStatus" },
    ],
    name: "Plan",
  },
  {
    label: "Basket",
    icon: "ShoppingCart",
    children: [
      {
        label: "Basket Detail",
        icon: "ShoppingCart",
        link: "/admin/basket",
        name: "BasketDetail"
      },
      {
        label: "Basket Stock Published",
        icon: "Boxes", link: "/admin/basket/basketstockpublish",
        name: "BasketStockPublished"
      },
      {
        label: "Subscription History",
        icon: "FolderClock",
        link: "/admin/purchasebaskethistory",
        name: "SubscriptionHistory"
      },
    ],
    name: "Basket",
  },
  {
    label: "Signal",
    icon: "Activity",
    children: [
      {
        label: "Open Signal",
        icon: "ScatterChart",
        link: "/admin/signal",
        name: "OpenSignal"
      },
      {
        label: "Close Signal",
        icon: "ScatterChart", link: "/admin/closesignal",
        name: "CloseSignal"
      },
    ],
    name: "Signal",
  },
  {
    label: "Payment History",
    icon: "WalletCards",
    link: "/admin/paymenthistory",
    name: "PaymentHistory"
  },
  {
    label: "Withdrawal Request",
    icon: "ArrowRightLeft",
    link: "/admin/paymentrequest",
    name: "WithdrawalRequest"
  },
  {
    label: "Blogs",
    icon: "Paintbrush",
    link: "/admin/blogs",
    name: "Blogs"
  },
  {
    label: "News",
    icon: "Vote",
    link: "/admin/news",
    name: "News"
  },
  {
    label: "Coupon",
    icon: "Copyright",
    link: "/admin/coupon",
    name: "Coupon"
  },
  {
    label: "Banner",
    icon: "Frame",
    link: "/admin/banner",
    name: "Banner"
  },
  {
    label: "Client Plan Expiry",
    icon: "FolderClock",
    link: "/admin/planexpiry",
    name: "ClientPlanExpiry"
  },
  {
    label: "Performance",
    icon: "ScatterChart",
    link: "/admin/perfom",
    name: "Performance"
  },
  {
    label: "Basic Settings",
    icon: "Cog",
    children: [
      {
        label: "General Setting",
        icon: "Wrench",
        link: "/admin/generalsettings",
        name: "GeneralSetting"
      },
      {
        label: "Email Setting",
        icon: "EthernetPort",
        link: "/admin/emailsetting",
        name: "EmailSetting"
      },
      {
        label: "API Information",
        icon: "Building2", link: "/admin/Apiinfo",
        name: "APIInformation"
      },
      {
        label: "Payment Gateway",
        icon: "ArrowRightLeft",
        link: "/admin/paymentgeteway",
        name: "PaymentGateway"
      },
      {
        label: "Email Template",
        icon: "ClipboardType",
        link: "/admin/emailtemplate",
        name: "EmailTemplate"
      },
      {
        label: "Refer And Earn",
        icon: "HelpingHand",
        link: "/admin/referandearn",
        name: "ReferAndEarn"
      },
      {
        label: "Auto SquareOff",
        icon: "CandlestickChart",
        link: "/admin/autosquareoff",
        name: "AutoSquareOff"
      },
      {
        label: "Bank Detail",
        icon: "Wrench",
        link: "/admin/bankdetail",
        name: "BankDetail"
      },
      {
        label: "QR Detail",
        icon: "Wrench",
        link: "/admin/QRdetails",
        name: "QRDetail"
      },
    ],
    name: "BasicSettings",
  },
  {
    label: "Order List",
    icon: "MessageCircleMore",
    link: "/admin/orderlist",
    name: "Order List"
  },
  {
    label: "Broadcast SMS",
    icon: "MessageCircleMore",
    link: "/admin/message",
    name: "BroadcastSMS"
  },
  {
    label: "FAQ",
    icon: "FileQuestion",
    link: "/admin/faq",
    name: "FAQ"
  },
  {
    label: "Help Center",
    icon: "HelpingHand",
    link: "/admin/help",
    name: "HelpCenter"
  },
  {
    label: "Policy",
    icon: "Wrench",
    link: "/admin/termsandcondtion",
    name: "Policy"
  },
];


const SuperAdmin = [
  // {
  //   name: "Dashboard",
  //   label: "Dashboard",
  //   icon: "LayoutDashboard",
  //   link: "/superadmin/dashboard",
  //   children: [],
  // },
  {
    name: "Company",
    label: "Company",
    icon: "Building2",
    link: "/superadmin/company",
    children: [],
  },
  {
    name: "Themes",
    label: "Themes",
    icon: "Paintbrush",
    link: "/superadmin/themes",
    children: [],
  },

];


const User = [
  {
    name: "Dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    link: "/user/dashboard",
    children: [],
  },
  {
    name: "Service",
    label: "Service",
    icon: "ClipboardType",
    link: "/user/service",
    children: [],
  },
  {
    name: "Trades",
    label: "Trades",
    icon: "Activity",
    link: "/user/trades",
    children: [],
  },
  {
    name: "Basket",
    label: "Basket",
    icon: "ShoppingCart",
    link: "/user/basket",
    children: [],
  },
  {
    name: "Subscription",
    label: "Subscription",
    icon: "Rocket",
    link: "/user/subscription",
    children: [],
  },
  {
    name: "Demat",
    label: "Demat",
    icon: "EthernetPort",
    link: "/user/demat",
    children: [],
  },
  // {
  //   name: "TradeResponse",
  //   label: "Trade Response",
  //   icon: "ArrowRightLeft",
  //   link: "/user/trade-response",
  //   children: [],
  // },
  {
    name: "Basket Response",
    label: "Basket Response",
    icon: "FolderClock",
    link: "/user/basket-response",
    children: [],
  },
  {
    name: "Broker Response",
    label: "Broker Response",
    icon: "FolderClock",
    link: "/user/broker-response",
    children: [],
  },
  {
    name: "Coupons",
    label: "Coupons",
    icon: "Copyright",
    link: "/user/coupons",
    children: [],
  },
  {
    name: "ReferEarn",
    label: "Refer & Earn",
    icon: "Puzzle",
    link: "/user/refer-earn",
    children: [],
  },
  {
    name: "Faqs",
    label: "Faqs",
    icon: "FileQuestion",
    link: "/user/faq",
    children: [],
  },
  {
    name: "PrivacyPolicy",
    label: "Privacy Policy",
    icon: "Wrench",
    link: "/user/privacy-policy",
    children: [],
  },
  {
    name: "TermsConditions",
    label: "Terms & Conditions",
    icon: "Wrench",
    link: "/user/terms-conditions",
    children: [],
  },
  {
    name: "HelpDesk",
    label: "Help Desk",
    icon: "HelpingHand",
    link: "/user/help-desk",
    children: [],
  },
  {
    name: "Brodcast",
    label: "Broadcast",
    icon: "MessageCircleMore",
    link: "/user/broadcast",
    children: [],
  },
  {
    name: "Notification",
    label: "Notification",
    icon: "Bell",
    link: "/user/notification",
    children: [],
  },
  {
    name: "News",
    label: "News",
    icon: "Vote",
    link: "/user/news",
    children: [],
  },
  {
    name: "Blogs",
    label: "Blogs",
    icon: "Paintbrush",
    link: "/user/blogs",
    children: [],

  }
  ,
  {
    name: "PaymentHistory",
    label: "Payment History",
    icon: "WalletCards",
    link: "/user/payment-history",
    children: [],
  },
  {
    name: "PastPerformance",
    label: "Past Performance",
    icon: "ScatterChart",
    link: "/user/past-performance",
    children: [],
  },
];


const Employee = [
  {
    label: "Dashboard",
    icon: "LayoutDashboard",
    link: "/employee/dashboard",
    name: "Dashboard"
  },

  {
    label: "Client",
    icon: "Users",
    link: "/employee/client",
    name: "Client"
  },
  {
    label: "Free Trial Client",
    icon: "UserPen",
    link: "/employee/freeclient",
    name: "FreeTrialClient"
  },
  {
    label: "Plan",
    icon: "Rocket",
    children: [
      { label: "Package", icon: "Repeat2", link: "/employee/plan", name: "Package" },
      { label: "Category", icon: "ClipboardType", link: "/employee/category", name: "Category" },

    ],
    name: "Plan",
  },
  {
    label: "Basket",
    icon: "ShoppingCart",
    children: [
      {
        label: "Basket Detail",
        icon: "ShoppingCart",
        link: "/employee/basket",
        name: "BasketDetail"
      },
      {
        label: "Basket Stock Published",
        icon: "Boxes",
        link: "/employee/basket/basketstockpublish",
        name: "BasketStockPublished"
      },
      {
        label: "Subscription History",
        icon: "FolderClock",
        link: "/employee/purchasebaskethistory",
        name: "SubscriptionHistory"
      },
    ],
    name: "Basket",
  },
  {
    label: "Signal",
    icon: "Activity",
    children: [
      {
        label: "Open Signal",
        icon: "ScatterChart",
        link: "/employee/signal",
        name: "OpenSignal"
      },
      {
        label: "Close Signal",
        icon: "ScatterChart", link: "/employee/closesignal",
        name: "CloseSignal"
      },
    ],
    name: "Signal",
  },
  {
    label: "Plan Expiry",
    icon: "FolderClock",
    link: "/employee/planexpiry",
    name: "PlanExpiry"
  },
  {
    label: "Performance",
    icon: "WalletCards",
    link: "/employee/perform",
    name: "Perform"
  },
  {
    label: "Withdrawal Request",
    icon: "ArrowRightLeft",
    link: "/employee/paymentrequest",
    name: "WithdrawalRequest"
  },
  {
    label: "Blogs",
    icon: "Paintbrush",
    link: "/employee/blogs",
    name: "Blogs"
  },
  {
    label: "News",
    icon: "Vote",
    link: "/employee/news",
    name: "News"
  },
  {
    label: "Coupon",
    icon: "Copyright",
    link: "/employee/coupon",
    name: "Coupon"
  },
  {
    label: "Banner",
    icon: "Frame",
    link: "/employee/banner",
    name: "Banner"
  },
  {
    label: "FAQ",
    icon: "HelpingHand",
    link: "/employee/faq",
    name: "FAQ"
  }
];


export { SuperAdmin, Admin, User, Employee };

