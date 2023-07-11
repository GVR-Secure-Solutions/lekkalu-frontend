import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import Charts from './components/Charts/Charts';
import Expenses from './components/Expenses/Expenses';
import Header from './components/Header/Header';
import { Context } from './provider/Provider';
import IncomeStatement from './pages/income-statement/IncomeStatement';
import EmiCalculator from './pages/EmiCalculator';
import SupportPopUp from './components/Support/PopUp/PopUp';
import Footer from './components/Footer/Footer';
import Signin from './pages/Signin/Signin';
import Signup from './pages/Signup/Signup';
import React from 'react';

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/signin"
          element={
            <>
              <Signin />
              <SupportPopUp Context={Context} />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <Signup />
              <SupportPopUp Context={Context} />
            </>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Header />
              <Charts />
              <Footer />
              <SupportPopUp Context={Context} />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/loan_emi_calculator"
          element={
            <ProtectedRoutes>
              <Header />
              <EmiCalculator />
              <Footer />
              <SupportPopUp Context={Context} />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/income-statement"
          element={
            <ProtectedRoutes>
              <Header />
              <IncomeStatement Context={Context} />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoutes>
              <Header />
              <Expenses Context={Context} />
              <Footer />
              <SupportPopUp Context={Context} />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Router>
  );
};

export default RouterComponent;
