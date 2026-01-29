import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Users, 
  Truck, 
  Shield, 
  Heart, 
  Target,
  Award,
  Sprout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

const About: React.FC = () => {
  const values = [
    {
      icon: Leaf,
      title: 'Fresh & Organic',
      description: 'We source only the freshest, organically grown produce directly from certified Kenyan farms.',
    },
    {
      icon: Users,
      title: 'Farmer Empowerment',
      description: 'We partner with local farmers, providing them fair prices and access to urban markets.',
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Every product undergoes rigorous quality checks to ensure you receive only the best.',
    },
    {
      icon: Truck,
      title: 'Same-Day Delivery',
      description: 'Fresh from farm to your doorstep within hours, maintaining peak freshness.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Products' },
    { value: '87', label: 'Partner Farms' },
    { value: '10K+', label: 'Happy Customers' },
    { value: '47', label: 'Counties Served' },
  ];

  const team = [
    {
      name: 'David Mwangi',
      role: 'Founder & CEO',
      description: 'Agricultural economist with 15 years in agribusiness development.',
    },
    {
      name: 'Grace Akinyi',
      role: 'Head of Operations',
      description: 'Supply chain expert focused on farm-to-market logistics.',
    },
    {
      name: 'Peter Ochieng',
      role: 'Farmer Relations',
      description: 'Works directly with our network of partner farmers across Kenya.',
    },
    {
      name: 'Mary Wanjiru',
      role: 'Quality Control',
      description: 'Food scientist ensuring every product meets our quality standards.',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              About Villagio Farm Fresh
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Connecting Kenyan farmers directly with consumers, bringing fresh, 
              organic produce from the farm to your table.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/vendors">Meet Our Farmers</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-secondary" />
                </div>
                <span className="text-secondary font-medium">Our Mission</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Transforming Kenya's Agricultural Value Chain
              </h2>
              <p className="text-muted-foreground mb-6">
                Villagio Farm Fresh was founded with a simple yet powerful vision: to bridge 
                the gap between Kenyan farmers and urban consumers. We believe that everyone 
                deserves access to fresh, nutritious, and organically grown produce while 
                ensuring that our hardworking farmers receive fair compensation for their labor.
              </p>
              <p className="text-muted-foreground mb-6">
                Our farm-to-market model eliminates unnecessary middlemen, reducing food waste 
                and ensuring that produce reaches your table at peak freshness. By working 
                directly with farmers across 47 Kenyan counties, we've built a sustainable 
                ecosystem that benefits both producers and consumers.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Sprout className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Our Story</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Started in 2020 by a team of agricultural enthusiasts, Villagio began 
                  as a small operation connecting just 5 farmers in Naivasha with customers 
                  in Nairobi.
                </p>
                <p className="text-muted-foreground mb-4">
                  Today, we've grown to partner with over 87 farms across Kenya, serving 
                  more than 10,000 happy customers. Our commitment to quality, freshness, 
                  and farmer welfare remains unchanged.
                </p>
                <p className="text-muted-foreground">
                  We're not just a marketplace – we're a movement towards sustainable, 
                  ethical food sourcing in Kenya.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything we do is guided by our commitment to freshness, quality, 
              and empowering local farming communities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-card text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="h-6 w-6 text-secondary" />
              <span className="text-secondary font-medium">Our Team</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet the People Behind Villagio</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A passionate team dedicated to transforming how Kenyans access fresh produce.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-card text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-secondary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="h-12 w-12 text-secondary-foreground mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-secondary-foreground mb-4">
              Join the Villagio Family
            </h2>
            <p className="text-secondary-foreground/90 mb-8 max-w-xl mx-auto">
              Whether you're a customer looking for fresh produce or a farmer wanting 
              to reach more customers, we'd love to have you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground" asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10" asChild>
                <Link to="/vendor-application">Become a Partner</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
