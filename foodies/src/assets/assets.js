import logo from './logo.png';
import cart from './cart.png';
import bg   from './bg.png';
import bg1  from './bg1.png';
import bg2  from './bg2.png';
import meat      from './meat.png';
import fruit     from './fruit.png';
import vegetable from './vegetable.png';
import dairy     from './dairy.png';
import drink     from './drink.png';

export const assets = {
    logo,
    cart,
    bg,
    bg1,
    bg2,
};

// 13 Real Database Categories — local images used where available
export const categories = [
    { category: 'Eggs, Meat & Fish',       icon: meat },
    { category: 'Fruits & Vegetables',      icon: fruit },
    { category: 'Bakery, Cakes & Dairy',    icon: dairy },
    { category: 'Beverages',                icon: drink },
    { category: 'Prepared & Frozen Foods',  icon: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=60' },
    { category: 'Foodgrains, Oil & Masala', icon: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&auto=format&fit=crop&q=60' },
    { category: 'Snacks & Branded Foods',   icon: 'https://images.unsplash.com/photo-1599490659213-e2b9527bb087?w=150&auto=format&fit=crop&q=60' },
    { category: 'Breakfast & Cereal',       icon: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=150&auto=format&fit=crop&q=60' },
    { category: 'Gourmet & World Food',     icon: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=150&auto=format&fit=crop&q=60' },
    { category: 'Baby Care',                icon: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=150&auto=format&fit=crop&q=60' },
    { category: 'Beauty & Hygiene',         icon: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&auto=format&fit=crop&q=60' },
    { category: 'Cleaning & Household',     icon: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&auto=format&fit=crop&q=60' },
    { category: 'Kitchen, Garden & Pets',   icon: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=150&auto=format&fit=crop&q=60' },
];