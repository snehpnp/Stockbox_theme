import React, { useState, useEffect } from "react";
import { SuperAdmin, Admin, User } from "../Sidebars/Sidebar_config";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTopbar, setIsTopbar] = useState(false);
  const [openTab, setOpenTab] = useState(null);
  const location = useLocation();
  const theme = JSON.parse(localStorage.getItem("theme")) || {};
  const [routes, setRoutes] = useState(() => {
    const role = localStorage.getItem("Role");
  
    if (role === "SUPERADMIN") {
      return SuperAdmin;
    } else if (role === "ADMIN") {
      return Admin;
    } else {
      return User;
    }
  });

  useEffect(() => {
    if (theme && theme.sidebarPosition === "Header") {
      setIsTopbar(true);
    }
  }, [theme]);

  const toggleSubmenu = (tabName) => {
    setOpenTab(openTab === tabName ? null : tabName);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
    <div
      className="sidebar-container"
      style={{
        flexDirection: isTopbar ? "column" : "row",
      }}
    >
      {theme.sidebarName == 1 && (
        <div className={isTopbar ? "SidebarColored Sidebar-horizontal" : "SidebarColored Sidebar-vertical"}>
          <div>
            {!isTopbar && (
              <div className="sidebartoggle" onClick={toggleSidebar}>
                <i className={`bx ${isCollapsed ? "bx-chevrons-right" : "bx-chevrons-left"}`}></i>
              </div>
            )}
          </div>

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
                      className={`sidebar-color sidebar-link ${location.pathname === tab.link ? "active" : ""}`}
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IconComponent icon={tab.icon} className="sidebar-color mx-2" />
                      {!isCollapsed ? tab?.name : ""}
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
                            <IconComponent icon={child.icon} className="sidebar-color mx-2" />
                            {child.name}
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
  );
};

export default Sidebar;

const IconComponent = ({ icon }) => {
  const renderIcon = () => {
    switch (icon) {
      case "UserRoundPlus":
        return <UserRoundPlus className="me-3 " />;
      case "Users":
        return <Users className="me-3" />;
      case "Wrench":
        return <Wrench className="me-3" />;
      case "Frame":
        return <Frame className="me-3" />;
      case "CandlestickChart":
        return <CandlestickChart className="me-3" />;
      case "Activity":
        return <Activity className="me-3" />;
      case "WalletCards":
        return <WalletCards className="me-3" />;
      case "HelpingHand":
        return <HelpingHand className="me-3" />;
      case "FolderClock":
        return <FolderClock className="me-3" />;
      case "LayoutDashboard":
        return <LayoutDashboard className="me-3" />;
      case "Building2":
        return <Building2 className="me-3" />;
      case "Copyright":
        return <Copyright className="me-3" />;
      case "Repeat2":
        return <Repeat2 className="me-3" />;
      case "Rocket":
        return <Rocket className="me-3" />;
      case "ArrowRightLeft":
        return <ArrowRightLeft className="me-3" />;
      case "ScatterChart":
        return <ScatterChart className="me-3" />;
      case "Paintbrush":
        return <Paintbrush className="me-3" />;
      case "Vote":
        return <Vote className="me-3" />;
      case "Boxes":
        return <Boxes className="me-3" />;
      case "UserPen":
        return <UserPen className="me-3" />;
      case "EthernetPort":
        return <EthernetPort className="me-3" />;
      case "ClipboardType":
        return <ClipboardType className="me-3" />;
      case "ShoppingCart":
        return <ShoppingCart className="me-3" />;
      case "Cog":
        return <Cog className="me-3" />;
      default:
        return null;
    }
  };

  return <>{renderIcon()}</>;
};
