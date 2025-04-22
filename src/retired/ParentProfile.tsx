import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles for toast notifications

export default function ParentProfile() {
  const [parent, setParent] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [children, setChildren] = useState([{ name: "", age: "", school: "" }]);

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParent({ ...parent, [e.target.name]: e.target.value });
  };

  const handleChildChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newChildren = [...children];
    (newChildren[index] as any)[e.target.name] = e.target.value;
    setChildren(newChildren);
  };

  const addChild = () => {
    setChildren([...children, { name: "", age: "", school: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register", { parent, children });
      console.log('Profile created:', response.data);

      // Show success toast
      toast.success('Profile created successfully!', {
        position: 'top-center', // Updated to string instead of toast.POSITION.TOP_CENTER
        autoClose: 3000, // Toast will disappear after 3 seconds
      });
      // Clear the form fields after successful submission
    setParent({ name: "", email: "", phone: "", address: "" });
    setChildren([{ name: "", age: "", school: "" }]); // Reset to initial state (1 child)
    } catch (error) {
      console.error("Error registering:", error);
      // Show error toast
      toast.error('Error creating profile!', {
        position: 'top-center', // Updated to string
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Parent Profile</h2>
      <label>Name</label>
      <input name="name" value={parent.name} onChange={handleParentChange} className="border p-2 w-full" />
      <label>Email</label>
      <input name="email" type="email" value={parent.email} onChange={handleParentChange} className="border p-2 w-full" />
      <label>Phone</label>
      <input name="phone" value={parent.phone} onChange={handleParentChange} className="border p-2 w-full" />
      <label>Address</label>
      <input name="address" value={parent.address} onChange={handleParentChange} className="border p-2 w-full" />
      
      <h2 className="text-xl font-bold mt-4">Children</h2>
      {children.map((child, index) => (
        <div key={index} className="mb-2">
          <label>Name</label>
          <input name="name" value={child.name} onChange={(e) => handleChildChange(index, e)} className="border p-2 w-full" />
          <label>Age</label>
          <input name="age" type="number" value={child.age} onChange={(e) => handleChildChange(index, e)} className="border p-2 w-full" />
          <label>School</label>
          <input name="school" value={child.school} onChange={(e) => handleChildChange(index, e)} className="border p-2 w-full" />
        </div>
      ))}
      <button onClick={addChild} className="bg-blue-500 text-white p-2 rounded mt-2">Add Another Child</button>
      <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded mt-4">Submit</button>

      {/* ToastContainer for rendering the toast notifications */}
      <ToastContainer />
    </div>
  );
}
