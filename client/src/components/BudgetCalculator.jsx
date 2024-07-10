import React, { useState, useEffect } from 'react';

const developers = ["emmar", "damac", "sobah-reality", "nakheel", "nshama", "meraas", "dubai-properties", "tilal-al-ghaf", "ellington", "samana", "aldar", "masaar"];
const residentialCategories = ["Apartment", "Villa", "Townhouse", "Duplex", "Hotel Apartment"];
const commercialCategories = ["Office Space", "Retail", "Warehouse", "Half Floor", "Full Floor", "Co-working Space", "Clinic", "Pharmacy"];

const BudgetCalculator = () => {
  const [isBuying, setIsBuying] = useState(true);
  const [totalBudget, setTotalBudget] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [yearlyPayment, setYearlyPayment] = useState('');
  const [yearsOfInstallments, setYearsOfInstallments] = useState('');
  const [unitType, setUnitType] = useState('');
  const [location, setLocation] = useState('');
  const [developer, setDeveloper] = useState('');
  const [community, setCommunity] = useState('');
  const [project, setProject] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [results, setResults] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (developer) {
      fetchCommunities(developer);
    } else {
      setCommunities([]);
    }
  }, [developer]);

  useEffect(() => {
    if (community) {
      fetchProjects(community);
    } else {
      setProjects([]);
    }
  }, [community]);

  const fetchCommunities = async (developer) => {
    try {
      const response = await fetch(`http://localhost:3000/api/community/communities/developer/${developer}`);
      const data = await response.json();
      setCommunities(data);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchProjects = async (community) => {
    try {
      const response = await fetch(`http://localhost:3000/api/project/projects/community/${community}`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleCalculate = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/listing/listings/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isBuying,
          totalBudget,
          downPayment,
          yearlyPayment,
          yearsOfInstallments,
          unitType,
          location,
          developer,
          community,
          project,
          deliveryStatus
        })
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  return (
    <div className="container flex flex-row mx-auto p-4 mt-20">
      <div className="bg-white p-6 shadow-md rounded-lg max-w-2xl mx-auto">
        <h2 className="text-xl text-center font-semibold mb-4">Budget Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex justify-around mb-4">
              <button className={`w-1/2 p-2 ${isBuying ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setIsBuying(true)}>
                Buy
              </button>
              <button className={`w-1/2 p-2 ${!isBuying ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setIsBuying(false)}>
                Rent
              </button>
            </div>
          </div>

          {isBuying ? (
            <div className="col-span-1 md:col-span-2">
              <label className="block mb-2">Total Budget *</label>
              <input type="number" className="w-full p-2 border rounded" value={totalBudget} onChange={(e) => setTotalBudget(e.target.value)} required />
            </div>
          ) : (
            <div className="col-span-1 md:col-span-2">
              <label className="block mb-2">Yearly Payment *</label>
              <input type="number" className="w-full p-2 border rounded" value={yearlyPayment} onChange={(e) => setYearlyPayment(e.target.value)} required />
            </div>
          )}

          <div>
            <label className="block mb-2">Unit Type *</label>
            <select className="w-full p-2 border rounded" value={unitType} onChange={(e) => setUnitType(e.target.value)}>
              <option value="">Select Unit Type</option>
              {residentialCategories.concat(commercialCategories).map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Developer *</label>
            <select className="w-full p-2 border rounded" value={developer} onChange={(e) => setDeveloper(e.target.value)}>
              <option value="">Select Developer</option>
              {developers.map((dev) => (
                <option key={dev} value={dev}>{dev}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Community *</label>
            <select className="w-full p-2 border rounded" value={community} onChange={(e) => setCommunity(e.target.value)} disabled={!developer}>
              <option value="">Select Community</option>
              {communities.map((comm) => (
                <option key={comm._id} value={comm._id}>{comm.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Project *</label>
            <select className="w-full p-2 border rounded" value={project} onChange={(e) => setProject(e.target.value)} disabled={!community}>
              <option value="">Select Project</option>
              {projects.map((proj) => (
                <option key={proj._id} value={proj._id}>{proj.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="mt-4 w-full bg-blue-500 text-white p-2 rounded" onClick={handleCalculate}>Find Your Unit</button>

        <div className="mt-4 bg-blue-100 p-4 rounded">
          <p>We display the average price for all the projects. To know more about the prices for your unit, <span className="text-blue-500">CALL 16223</span></p>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 shadow-md rounded-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Results</h2>
        <div>
          {results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className="mb-4 p-4 border flex flex-col">
                <img src={result.imageUrls} alt={result.name} className="w-50 h-40 object-cover mb-2" />
                <h3 className="text-lg font-semibold text-center">{result.name}</h3>
                <p className='text-center'>{result.description}</p>
                <button className="mt-2 text-blue-500">Show Plan</button>
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;
