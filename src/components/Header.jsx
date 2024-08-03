import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = React.useState(false);
  const navigation = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigation("/login");
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem key="Home" disablePadding className="sidebarLink">
          <ListItemButton>
            <Link to="/" className="sidebarLink">
              <ListItemIcon>
                <HomeIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </Link>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider sx={{ backgroundColor: "#ffffff" }} />
      <List>
        <ListItem key="customerList" disablePadding>
          <ListItemButton>
            <Link to="/customerList" className="sidebarLink">
              <ListItemIcon>
                <ListAltIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              <ListItemText primary="Customer List" />
            </Link>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider sx={{ backgroundColor: "#ffffff" }} />
    </Box>
  );

  return (
    <div className="container-fluid headerMain">
      <div className="row">
        <div className="col d-flex">
          <div className="p-2">
            <MenuIcon onClick={toggleDrawer(true)} />
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col d-flex justify-content-between align-items-center">
                <div className="headerLogo d-flex p-2 ">
                  <img src="/funds_icon.png" alt="logo" className="fundsLogo" />
                  <div>Fund Collection</div>
                </div>
                <button className="btn btn-primary" onClick={handleLogOut}>
                  logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Drawer
            open={open}
            onClose={toggleDrawer(false)}
            PaperProps={{
              style: {
                color: "#ffffff",
                backgroundImage: "linear-gradient(#00bbff, #00ff03b5)",
              },
            }}
          >
            {DrawerList}
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default Header;
