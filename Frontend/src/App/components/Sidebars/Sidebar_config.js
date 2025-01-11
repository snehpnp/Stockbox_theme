const Admin = [
  { label: "Dashboard", icon: "LayoutDashboard", link: "/admin/dashboard", name: "Dashboard" },
  { label: "Client", icon: "Users", link: "/admin/client", name: "Client" },
  { label: "Client Request", icon: "UserPen", link: "/admin/clientrequest", name: "ClientRequest" },
  { label: "Free Trial Client", icon: "UserPen", link: "/admin/freeclient", name: "FreeTrialClient" },
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
      { label: "Basket Detail", icon: "ShoppingCart", link: "/admin/basket", name: "BasketDetail" },
      { label: "Basket Stock Published", icon: "Boxes", link: "/admin/basket/basketstockpublish", name: "BasketStockPublished" },
      { label: "Subscription History", icon: "FolderClock", link: "/admin/purchasebaskethistory", name: "SubscriptionHistory" },
    ],
    name: "Basket",
  },
  {
    label: "Signal",
    icon: "Activity",
    children: [
      { label: "Open Signal", icon: "ScatterChart", link: "/admin/signal", name: "OpenSignal" },
      { label: "Close Signal", icon: "ScatterChart", link: "/admin/closesignal", name: "CloseSignal" },
    ],
    name: "Signal",
  },
  { label: "Payment History", icon: "WalletCards", link: "/admin/paymenthistory", name: "PaymentHistory" },
  { label: "Withdrawal Request", icon: "ArrowRightLeft", link: "/admin/paymentrequest", name: "WithdrawalRequest" },
  { label: "Blogs", icon: "Paintbrush", link: "/admin/blogs", name: "Blogs" },
  { label: "News", icon: "Vote", link: "/admin/news", name: "News" },
  { label: "Coupon", icon: "Copyright", link: "/admin/coupon", name: "Coupon" },
  { label: "Banner", icon: "Frame", link: "/admin/banner", name: "Banner" },
  { label: "Client Plan Expiry", icon: "FolderClock", link: "/admin/planexpiry", name: "ClientPlanExpiry" },
  { label: "Performance", icon: "ScatterChart", link: "/admin/perfom", name: "Performance" },
  {
    label: "Basic Settings",
    icon: "Cog",
    children: [
      { label: "General Setting", icon: "Wrench", link: "/admin/generalsettings", name: "GeneralSetting" },
      { label: "Email Setting", icon: "EthernetPort", link: "/admin/emailsetting", name: "EmailSetting" },
      { label: "API Information", icon: "Building2", link: "/admin/Apiinfo", name: "APIInformation" },
      { label: "Payment Gateway", icon: "ArrowRightLeft", link: "/admin/paymentgeteway", name: "PaymentGateway" },
      { label: "Email Template", icon: "ClipboardType", link: "/admin/emailtemplate", name: "EmailTemplate" },
      { label: "Refer And Earn", icon: "HelpingHand", link: "/admin/referandearn", name: "ReferAndEarn" },
      { label: "Auto SquareOff", icon: "CandlestickChart", link: "/admin/autosquareoff", name: "AutoSquareOff" },
      { label: "Bank Detail", icon: "Wrench", link: "/admin/bankdetail", name: "BankDetail" },
      { label: "QR Detail", icon: "Wrench", link: "/admin/QRdetails", name: "QRDetail" },
    ],
    name: "BasicSettings",
  },
  { label: "Broadcast SMS", icon: "HelpingHand", link: "/admin/message", name: "BroadcastSMS" },
  { label: "FAQ", icon: "HelpingHand", link: "/admin/faq", name: "FAQ" },
  { label: "Help Center", icon: "HelpingHand", link: "/admin/help", name: "HelpCenter" },
  { label: "Policy", icon: "Wrench", link: "/admin/termsandcondtion", name: "Policy" },
];


const SuperAdmin = [
  {
    name: "Dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    link: "/superadmin/dashboard",
    children: [],
  },
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
  {
    name: "TradeResponse",
    label: "Trade Response",
    icon: "ArrowRightLeft",
    link: "/user/trade-response",
    children: [],
  },
  {
    name: "BasketResponse",
    label: "Basket Response",
    icon: "FolderClock",
    link: "/user/basket_response/basket_response",
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
    icon: "HelpingHand",
    link: "/user/refer-earn",
    children: [],
  },
  {
    name: "Faqs",
    label: "Faqs",
    icon: "HelpingHand",
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
    icon: "HelpingHand",
    link: "/user/brodcast",
    children: [],
  },
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


export { SuperAdmin, Admin,User};
















// const Admin = [
//   {
//     name: "Dashboard",
//     label: "Dashboard",
//     icon: "LayoutDashboard",
//     link: "/dashboard",
//     children: [],
//   },
//   {
//     name: "Services",
//     label: "Dashboard",
//     icon: "Wrench",
//     link: "/services",
//     children: [],
//   },
//   {
//     name: "Users",
//     label: "Users",
//     icon: "Users",
//     link: "/users",
//     children: [
//       {
//         name: "All Users",
//         label: "All Users",
//         icon: "Users",
//         link: "/users",
//       },
//       {
//         name: "Add User",
//         label: "Add User",
//         icon: "UserRoundPlus",
//         link: "/users/add",
//       },
//       {
//         name: "Edit User",
//         label: "Edit User",
//         icon: "UserPen",
//         link: "/users/edit/:id",
//       },
//     ],
//   },
//   // {
//   //   name: "Tables",
//   //   label: "Tables",
//   //   icon: "FolderClock",
//   //   link: "/tables",
//   //   children: [
//   //     {
//   //       name: "Basic Table",
//   //       label: "Basic Table",
//   //       icon: "FolderClock",
//   //       link: "/tables/basic",
//   //     },
//   //     {
//   //       name: "React Table",
//   //       label: "React Table",
//   //       icon: "FolderClock",
//   //       link: "/tables/reacttable",
//   //     },
//   //     {
//   //       name: "Bordered Table",
//   //       label: "Bordered Table",
//   //       icon: "FolderClock",
//   //       link: "/tables/bordered",
//   //     },
//   //     {
//   //       name: "Striped Table",
//   //       label: "Striped Table",
//   //       icon: "FolderClock",
//   //       link: "/tables/striped",
//   //     },
//   //     {
//   //       name: "Hover Table",
//   //       label: "Hover Table",
//   //       icon: "FolderClock",
//   //       link: "/tables/hover",
//   //     },
//   //     {
//   //       name: "Card Table",
//   //       label: "Card Table",
//   //       icon: "FolderClock",
//   //       link: "/tables/card",
//   //     },
//   //   ],
//   // },
//   // {
//   //   name: "Charts",
//   //   label: "Charts",
//   //   icon: "CandlestickChart",
//   //   link: "/charts",
//   //   children: [],
//   // },
//   // {
//   //   name: "Modals",
//   //   label: "Modals",
//   //   icon: "EthernetPort",
//   //   link: "/modals",
//   //   children: [],
//   // },
//   // {
//   //   name: "Forms",
//   //   label: "Forms",
//   //   icon: "ClipboardType",
//   //   link: "/forms",
//   //   children: [
//   //     {
//   //       name: "Basic Form",
//   //       label: "Basic Form",
//   //       icon: "ClipboardType",
//   //       link: "/forms/classic",
//   //     },
//   //     {
//   //       name: "Modern Form",
//   //       label: "Modern Form",
//   //       icon: "ClipboardType",
//   //       link: "/forms/modern",
//   //     },
//   //     {
//   //       name: "Glassmorphism Form",
//   //       label: "Glassmorphism Form",
//   //       icon: "ClipboardType",
//   //       link: "/forms/glassmorphism",
//   //     },
//   //     {
//   //       name: "Floating Form",
//   //       label: "Floating Form",
//   //       icon: "ClipboardType",
//   //       link: "/forms/floating",
//   //     },
//   //     {
//   //       name: "Dark Theme Form",
//   //       label: "Dark Theme Form",
//   //       icon: "ClipboardType",
//   //       link: "/forms/darktheme",
//   //     },
//   //   ],
//   // },
//   // {
//   //   name: "Products",
//   //   label: "Products",
//   //   icon: "ShoppingCart",
//   //   link: "/products",
//   //   children: [],
//   // },
//   // {
//   //   name: "Settings",
//   //   label: "Settings",
//   //   icon: "Cog",
//   //   link: "/settings",
//   //   children: [],
//   // },
//   {
//     name: "Themes",
//     label: "Themes",
//     icon: "Cog",
//     link: "/themes",
//     children: [],
//   },
//   {
//     name: "Themes",
//     label: "Themes",
//     icon: "Cog",
//     link: "/themes",
//     children: [],
//   },
// ];