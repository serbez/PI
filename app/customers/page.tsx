"use client"

import { useState, useEffect } from "react"
import { BookmasterLogo } from "@/components/bookmaster-logo"
import { AppHeader } from "@/components/app-header"
import { useCustomers } from "@/hooks/use-customers"
import { Customer } from "@/hooks/types/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CustomersPage() {
  const [searchId, setSearchId] = useState("")
  const [searchName, setSearchName] = useState("")
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  

  const { customers, loading, error, search, createCustomer, updateCustomer } = useCustomers()

 
  useEffect(() => {
    search({})
  }, [search])

  const handleSearch = () => {
    search({
      id: searchId,
      name: searchName,
    })
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setShowEditDialog(true)
  }

  const handleAdd = () => {
    setEditingCustomer({
      id: "",
      name: "",
      address: "",
      zip: "",
      city: "",
      phone: "",
      email: "",
    })
    setShowEditDialog(true)
  }

  const handleSave = async () => {
    if (!editingCustomer) return

    try {
      if (editingCustomer.id) {
     
        await updateCustomer(editingCustomer.id, editingCustomer)
      } else {
       
        await createCustomer(editingCustomer)
      }
      setShowEditDialog(false)
      
      search({}) 
    } catch (error) {
      console.error('Failed to save customer:', error)
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-[#c0c0c0] flex items-center justify-center">
        <div>Loading customers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-[#c0c0c0] flex items-center justify-center">
        <div>Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#c0c0c0] flex flex-col">
      <AppHeader title="Customers" />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r-2 border-black p-6 flex flex-col gap-6">
          <BookmasterLogo />

          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="customerId" className="text-base mb-2 block">
                Customer ID
              </Label>
              <Input
                id="customerId"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="h-10 border-2 border-black rounded-none"
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-base mb-2 block">
                Name
              </Label>
              <Input
                id="name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="h-10 border-2 border-black rounded-none"
              />
            </div>

            <Button
              onClick={handleSearch}
              className="h-10 border-2 border-black rounded-none bg-white hover:bg-gray-100 text-black font-normal"
            >
              <span className="mr-2">🔍</span> Search
            </Button>
          </div>

          <div className="flex gap-2 mt-auto">
            <Button
              onClick={() => customers.length > 0 && handleEdit(customers[0])}
              disabled={customers.length === 0}
              className="flex-1 h-10 border-2 border-black rounded-none bg-white hover:bg-gray-100 text-black font-normal disabled:opacity-50"
            >
              Edit...
            </Button>
            <Button
              onClick={handleAdd}
              className="flex-1 h-10 border-2 border-black rounded-none bg-white hover:bg-gray-100 text-black font-normal"
            >
              Add...
            </Button>
          </div>
        </div>

        {/* Main Content - Table fills all available space */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-[#c0c0c0] border-2 border-black border-l-0 flex flex-col overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#c0c0c0] border-b-2 border-black">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-3 border-r-2 border-black font-normal w-[15%]">ID</th>
                    <th className="text-left p-3 border-r-2 border-black font-normal w-[20%]">Name</th>
                    <th className="text-left p-3 border-r-2 border-black font-normal w-[35%]">Address</th>
                    <th className="text-left p-3 border-r-2 border-black font-normal w-[15%]">Zip</th>
                    <th className="text-left p-3 font-normal w-[15%]">City</th>
                  </tr>
                </thead>
              </table>
            </div>

            <div className="flex-1 overflow-auto bg-[#c0c0c0]">
              <table className="w-full">
                <tbody>
                  {customers.map((customer, index) => (
                    <tr
                      key={customer.id}
                      className={`border-b border-gray-300 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                    >
                      <td className="p-3 border-r border-gray-300 w-[15%]">{customer.id}</td>
                      <td className="p-3 border-r border-gray-300 w-[20%]">{customer.name}</td>
                      <td className="p-3 border-r border-gray-300 w-[35%]">{customer.address}</td>
                      <td className="p-3 border-r border-gray-300 w-[15%]">{customer.zip}</td>
                      <td className="p-3 w-[15%]">{customer.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Add Customer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl border-4 border-black rounded-none bg-white p-0">
          <DialogHeader className="border-b-2 border-black bg-white p-4">
            <DialogTitle className="text-xl font-normal">
              {editingCustomer?.id ? 'Edit Customer' : 'Add Customer'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Label htmlFor="edit-id" className="text-base mb-2 block">
                  ID
                </Label>
                <Input
                  id="edit-id"
                  value={editingCustomer?.id || ''}
                  onChange={(e) => setEditingCustomer(prev => prev ? {...prev, id: e.target.value} : null)}
                  className="h-12 border-2 border-black rounded-none"
                  disabled={!!editingCustomer?.id} // Нельзя редактировать ID существующего customer
                />
              </div>

              <div>
                <Label htmlFor="edit-name" className="text-base mb-2 block">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingCustomer?.name || ''}
                  onChange={(e) => setEditingCustomer(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="h-12 border-2 border-black rounded-none"
                />
              </div>

              <div>
                <Label htmlFor="edit-phone" className="text-base mb-2 block">
                  Phone
                </Label>
                <Input
                  id="edit-phone"
                  value={editingCustomer?.phone || ''}
                  onChange={(e) => setEditingCustomer(prev => prev ? {...prev, phone: e.target.value} : null)}
                  className="h-12 border-2 border-black rounded-none"
                />
              </div>

              <div>
                <Label htmlFor="edit-address" className="text-base mb-2 block">
                  Address
                </Label>
                <Input
                  id="edit-address"
                  value={editingCustomer?.address || ''}
                  onChange={(e) => setEditingCustomer(prev => prev ? {...prev, address: e.target.value} : null)}
                  className="h-12 border-2 border-black rounded-none"
                />
              </div>

              <div>
                <Label htmlFor="edit-email" className="text-base mb-2 block">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  value={editingCustomer?.email || ''}
                  onChange={(e) => setEditingCustomer(prev => prev ? {...prev, email: e.target.value} : null)}
                  className="h-12 border-2 border-black rounded-none"
                />
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-zip" className="text-base mb-2 block">
                    Zip
                  </Label>
                  <Input
                    id="edit-zip"
                    value={editingCustomer?.zip || ''}
                    onChange={(e) => setEditingCustomer(prev => prev ? {...prev, zip: e.target.value} : null)}
                    className="h-12 border-2 border-black rounded-none"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-city" className="text-base mb-2 block">
                    City
                  </Label>
                  <Input
                    id="edit-city"
                    value={editingCustomer?.city || ''}
                    onChange={(e) => setEditingCustomer(prev => prev ? {...prev, city: e.target.value} : null)}
                    className="h-12 border-2 border-black rounded-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button 
                onClick={handleSave}
                className="w-32 h-12 border-2 border-black rounded-none bg-white hover:bg-gray-100 text-black font-normal"
              >
                Save
              </Button>
              <Button
                onClick={() => setShowEditDialog(false)}
                className="w-32 h-12 border-2 border-black rounded-none bg-white hover:bg-gray-100 text-black font-normal"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}