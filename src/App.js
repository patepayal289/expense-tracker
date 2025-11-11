import React, { useEffect, useState } from "react";
import CustomerList from "./components/CustomerList";
import CustomerLedger from "./components/CustomerLedger";
import Dashboard from "./components/Dashboard";

function App() {
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("kb_customers");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    localStorage.setItem("kb_customers", JSON.stringify(customers));
  }, [customers]);

  const addCustomer = (cust) => {
    const newCust = { id: Date.now().toString(), name: cust.name, phone: cust.phone, transactions: [], note: "" };
    setCustomers((s) => [newCust, ...s]);
    setSelectedCustomerId(newCust.id);
  };

  const updateCustomer = (id, patch) => {
    setCustomers((s) => s.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  const deleteCustomer = (id) => {
    setCustomers((s) => s.filter(c => c.id !== id));
    if (selectedCustomerId === id) setSelectedCustomerId(null);
  };

  const addTransaction = (customerId, tx) => {
    setCustomers((s) =>
      s.map(c => c.id === customerId ? { ...c, transactions: [{ id: Date.now().toString(), ...tx }, ...c.transactions] } : c)
    );
  };

  const deleteTransaction = (customerId, txId) => {
    setCustomers((s) =>
      s.map(c => c.id === customerId ? { ...c, transactions: c.transactions.filter(t => t.id !== txId) } : c)
    );
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">💼 Khatabook Tracker</h1>

      <div className="row">
        <div className="col-lg-4 mb-3">
          <CustomerList
            customers={customers}
            onAdd={addCustomer}
            onSelect={(id) => setSelectedCustomerId(id)}
            selectedId={selectedCustomerId}
            onUpdate={updateCustomer}
            onDelete={deleteCustomer}
          />
        </div>

        <div className="col-lg-8">
          <Dashboard
            customers={customers}
            onExportAll={() => {
              // we'll implement export inside Dashboard component via props or internal - done there
            }}
          />
          <div className="mt-3">
            {selectedCustomerId ? (
              <CustomerLedger
                key={selectedCustomerId}
                customer={customers.find(c => c.id === selectedCustomerId)}
                onAddTx={(tx) => addTransaction(selectedCustomerId, tx)}
                onDeleteTx={(txId) => deleteTransaction(selectedCustomerId, txId)}
                onUpdateCustomer={(patch) => updateCustomer(selectedCustomerId, patch)}
              />
            ) : (
              <div className="card p-4 text-center">
                <p className="mb-0">Select a customer to view ledger or add a transaction.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
