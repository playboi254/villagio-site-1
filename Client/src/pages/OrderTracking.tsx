import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Phone,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import MainLayout from '@/components/layout/MainLayout';
import { orders } from '@/data/mockData';

const OrderTracking: React.FC = () => {
  const { orderId } = useParams();
  
  // Find order or use mock data for new orders
  const order = orders.find(o => o.id === orderId) || {
    id: orderId || 'ORD-123456',
    status: 'processing',
    items: [
      { productId: '1', name: 'Organic Tomatoes', quantity: 2, price: 120 },
      { productId: '5', name: 'Farm Fresh Milk', quantity: 1, price: 60 },
    ],
    subtotal: 300,
    deliveryFee: 0,
    total: 300,
    deliveryAddress: {
      street: 'Kimathi Street',
      city: 'Nairobi',
      state: 'Nairobi County',
      zip: '00100',
    },
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 3600000 * 2).toISOString(),
  };

  const trackingSteps = [
    {
      id: 1,
      title: 'Order Placed',
      description: 'Your order has been confirmed',
      time: new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      completed: true,
      icon: ShoppingBag,
    },
    {
      id: 2,
      title: 'Processing',
      description: 'Your order is being prepared',
      time: order.status !== 'pending' ? '10 mins ago' : null,
      completed: ['processing', 'shipped', 'delivered'].includes(order.status),
      icon: Package,
    },
    {
      id: 3,
      title: 'Out for Delivery',
      description: 'Your order is on its way',
      time: order.status === 'shipped' || order.status === 'delivered' ? '30 mins ago' : null,
      completed: ['shipped', 'delivered'].includes(order.status),
      icon: Truck,
    },
    {
      id: 4,
      title: 'Delivered',
      description: 'Order has been delivered',
      time: order.status === 'delivered' && 'deliveredAt' in order && order.deliveredAt 
        ? new Date(order.deliveredAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : null,
      completed: order.status === 'delivered',
      icon: CheckCircle,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-primary text-primary-foreground';
      case 'processing':
        return 'bg-orange text-white';
      case 'shipped':
        return 'bg-sky text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-muted/50 py-8">
        <div className="container">
          <Link to="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
          
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">Track Order</h1>
              <p className="text-muted-foreground">Order ID: {order.id}</p>
            </div>
            <Badge className={`text-sm px-4 py-2 ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Tracking Timeline */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold mb-6">Order Status</h2>
                  
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                    
                    <div className="space-y-8">
                      {trackingSteps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative flex items-start gap-4"
                        >
                          <div className={`
                            relative z-10 w-12 h-12 rounded-full flex items-center justify-center
                            ${step.completed 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                            }
                          `}>
                            <step.icon className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-semibold ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step.title}
                              </h3>
                              {step.time && (
                                <span className="text-sm text-muted-foreground">{step.time}</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {order.status !== 'delivered' && (
                    <div className="mt-8 p-4 bg-leaf-light rounded-xl">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">Estimated Delivery</p>
                          <p className="text-sm text-muted-foreground">
                            Today by {new Date(Date.now() + 3600000 * 2).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold mb-4">Delivery Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">Delivery Address</span>
                      </div>
                      <p className="text-foreground">{order.deliveryAddress.street}</p>
                      <p className="text-muted-foreground">
                        {order.deliveryAddress.city}, {order.deliveryAddress.state}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm font-medium">Contact Support</span>
                      </div>
                      <p className="text-foreground">+254 700 123 456</p>
                      <p className="text-muted-foreground">Available 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-32">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-4 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium">KSh {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>KSh {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className={order.deliveryFee === 0 ? 'text-primary' : ''}>
                        {order.deliveryFee === 0 ? 'Free' : `KSh ${order.deliveryFee}`}
                      </span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">KSh {order.total.toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <Button variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Driver
                    </Button>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default OrderTracking;
