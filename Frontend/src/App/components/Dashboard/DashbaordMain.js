/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import Dashboard1 from "./Dashboard1";
import Dashboard2 from "./Dashboard2";
import Dashboard4 from "./Dashboard4";
import Dashboard5 from "./Dashboard5";
import Dashboard6 from "./Dashboard6";
import Dashboard7 from "./Dashboard7";
import Dashboard8 from "./Dashboard8";
import Dashboard10 from "./Dashboard10";
import Dashboard11 from "./Dashboard11";
import Dashboard9 from "./Dashboard13";


const DashboardData = {
  total_client: 10,
  total_active_client: 10,
  total_expired_client: 10,
  total_live_client: 10,
  total_active_live: 10,
  total_expired_live: 10,
  total_demo_client: 10,
  total_demo_active: 10,
  total_demo_expired: 10,
  total_demo_live: 10,
  total_demo_active_live: 10,
  total_active_demo: 10,
  total_expired_demo: 10,
  total_two_days: 10,
  total_active_two_days: 10,
  total_expired_two_days: 10,
  total_expired_two_days: 10,
  all_licence: 10,
  remaining_licence: 10,
  used_licence: 10,
};

const Dashboard = (monthexpiry, data) => {
  var GetThemeId = JSON.parse(localStorage.getItem("theme"));

  return <>{CallDashboard(monthexpiry, GetThemeId?.themeId || 1)}</>;
};

const CallDashboard = (monthexpiry, id) => {
  if (id == 1) {
    return <Dashboard1 monthexpiry={monthexpiry} />;
  } else if (id == 2) {
    return <Dashboard2 monthexpiry={monthexpiry} />;
  } 
 
   else if (id == 4) {
    return <Dashboard4 monthexpiry={monthexpiry} />;
  } else if (id == 5) {
    return <Dashboard5 monthexpiry={monthexpiry} />;
  } else if (id == 6) {
    return <Dashboard6 monthexpiry={monthexpiry} />;
  } else if (id == 7) {
    return <Dashboard7 monthexpiry={monthexpiry} />;
  } else if (id == 8) {
    return <Dashboard8 monthexpiry={monthexpiry} />;
  } else if (id == 9) {
    return <Dashboard9 monthexpiry={monthexpiry} />; //Remove this line
  } else if (id == 10) {
    return <Dashboard10 monthexpiry={monthexpiry} />;
  } else if (id == 11) {
    return <Dashboard11 monthexpiry={monthexpiry} />;
  } else {
    return;
  }
};

export default Dashboard;
