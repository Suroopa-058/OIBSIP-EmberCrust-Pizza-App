import mongoose  from 'mongoose'
import dotenv    from 'dotenv'
import Pizza     from '../models/Pizza.js'

dotenv.config()

const pizzas = [
  { name:'Diavola Classico',    description:'Hand-stretched base, DOP San Marzano sauce, spicy Calabrian salami, smoked fior di latte, fresh basil',    image:'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=85&auto=format', category:'spicy',   price:22, rating:4.9, ratingCount:1240, isVeg:false, isPopular:true,  tag:'🔥 Best Seller', stock:50, deliveryTime:25 },
  { name:'Truffle Royale',       description:'Black truffle cream, burrata, wild mushroom medley, 36-month Parmigiano, truffle oil drizzle',              image:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=85&auto=format', category:'premium', price:34, rating:4.8, ratingCount:876,  isVeg:true,  isPopular:true,  tag:'⭐ Premium',     stock:30, deliveryTime:28 },
  { name:'Margherita Nera',      description:'Classic Neapolitan base, DOP San Marzano, fior di latte, extra virgin olive oil, fresh basil, sea salt',   image:'https://images.unsplash.com/photo-1604917877934-07d58d7d5a84?w=600&q=85&auto=format', category:'classic', price:18, rating:4.7, ratingCount:2100, isVeg:true,  isPopular:true,  tag:'🤍 Classic',     stock:60, deliveryTime:22 },
  { name:'Calabrese Fire',       description:"N'duja Calabrese spread, roasted Padron peppers, caramelized onion, sharp provolone, chilli flakes",       image:'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=85&auto=format', category:'spicy',   price:26, rating:4.9, ratingCount:980,  isVeg:false, isPopular:false, tag:'🌶️ Spicy',       stock:40, deliveryTime:26 },
  { name:'Volcano Prawn',        description:'Tiger prawns, nduja butter base, roasted garlic, chilli flakes, rocket salad, lemon zest finish',          image:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=85&auto=format', category:'seafood', price:30, rating:4.8, ratingCount:654,  isVeg:false, isPopular:false, tag:'🦐 Seafood',      stock:25, deliveryTime:30 },
  { name:'Garden Bianca',        description:'White ricotta base, grilled courgette, cherry tomato, artichoke hearts, pine nuts, fresh oregano',         image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=85&auto=format', category:'veg',     price:21, rating:4.6, ratingCount:430,  isVeg:true,  isPopular:false, tag:'🌿 Veg',          stock:45, deliveryTime:24 },
  { name:'Quattro Formaggi',     description:'Fior di latte, gorgonzola dolce, aged pecorino, smoked scamorza on olive oil base',                        image:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=85&auto=format', category:'classic', price:24, rating:4.8, ratingCount:1320, isVeg:true,  isPopular:true,  tag:'🤍 Classic',     stock:55, deliveryTime:23 },
  { name:'Smoked Brisket',       description:'12-hour oak-smoked brisket, house BBQ glaze, pickled jalapeños, crispy onions, aged cheddar melt',        image:'https://images.unsplash.com/photo-1548369937-47519962c11a?w=600&q=85&auto=format', category:'premium', price:32, rating:4.9, ratingCount:760,  isVeg:false, isPopular:true,  tag:'🥩 Signature',   stock:35, deliveryTime:28 },
  { name:'Funghi Porcini',       description:'Porcini cream base, mixed wild mushrooms, fresh thyme, taleggio, walnut oil, micro herbs',                 image:'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=85&auto=format', category:'veg',     price:23, rating:4.7, ratingCount:390,  isVeg:true,  isPopular:false, tag:'🌿 Veg',          stock:40, deliveryTime:25 },
  { name:'Lobster Bisque',       description:'Lobster bisque base, butter-poached langoustine, tarragon cream, caviar pearls, micro chives',             image:'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=85&auto=format', category:'seafood', price:42, rating:4.9, ratingCount:312,  isVeg:false, isPopular:false, tag:'👑 Luxury',       stock:20, deliveryTime:32 },
  { name:'Ghost Pepper Inferno', description:'Ghost pepper tomato base, double pepperoni, jalapeños, habanero honey drizzle, cooling crème fraîche',    image:'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=85&auto=format', category:'spicy',   price:27, rating:4.8, ratingCount:544,  isVeg:false, isPopular:false, tag:'💀 Extreme',      stock:30, deliveryTime:26 },
  { name:'Burrata & Prosciutto', description:'Torn burrata, paper-thin prosciutto di Parma, fig preserve, rocket, balsamic reduction, toasted hazelnuts',image:'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=600&q=85&auto=format', category:'premium', price:36, rating:4.9, ratingCount:688,  isVeg:false, isPopular:true,  tag:'⭐ Premium',     stock:28, deliveryTime:29 },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB Connected')

    await Pizza.deleteMany()
    console.log('🗑️  Old pizzas cleared')

    await Pizza.insertMany(pizzas)
    console.log('✅ 12 Pizzas seeded successfully!')

    process.exit()
  } catch (error) {
    console.error('❌ Seed error:', error)
    process.exit(1)
  }
}

seed()