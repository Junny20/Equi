import React from "react";

const NavBar = () => {
  return (
    <nav className="flex items-center mx-10 my-4">
      <a href="/equi" className="items-center">
        Logo
      </a>
      <ul className="flex flex-1 items-center justify-between ml-30">
        <li>
          <a href="/news">News</a>
        </li>
        <li>
          <a href="/portfolio">Portfolio Insights</a>
        </li>
        <li>
          <a href="/predictor">EquiPredict</a>
        </li>
        <li>
          <a href="/">EquiData</a>
        </li>
        <li>
          <a href="/correlate">EquiCorrelate</a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
