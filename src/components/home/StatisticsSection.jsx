import React from 'react';
import { statistics } from '../../data/statistics';

const StatisticsSection = () => {
  return (
    <section className="section bg-[#404040] py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center border border-white/10 shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-4xl font-bold text-[#696EFF] mb-2">{stat.number}</h3>
              <p className="text-gray-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
