import { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import Charts from 'components/Charts/Charts';
import Expenses from 'components/Expenses/Expenses';
import Header from 'components/Header/Header';
import { Context } from 'provider/Provider';
import IncomeStatement from 'pages/income-statement/IncomeStatement';
import EmiCalculator from 'pages/EmiCalculator';
import SupportPopUp from 'components/Support/PopUp/PopUp';
import Footer from 'components/Footer/Footer';
import Signin from './pages/Signin/Signin';
import Signup from './pages/Signup/Signup';
import PersistLogin from 'components/PersistLogin/PersistLogin';
import ErrorPage from 'components/ErrorPage/ErrorPage';

const RouterComponent = () => {
  const { authToken } = useContext(Context);

  return (
    <Router>
      <Routes>
        <Route
          path="/signin"
          element={
            <>
              <Signin Context={Context} />
              <SupportPopUp Context={Context} />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <Signup Context={Context} />
              <SupportPopUp Context={Context} />
            </>
          }
        />

        <Route element={<PersistLogin />}>
          <Route
            path="/"
            element={
              <ProtectedRoutes authToken={authToken}>
                <>
                  <Header />
                  <Charts />
                  <Footer />
                  <SupportPopUp Context={Context} />
                </>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/loan_emi_calculator"
            element={
              <ProtectedRoutes authToken={authToken}>
                <>
                  <Header />
                  <EmiCalculator />
                  <Footer />
                  <SupportPopUp Context={Context} />
                </>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/income-statement"
            element={
              <ProtectedRoutes authToken={authToken}>
                <>
                  <Header />
                  <IncomeStatement Context={Context} />
                  <Footer />
                  <SupportPopUp Context={Context} />
                </>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoutes authToken={authToken}>
                <>
                  <Header />
                  <Expenses Context={Context} />
                  <Footer />
                  <SupportPopUp Context={Context} />
                </>
              </ProtectedRoutes>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default RouterComponent;
