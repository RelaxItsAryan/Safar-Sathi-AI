import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plane, Plus, MapPin, Calendar, DollarSign,
  Trash2, LogOut, User, Globe, BarChart3, Clock, Star,
  X, Camera, Mail, MapPinned, Heart, Briefcase, Mountain,
  Palmtree, Building, Tent, Ship, Utensils, Music, Save,
  Check, Edit3, Shield, Bell, Loader2
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PageTransition } from "@/components/PageTransition";
import { useToast } from "@/hooks/use-toast";

interface SavedTrip {
  id: string;
  destination: string;
  days: number;
  budget: number;
  currency: string;
  overview: string | null;
  created_at: string;
}

interface ProfileData {
  display_name: string;
  avatar_url: string | null;
  travel_preferences: string[];
}

const TRAVEL_INTERESTS = [
  { id: "adventure", label: "Adventure", icon: Mountain },
  { id: "beach", label: "Beach & Relaxation", icon: Palmtree },
  { id: "cultural", label: "Cultural & Historical", icon: Building },
  { id: "nature", label: "Nature & Wildlife", icon: Tent },
  { id: "cruise", label: "Cruises", icon: Ship },
  { id: "food", label: "Food & Culinary", icon: Utensils },
  { id: "nightlife", label: "Nightlife", icon: Music },
  { id: "business", label: "Business Travel", icon: Briefcase },
];

const AVATAR_COLORS = [
  "from-primary to-secondary",
  "from-teal to-primary",
  "from-secondary to-teal",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");
  
  // Profile modal state
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    display_name: "",
    avatar_url: null,
    travel_preferences: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<ProfileData>({
    display_name: "",
    avatar_url: null,
    travel_preferences: [],
  });
  const [selectedAvatarColor, setSelectedAvatarColor] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: profile }, { data: tripsData }] = await Promise.all([
      supabase.from("profiles").select("display_name, avatar_url, travel_preferences").eq("user_id", user!.id).single(),
      supabase.from("saved_trips").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
    ]);
    if (profile) {
      const prefs = profile.travel_preferences ? 
        (typeof profile.travel_preferences === 'string' ? JSON.parse(profile.travel_preferences) : profile.travel_preferences) : [];
      setProfileName(profile.display_name || user!.email || "");
      setProfileData({
        display_name: profile.display_name || "",
        avatar_url: profile.avatar_url,
        travel_preferences: Array.isArray(prefs) ? prefs : [],
      });
      setTempProfile({
        display_name: profile.display_name || "",
        avatar_url: profile.avatar_url,
        travel_preferences: Array.isArray(prefs) ? prefs : [],
      });
    }
    if (tripsData) setTrips(tripsData);
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: tempProfile.display_name,
        avatar_url: tempProfile.avatar_url,
        travel_preferences: JSON.stringify(tempProfile.travel_preferences),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user!.id);
    
    if (error) {
      toast({ title: "Error updating profile", description: error.message, variant: "destructive" });
    } else {
      setProfileData(tempProfile);
      setProfileName(tempProfile.display_name || user!.email || "");
      setEditMode(false);
      toast({ title: "Profile updated! ✨", description: "Your changes have been saved." });
    }
    setSavingProfile(false);
  };

  const handleCancelEdit = () => {
    setTempProfile(profileData);
    setEditMode(false);
  };

  const togglePreference = (id: string) => {
    setTempProfile(prev => ({
      ...prev,
      travel_preferences: prev.travel_preferences.includes(id)
        ? prev.travel_preferences.filter(p => p !== id)
        : [...prev.travel_preferences, id]
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For now, create a data URL (in production, you'd upload to Supabase Storage)
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempProfile(prev => ({ ...prev, avatar_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  };

  const deleteTrip = async (id: string) => {
    await supabase.from("saved_trips").delete().eq("id", id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const totalBudget = trips.reduce((acc, t) => acc + Number(t.budget), 0);
  const destinations = [...new Set(trips.map((t) => t.destination.split(",")[1]?.trim() || t.destination))];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Sidebar + Layout */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden lg:flex w-64 min-h-screen flex-col glass-card border-r border-border fixed left-0 top-0 bottom-0 z-40">
            <div className="p-6 border-b border-border">
              <Link to="/" className="flex items-center gap-2">
                <img src={Logo} alt="Logo" className="w-8 h-8 rounded-xl" />
                <span className="font-display font-bold text-lg">
                  <span className="gradient-text">Safar</span>
                  <span className="text-foreground">Sathi</span>
                </span>
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {[
                { icon: BarChart3, label: "Dashboard", active: true },
                { icon: Globe, label: "Explore", to: "/" },
                { icon: MapPin, label: "My Trips", active: false },
                { icon: User, label: "Profile", active: false, onClick: () => setShowProfile(true) },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => item.onClick ? item.onClick() : item.to && navigate(item.to)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    item.active
                      ? "bg-gradient-primary text-white shadow-glow-blue"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-border">
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-3 mb-3 w-full hover:bg-muted/50 rounded-xl p-1 -m-1 transition-colors"
              >
                {profileData.avatar_url ? (
                  <img src={profileData.avatar_url} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_COLORS[selectedAvatarColor]} flex items-center justify-center`}>
                    <span className="text-white text-sm font-bold">{getInitials(profileName)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-foreground truncate">{profileName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 lg:ml-64 p-6 md:p-8">
            {/* Mobile header */}
            <div className="flex items-center justify-between mb-8 lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <img src={Logo} alt="Logo" className="w-8 h-8 rounded-xl" />
                <span className="font-display font-bold text-lg gradient-text">SafarSathi AI</span>
              </Link>
              <button onClick={handleSignOut} className="p-2 rounded-xl glass-card text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Welcome */}
            <div className="mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
                Welcome back, <span className="gradient-text">{profileName.split(" ")[0] || "Traveler"}</span> ✈️
              </h1>
              <p className="text-muted-foreground">Ready to plan your next adventure?</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Plane, label: "Trips Planned", value: trips.length, color: "from-primary to-secondary" },
                { icon: Globe, label: "Countries", value: destinations.length, color: "from-teal to-primary" },
                { icon: DollarSign, label: "Total Budget", value: `$${(totalBudget / 1000).toFixed(1)}K`, color: "from-secondary to-teal" },
                { icon: Star, label: "Saved Places", value: trips.length * 4, color: "from-primary to-teal" },
              ].map((stat, i) => (
                <div key={i} className="glass-card rounded-2xl p-4 hover:shadow-elevated transition-all duration-200">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-display text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA + Trips */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-foreground">My Trips</h2>
              <Link
                to="/planner"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-glow-blue hover:opacity-90 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Plan New Trip
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card rounded-2xl p-5 animate-pulse h-44" />
                ))}
              </div>
            ) : trips.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Plane className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">No trips yet</h3>
                <p className="text-muted-foreground mb-6">Start planning your first AI-powered adventure!</p>
                <Link
                  to="/planner"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold shadow-glow-blue hover:opacity-90 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Plan Your First Trip
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="glass-card rounded-2xl p-5 hover:shadow-elevated hover:border-primary/30 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <button
                        onClick={() => deleteTrip(trip.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-display font-bold text-foreground mb-1 truncate">{trip.destination}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{trip.overview || "AI-generated itinerary"}</p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {trip.days} days
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {trip.currency} {Number(trip.budget).toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(trip.created_at).toLocaleDateString()}
                      </div>
                      <Link
                        to={`/trip/${trip.id}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View Trip →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Profile Modal */}
        {showProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => { setShowProfile(false); handleCancelEdit(); }}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl shadow-elevated animate-scale-in">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">My Profile</h2>
                    <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
                  </div>
                  <button
                    onClick={() => { setShowProfile(false); handleCancelEdit(); }}
                    className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    {tempProfile.avatar_url ? (
                      <img 
                        src={tempProfile.avatar_url} 
                        alt="Profile" 
                        className="w-28 h-28 rounded-full object-cover ring-4 ring-primary/20"
                      />
                    ) : (
                      <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${AVATAR_COLORS[selectedAvatarColor]} flex items-center justify-center ring-4 ring-primary/20`}>
                        <span className="text-white text-3xl font-bold">{getInitials(tempProfile.display_name || profileName)}</span>
                      </div>
                    )}
                    {editMode && (
                      <>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Camera className="w-6 h-6 text-white" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {profileData.display_name || "Traveler"}
                    </h3>
                    <p className="text-muted-foreground text-sm flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                      <Mail className="w-3.5 h-3.5" />
                      {user?.email}
                    </p>
                    <p className="text-muted-foreground text-xs flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                      <Clock className="w-3 h-3" />
                      Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    
                    {/* Avatar color selector in edit mode */}
                    {editMode && !tempProfile.avatar_url && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Choose avatar color:</p>
                        <div className="flex gap-2 justify-center sm:justify-start">
                          {AVATAR_COLORS.map((color, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedAvatarColor(i)}
                              className={`w-6 h-6 rounded-full bg-gradient-to-br ${color} transition-transform ${selectedAvatarColor === i ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110'}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-border hover:border-primary/40 text-sm font-semibold text-foreground transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>

                {/* Personal Information */}
                <div className="glass-card rounded-2xl p-5">
                  <h4 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Personal Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Display Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={tempProfile.display_name}
                          onChange={(e) => setTempProfile(prev => ({ ...prev, display_name: e.target.value }))}
                          placeholder="Your display name"
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                        />
                      ) : (
                        <p className="text-foreground">{profileData.display_name || "Not set"}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Email Address</label>
                      <p className="text-foreground flex items-center gap-2">
                        {user?.email}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-teal/10 text-teal font-medium">Verified</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Travel Preferences */}
                <div className="glass-card rounded-2xl p-5">
                  <h4 className="font-display font-bold text-foreground mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-secondary" />
                    Travel Preferences
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select your travel interests to get personalized recommendations
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TRAVEL_INTERESTS.map(({ id, label, icon: Icon }) => {
                      const isSelected = editMode 
                        ? tempProfile.travel_preferences.includes(id)
                        : profileData.travel_preferences.includes(id);
                      return (
                        <button
                          key={id}
                          onClick={() => editMode && togglePreference(id)}
                          disabled={!editMode}
                          className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                            isSelected
                              ? "bg-gradient-primary border-primary/30 text-white shadow-glow-blue"
                              : editMode
                                ? "glass-card border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                                : "glass-card border-border text-muted-foreground opacity-60"
                          }`}
                        >
                          <Icon className={`w-5 h-5 mx-auto mb-1.5 ${isSelected ? "text-white" : ""}`} />
                          <span className="text-xs font-medium">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Travel Stats */}
                <div className="glass-card rounded-2xl p-5">
                  <h4 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-teal" />
                    Your Travel Stats
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: Plane, label: "Trips Planned", value: trips.length, color: "from-primary to-secondary" },
                      { icon: Globe, label: "Destinations", value: [...new Set(trips.map(t => t.destination))].length, color: "from-teal to-primary" },
                      { icon: Calendar, label: "Total Days", value: trips.reduce((a, t) => a + t.days, 0), color: "from-secondary to-teal" },
                      { icon: Star, label: "Places Saved", value: trips.length * 4, color: "from-primary to-teal" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center p-3 rounded-xl bg-muted/30">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                          <stat.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="font-display text-lg font-bold gradient-text">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account Settings Quick Links */}
                <div className="glass-card rounded-2xl p-5">
                  <h4 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Account Settings
                  </h4>
                  <div className="space-y-2">
                    {[
                      { icon: Bell, label: "Notification Preferences", desc: "Manage email and push notifications" },
                      { icon: Shield, label: "Privacy & Security", desc: "Password, 2FA, and privacy settings" },
                      { icon: MapPinned, label: "Saved Locations", desc: "Manage your favorite destinations" },
                    ].map((item, i) => (
                      <button
                        key={i}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                {editMode && (
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-5 py-2.5 rounded-xl glass-card border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-glow-blue hover:opacity-90 transition-all disabled:opacity-60"
                    >
                      {savingProfile ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Dashboard;
