// Sidebar imports
import{
    UilEstate,
    UilClipboardAlt,
    UilUsersAlt,
    UilPackage,
    UilChart,
    UilSignOutAlt,
    UilUsdSquare,
    UilMoneyWithdrawal
} from "@iconscout/react-unicons";



// Analytics Cards Data
export const CardsData = [
    {
      title: "Air Quality",
      color: {
        backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      },
      barValue: 70,
      value: "25,970",
      png: UilUsdSquare,
      series: [
        {
          name: "Air Quality",
          data: [31, 40, 28, 51, 42, 109, 100],
        },
      ],
    },
    {
      title: "Temperature",
      color: {
        backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
        boxShadow: "0px 10px 20px 0px #FDC0C7",
      },
      barValue: 80,
      value: "14,270",
      png: UilMoneyWithdrawal,
      series: [
        {
          name: "Temperature",
          data: [10, 100, 50, 70, 80, 30, 40],
        },
      ],
    },
    {
      title: "Light",
      color: {
        backGround:
          "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
        boxShadow: "0px 10px 20px 0px #F9D59B",
      },
      barValue: 60,
      value: "4,270",
      png: UilClipboardAlt,
      series: [
        {
          name: "Light",
          data: [10, 25, 15, 30, 12, 15, 20],
        },
      ],
    },
  ];

  // Recent Update Card Data
export const UpdatesData = [
  {
    name: "Temperature",
    noti: "has decreased.",
    time: "25 seconds ago",
  },
  {
    name: "Light",
    noti: "has been lit.",
    time: "30 minutes ago",
  },
  {
    name: "Air Quality",
    noti: "has been purified.",
    time: "2 hours ago",
  },
  {
    name: "Carbon Dioxide",
    noti: "has cleaned.",
    time: "2 hours ago",
  },
  {
    name: "Smog",
    noti: "has no detections.",
    time: "2 hours ago",
  },
  {
    name: "Head Count",
    noti: "has been captured.",
    time: "2 hours ago",
  },
];

// mock data Team
export const mockDataTeam = [
  {
    id: 1,
    name: "Jon Snow",
    email: "jonsnow@gmail.com",
    age: 35,
    phone: "(665)121-5454",
    access: "admin",
  },
  {
    id: 2,
    name: "Cersei Lannister",
    email: "cerseilannister@gmail.com",
    age: 42,
    phone: "(421)314-2288",
    access: "manager",
  },
  {
    id: 3,
    name: "Jaime Lannister",
    email: "jaimelannister@gmail.com",
    age: 45,
    phone: "(422)982-6739",
    access: "user",
  },
];

// user data
export const user = [
  {
    id: 1,
    userName: 'SirNicanor',
    password: '123admin',
    role: 'Principal',
    firstName: 'Sir',
    lastName: 'Reyes I',

    access: "Admin",
    email: '1Reyes@gmail.com'
  },
  {
    id: 2,
    userName: 'SirNicanor',
    password: '123admin',
    role: 'Physical Facilitator Coordinator',
    firstName: 'Nicanor',
    lastName: 'Reyes II',

    access: "Manager",
    email: '2Reyes@gmail.com'
    
  },
  {
    id: 3,
    userName: 'SirNicanor',
    password: '123admin',
    role: 'SDRRM Coordinator',
    firstName: 'Mr',
    lastName: 'Reyes III',

    access: "User",
    email: '3Reyes@gmail.com'
  },
];


//Sidebar Data
export const SidebarData =[
    {
        icon: UilEstate,
        heading: "Dashboard",
        path: "/"
    },    
    {
        icon: UilUsersAlt,
        heading: "Accounts",
        path: "/accounts"
    },
    {
        icon: UilClipboardAlt,
        heading: "Reports",
        path: "/records"

    },

    {
        icon: UilPackage,
        heading: "Monitor",
        path: "/monitor"
    },
    {
        icon: UilChart,
        heading: "Analytics",
    },
];