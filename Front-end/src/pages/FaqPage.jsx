// src/pages/FaqPage.jsx
import React from 'react';

const FaqPage = () => {
  const faqs = [
    {
      question: "How do I report a lost item?",
      answer: "To report a lost item, navigate to the 'Report Lost Item' page from the main menu. Fill in the details about the item, including description, last seen location, date, and any identifying marks. The more details you provide, the higher the chances of finding it."
    },
    {
      question: "How do I report a found item?",
      answer: "If you have found an item, go to the 'Report Found Item' page. Provide a description of the item, where and when you found it, and upload a photo if possible. We will try to match it with lost item reports."
    },
    {
      question: "Is there a fee for using FindSpot?",
      answer: "No, FindSpot is a completely free platform for both reporting lost items and finding their owners."
    },
    {
      question: "How will I be notified if my lost item is found?",
      answer: "If someone reports an item that matches the description of your lost item, you will be notified via email and through your dashboard on the FindSpot platform. Ensure your contact information is up to date."
    },
    {
      question: "What should I do if I find an item listed on FindSpot?",
      answer: "If you believe you have found an item that is listed as lost on our platform, you can contact the person who reported it through the contact information provided in the listing (if they chose to share it) or contact us, and we will help facilitate the return."
    },
    {
      question: "How long are listings kept on the site?",
      answer: "Listings remain active on the site for 90 days. After this period, they may be archived, but you can always re-list an item if it hasn't been found."
    }
  ];

  return (
    <div className="container mx-auto p-4 pt-24 min-h-screen"> {/* Added pt-24 for spacing below header */}
      <h1 className="text-3xl font-bold mb-8 text-center text-[#00AFB9]">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{faq.question}</h2>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;