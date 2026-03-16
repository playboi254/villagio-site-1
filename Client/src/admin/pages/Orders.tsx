import { useState } from "react";
import { format } from "date-fns";
import { Search, Download, ShoppingCart, Clock, CheckCircle, XCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/admin/components/ui/card";
import { Button } from "@/admin/components/ui/button";
import { Input } from "@/admin/components/ui/input";
import { Badge } from "@/admin/components/ui/badge";
import { useAdminOrders } from "@/admin/hooks/useAdminOrders";
import { useAdminCustomers } from "@/admin/hooks/useAdminCustomers";
import { useAdminProducts } from "@/admin/hooks/useAdminProducts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/admin/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/admin/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/admin/components/ui/dialog";
import { Label } from "@/admin/components/ui/label";
import { toast } from "@/admin/hooks/use-toast";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  confirmed: "bg-info/10 text-info border-info/20",
  shipped: "bg-accent/10 text-accent border-accent/20",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Orders() {
  const { orders, isLoading, updateOrderStatus, createOrder, isCreating } = useAdminOrders();
  const { customers } = useAdminCustomers();
  const { products } = useAdminProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // New Order State
  const [newOrder, setNewOrder] = useState({
    consumerId: "",
    items: [] as Array<{ productId: string; quantity: number; price: number }>,
    paymentMethod: "cash_on_delivery",
    deliveryAddress: {
      phone: "",
      streetAddress: "",
      city: "Nairobi",
      county: "Nairobi",
      postalCode: "00100",
    },
  });

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.consumer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         o._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatus({ id, status: newStatus });
      toast({ title: "Updated", description: `Order status set to ${newStatus}` });
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrder.items.length === 0) {
      toast({ title: "Error", description: "Please add at least one item", variant: "destructive" });
      return;
    }
    try {
      await createOrder({
        ...newOrder,
        items: newOrder.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      });
      toast({ title: "Success", description: "Order created successfully" });
      setIsAddDialogOpen(false);
      setNewOrder({
        consumerId: "",
        items: [],
        paymentMethod: "cash_on_delivery",
        deliveryAddress: { phone: "", streetAddress: "", city: "Nairobi", county: "Nairobi", postalCode: "00100" },
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to create order", variant: "destructive" });
    }
  };

  const addItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productId: "", quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // If product changed, update price automatically
    if (field === 'productId') {
      const product = products.find(p => p._id === value);
      if (product) {
        updatedItems[index].price = product.price;
      }
    }
    
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const stats = [
    { label: "Total Orders", value: orders.length.toString(), icon: ShoppingCart, color: "accent" },
    { label: "Pending", value: orders.filter(o => o.status === 'pending').length.toString(), icon: Clock, color: "warning" },
    { label: "Completed", value: orders.filter(o => o.status === 'delivered').length.toString(), icon: CheckCircle, color: "success" },
    { label: "Cancelled", value: orders.filter(o => o.status === 'cancelled').length.toString(), icon: XCircle, color: "destructive" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage and track all customer orders</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Manual Order</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateOrder} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Select Customer</Label>
                  <Select value={newOrder.consumerId} onValueChange={val => setNewOrder({...newOrder, consumerId: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name} ({c.email})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Order Items</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>Add Item</Button>
                  </div>
                  {newOrder.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end border p-2 rounded-lg">
                      <div className="col-span-6 space-y-1">
                        <Label className="text-[10px]">Product</Label>
                        <Select value={item.productId} onValueChange={val => updateItem(index, 'productId', val)}>
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map(p => (
                              <SelectItem key={p._id} value={p._id}>{p.name} - KES {p.price}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3 space-y-1">
                        <Label className="text-[10px]">Qty</Label>
                        <Input 
                          type="number" 
                          className="h-8" 
                          value={item.quantity} 
                          onChange={e => updateItem(index, 'quantity', parseInt(e.target.value))} 
                        />
                      </div>
                      <div className="col-span-2 text-xs font-bold pt-6">
                        KES {item.price * item.quantity}
                      </div>
                      <div className="col-span-1">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Delivery Street</Label>
                    <Input value={newOrder.deliveryAddress.streetAddress} onChange={e => setNewOrder({...newOrder, deliveryAddress: {...newOrder.deliveryAddress, streetAddress: e.target.value}})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Recipient Phone</Label>
                    <Input value={newOrder.deliveryAddress.phone} onChange={e => setNewOrder({...newOrder, deliveryAddress: {...newOrder.deliveryAddress, phone: e.target.value}})} required />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={isCreating} className="w-full">
                    {isCreating ? "Processing..." : "Create Order"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => {
            const csv = [
              ["Order ID", "Customer", "Total", "Status", "Date"].join(","),
              ...filteredOrders.map(o => [o._id, o.consumer?.name, o.totalAmount, o.status, format(new Date(o.createdAt), 'yyyy-MM-dd')].join(","))
            ].join("\n");
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `orders-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
            a.click();
          }}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card border-0">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-emerald-500/10`}>
                <stat.icon className={`h-5 w-5 text-emerald-500`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card border-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-xs">#{order._id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell className="font-medium">{order.consumer?.name || "Guest"}</TableCell>
                  <TableCell className="text-xs">{order.consumer?.phone || "N/A"}</TableCell>
                  <TableCell className="font-bold">KES {order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={statusStyles[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(order.createdAt), "MMM d, HH:mm")}
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      title="Notify via WhatsApp"
                      onClick={() => {
                        const message = `Halo Villagio, New order #${order._id.slice(-6).toUpperCase()} from ${order.consumer?.name || "Customer"}. Total: KES ${order.totalAmount}. Status: ${order.status}.`;
                        window.open(`https://wa.me/254115566775?text=${encodeURIComponent(message)}`, "_blank");
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.446 4.435-9.879 9.883-9.879 2.64 0 5.122 1.03 6.987 2.898a9.825 9.825 0 012.893 6.994c-.003 5.446-4.437 9.880-9.885 9.880m8.415-18.297A11.815 11.815 0 0012.05 0C5.445 0 .081 5.363.078 11.969c0 2.112.551 4.172 1.597 6.011L0 24l6.193-1.623c1.78.97 3.793 1.484 5.845 1.485h.005c6.604 0 11.967-5.362 11.97-11.97a11.83 11.83 0 00-3.504-8.452" />
                      </svg>
                    </Button>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(val) => handleStatusUpdate(order._id, val)}
                    >
                      <SelectTrigger className="ml-auto h-8 w-[120px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
