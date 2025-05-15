import { format, formatDistanceToNow } from 'date-fns';
// import Holidays from "date-holidays"


// ----------------------------------------------------------------------

export function fDate(date) {
  if (date == "" || date == null) {
    return ""
  } else {

    return format(new Date(date), 'dd MMMM yyyy');
  }
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy ');
}

export function fDateMonth(monthYear) {

  const month = monthYear.slice(0, 2);
  const year = monthYear.slice(2);
  const date = new Date(`${year}-${month}-01`);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};
export function fDateTimeH(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm:ss');
}


export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm:ss');
}

export function f_time(date) {
  return format(new Date(date), 'yyyy-MM-dd');
}



export function get_three_digit_month(date) {
  return format(new Date(date), 'yyyy-MMM-dd');
}

export function get_year_and_month_only(date) {
  return format(new Date(date), 'yyyy-MM');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}


export function fa_time(date) {
  return format(new Date(date), 'dd MMM');
}

export const getActualDateFormate = (date) => {
  const dateParts = date.split("-");
  const formattedDate = `${dateParts[0]}/${parseInt(
    dateParts[1],
    10
  )}/${parseInt(dateParts[2], 10)}`;
  return formattedDate;
};

export const today = () => {
  let abc = new Date();
  let month = abc.getMonth() + 1;
  let date = abc.getDate();
  let year = abc.getFullYear();
  let full = `${year}-${month}-${date}`;
  return full
}

export const convert_string_to_month = (expiry) => {


  const day_expiry = expiry.substring(0, 2);
  const moth_str = expiry.substring(2, 4);
  const year_expiry = expiry.substring(4);



  let month_string
  if (moth_str === "01") {
    month_string = "JAN";
  } else if (moth_str === "02") {
    month_string = "FEB";
  }
  else if (moth_str === "03") {
    month_string = "MAR";
  }
  else if (moth_str === "04") {
    month_string = "APR";
  }
  else if (moth_str === "05") {
    month_string = "MAY";
  }
  else if (moth_str === "06") {
    month_string = "JUN";
  }
  else if (moth_str === "07") {
    month_string = "JUL";
  }
  else if (moth_str === "08") {
    month_string = "AUG";
  }
  else if (moth_str === "09") {
    month_string = "SEP";
  }
  else if (moth_str === "10") {
    month_string = "OCT";
  }
  else if (moth_str === "11") {
    month_string = "NOV";
  }
  else if (moth_str === "12") {
    month_string = "DEC";
  }

  return `${day_expiry}${month_string}${year_expiry}`

}



export const isForeignUserAllowedToLogin = (userCountry, userLocalTime) => {

  const isForeignUser = userCountry !== 'IN';

  // Convert the user's local time to Indian Standard Time (IST)
  const convertedISTTime = new Date(userLocalTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

  // Get the hours in IST
  const hoursInIST = convertedISTTime.getHours();

  // Check if the user is trying to log in between 8 AM and 11 PM IST
  const isLoginTimeValid = hoursInIST >= 8 && hoursInIST < 23;

  // Return true if it's a foreign user and the login time is valid, otherwise return false
  return isForeignUser && isLoginTimeValid;
}


// export const GetMarketOpenDays = (userCountry, userLocalTime) => {
//   const currentDate = new Date();
//   // const currentDate = new Date('Fri Dec 22 2023 14:08:08 GMT+0530 (India Standard Time)');


//   const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//   const weekday = weekdays[currentDate.getDay()];
//   const holidays = new Holidays();


//   return !holidays.isHoliday(currentDate) && weekday !== 'Sunday' && weekday !== 'Saturday'
// }



export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

