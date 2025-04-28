
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 w-full mt-8 font-semibold text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {currentYear} wpms. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;