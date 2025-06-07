import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import ItemFilters from './ItemFilters';
import ItemCard from './ItemCard';
import Pagination from './Pagination';

const items = [
    {
        title: 'MacBook Pro 13"',
        status: 'lost',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
        description: 'Silver MacBook Pro with stickers on the lid. Last seen at the University Library.',
        location: 'University of Dodoma Library',
        date: 'June 15, 2023',
    },
    {
        title: 'Black Wallet',
        status: 'lost',
        image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1',
        description: 'Leather wallet containing ID, credit cards, and some cash. Lost near the campus cafeteria.',
        location: 'University Cafeteria',
        date: 'June 10, 2023',
    },
    {
        title: 'Car Keys - Honda',
        status: 'resolved',
        image: 'https://images.unsplash.com/photo-1529336953128-a85760f58cb5',
        description: 'Honda car keys with black remote and keychain. Lost in the parking lot.',
        location: 'Main Parking Lot, Block C',
        date: 'May 28, 2023',
    },
    {
        title: 'Red Umbrella',
        status: 'found',
        image: 'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394',
        description: 'Red foldable umbrella with black handle found at Science Building.',
        location: 'Science Building, Room 302',
        date: 'June 17, 2023',
    },
    {
        title: 'Wristwatch - Casio',
        status: 'lost',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
        description: 'Black Casio digital watch with rubber strap. Lost during sports event.',
        location: 'Sports Complex',
        date: 'June 5, 2023',
    },
    {
        title: 'Textbooks (3)',
        status: 'found',
        image: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa',
        description: 'Three textbooks found in the library study area: Physics, Calculus, and Chemistry.',
        location: 'University Library, 2nd Floor',
        date: 'June 14, 2023',
    },
];

const MyItems = () => (
    <section id="my-items-page" className="page">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center animate-fadeIn">
            <div>
                <h1 className="text-2xl font-bold mb-2">My Items</h1>
                <p className="text-gray-600">Manage your lost and found items</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
                <Button variant="primary" icon="fa-plus">
                    Report Lost Item
                </Button>
                <Button variant="secondary" icon="fa-plus">
                    Report Found Item
                </Button>
            </div>
        </div>
        <Card>
            <ItemFilters />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, index) => (
                    <ItemCard key={index} {...item} />
                ))}
            </div>
            <Pagination />
        </Card>
    </section>
);

export default MyItems;