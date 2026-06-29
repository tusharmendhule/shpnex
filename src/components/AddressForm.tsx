import React, { useState } from 'react';
import { Address } from '../types.js';
import { Home, Save, X } from 'lucide-react';

interface AddressFormProps {
  onSubmit: (address: Address) => void;
  onCancel: () => void;
}

export default function AddressForm({ onSubmit, onCancel }: AddressFormProps) {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode || !country) return;
    onSubmit({ street, city, state, zipCode, country, isDefault });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl">
      <div className="flex items-center gap-2 text-zinc-900 dark:text-white mb-2">
        <Home className="h-4.5 w-4.5 text-emerald-500" />
        <h3 className="text-sm font-bold">Add Shipping Address</h3>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-500 mb-1">Street Address</label>
        <input
          type="text"
          required
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="e.g. 1 Infinite Loop"
          className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm px-3.5 py-2 outline-none focus:border-emerald-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">City</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Cupertino"
            className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm px-3.5 py-2 outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">State / Province</label>
          <input
            type="text"
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="e.g. CA"
            className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm px-3.5 py-2 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">ZIP / Postal Code</label>
          <input
            type="text"
            required
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="e.g. 95014"
            className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm px-3.5 py-2 outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Country</label>
          <input
            type="text"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. United States"
            className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm px-3.5 py-2 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          id="default-chk"
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="h-4 w-4 rounded text-emerald-500 focus:ring-emerald-500 border-zinc-300"
        />
        <label htmlFor="default-chk" className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
          Make this my default shipping address
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
        >
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Save className="h-3.5 w-3.5" /> Save Address
        </button>
      </div>
    </form>
  );
}
