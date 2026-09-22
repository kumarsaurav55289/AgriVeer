import React, { useState } from 'react';
import { X, Tractor, Sprout, PlusCircle, MapPin, IndianRupee, Phone, CheckCircle2, Upload, Camera, Link, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ListPropertyModal({ isOpen, onClose, onAddListing, currentUser }) {
  const [listingType, setListingType] = useState('machinery'); // 'machinery' | 'land'
  const [category, setCategory] = useState('Tractor');
  const [title, setTitle] = useState('');
  const [rate, setRate] = useState('');
  const [rateUnit, setRateUnit] = useState('day'); // 'day' | 'hour' | 'acre'
  const [location, setLocation] = useState('Ludhiana, Punjab');
  const [phone, setPhone] = useState(currentUser ? currentUser.phone : '');
  const [ownerName, setOwnerName] = useState(currentUser ? currentUser.name : '');
  const [driverProvided, setDriverProvided] = useState(true);
  const [waterSource, setWaterSource] = useState('Solar Tube-well');
  const [powerHp, setPowerHp] = useState('50 HP 4WD');
  const [landAcres, setLandAcres] = useState('10 Acres');
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Image upload states
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url' | 'preset'
  const [uploadedImageData, setUploadedImageData] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please upload a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImageData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const defaultFallbackImage = listingType === 'land'
    ? '/assets/paddy.png'
    : category === 'Harvester' ? '/assets/harvester.png'
    : category === 'Plough' ? '/assets/plough.png'
    : category === 'Sprayer' ? '/assets/drone.png'
    : '/assets/tractor.png';

  const activePreviewImage = 
    imageMode === 'upload' && uploadedImageData ? uploadedImageData :
    imageMode === 'url' && customImageUrl.trim() ? customImageUrl.trim() :
    imageMode === 'preset' && selectedPreset ? selectedPreset :
    defaultFallbackImage;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !rate || !phone) {
      alert('Please fill in the title, rental rate, and contact mobile phone number.');
      return;
    }

    const newListing = {
      id: 'item-' + Date.now(),
      title: title,
      type: listingType,
      category: category,
      image: activePreviewImage,
      location: location || 'Punjab, India',
      distance: 'Just Listed Today',
      dailyRate: rateUnit === 'day' ? Number(rate) : (rateUnit === 'hour' ? Number(rate) * 8 : Number(rate)),
      hourlyRate: rateUnit === 'hour' ? Number(rate) : Math.round(Number(rate) / 6),
      acreRate: listingType === 'land' ? Number(rate) : undefined,
      ownerName: ownerName || 'Verified Owner',
      ownerPhone: phone || '+91 98765 43210',
      rating: 5.0,
      reviewsCount: 1,
      isVerified: true,
      availableNow: true,
      specs: listingType === 'land'
        ? { landSize: landAcres, waterSource: waterSource }
        : { power: powerHp, driverProvided: driverProvided },
      description: description || `Newly listed ${category.toLowerCase()} available for rental.`
    };

    onAddListing(newListing);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset Form
      setTitle('');
      setRate('');
      setDescription('');
      setUploadedImageData('');
      setCustomImageUrl('');
      setSelectedPreset('');
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-[200] overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-white/80 backdrop-blur-2xl rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden relative shadow-2xl border border-white/80 my-auto"
        >
          
          {/* Header */}
          <div className="shrink-0 p-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border-b border-slate-200/80 relative backdrop-blur-md">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-sm">
                <PlusCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold font-['Outfit'] text-slate-900">
                  List Land or Equipment for Rent
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Earn daily income by renting unused farm machinery or land
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-5 sm:p-6 space-y-4">

            {isSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black text-3xl mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                  Listing Published Successfully!
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  Your land/equipment is now live on Agriveer for local farmers to rent.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Type Toggle: Machinery vs Land */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                    What are you putting for Rent? *
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => { setListingType('machinery'); setCategory('Tractor'); setRateUnit('day'); }}
                      className={`flex items-center justify-center gap-2 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                        listingType === 'machinery'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Tractor className="w-4 h-4" />
                      <span>Farm Machinery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setListingType('land'); setCategory('Farmland'); setRateUnit('acre'); }}
                      className={`flex items-center justify-center gap-2 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                        listingType === 'land'
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sprout className="w-4 h-4" />
                      <span>Agricultural Land</span>
                    </button>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-slate-800 text-xs font-extrabold bg-white/90 cursor-pointer"
                  >
                    {listingType === 'machinery' ? (
                      <>
                        <option value="Tractor">Heavy Duty Tractor (Mahindra, Swaraj, John Deere)</option>
                        <option value="Harvester">Grain Combine Harvester</option>
                        <option value="Plough">Hydraulic Reversible Disc Plough</option>
                        <option value="Sprayer">Precision Drone Sprayer / Boom Sprayer</option>
                        <option value="Rotavator">Heavy Rotavator & Seed Drill</option>
                      </>
                    ) : (
                      <>
                        <option value="Farmland">Fertile Paddy / Wheat Farm Land</option>
                        <option value="Farmland">High-Yield Fruit Orchard Plot</option>
                        <option value="Farmland">Modern Polyhouse & Greenhouse Plot</option>
                        <option value="Farmland">Rich Black Soil Cotton Cultivation Plot</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Listing Title */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                    Listing Title / Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={listingType === 'land' ? 'e.g. 10 Acre Organic Paddy & Wheat Land Lease' : 'e.g. Mahindra 575 DI 50 HP 4WD Tractor'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs font-semibold text-slate-900 bg-white/90"
                  />
                </div>

                {/* Property Photo Upload Section */}
                <div className="space-y-2.5 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>Listing Photo *</span>
                    </label>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${imageMode === 'upload' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${imageMode === 'url' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        Image Link
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('preset')}
                        className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${imageMode === 'preset' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        Presets
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: File Upload */}
                  {imageMode === 'upload' && (
                    <div className="space-y-2">
                      <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                        <Upload className="w-6 h-6 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-slate-800">
                          {uploadedImageData ? 'Photo Selected! Click to Change' : 'Click to Upload Photo from Device'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">JPG, PNG, WEBP up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Mode 2: Web URL */}
                  {imageMode === 'url' && (
                    <div className="relative">
                      <input
                        type="url"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="Paste image URL (e.g. https://domain.com/photo.jpg)"
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs font-medium text-slate-900 bg-white"
                      />
                      <Link className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    </div>
                  )}

                  {/* Mode 3: Preset Gallery */}
                  {imageMode === 'preset' && (
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { name: 'Tractor', url: '/assets/tractor.png' },
                        { name: 'Harvester', url: '/assets/harvester.png' },
                        { name: 'Sprayer', url: '/assets/drone.png' },
                        { name: 'Plough', url: '/assets/plough.png' },
                        { name: 'Paddy Land', url: '/assets/paddy.png' },
                        { name: 'Wheat Land', url: '/assets/wheat.png' },
                        { name: 'Orchard', url: '/assets/orchard.png' },
                        { name: 'Greenhouse', url: '/assets/greenhouse.png' }
                      ].map((preset) => (
                        <div
                          key={preset.name}
                          onClick={() => setSelectedPreset(preset.url)}
                          className={`relative border-2 rounded-xl overflow-hidden cursor-pointer h-14 transition-all ${
                            selectedPreset === preset.url ? 'border-emerald-600 ring-2 ring-emerald-400 shadow' : 'border-slate-200 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white text-[8px] font-bold text-center py-0.5 truncate px-1">
                            {preset.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Live Thumbnail Preview */}
                  {activePreviewImage && (
                    <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-300 shadow-inner group mt-2">
                      <img src={activePreviewImage} alt="Live Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-black bg-slate-950/80 px-3 py-1 rounded-full border border-white/20">
                          Live Photo Preview
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rental Rate & Unit */}
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-7">
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      Rental Rate (₹) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        placeholder={listingType === 'land' ? '45000' : '1800'}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs font-black text-slate-900 bg-white/90"
                      />
                      <IndianRupee className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="col-span-5">
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      Per Rate Unit
                    </label>
                    <select
                      value={rateUnit}
                      onChange={(e) => setRateUnit(e.target.value)}
                      className="w-full px-2 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs font-bold text-slate-800 bg-white/90 cursor-pointer"
                    >
                      <option value="day">Per Day (24 Hrs)</option>
                      <option value="hour">Per Hour</option>
                      <option value="acre">Per Acre / Year</option>
                    </select>
                  </div>
                </div>

                {/* Location & Mobile Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      District / Location *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ludhiana, Punjab"
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs font-semibold text-slate-900 bg-white/90"
                      />
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                      Owner Phone (+91) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs font-semibold text-slate-900 bg-white/90"
                      />
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    </div>
                  </div>
                </div>

                {/* Specs Options */}
                {listingType === 'machinery' ? (
                  <div className="flex items-center justify-between bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                    <span className="text-xs font-extrabold text-emerald-900">Driver / Operator Provided?</span>
                    <input
                      type="checkbox"
                      checked={driverProvided}
                      onChange={(e) => setDriverProvided(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600">Land Size (Acres)</label>
                      <input
                        type="text"
                        value={landAcres}
                        onChange={(e) => setLandAcres(e.target.value)}
                        placeholder="10 Acres"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white/90"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600">Water Source</label>
                      <input
                        type="text"
                        value={waterSource}
                        onChange={(e) => setWaterSource(e.target.value)}
                        placeholder="Solar Tube-well"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white/90"
                      />
                    </div>
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs shadow-md transition-all mt-2 cursor-pointer active:scale-95"
                >
                  Publish Rent Listing to Agriveer
                </button>

              </form>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
