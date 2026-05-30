export const CATEGORIES = [
  { id: 'all',     label: 'All',     icon: '🍕' },
  { id: 'classic', label: 'Classic', icon: '🤍' },
  { id: 'spicy',   label: 'Spicy',   icon: '🌶️' },
  { id: 'veg',     label: 'Veg',     icon: '🌿' },
  { id: 'premium', label: 'Premium', icon: '⭐' },
  { id: 'seafood', label: 'Seafood', icon: '🦐' },
]

export const SORT_OPTIONS = [
  { id: 'popular',    label: 'Popularity' },
  { id: 'rating',     label: 'Top Rated' },
  { id: 'price_asc',  label: 'Price: Low → High' },
  { id: 'price_desc', label: 'Price: High → Low' },
]

export const MENU_PIZZAS = [
  { id:1,  name:'Diavola Classico',    description:'Hand-stretched base, DOP San Marzano sauce, spicy Calabrian salami, smoked fior di latte, fresh basil',      image:'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=85&auto=format', category:'spicy',   price:22, rating:4.9, ratingCount:1240, deliveryTime:25, isVeg:false, isPopular:true,  tag:'🔥 Best Seller' },
  { id:2,  name:'Truffle Royale',      description:'Black truffle cream, burrata, wild mushroom medley, 36-month Parmigiano, truffle oil drizzle',               image:'https://rippleconifer.com/wp-content/uploads/2024/12/Quattro-Formaggi-Half.jpg', category:'premium', price:34, rating:4.8, ratingCount:876,  deliveryTime:28, isVeg:true,  isPopular:true,  tag:'⭐ Premium' },
  { id:3,  name:'Margherita Nera',     description:'Classic Neapolitan base, DOP San Marzano, fior di latte, extra virgin olive oil, fresh basil, sea salt',     image:'https://images.unsplash.com/photo-1604917877934-07d58d7d5a84?w=600&q=85&auto=format', category:'classic', price:18, rating:4.7, ratingCount:2100, deliveryTime:22, isVeg:true,  isPopular:true,  tag:'🤍 Classic' },
  { id:4,  name:'Calabrese Fire',      description:"N'duja Calabrese spread, roasted Padron peppers, caramelized onion, sharp provolone, chilli flakes",         image:'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=85&auto=format', category:'spicy',   price:26, rating:4.9, ratingCount:980,  deliveryTime:26, isVeg:false, isPopular:false, tag:'🌶️ Spicy' },
  { id:5,  name:'Volcano Prawn',       description:'Tiger prawns, nduja butter base, roasted garlic, chilli flakes, rocket salad, lemon zest finish',            image:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=85&auto=format', category:'seafood', price:30, rating:4.8, ratingCount:654,  deliveryTime:30, isVeg:false, isPopular:false, tag:'🦐 Seafood' },
  { id:6,  name:'Garden Bianca',       description:'White ricotta base, grilled courgette, cherry tomato, artichoke hearts, pine nuts, fresh oregano',           image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=85&auto=format', category:'veg',     price:21, rating:4.6, ratingCount:430,  deliveryTime:24, isVeg:true,  isPopular:false, tag:'🌿 Veg' },
  { id:7,  name:'Quattro Formaggi',    description:'Fior di latte, gorgonzola dolce, aged pecorino, smoked scamorza on olive oil base',                          image:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=85&auto=format', category:'classic', price:24, rating:4.8, ratingCount:1320, deliveryTime:23, isVeg:true,  isPopular:true,  tag:'🤍 Classic' },
  { id:8,  name:'Smoked Brisket',      description:'12-hour oak-smoked brisket, house BBQ glaze, pickled jalapeños, crispy onions, aged cheddar melt',           image:'https://images.unsplash.com/photo-1548369937-47519962c11a?w=600&q=85&auto=format', category:'premium', price:32, rating:4.9, ratingCount:760,  deliveryTime:28, isVeg:false, isPopular:true,  tag:'🥩 Signature' },
  { id:9,  name:'Funghi Porcini',      description:'Porcini cream base, mixed wild mushrooms, fresh thyme, taleggio, walnut oil, micro herbs',                   image:'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=85&auto=format', category:'veg',     price:23, rating:4.7, ratingCount:390,  deliveryTime:25, isVeg:true,  isPopular:false, tag:'🌿 Veg' },
  { id:10, name:'Lobster Bisque',      description:'Lobster bisque base, butter-poached langoustine, tarragon cream, caviar pearls, micro chives',               image:'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=85&auto=format', category:'seafood', price:42, rating:4.9, ratingCount:312,  deliveryTime:32, isVeg:false, isPopular:false, tag:'👑 Luxury' },
  { id:11, name:'Ghost Pepper Inferno',description:'Ghost pepper tomato base, double pepperoni, jalapeños, habanero honey drizzle, cooling crème fraîche',       image:'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=85&auto=format', category:'spicy',   price:27, rating:4.8, ratingCount:544,  deliveryTime:26, isVeg:false, isPopular:false, tag:'💀 Extreme' },
  { id:12, name:'Burrata & Prosciutto',description:'Torn burrata, paper-thin prosciutto di Parma, fig preserve, rocket, balsamic reduction, toasted hazelnuts',  image:'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=600&q=85&auto=format', category:'premium', price:36, rating:4.9, ratingCount:688,  deliveryTime:29, isVeg:false, isPopular:true,  tag:'⭐ Premium' },
]

export const TESTIMONIALS = [
  { name:'Aria Kapoor',  role:'Food Critic, Bon Appétit', text:'EmberCrust redefined what I thought delivery pizza could be. The Diavola is transcendent — blistered crust, complex heat, and a sauce that tastes like summer in Sicily.', initials:'AK', color:'#e06020' },
  { name:'Marcus Chen',  role:'Restaurant Owner',         text:"As someone who runs a restaurant, I'm impossible to impress. EmberCrust had me ordering again the next day. The char, the tang — everything is at a Michelin level.",        initials:'MC', color:'#b84a14' },
  { name:'Sofia Rossi',  role:'Verified Customer',        text:"I've had pizza in Rome, Naples and New York. EmberCrust holds its own. The 28-min claim is real — mine arrived in 24 minutes, still piping hot with perfect char.",           initials:'SR', color:'#c8420a' },
]

export const FEATURES = [
  { icon:'⚡', title:'Lightning Delivery',  desc:'28 min or your next order is free. Every order tracked live.' },
  { icon:'🌿', title:'Artisan Ingredients', desc:'DOP-certified San Marzano tomatoes, 00-flour imported from Naples.' },
  { icon:'🔒', title:'Secure Checkout',     desc:'Apple Pay, Google Pay, all major cards. SSL-encrypted always.' },
  { icon:'🕐', title:'24/7 Support',        desc:'Real humans, not bots — always on standby for you.' },
]