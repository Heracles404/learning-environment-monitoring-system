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



// user data
export const user = [
  {
    id: 1,

    userID: 1,
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

    userID: 2,
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

    userID: 3,
    userName: 'SirNicanor',
    password: '123admin',
    role: 'SDRRM Coordinator',
    firstName: 'Mr',
    lastName: 'Reyes III',

    access: "User",
    email: '3Reyes@gmail.com'
  },
];

export const readout = [
  {
    id: 1,

    readoutID: 1,
    date: '10/16/2024',
    time: '11:59:00 PM',
    temperature: "1",
    humidity: "1",

    heatIndex: "1",
    lighting: "1",
    headCount: "1",
    oxygen: "1",
    carbonDioxide: "1",
    sulfurDioxide: "1",
    particulateMatter: "1",
    // set conditions in arduino
    indoorAir: "Good",
    outdoorAir: "Good",
    temp: "Good",
    remarks: "Good",

  },
  {
    id: 2,

    readoutID: 2,
    date: '10/16/2024',
    time: '11:59:00 PM',
    temperature: "2",
    humidity: "2",

    heatIndex: "2",
    lighting: "2",
    headCount: "2",
    oxygen: "2",
    carbonDioxide: "2",
    sulfurDioxide: "2",
    particulateMatter: "2",
    // set conditions in arduino
    indoorAir: "Good",
    outdoorAir: "Good",
    temp: "Good",
    remarks: "Good",

  },
  {
    id: 3,

    readoutID: 3,
    date: '10/16/2024',
    time: '11:59:00 PM',
    temperature: "3",
    humidity: "3",

    heatIndex: "3",
    lighting: "3",
    headCount: "3",
    oxygen: "3",
    carbonDioxide: "3",
    sulfurDioxide: "3",
    particulateMatter: "3",
    // set conditions in arduino
    indoorAir: "Good",
    outdoorAir: "Good",
    temp: "Good",
    remarks: "Good",

  },
]


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
        heading: "Records",
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