import {AppBar, Toolbar, Box} from "@mui/material";
import { Link } from "react-router-dom";
import { HeaderButton } from "./styled";
import { useContext } from "react";
import { Context } from "provider/Provider";

const Header = () => {
  const {signOut} = useContext(Context)

  return (
    <AppBar position="static">
      <Toolbar>
        <HeaderButton color="inherit" component={Link} to="/">
          Home
        </HeaderButton>
        <HeaderButton color="inherit" component={Link} to="/expenses">
          Expenses
        </HeaderButton>
        <HeaderButton color="inherit" component={Link} to="/income-statement">
          Income Statement
        </HeaderButton>
        <HeaderButton
          color="inherit"
          component={Link}
          to="/loan_emi_calculator"
        >
          EMI Calculator
        </HeaderButton>

        <Box sx={{ flexGrow: 1 }} />

        <HeaderButton color="inherit" component={Link} to="/signin">
          Sign in
        </HeaderButton>
        <HeaderButton color="inherit" component={Link} to="/signup">
          Sign up
        </HeaderButton>
        <HeaderButton color="inherit" onClick={() => signOut()}>
          Sign out
        </HeaderButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
