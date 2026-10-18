export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-xl font-bold text-white">SQOON Property</h3>
          <p className="text-sm mt-1">Find your next home</p>
        </div>
        <div className="text-sm">
          <h4 className="text-white font-semibold mb-2">Explore</h4>
          <p>For Rent</p>
          <p>For Sale</p>
          <p>Available Now</p>
        </div>
        <div className="text-sm">
          <h4 className="text-white font-semibold mb-2">Contact</h4>
          <p>info@sqoonproperty.com</p>
          <p>+1 (803) 575-0591</p>
        </div>
      </div>
      <div className="text-center text-xs py-4 border-t border-gray-800">
        © {new Date().getFullYear()} SQOON Property. All rights reserved.
      </div>
    </footer>
  );
}
