/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import Dashboard1 from "./Dashboard1";
import Dashboard2 from "./Dashboard2";
import Dashboard3 from "./Dashboard3";
import Dashboard4 from "./Dashboard4";
import Dashboard5 from "./Dashboard5";
import Dashboard6 from "./Dashboard6";
import Dashboard7 from "./Dashboard7";
import Dashboard8 from "./Dashboard8";
import Dashboard9 from "./Dashboard9";
import Dashboard10 from "./Dashboard10";
import Dashboard11 from "./Dashboard11";

import Contnet from "../Content";

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

const Dashboard = () => {
  var GetThemeId = JSON.parse(localStorage.getItem("theme"));

  return (
    <>
      <Contnet
        Page_title="Dashboard"
        button_title="Add Theme"
        button_status={false}
        route="/add-theme"
      >
        {CallDashboard(GetThemeId.themeId)}
      </Contnet>
    </>
  );
};

const CallDashboard = (id) => {
  if (id == 1) {
    return <Dashboard1 data={DashboardData} />;
  } else if (id == 2) {
    return <Dashboard2 data={DashboardData} />;
  } else if (id == 3) {
    return <Dashboard3 data={DashboardData} />;
  } else if (id == 4) {
    return <Dashboard4 data={DashboardData} />;
  } else if (id == 5) {
    return <Dashboard5 data={DashboardData} />;
  } else if (id == 6) {
    return <Dashboard6 data={DashboardData} />;
  } else if (id == 7) {
    return <Dashboard7 data={DashboardData} />;
  } else if (id == 8) {
    return <Dashboard8 data={DashboardData} />;
  } else if (id == 9) {
    return <Dashboard9 data={DashboardData} />;
  } else if (id == 10) {
    return <Dashboard10 data={DashboardData} />;
  } else if (id == 11) {
    return <Dashboard11 data={DashboardData} />;
  } else {
    return <Dashboard1 data={DashboardData} />;
  }
};

export default Dashboard;
