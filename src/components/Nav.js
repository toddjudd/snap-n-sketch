import React from 'react';

const Nav = () => (
  <nav>
    <ul className='nav'>
      {/* <li className='nav-item'>
        <a className='nav-link' href='/'>
          <i className='fas fa-home'></i>
        </a>
      </li> */}
      <li className='nav-item'>
        <a className='nav-link' href='/camera'>
          <i className='fas fa-camera'></i>
        </a>
      </li>
      <li className='nav-item'>
        <a className='nav-link' href='/canvas'>
          <i className='fas fa-pen'></i>
        </a>
      </li>
    </ul>
  </nav>
);

export default Nav;
