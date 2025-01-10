

const Admin = [
  {
    name: "Dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    link: "/dashboard",
    children: [],
  },
  {
    name: "Services",
    label: "Dashboard",
    icon: "Wrench",
    link: "/services",
    children: [],
  },
  {
    name: "Users",
    label: "Users",
    icon: "Users",
    link: "/users",
    children: [
      {
        name: "All Users",
        label: "All Users",
        icon: "Users",
        link: "/users",
      },
      {
        name: "Add User",
        label: "Add User",
        icon: "UserRoundPlus",
        link: "/users/add",
      },
      {
        name: "Edit User",
        label: "Edit User",
        icon: "UserPen",
        link: "/users/edit/:id",
      },
    ],
  },
  // {
  //   name: "Tables",
  //   label: "Tables",
  //   icon: "FolderClock",
  //   link: "/tables",
  //   children: [
  //     {
  //       name: "Basic Table",
  //       label: "Basic Table",
  //       icon: "FolderClock",
  //       link: "/tables/basic",
  //     },
  //     {
  //       name: "React Table",
  //       label: "React Table",
  //       icon: "FolderClock",
  //       link: "/tables/reacttable",
  //     },
  //     {
  //       name: "Bordered Table",
  //       label: "Bordered Table",
  //       icon: "FolderClock",
  //       link: "/tables/bordered",
  //     },
  //     {
  //       name: "Striped Table",
  //       label: "Striped Table",
  //       icon: "FolderClock",
  //       link: "/tables/striped",
  //     },
  //     {
  //       name: "Hover Table",
  //       label: "Hover Table",
  //       icon: "FolderClock",
  //       link: "/tables/hover",
  //     },
  //     {
  //       name: "Card Table",
  //       label: "Card Table",
  //       icon: "FolderClock",
  //       link: "/tables/card",
  //     },
  //   ],
  // },
  // {
  //   name: "Charts",
  //   label: "Charts",
  //   icon: "CandlestickChart",
  //   link: "/charts",
  //   children: [],
  // },
  // {
  //   name: "Modals",
  //   label: "Modals",
  //   icon: "EthernetPort",
  //   link: "/modals",
  //   children: [],
  // },
  // {
  //   name: "Forms",
  //   label: "Forms",
  //   icon: "ClipboardType",
  //   link: "/forms",
  //   children: [
  //     {
  //       name: "Basic Form",
  //       label: "Basic Form",
  //       icon: "ClipboardType",
  //       link: "/forms/classic",
  //     },
  //     {
  //       name: "Modern Form",
  //       label: "Modern Form",
  //       icon: "ClipboardType",
  //       link: "/forms/modern",
  //     },
  //     {
  //       name: "Glassmorphism Form",
  //       label: "Glassmorphism Form",
  //       icon: "ClipboardType",
  //       link: "/forms/glassmorphism",
  //     },
  //     {
  //       name: "Floating Form",
  //       label: "Floating Form",
  //       icon: "ClipboardType",
  //       link: "/forms/floating",
  //     },
  //     {
  //       name: "Dark Theme Form",
  //       label: "Dark Theme Form",
  //       icon: "ClipboardType",
  //       link: "/forms/darktheme",
  //     },
  //   ],
  // },
  // {
  //   name: "Products",
  //   label: "Products",
  //   icon: "ShoppingCart",
  //   link: "/products",
  //   children: [],
  // },
  // {
  //   name: "Settings",
  //   label: "Settings",
  //   icon: "Cog",
  //   link: "/settings",
  //   children: [],
  // },
  {
    name: "Themes",
    label: "Themes",
    icon: "Cog",
    link: "/themes",
    children: [],
  }
];

export { Admin };
