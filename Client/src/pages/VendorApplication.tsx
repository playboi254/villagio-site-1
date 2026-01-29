import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Store, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Truck,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import MainLayout from '@/components/layout/MainLayout';
import { toast } from '@/hooks/use-toast';

const VendorApplication: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Farm Info
    farmName: '',
    farmLocation: '',
    farmDescription: '',
    farmSize: '',
    // Products Info
    productCategories: [] as string[],
    sampleProducts: '',
    hasDelivery: false,
    deliveryAreas: '',
    // Agreement
    agreeTerms: false,
    agreePolicies: false,
  });

  const productOptions = [
    'Fresh Vegetables',
    'Fruits',
    'Dairy & Eggs',
    'Herbs & Spices',
    'Grains & Cereals',
    'Organic Products',
    'Processed Foods',
    'Beverages',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms || !formData.agreePolicies) {
      toast({ title: 'Error', description: 'Please agree to the terms and policies', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setStep(4); // Success step
    
    toast({ title: 'Application Submitted!', description: 'We will review your application and get back to you within 48 hours.' });
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
        return;
      }
    }
    if (step === 2) {
      if (!formData.farmName || !formData.farmLocation) {
        toast({ title: 'Error', description: 'Please fill in farm details', variant: 'destructive' });
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <MainLayout>
      <div className="min-h-[80vh] bg-muted/30 py-12">
        <div className="container max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <Store className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Become a Vendor</h1>
            <p className="text-muted-foreground">Join our network of local farmers and vendors</p>
          </motion.div>

          {/* Progress Steps */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-2 mb-10">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    step >= s ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`w-16 h-1 rounded ${step > s ? 'bg-secondary' : 'bg-muted'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Form Card */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-2xl shadow-card p-8"
          >
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-secondary" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+254 700 123 456"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Farm Details */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Store className="h-5 w-5 text-secondary" />
                  Farm Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="farmName">Farm/Business Name *</Label>
                    <Input
                      id="farmName"
                      name="farmName"
                      value={formData.farmName}
                      onChange={handleChange}
                      placeholder="Happy Harvest Farm"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="farmLocation">Farm Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="farmLocation"
                        name="farmLocation"
                        value={formData.farmLocation}
                        onChange={handleChange}
                        placeholder="Kiambu, Kenya"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="farmSize">Farm Size (approximate)</Label>
                    <Input
                      id="farmSize"
                      name="farmSize"
                      value={formData.farmSize}
                      onChange={handleChange}
                      placeholder="e.g., 5 acres"
                    />
                  </div>
                  <div>
                    <Label htmlFor="farmDescription">Tell us about your farm</Label>
                    <Textarea
                      id="farmDescription"
                      name="farmDescription"
                      value={formData.farmDescription}
                      onChange={handleChange}
                      placeholder="Describe your farm, farming practices, and what makes your products special..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Products & Terms */}
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Package className="h-5 w-5 text-secondary" />
                  Products & Delivery
                </h2>
                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Product Categories *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {productOptions.map((category) => (
                        <label
                          key={category}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                            formData.productCategories.includes(category)
                              ? 'border-secondary bg-secondary/10'
                              : 'border-border hover:bg-muted/50'
                          }`}
                        >
                          <Checkbox
                            checked={formData.productCategories.includes(category)}
                            onCheckedChange={() => handleCategoryToggle(category)}
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sampleProducts">Sample Products</Label>
                    <Textarea
                      id="sampleProducts"
                      name="sampleProducts"
                      value={formData.sampleProducts}
                      onChange={handleChange}
                      placeholder="List some of the products you plan to sell (e.g., Tomatoes, Sukuma Wiki, Fresh Milk...)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={formData.hasDelivery}
                        onCheckedChange={(checked) => setFormData({ ...formData, hasDelivery: checked as boolean })}
                      />
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">I can provide my own delivery</span>
                      </div>
                    </label>
                    
                    {formData.hasDelivery && (
                      <div className="pl-7">
                        <Label htmlFor="deliveryAreas">Delivery Areas</Label>
                        <Input
                          id="deliveryAreas"
                          name="deliveryAreas"
                          value={formData.deliveryAreas}
                          onChange={handleChange}
                          placeholder="e.g., Nairobi, Kiambu, Thika"
                        />
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-6 space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <Checkbox
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-muted-foreground">
                        I agree to the <Link to="/terms" className="text-secondary hover:underline">Terms of Service</Link> and 
                        understand the vendor guidelines.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <Checkbox
                        checked={formData.agreePolicies}
                        onCheckedChange={(checked) => setFormData({ ...formData, agreePolicies: checked as boolean })}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-muted-foreground">
                        I agree to maintain quality standards and follow Villagio's <Link to="/vendor-policies" className="text-secondary hover:underline">vendor policies</Link>.
                      </span>
                    </label>
                  </div>
                </div>
              </form>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Application Submitted!</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Thank you for applying to become a Villagio vendor. Our team will review your application 
                  and get back to you within 48 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" asChild>
                    <Link to="/">Return to Home</Link>
                  </Button>
                  <Button className="bg-secondary hover:bg-secondary-light" asChild>
                    <Link to="/vendors">Browse Vendors</Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                {step > 1 ? (
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                
                {step < 3 ? (
                  <Button className="bg-secondary hover:bg-secondary-light" onClick={nextStep}>
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    className="bg-secondary hover:bg-secondary-light" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VendorApplication;
