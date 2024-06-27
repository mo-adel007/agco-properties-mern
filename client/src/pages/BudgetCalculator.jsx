// src/components/BudgetCalculator.jsx
import React, { useState } from 'react';

const BudgetCalculator = () => {
  const [totalBudget, setTotalBudget] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [yearsOfInstallments, setYearsOfInstallments] = useState('');
  const [unitType, setUnitType] = useState('');
  const [location, setLocation] = useState('');
  const [project, setProject] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [results, setResults] = useState([]);

  const handleCalculate = () => {
    // Placeholder logic for results calculation
    setResults([
      { name: 'Vinci | Phase 1B', description: 'Luxury Boutique Living...', plan: 'Show Plan' },
      { name: 'Vinci | Phase 2A', description: 'Luxury Boutique Living...', plan: 'Show Plan' },
      { name: 'The Curve | Cactus', description: 'New Administrative Capital...', plan: 'Show Plan' },
    ]);
  };

  return (
    <div className="container flex mx-auto p-4 mt-20">
      <div className="bg-white p-6 shadow-md rounded-lg max-w-2xl mx-auto">
        <h2 className="text-xl text-center font-semibold mb-4">Budget Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Total Budget *</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Down Payment *</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Monthly Payment *</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Years Of Installments *</label>
            <select
              className="w-full p-2 border rounded"
              value={yearsOfInstallments}
              onChange={(e) => setYearsOfInstallments(e.target.value)}
            >
              <option value="6">6 Years</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div>
            <label className="block mb-2">Unit Type *</label>
            <select
              className="w-full p-2 border rounded"
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
            >
              <option value="Apartment">Apartment</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div>
            <label className="block mb-2">Location *</label>
            <select
              className="w-full p-2 border rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="New Cairo, 6 October">New Cairo, 6 October</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div>
            <label className="block mb-2">Project *</label>
            <select
              className="w-full p-2 border rounded"
              value={project}
              onChange={(e) => setProject(e.target.value)}
            >
              <option value="Select Project">Select Project</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div>
            <label className="block mb-2">Delivery Status *</label>
            <select
              className="w-full p-2 border rounded"
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
            >
              <option value="Off Plan">Off Plan</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>
        <button
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
          onClick={handleCalculate}
        >
          Find Your Unit
        </button>
        <div className="mt-4 bg-blue-100 p-4 rounded">
          <p>
            We display the average price for all the projects. To know more about the prices for your unit,{' '}
            <span className="text-blue-500">CALL 16223</span>
          </p>
        </div>
      </div>
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Results</h2>
        <div>
          {results.map((result, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold">{result.name}</h3>
              <p>{result.description}</p>
              <button className="mt-2 text-blue-500">{result.plan}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;