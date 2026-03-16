import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MapPin, Package, Heart, Settings, LogOut,
  Edit, Plus, Phone, Mail, Camera, Upload, Loader2,
  ShoppingBag, X, ImagePlus, Tag, FileText, CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockUser } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProductForm {
  name: string;
  price: string;
  unit: string;
  category: string;
  description: string;
  stock: string;
}

const EMPTY_PRODUCT: ProductForm = {
  name: '', price: '', unit: 'kg', category: '', description: '', stock: '',
};

const CATEGORIES = [
  'Vegetables', 'Fruits', 'Dairy & Eggs', 'Cereals & Grains',
  'Herbs & Spices', 'Meat & Poultry', 'Other',
];

const UNITS = ['kg', 'g', 'litre', 'piece', 'bunch', 'crate', 'bag', 'dozen'];

// ✅ FIX 2: Convert relative upload paths to full URLs
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  // Remove leading slash if present, then prepend backend base URL
  const clean = imagePath.replace(/^\//, '');
  return `http://localhost:8000/${clean}`;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Profile: React.FC = () => {
  const { user, logout, updateProfile, updateAvatar } = useAuth();

  // Avatar
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar ? getImageUrl(user.avatar) : null
  );
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Profile edit
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: user?.email || mockUser.email,
    phone: user?.phone || mockUser.phone,
  });

  // Products state
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productPreviews, setProductPreviews] = useState<string[]>([]);
  const [productForm, setProductForm] = useState<ProductForm>(EMPTY_PRODUCT);
  const [productImages, setProductImages] = useState<File[]>([]);
  const productImageRef = useRef<HTMLInputElement>(null);

  // Orders state
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const fetchMyProducts = useCallback(async () => {
    if (!user?.id) return;
    setProductsLoading(true);
    try {
      const res = await api.get('/products');
      const mine = res.data.filter((p: any) => {
        const farmerId = p.farmer?._id || p.farmer;
        return farmerId?.toString() === user.id;
      });
      setMyProducts(mine);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setProductsLoading(false);
    }
  }, [user?.id]);

  const fetchMyOrders = useCallback(async () => {
    if (!user?.id) return;
    setOrdersLoading(true);
    try {
      const res = await api.get('/orders/my-orders');
      setMyOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchMyOrders();
    fetchMyProducts();
  }, [fetchMyOrders, fetchMyProducts]);

  // ── Avatar ──────────────────────────────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      toast({ title: 'Invalid file type', description: 'Use JPG, PNG, or WebP.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 5MB.', variant: 'destructive' });
      return;
    }
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarUploading(true);
    try {
      const url = await updateAvatar(file);
      setAvatarPreview(getImageUrl(url));
      toast({ title: 'Photo updated!' });
    } catch {
      setAvatarPreview(user?.avatar ? getImageUrl(user.avatar) : null);
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setAvatarUploading(false);
    }
  };

  // ── Profile save ────────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.email,
        phone: profileData.phone,
      });
      setIsEditing(false);
      toast({ title: 'Profile updated!' });
    } catch {
      toast({ title: 'Update failed', variant: 'destructive' });
    }
  };

  // ── Product images ──────────────────────────────────────────────────────────
  const handleProductImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter(f =>
      f.type.match(/image\/(jpeg|jpg|png|webp)/) && f.size <= 5 * 1024 * 1024
    );
    if (valid.length !== files.length) {
      toast({ title: 'Some files skipped', description: 'JPG/PNG/WebP under 5MB only.', variant: 'destructive' });
    }
    if (productImages.length + valid.length > 4) {
      toast({ title: 'Max 4 images allowed', variant: 'destructive' });
      return;
    }
    setProductImages(prev => [...prev, ...valid]);
    setProductPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeProductImage = (i: number) => {
    setProductImages(prev => prev.filter((_, idx) => idx !== i));
    setProductPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  // ── Product submit ──────────────────────────────────────────────────────────
  const handleAddProduct = async () => {
    if (!productForm.name.trim()) {
      toast({ title: 'Product name is required', variant: 'destructive' }); return;
    }
    if (!productForm.price || Number(productForm.price) <= 0) {
      toast({ title: 'Enter a valid price', variant: 'destructive' }); return;
    }
    if (!productForm.category) {
      toast({ title: 'Select a category', variant: 'destructive' }); return;
    }
    if (productImages.length === 0) {
      toast({ title: 'Add at least one image', variant: 'destructive' }); return;
    }

    setProductSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', productForm.name.trim());
      formData.append('price', productForm.price);
      formData.append('unit', productForm.unit);
      formData.append('category', productForm.category);
      formData.append('description', productForm.description.trim());
      formData.append('stock', productForm.stock || '0');
      productImages.forEach(img => formData.append('images', img));

      const res = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMyProducts(prev => [res.data.product, ...prev]);
      setProductForm(EMPTY_PRODUCT);
      setProductImages([]);
      setProductPreviews([]);
      toast({ title: '✅ Product listed!', description: `"${productForm.name}" is now live.` });
    } catch (err: any) {
      toast({
        title: 'Failed to add product',
        description: err?.response?.data?.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setProductSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':  return 'bg-primary/10 text-primary';
      case 'confirmed': return 'bg-orange-100 text-orange-600';
      case 'shipped':    return 'bg-sky-100 text-sky-600';
      case 'cancelled':  return 'bg-destructive/10 text-destructive';
      default:           return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <MainLayout>
      {/* ── Hero ── */}
      <section className="bg-muted/50 py-12">
        <div className="container">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center ring-4 ring-white shadow-md">
                {avatarPreview
                  ? <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                  : <User className="h-12 w-12 text-primary" />}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {avatarUploading ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <Camera className="h-6 w-6 text-white" />}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow pointer-events-none">
                <Camera className="h-4 w-4" />
              </div>
              <input ref={avatarInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">{user?.name || `${mockUser.firstName} ${mockUser.lastName}`}</h1>
              <p className="text-muted-foreground">{user?.email || mockUser.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Member since {new Date(mockUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-primary mt-1 cursor-pointer hover:underline" onClick={() => avatarInputRef.current?.click()}>
                {avatarUploading ? 'Uploading...' : 'Change profile photo'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <section className="py-12">
        <div className="container">
          <Tabs defaultValue="orders" className="space-y-8">
            <TabsList className="bg-muted/50 p-1 flex-wrap h-auto gap-1">
              <TabsTrigger value="orders"    className="gap-2"><Package     className="h-4 w-4" />Orders</TabsTrigger>
              <TabsTrigger value="products"  className="gap-2"><ShoppingBag className="h-4 w-4" />My Products</TabsTrigger>
              <TabsTrigger value="addresses" className="gap-2"><MapPin      className="h-4 w-4" />Addresses</TabsTrigger>
              <TabsTrigger value="wishlist"  className="gap-2"><Heart       className="h-4 w-4" />Wishlist</TabsTrigger>
              <TabsTrigger value="settings"  className="gap-2"><Settings    className="h-4 w-4" />Settings</TabsTrigger>
            </TabsList>

            {/* ── Orders Tab ── */}
            <TabsContent value="orders">
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold">Order History</h2>
                {ordersLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading your orders...</span>
                  </div>
                ) : myOrders.length === 0 ? (
                  <Card><CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                    <Button asChild><Link to="/products">Browse Products</Link></Button>
                  </CardContent></Card>
                ) : (
                  <div className="space-y-4">
                    {myOrders.map((order, index) => (
                      <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                        <Card><CardContent className="p-6">
                          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-sm font-mono break-all">{order._id}</h3>
                                <Badge variant="secondary" className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">KSh {order.totalAmount.toLocaleString()}</div>
                              <p className="text-sm text-muted-foreground">{order.items?.length || 0} items</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {order.items?.map((item: any, i: number) => (
                              <Badge key={i} variant="outline">{item.product?.name || 'Product'} × {item.quantity}</Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild><Link to={`/order-tracking/${order._id}`}>Track Order</Link></Button>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </div>
                        </CardContent></Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── My Products Tab ── */}
            <TabsContent value="products">
              <div className="space-y-8 max-w-2xl">

                {/* Add Product Form */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5 text-primary" />
                      Add New Product
                    </CardTitle>
                    <CardDescription>List your product on the Villagio marketplace</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">

                    {/* Image upload grid */}
                    <div>
                      <Label className="mb-2 block">
                        Product Images <span className="text-destructive">*</span>
                        <span className="text-xs text-muted-foreground font-normal ml-2">({productImages.length}/4)</span>
                      </Label>
                      <div className="grid grid-cols-4 gap-3">
                        {productPreviews.map((src, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/20 group">
                            <img src={src} alt={`img-${i}`} className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeProductImage(i)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            {i === 0 && (
                              <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-xs text-center py-0.5">
                                Main photo
                              </span>
                            )}
                          </div>
                        ))}
                        {productImages.length < 4 && (
                          <button
                            onClick={() => productImageRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/60 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary"
                          >
                            <ImagePlus className="h-6 w-6" />
                            <span className="text-xs font-medium">Add photo</span>
                          </button>
                        )}
                      </div>
                      <input ref={productImageRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple className="hidden" onChange={handleProductImages} />
                      <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG or WebP · Max 5MB each · First image is the main photo</p>
                    </div>

                    {/* Product name */}
                    <div>
                      <Label htmlFor="pName" className="mb-1.5 block">
                        <Tag className="h-3.5 w-3.5 inline mr-1" />
                        Product Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="pName"
                        placeholder="e.g. Fresh Organic Tomatoes"
                        value={productForm.name}
                        onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>

                    {/* Price + Unit */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pPrice" className="mb-1.5 block">
                          Price (KSh) <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none">KSh</span>
                          <Input
                            id="pPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-12"
                            value={productForm.price}
                            onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="mb-1.5 block">Unit</Label>
                        <Select value={productForm.unit} onValueChange={v => setProductForm(p => ({ ...p, unit: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Category + Stock */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-1.5 block">
                          Category <span className="text-destructive">*</span>
                        </Label>
                        <Select value={productForm.category} onValueChange={v => setProductForm(p => ({ ...p, category: v }))}>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="pStock" className="mb-1.5 block">Stock Qty</Label>
                        <Input
                          id="pStock"
                          type="number"
                          min="0"
                          placeholder="e.g. 50"
                          value={productForm.stock}
                          onChange={e => setProductForm(p => ({ ...p, stock: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="pDesc" className="mb-1.5 block">
                        <FileText className="h-3.5 w-3.5 inline mr-1" />
                        Description
                      </Label>
                      <Textarea
                        id="pDesc"
                        placeholder="Describe your product — freshness, origin, how it's grown..."
                        rows={3}
                        value={productForm.description}
                        onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                      />
                    </div>

                    <Button onClick={handleAddProduct} disabled={productSubmitting} className="w-full h-11">
                      {productSubmitting
                        ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Listing product...</>
                        : <><Plus className="h-4 w-4 mr-2" />List Product</>}
                    </Button>
                  </CardContent>
                </Card>

                {/* Listed products */}
                <div className="space-y-3">
                  {productsLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground py-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Loading your products...</span>
                    </div>
                  ) : myProducts.length > 0 ? (
                    <>
                      <h3 className="font-display text-xl font-bold">My Listed Products ({myProducts.length})</h3>
                      <AnimatePresence>
                        {myProducts.map((product, i) => (
                          <motion.div key={product._id || i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <Card>
                              <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                  {product.images?.[0]
                                    // ✅ FIX 2: Use getImageUrl to build full URL
                                    ? <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="h-6 w-6 text-muted-foreground" /></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold truncate">{product.name}</p>
                                  <p className="text-sm text-muted-foreground">{product.category}</p>
                                  <p className="text-sm font-medium text-primary">KSh {Number(product.price).toLocaleString()} / {product.unit}</p>
                                </div>
                                <Badge variant="secondary" className="bg-primary/10 text-primary flex-shrink-0">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />Listed
                                </Badge>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Card>
                      <CardContent className="py-10 text-center">
                        <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="font-medium">No products listed yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Add your first product above</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* ── Addresses Tab ── */}
            <TabsContent value="addresses">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold">Saved Addresses</h2>
                  <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Address</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {mockUser.addresses.map((address) => (
                    <Card key={address.id} className={address.isDefault ? 'border-primary' : ''}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={address.isDefault ? 'default' : 'secondary'}>{address.label}</Badge>
                            {address.isDefault && <Badge variant="outline" className="text-primary border-primary">Default</Badge>}
                          </div>
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        </div>
                        <p>{address.street}</p>
                        <p className="text-muted-foreground">{address.city}, {address.state} {address.zip}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ── Wishlist Tab ── */}
            <TabsContent value="wishlist">
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold">My Wishlist</h2>
                <Card><CardContent className="py-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-4">Save items you love to your wishlist</p>
                  <Button asChild><a href="/products">Explore Products</a></Button>
                </CardContent></Card>
              </div>
            </TabsContent>

            {/* ── Settings Tab ── */}
            <TabsContent value="settings">
              <div className="max-w-2xl space-y-6">

                <Card>
                  <CardHeader>
                    <CardTitle>Profile Photo</CardTitle>
                    <CardDescription>Upload a photo to personalise your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center ring-2 ring-border">
                        {avatarPreview ? <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" /> : <User className="h-10 w-10 text-primary" />}
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" onClick={() => avatarInputRef.current?.click()} disabled={avatarUploading}>
                          {avatarUploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</> : <><Upload className="h-4 w-4 mr-2" />Upload Photo</>}
                        </Button>
                        <p className="text-xs text-muted-foreground">JPG, PNG or WebP · Max 5MB</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                      </div>
                      {!isEditing && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />Edit
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div><Label>First Name</Label><Input value={profileData.firstName} onChange={e => setProfileData(p => ({ ...p, firstName: e.target.value }))} /></div>
                          <div><Label>Last Name</Label><Input value={profileData.lastName} onChange={e => setProfileData(p => ({ ...p, lastName: e.target.value }))} /></div>
                        </div>
                        <div><Label>Email</Label><Input type="email" value={profileData.email} onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))} /></div>
                        <div><Label>Phone</Label><Input value={profileData.phone} onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))} /></div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveProfile}>Save Changes</Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3"><User className="h-5 w-5 text-muted-foreground" /><span>{profileData.firstName} {profileData.lastName}</span></div>
                        <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-muted-foreground" /><span>{profileData.email}</span></div>
                        <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-muted-foreground" /><span>{profileData.phone}</span></div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
};

export default Profile;