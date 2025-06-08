// src/pages/TermsOfServicePage.jsx
import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Agreement to Terms</h2>
        <p className="text-gray-700">
          By using our website, FindSpot, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We may update these terms from time to time, and your continued use of the service constitutes acceptance of those changes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. Use of Service</h2>
        <p className="text-gray-700">
          FindSpot provides a platform for users to report and search for lost and found items. You agree to use the service responsibly and not to post any content that is illegal, offensive, or infringes on the rights of others.
        </p>
        <p className="text-gray-700 mt-2">
          You are responsible for the accuracy of the information you provide. We are not responsible for any miscommunication or failure to return items based on inaccurate information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. User Accounts</h2>
        <p className="text-gray-700">
          To use certain features of the service, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Prohibited Activities</h2>
        <p className="text-gray-700">
          You agree not to engage in any of the following prohibited activities:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>Using the service for any illegal purpose or in violation of any local, state, national, or international law.</li>
          <li>Posting any content that is threatening, abusive, harassing, defamatory, libelous, deceptive, fraudulent, invasive of another’s privacy, or otherwise objectionable.</li>
          <li>Impersonating any person or entity, or falsely stating or otherwise misrepresenting your affiliation with a person or entity.</li>
          <li>Interfering with or disrupting the service or servers or networks connected to the service.</li>
          <li>Using any automated system, including without limitation “robots,” “spiders,” or “offline readers,” to access the service in a manner that sends more request messages to the servers than a human can reasonably produce in the same period by using a conventional on-line web browser.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Intellectual Property</h2>
        <p className="text-gray-700">
          All content and materials available on FindSpot, including but not limited to text, graphics, website name, code, images, and logos are the intellectual property of FindSpot and are protected by applicable copyright and trademark law.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Disclaimer of Warranties</h2>
        <p className="text-gray-700">
          The service is provided on an “as is” and “as available” basis. FindSpot makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">7. Limitation of Liability</h2>
        <p className="text-gray-700">
          In no event shall FindSpot or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FindSpot’s website, even if FindSpot or a FindSpot authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">8. Governing Law</h2>
        <p className="text-gray-700">
          These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">9. Changes to Terms</h2>
        <p className="text-gray-700">
          FindSpot reserves the right, in its sole discretion, to change the Terms under which The Service is offered. The most current version of the Terms will supersede all previous versions. FindSpot encourages you to periodically review the Terms to stay informed of our updates.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">10. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about these Terms, please contact us at:
        </p>
        <p className="text-gray-700 mt-2">
          FindSpot<br />
          Email: support@findspot.com<br />
          Address: 123 Lost and Found Lane, Anytown, AT 12345, Earth
        </p>
      </section>
    </div>
  );
};

export default TermsOfServicePage;