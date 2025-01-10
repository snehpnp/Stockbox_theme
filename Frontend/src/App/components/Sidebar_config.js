const Admin = [
  { label: "Dashboard", icon: "LayoutDashboard", link: "/admin/dashboard" },
  { label: "Client", icon: "Users", link: "/admin/client" },
  { label: "Client Request", icon: "UserPen", link: "/admin/clientrequest" },
  { label: "Free Trial Client", icon: "UserPen", link: "/admin/freeclient" },
  {
    label: "Plan",
    icon: "Rocket",
    subMenu: [
      { label: "Package", icon: "Repeat2", link: "/admin/plan" },
      { label: "Segment", icon: "ScatterChart", link: "/admin/service" },
      { label: "Category", icon: "ClipboardType", link: "/admin/category" },
      { label: "Free Trial Status", icon: "Boxes", link: "/admin/freetrialstatus" },
    ],
  },
  {
    label: "Basket",
    icon: "ShoppingCart",
    subMenu: [
      { label: "Basket Detail", icon: "ShoppingCart", link: "/admin/basket" },
      { label: "Basket Stock Published", icon: "Boxes", link: "/admin/basket/basketstockpublish" },
      { label: "Subscription History", icon: "FolderClock", link: "/admin/purchasebaskethistory" },
    ],
  },
  {
    label: "Signal",
    icon: "Activity",
    subMenu: [
      { label: "Open Signal", icon: "ScatterChart", link: "/admin/signal" },
      { label: "Close Signal", icon: "ScatterChart", link: "/admin/closesignal" },
    ],
  },
  { label: "Payment History", icon: "WalletCards", link: "/admin/paymenthistory" },
  { label: "Withdrawal Request", icon: "ArrowRightLeft", link: "/admin/paymentrequest" },
  { label: "Blogs", icon: "Paintbrush", link: "/admin/blogs" },
  { label: "News", icon: "Vote", link: "/admin/news" },
  { label: "Coupon", icon: "Copyright", link: "/admin/coupon" },
  { label: "Banner", icon: "Frame", link: "/admin/banner" },
  { label: "Client Plan Expiry", icon: "FolderClock", link: "/admin/planexpiry" },
  { label: "Performance", icon: "ScatterChart", link: "/admin/perfom" },
  {
    label: "Basic Settings",
    icon: "Cog",
    subMenu: [
      { label: "General Setting", icon: "Wrench", link: "/admin/generalsettings" },
      { label: "Email Setting", icon: "EthernetPort", link: "/admin/emailsetting" },
      { label: "API Information", icon: "Building2", link: "/admin/Apiinfo" },
      { label: "Payment Gateway", icon: "ArrowRightLeft", link: "/admin/paymentgeteway" },
      { label: "Email Template", icon: "ClipboardType", link: "/admin/emailtemplate" },
      { label: "Refer And Earn", icon: "HelpingHand", link: "/admin/referandearn" },
      { label: "Auto SquareOff", icon: "CandlestickChart", link: "/admin/autosquareoff" },
      { label: "Bank Detail", icon: "Wrench", link: "/admin/bankdetail" },
      { label: "QR Detail", icon: "Wrench", link: "/admin/QRdetails" },
    ],
  },
  { label: "Broadcast SMS", icon: "HelpingHand", link: "/admin/message" },
  { label: "FAQ", icon: "HelpingHand", link: "/admin/faq" },
  { label: "Help Center", icon: "HelpingHand", link: "/admin/help" },
  { label: "Policy", icon: "Wrench", link: "/admin/termsandcondtion" },
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
    link: "/user/basket/response",
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