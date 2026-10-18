export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-800 mb-3">
          SQOON Property Management
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          Professional Property Management. Trusted Services. Lasting Value.
        </p>
      </div>

      <section className="bg-white rounded-lg shadow p-6 md:p-8 mb-8 space-y-4 text-gray-700 leading-relaxed">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About Us</h2>
        <p>
          Welcome to <strong>SQOON Property Management</strong>, your partner in
          professional property management and real estate services. We are
          committed to helping property owners protect their investments,
          maintain their properties, and maximize the long-term value of their
          real estate assets.
        </p>
        <p>
          Led by <strong>Corey Quaintance</strong>, CEO and Owner, SQOON Property
          Management focuses on delivering reliable service, transparent
          communication, and practical property management solutions tailored to
          the needs of property owners, landlords, tenants, and real estate
          investors.
        </p>
        <p>
          Our approach is built around professionalism, accountability, and
          attention to detail. From property maintenance coordination and tenant
          relations to rental property oversight and investment support, our
          goal is to make property ownership more convenient and rewarding.
        </p>
        <p>
          At SQOON Property Management, we understand that real estate is more
          than property—it is an investment in the future. That is why we strive
          to build lasting relationships, maintain high service standards, and
          treat every property with the care and attention it deserves.
        </p>
        <p>
          Our mission is simple: to provide dependable property management
          services that give property owners greater confidence and peace of
          mind while helping their investments retain and grow their value.
        </p>
        <p>
          Whether you own a single rental property or manage a growing real
          estate portfolio, SQOON Property Management is committed to helping you
          manage your property with confidence.
        </p>
        <p className="font-semibold text-blue-800 pt-2">
          SQOON Property Management — Managing Properties. Building Trust.
          Protecting Investments.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow p-6 md:p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Meet Our CEO &amp; Owner
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src="/ceo.jpg"
            alt="Corey Quaintance — CEO"
            className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-full border-4 border-blue-100 shadow"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='%23e5e7eb'/><text x='100' y='110' font-size='14' text-anchor='middle' fill='%236b7280'>CEO Photo</text></svg>";
            }}
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">Corey Quaintance</h3>
            <p className="text-blue-700 font-medium mb-3">
              Chief Executive Officer &amp; Owner
            </p>
            <p className="text-gray-700 mb-3">
              Corey Quaintance leads SQOON Property Management with a focus on
              professional service, responsible property oversight, and building
              lasting relationships with clients.
            </p>
            <p className="text-gray-700 mb-3">
              With <strong>15 years of experience</strong> in real estate, Corey
              brings deep industry knowledge, a strong understanding of property
              management, and a commitment to helping property owners make
              informed decisions.
            </p>
            <p className="text-gray-700">
              His leadership philosophy emphasizes <strong>integrity</strong>,{" "}
              <strong>accountability</strong>, and a{" "}
              <strong>client-first approach</strong> to managing real estate
              assets.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Company Information
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-semibold w-1/3">Company Name</td>
                <td className="py-3">SQOON Property Management</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold">CEO / Owner</td>
                <td className="py-3">Corey Quaintance</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold">Industry</td>
                <td className="py-3">Real Estate &amp; Property Management</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold">Phone</td>
                <td className="py-3">+1 (803) 575-0591</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold">Address</td>
                <td className="py-3">
                  1701 Charleston Regional Pky, Charleston, SC 29492
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold">Business Email</td>
                <td className="py-3">info@sqoonproperty.com</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
