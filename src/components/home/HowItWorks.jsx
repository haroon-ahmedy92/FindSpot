import React from 'react';
import { steps } from '../../data/steps';

const HowItWorks = () => {
  return (
    <section className="section bg-[#404040] py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          How <span className="text-[#696EFF]">FindSpot</span> Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl shadow-lg border border-white/10 bg-white/10 backdrop-blur-md hover:shadow-2xl transition duration-300 text-center"
            >
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r from-[#696EFF] to-[#F8ACFF] mb-6">
                <img src={step.icon} alt={step.title} className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
