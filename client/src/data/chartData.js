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
// CarbonDioxide Cards Data
export const CO2Data = [
  {
    title: "Air Quality",
    color: {
      backGround: "linear-gradient(180deg, #1e5245 0%, #00cc00 100%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    // barValue: 70,
    // value: "25,970",
    png: UilUsdSquare,
    series: [
      {
        name: "Air Quality",
        data: [1, 5, 16, 20, 4, 26, 14, 2 ],
      },
    ],
  },
];