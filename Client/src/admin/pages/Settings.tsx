import { useState, useEffect } from "react";
import { User as UserIcon, Lock, Bell, Globe, DollarSign, Upload, Loader2, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/admin/components/ui/card";
import { Button } from "@/admin/components/ui/button";
import { Input } from "@/admin/components/ui/input";
import { Label } from "@/admin/components/ui/label";
import { Switch } from "@/admin/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/admin/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/admin/components/ui/avatar";
import { Badge } from "@/admin/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/admin/components/ui/select";
import { useAdminSettings } from "@/admin/hooks/useAdminSettings";
import { useAdminAuth } from "@/admin/context/useAdminAuth";
import { toast } from "@/admin/hooks/use-toast";

export default function Settings() {
  const { profile, isLoading, updateProfile, isUpdating } = useAdminSettings();
  const { updateAdmin } = useAdminAuth();
  const [accountData, setAccountData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (profile) {
      setAccountData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateProfile(accountData);
      if (res.user) updateAdmin(res.user);
      toast({ title: "Success", description: "Account information updated" });
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to update account", variant: "destructive" });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    try {
      await updateProfile({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });
      toast({ title: "Success", description: "Password updated successfully" });
      setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.response?.data?.message || "Failed to update password", 
        variant: "destructive" 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and platform preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-auto lg:inline-grid gap-1 h-auto p-1">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Platform</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal information and profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar ? `http://localhost:8000/${profile.avatar.replace(/^\//, '')}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name}`} />
                  <AvatarFallback className="bg-accent text-accent-foreground text-2xl uppercase">
                    {profile?.name?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append('avatar', file);
                        try {
                          const res = await updateProfile(formData);
                          if (res.user) updateAdmin(res.user);
                          toast({ title: "Success", description: "Profile photo updated" });
                        } catch (err) {
                          toast({ title: "Error", description: "Failed to upload photo", variant: "destructive" });
                        }
                      }
                    }}
                  />
                  <Button variant="outline" onClick={() => document.getElementById('avatar-upload')?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <form onSubmit={handleUpdateAccount} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={accountData.name} onChange={e => setAccountData({...accountData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={accountData.email} onChange={e => setAccountData({...accountData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={accountData.phone} onChange={e => setAccountData({...accountData, phone: e.target.value})} />
                  </div>
                </div>
                <Button type="submit" disabled={isUpdating} className="bg-accent hover:bg-accent/90">
                  {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" value={securityData.currentPassword} onChange={e => setSecurityData({...securityData, currentPassword: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={securityData.newPassword} onChange={e => setSecurityData({...securityData, newPassword: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={securityData.confirmPassword} onChange={e => setSecurityData({...securityData, confirmPassword: e.target.value})} required />
                </div>
                <Button type="submit" disabled={isUpdating} className="bg-accent hover:bg-accent/90">
                  Update Password
                </Button>
              </form>

              <div className="pt-6 border-t">
                <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          {/* Notifications UI remains the same but purely visual as requested */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "New Orders", description: "Get notified when new orders are placed" },
                { title: "Order Updates", description: "Updates on order status changes" },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>Configure your platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Commission Rate (%)</Label>
                  <Input type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="kes">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kes">KES - Kenyan Shilling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="bg-accent hover:bg-accent/90">Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your platform subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg text-accent text-primary">Villagio Enterprise</p>
                    <p className="text-sm text-muted-foreground">Unlimited vendors & orders</p>
                  </div>
                  <Badge className="bg-success">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
