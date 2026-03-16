import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { useCart } from '@/contexts/CartContext';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, subtotal, deliveryFee, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart ({itemCount})</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 p-4 bg-card rounded-xl shadow-card"
              >
                <img 
                  src={item.product.images?.[0] || '/placeholder-product.jpg'} 
                  alt={item.product.name} 
                  className="w-24 h-24 object-cover rounded-lg" 
                />
                <div className="flex-1">
                  <Link to={`/products/${item.product._id}`} className="font-medium hover:text-primary">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.product.farmer?.name || 'Villagio Farm'}</p>
                  <p className="font-bold mt-1">
                    KES {item.product.price.toLocaleString()} 
                    <span className="text-sm font-normal text-muted-foreground">/{item.product.unit || 'unit'}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.productId)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 hover:bg-muted">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 hover:bg-muted">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-card p-6 sticky top-32">
              <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{deliveryFee === 0 ? 'Free' : `KES ${deliveryFee.toLocaleString()}`}</span></div>
                {deliveryFee > 0 && <p className="text-xs text-muted-foreground">Free delivery on orders over KES 2,000</p>}
                <div className="border-t pt-3 flex justify-between font-bold text-lg"><span>Total</span><span>KES {total.toLocaleString()}</span></div>
              </div>
              <Button className="w-full mt-6" size="lg" asChild>
                <Link to="/checkout">Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;



