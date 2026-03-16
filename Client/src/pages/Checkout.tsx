import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  MapPin, 
  Truck, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import MainLayout from '@/components/layout/MainLayout';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';

const Checkout: React.FC = () => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    streetAddress: '',
    city: '',
    county: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  const fetchDeliveryEstimate = async (county: string) => {
    try {
      // Find zone for the county
      const zonesRes = await api.get('/logistics/zones');
      const zone = zonesRes.data.find((z: any) => z.name.toLowerCase().includes(county.toLowerCase()));
      if (zone) {
        const estRes = await api.get(`/logistics/zones/${zone._id}/estimate`);
        setDeliveryEstimate(estRes.data.estimate);
      } else {
        setDeliveryEstimate("Same-day Delivery");
      }
    } catch {
      setDeliveryEstimate("Expected within 24h");
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryAddress({ ...deliveryAddress, [name]: value });
    if (name === 'county' && value.length > 3) {
      fetchDeliveryEstimate(value);
    }
  };

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price
        })),
        deliveryAddress: {
          phone: deliveryAddress.phone,
          streetAddress: deliveryAddress.streetAddress,
          city: deliveryAddress.city,
          county: deliveryAddress.county,
          postalCode: deliveryAddress.postalCode || '00100'
        },
        paymentMethod: paymentMethod === 'mpesa' ? 'mpesa' : 
                       paymentMethod === 'card' ? 'credit' : 'cash_on_delivery'
      };

      const response = await api.post('/orders', orderData);
      const savedOrder = response.data.data || response.data;

      if (paymentMethod === 'mpesa') {
        try {
          await api.post('/payments/stk-push', {
            orderId: savedOrder._id,
            phone: deliveryAddress.phone,
            amount: total
          });
          toast({
            title: 'M-Pesa STK Push Sent',
            description: 'Please check your phone and enter your PIN to complete the payment.',
          });
          await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (payErr) {
          console.error("Payment trigger failed:", payErr);
        }
      }
      
      clearCart();
      toast({ 
        title: 'Order Placed!', 
        description: `Order #${savedOrder._id.slice(-6).toUpperCase()} confirmed.` 
      });

      // Trigger WhatsApp
      const waMessage = `Villagio Order #${savedOrder._id.slice(-6).toUpperCase()} placed by ${deliveryAddress.firstName}. Total: KSh ${total.toLocaleString()}.`;
      const waUrl = `https://wa.me/254115566775?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');
      
      navigate(`/order-tracking/${savedOrder._id}`);
    } catch (error: any) {
      toast({
        title: 'Order Failed',
        description: error.response?.data?.message || 'Failed to place order. Try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products before checking out</p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-muted/50 py-8">
        <div className="container px-4">
          <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="font-display text-3xl font-bold">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {step > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className="font-sm md:font-medium whitespace-nowrap">Delivery</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {step > 2 ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <span className="font-sm md:font-medium whitespace-nowrap">Payment</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span className="font-sm md:font-medium whitespace-nowrap">Confirm</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Delivery Address */}
              {step === 1 && (
                <motion.div 
                   initial={{ opacity: 0, x: -20 }} 
                   animate={{ opacity: 1, x: 0 }}
                   className="bg-card rounded-2xl p-6 shadow-card"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-xl font-semibold">Delivery Address</h2>
                  </div>
                  
                  <form onSubmit={handleSubmitAddress} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          value={deliveryAddress.firstName}
                          onChange={handleAddressChange}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={deliveryAddress.lastName}
                          onChange={handleAddressChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number (M-Pesa)</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        type="tel"
                        placeholder="254700123456"
                        value={deliveryAddress.phone}
                        onChange={handleAddressChange}
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="streetAddress">Street Address</Label>
                      <Input 
                        id="streetAddress" 
                        name="streetAddress"
                        placeholder="House/Apartment number, Street name"
                        value={deliveryAddress.streetAddress}
                        onChange={handleAddressChange}
                        required 
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          name="city"
                          placeholder="Nairobi"
                          value={deliveryAddress.city}
                          onChange={handleAddressChange}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="county">County</Label>
                        <Input 
                          id="county" 
                          name="county"
                          placeholder="Nairobi County"
                          value={deliveryAddress.county}
                          onChange={handleAddressChange}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input 
                          id="postalCode" 
                          name="postalCode"
                          placeholder="00100"
                          value={deliveryAddress.postalCode}
                          onChange={handleAddressChange}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full">
                      Continue to Payment
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card rounded-2xl p-6 shadow-card"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-xl font-semibold">Payment Method</h2>
                  </div>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-colors cursor-pointer ${paymentMethod === 'mpesa' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <RadioGroupItem value="mpesa" id="mpesa" />
                      <Label htmlFor="mpesa" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-[#00A651] flex items-center justify-center">
                            <Smartphone className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">M-Pesa</div>
                            <div className="text-sm text-muted-foreground">Lipa na M-Pesa Online (STK Push)</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-colors cursor-pointer ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <Truck className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="font-semibold">Cash on Delivery</div>
                            <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={() => setStep(3)} className="flex-1">
                      Review Order
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Order Review */}
              {step === 3 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Delivery Info */}
                  <div className="bg-card rounded-2xl p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h3 className="font-display text-lg font-semibold">Delivery Address</h3>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Edit</Button>
                    </div>
                    <p className="text-foreground">
                      {deliveryAddress.firstName} {deliveryAddress.lastName}
                    </p>
                    <p className="text-muted-foreground">
                      {deliveryAddress.streetAddress}, {deliveryAddress.city}
                    </p>
                    <p className="text-muted-foreground">{deliveryAddress.phone}</p>
                  </div>
                  
                  {/* Payment Info */}
                  <div className="bg-card rounded-2xl p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h3 className="font-display text-lg font-semibold">Payment Method</h3>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setStep(2)}>Edit</Button>
                    </div>
                    <p className="text-foreground capitalize">
                      {paymentMethod === 'mpesa' ? 'M-Pesa' : paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
                    </p>
                  </div>
                  
                  {/* Order Items */}
                  <div className="bg-card rounded-2xl p-6 shadow-card">
                    <h3 className="font-display text-lg font-semibold mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-4">
                          <img 
                            src={item.product.images?.[0] || '/placeholder-product.jpg'} 
                            alt={item.product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <div className="font-semibold">
                            KSh {(item.product.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button 
                      onClick={handlePlaceOrder} 
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-card sticky top-32">
                <h3 className="font-display text-lg font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>KSh {(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-primary' : ''}>
                      {deliveryFee === 0 ? 'Free' : `KSh ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free delivery on orders above KSh 2,000
                    </p>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary text-xl">KSh {total.toLocaleString()}</span>
                  </div>

                  {deliveryEstimate && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10 flex items-center gap-3">
                      <Truck className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Estimated Delivery</p>
                        <p className="text-sm font-bold text-foreground">{deliveryEstimate}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 p-4 bg-leaf-light rounded-xl">
                    <div className="flex items-center gap-2 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="text-sm font-medium">Verified Payment</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Villagio uses end-to-end encryption for security.
                    </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Checkout;
