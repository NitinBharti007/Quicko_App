import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2">
        <p>&copy; All rights reserved 2025</p>
        <div className="flex items-center gap-4 justify-center text-2xl">
          <a
            href="https://linktr.ee/dev.nitin63"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-100"
          >
            <SiLinktree />
          </a>
          <a
            href="https://www.instagram.com/nit3.07"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-100"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/in/nitinbharti1163/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-100"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
