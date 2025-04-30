import React from 'react';
import MobileIcon from '../../assets/icons/mobile.svg';
import FileIcon from '../../assets/icons/file.svg';
import WalletIcon from '../../assets/icons/wallet.svg';
import KeyIcon from '../../assets/icons/key.svg';
import BackpackIcon from '../../assets/icons/backpack.svg';
import GlassesIcon from '../../assets/icons/glasses.svg';

const CategoriesSection = () => {
  const categories = [
    { icon: MobileIcon, label: 'Electronics' },
    { icon: FileIcon, label: 'Documents' },
    { icon: WalletIcon, label: 'Wallets' },
    { icon: KeyIcon, label: 'Keys' },
    { icon: BackpackIcon, label: 'Bags' },
    { icon: GlassesIcon, label: 'Accessories' },
  ];

  return (
    <section className="section bg-[#404040] py-12 backdrop-blur-md">
      <div className="container max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#696EFF] to-[#F8ACFF] mb-12">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-[#ffffff0f] hover:bg-[#ffffff1a] rounded-xl cursor-pointer transition duration-300 shadow-sm"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-[#696EFF] to-[#F8ACFF] rounded-full mb-3">
                <img
                  src={category.icon}
                  alt={category.label}
                  className="w-8 h-8 text-white"
                />
              </div>
              <span className="text-sm text-white font-medium">{category.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-12 w-full border-t border-white/20" />
      </div>
    </section>
  );
};

export default CategoriesSection;
