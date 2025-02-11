import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import { SuperAdmin, Admin, User, Employee } from "../Sidebars/Sidebar_config";

import {
  UserRoundPlus,
  Users,
  Wrench,
  UserPen,
  Frame,
  CandlestickChart,
  Activity,
  WalletCards,
  HelpingHand,
  FolderClock,
  LayoutDashboard,
  Building2,
  Copyright,
  CalendarPlus,
  Repeat2,
  ArrowRightLeft,
  ScatterChart,
  Boxes,
  Rocket,
  Paintbrush,
  Vote,
  Info,
  LayoutList,
  ChevronRight,
  ChevronDown,
  EthernetPort,
  File,
  ClipboardType,
  ShoppingCart,
  Cog,
  UserCheck,
  FileUser,
  MessageCircleMore,
  FileQuestion,
  CircleUserRound,
  Bell,
  Puzzle
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTopbar, setIsTopbar] = useState(false);
  const [openTab, setOpenTab] = useState(null);
  const location = useLocation();
  const theme = JSON.parse(localStorage.getItem("theme")) || {};
  const [routes, setRoutes] = useState(
    localStorage.getItem("Role") == "SUPERADMIN"
      ? SuperAdmin
      : localStorage.getItem("Role") == "ADMIN"
      ? Admin
      : localStorage.getItem("Role") == "USER"
      ? User
      : Employee
  );

  useEffect(() => {
    if (theme && theme.sidebarPosition === "Header") {
      setIsTopbar(true);
    }
  }, [theme]);

  const toggleSubmenu = (tabName) => {
    setOpenTab(openTab === tabName ? null : tabName);
  };

  let SidebarId = theme.sidebarName;

  const sidebarContainerClass =
    SidebarId === 2
      ? "SidebarColored unique-sidebar-container"
      : "SidebarColored default-sidebar-container";
  const sidebarStyles = {
    width: isTopbar ? "100%" : isCollapsed ? "60px" : "250px",
    height: isTopbar ? "60px" : "calc(100vh - 76px)",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: isTopbar ? "row" : "column",
    alignItems: isTopbar ? "center" : "flex-start",
    justifyContent: isTopbar ? "space-between" : "flex-start",
    padding: isTopbar ? "0 20px" : "10px",
  };

  useEffect(() => {
    if (isTopbar) {
      document.body.classList.add("sidebar-horizontal-container");
      document.body.classList.remove("sidebar-vertical-container");
    } else {
      document.body.classList.add("sidebar-vertical-container");
      document.body.classList.remove("sidebar-horizontal-container");
    }
  }, [isTopbar]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add("sidebar-collapsed");
      document.body.classList.remove("sidebar-open");
    } else {
      document.body.classList.add("sidebar-open");
      document.body.classList.remove("sidebar-collapsed");
    }
  }, [isCollapsed]);

  return (
    <>
      <div
        className="sidebar-container"
        style={{
          flexDirection: isTopbar ? "column" : "row",
        }}
      >
        {SidebarId == 1 && (
          <div
            className={
              isTopbar
                ? "SidebarColored Sidebar-horizontal"
                : "SidebarColored Sidebar-vertical"
            }
          >
            {/* <div>
              {!isTopbar && (
                <div className="sidebartoggle" onClick={toggleSidebar}>
                  <i
                    className={`bx ${isCollapsed ? "bx-chevrons-right" : "bx-chevrons-left"
                      }`}
                  ></i>
                </div>
              )}
            </div> */}

            <ul
              className="sidebar-menu"
              style={{
                flexDirection: isTopbar ? "row" : "column",
                gap: isTopbar ? "20px" : "5px",
              }}
            >
              {routes &&
                routes.map((tab) => (
                  <li key={tab.name}>
                    {/* Parent Tab */}
                    <div
                      onClick={() => tab.children && toggleSubmenu(tab.name)}
                      className={`sidebar-color sidebar-link ${
                        location.pathname === tab.link ? "active" : ""
                      }`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: tab.children ? "pointer" : "default",
                        padding: "0px",
                        borderRadius: "0px",
                      }}
                    >
                      <Link
                        to={tab.link}
                        className={`sidebar-color sidebar-link ${
                          location.pathname === tab.link ? "active" : ""
                        }`}
                        style={{
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Tooltip placement="top" title={tab?.name}>
                          <div>
                            <IconComponent icon={tab.icon} />
                          </div>
                        </Tooltip>
                        {!isCollapsed ? <span>{tab?.name}</span> : ""}
                      </Link>
                      {tab?.children?.length > 0 &&
                        (openTab === tab?.name ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        ))}
                    </div>

                    {tab.children && openTab === tab.name && (
                      <ul
                        className="submenu"
                        style={{
                          listStyle: "none",

                          display: isCollapsed ? "none" : "block",
                          position: isTopbar ? "absolute" : "relative",
                        }}
                      >
                        {tab.children.map((child) => (
                          <li
                            key={child.name}
                            className={`sidebar-subitem ${
                              location.pathname === child.link ? "active" : ""
                            }`}
                          >
                            <Link
                              to={child.link}
                              className={`sidebar-color sidebar-sublink ${
                                location.pathname === child.link ? "active" : ""
                              }`}
                              style={{
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              {" "}
                              <Tooltip placement="top" title={child.name}>
                                <div>
                                  <IconComponent icon={child.icon} />
                                </div>
                              </Tooltip>
                              <span> {child.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;

const IconComponent = ({ icon }) => {
  const icons = {
    UserRoundPlus,
    Users,
    Wrench,
    Frame,
    CandlestickChart,
    Activity,
    WalletCards,
    HelpingHand,
    FolderClock,
    LayoutDashboard,
    Building2,
    Copyright,
    Repeat2,
    Rocket,
    ArrowRightLeft,
    ScatterChart,
    Paintbrush,
    Vote,
    Boxes,
    UserPen,
    EthernetPort,
    ClipboardType,
    ShoppingCart,
    Cog,
    FileUser,
    MessageCircleMore,
    FileQuestion,
    CircleUserRound,
    Bell,
    Puzzle

  };

  const Icon = icons[icon] || null;
  return Icon ? <Icon className="sidebar-icon me-2" /> : null;
};
