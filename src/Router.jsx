import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import Charts from "components/Charts/Charts";
import Expenses from "components/Expenses/Expenses";
import IncomeStatement from "pages/income-statement/IncomeStatement";
import EmiCalculator from "pages/EmiCalculator";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";
import PersistLogin from "components/PersistLogin/PersistLogin";
import ErrorPage from "components/ErrorPage/ErrorPage";
import SIPCalculator from "pages/SIPCalculator/SIPCalculator";
import CAGRCalculator from "pages/CAGRCalculator/CAGRCalculator";

const RouterComponent = () => {

  return (
    <Router>
      <Layout>

          <Routes>

            <Route path="/signin" element={<Signin /> } />

            <Route path="/signup" element={ <Signup /> } />

            <Route path="*" element={<ErrorPage />}/>

            <Route element={<PersistLogin />}>

                  <Route path="/" element={<ProtectedRoutes component={<Charts />} />}/>
                    
                  <Route path="/loan_emi_calculator" element={<ProtectedRoutes component={<EmiCalculator />}/>}/>

                  <Route path="/income-statement" element={<ProtectedRoutes component={<IncomeStatement />} /> } />

                  <Route path="/expenses" element={<ProtectedRoutes component={<Expenses />} />} />

            </Route>
            
          </Routes>

      </Layout>

    </Router>
  );
};

export default RouterComponent;
