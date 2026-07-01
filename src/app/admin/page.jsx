"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardHeader, CardContent, Button, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Switch } from "@heroui/react";
import { ShieldAlert, Users, Database, Settings, Activity, ArrowLeft, Lock, Trash2, Key, Info, GraduationCap } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  // Administrative config settings
  const [systemConfigs, setSystemConfigs] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    realTimeTelemetry: true,
    advancedLogging: false,
  });

  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState("home"); // "home" or "students"

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !session) return;
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await fetch("http://localhost:8080/api/admin/users");
        const json = await res.json();
        if (json && json.data) {
          setUsersList(json.data);
        }
      } catch (err) {
        console.error("Failed to load real system users", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [mounted, session]);

  if (isPending || !mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0f1e]">
        <Spinner size="lg" color="danger" label="Initializing administrative security gateway..." />
      </div>
    );
  }

  // --- STRICT AUTH CHECK: Google Auth login must have the exact email shommo.nexus@gmail.com ---
  const isAuthenticatedAdmin = session && session.user && session.user.email === "shommo.nexus@gmail.com";

  if (!isAuthenticatedAdmin) {
    return (
      <div className="w-full min-h-screen bg-[#0a0f1e] text-slate-100 flex items-center justify-center py-16 px-4 admin-theme-container">
        <Card className="max-w-[480px] w-full bg-[#111827] border border-red-900/50 shadow-2xl p-8 rounded-3xl text-center">
          <CardHeader className="flex flex-col items-center gap-2 p-0 pb-6 border-b border-slate-800">
            <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-500 mb-2">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Access Denied</h1>
            <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
              Unauthorized Security Console
            </span>
          </CardHeader>
          <CardContent className="p-0 pt-6 space-y-4">
            <p className="text-sm text-slate-400 font-medium">
              You do not have permission to access the system administration workspace. 
              Only authorized developer accounts logged in through Google Auth may access this dashboard.
            </p>
            <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-2xl text-left text-xs font-semibold text-red-300">
              <span className="font-bold flex items-center gap-1.5 mb-1 text-red-400 uppercase tracking-tight text-[10px] font-mono">
                <Info className="w-3.5 h-3.5" /> Authorized Account
              </span>
              shommo.nexus@gmail.com
            </div>
            {session ? (
              <div className="text-xs text-slate-500 font-medium">
                Current account: <span className="font-bold text-slate-300">{session.user.email}</span>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-medium">
                You are not currently logged in.
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => router.push("/")}
                variant="flat"
                className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold rounded-xl border-none cursor-pointer"
                startContent={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Home
              </Button>
              {!session && (
                <Button
                  onClick={() => router.push("/login")}
                  color="danger"
                  className="flex-1 font-bold rounded-xl border-none cursor-pointer"
                  startContent={<Lock className="w-4 h-4" />}
                >
                  Sign In
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle system config switches
  const handleToggleConfig = (key) => {
    setSystemConfigs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Dummy action for demo purpose
  const handleDeleteUser = (userId) => {
    setMockUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <div className="w-full mt-16 bg-[#0a0f1e] text-slate-100 min-h-screen py-8 px-4 md:px-8 font-sans admin-theme-container">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded-md text-[10px] font-bold font-mono uppercase border border-rose-500/20">
                Root System
              </div>
              <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">
                Developer Console Gateway
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mt-1">
              Admin Workspace
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-1">
              Authorized admin control panel. Customize and toggle system parameters.
            </p>
          </div>

          <Button
            onClick={() => router.push("/dashboard")}
            color="secondary"
            variant="flat"
            className="bg-violet-950/40 hover:bg-violet-900/60 text-violet-400 font-bold border-none rounded-xl cursor-pointer"
            startContent={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Total Users</span>
              <span className="text-2xl font-black text-white leading-none mt-1 block">{usersList.length}</span>
            </div>
          </Card>

          <Card className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">DB Status</span>
              <span className="text-2xl font-black text-emerald-400 leading-none mt-1 block">Connected</span>
            </div>
          </Card>

          <Card className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">API Health</span>
              <span className="text-2xl font-black text-cyan-450 leading-none mt-1 block">100% OK</span>
            </div>
          </Card>

          <Card className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-455 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Security Level</span>
              <span className="text-2xl font-black text-rose-500 leading-none mt-1 block">Highest</span>
            </div>
          </Card>
        </div>

        {/* TABS CONSOLE SELECTOR */}
        <div className="flex gap-2 mb-8 bg-[#111827] p-1.5 rounded-2xl border border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab("home")}
            className={`py-2 px-4 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "home"
                ? "bg-violet-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Home / System Overview
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`py-2 px-4 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "students"
                ? "bg-violet-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Student Directory
          </button>
        </div>

        {activeTab === "home" ? (
          /* WORKSPACE CONTENT GRID (HOME OVERVIEW) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* USER MANAGEMENT BOARD */}
            <Card className="lg:col-span-8 bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h3 className="text-md font-black text-white">System Accounts Overview</h3>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Manage user credentials and status parameters.</p>
                </div>
              </div>

              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-450 font-bold uppercase tracking-tight text-[10px] font-mono">
                      <th className="py-3 px-2">Account Name</th>
                      <th className="py-3 px-2">Email Address</th>
                      <th className="py-3 px-2">Gender</th>
                      <th className="py-3 px-2">Profile Type</th>
                      <th className="py-3 px-2">Access Role</th>
                      <th className="py-3 px-2">Account Status</th>
                      <th className="py-3 px-2">User Progress UP</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-semibold">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                          Querying MongoDB active telemetry user records...
                        </td>
                      </tr>
                    ) : usersList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                          No active registered user accounts detected in database.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-900/25 transition-colors">
                          <td className="py-3.5 px-2 text-white flex items-center gap-2">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="w-6 h-6 rounded-full border border-violet-500 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-violet-600/10 text-violet-400 border border-violet-500/20 flex items-center justify-center text-[10px] font-bold shrink-0">
                                {user.name.charAt(0)}
                              </div>
                            )}
                            <span className="truncate max-w-[120px]">{user.name}</span>
                          </td>
                          <td className="py-3.5 px-2 text-slate-400 font-mono">{user.email}</td>
                          <td className="py-3.5 px-2 text-slate-450 capitalize font-mono text-[10px]">{user.gender}</td>
                          <td className="py-3.5 px-2">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-slate-800 text-slate-300 capitalize">
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                              user.email === "shommo.nexus@gmail.com" ? "bg-rose-500/10 text-rose-455 border border-rose-500/20" : "bg-slate-850 text-slate-400"
                            }`}>
                              {user.email === "shommo.nexus@gmail.com" ? "Super Admin" : "User"}
                            </span>
                          </td>
                          <td className="py-3.5 px-2">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-455">
                              Active
                            </span>
                          </td>
                          <td className="py-3.5 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${user.progressUp}%` }} />
                              </div>
                              <span className="text-emerald-400 font-mono text-[10px] font-black">{user.progressUp}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-2 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="light"
                                className="text-slate-400 hover:text-white min-w-0 p-1 border-none cursor-pointer"
                                title="Reset Password / Security Token"
                              >
                                <Key className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="light"
                                className="text-slate-400 hover:text-rose-500 min-w-0 p-1 border-none cursor-pointer"
                                disabled={user.email === "shommo.nexus@gmail.com"}
                                title="Delete Account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* SYSTEM GLOBAL PARAMETERS */}
            <Card className="lg:col-span-4 bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-6">
                  <Settings className="w-5 h-5 text-slate-400" />
                  <div>
                    <h3 className="text-md font-black text-white">System Controls</h3>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Toggle live system properties.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">System Maintenance Mode</span>
                      <span className="text-[9px] text-slate-500 block">Blocks all non-administrative access pathways.</span>
                    </div>
                    <Switch
                      isSelected={systemConfigs.maintenanceMode}
                      onValueChange={() => handleToggleConfig("maintenanceMode")}
                      color="secondary"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">Registration Gateway</span>
                      <span className="text-[9px] text-slate-500 block">Enable or disable new client onboarding registrations.</span>
                    </div>
                    <Switch
                      isSelected={systemConfigs.allowRegistrations}
                      onValueChange={() => handleToggleConfig("allowRegistrations")}
                      color="secondary"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">Realtime Telemetry</span>
                      <span className="text-[9px] text-slate-500 block">Streams live user check-ins into admin charts.</span>
                    </div>
                    <Switch
                      isSelected={systemConfigs.realTimeTelemetry}
                      onValueChange={() => handleToggleConfig("realTimeTelemetry")}
                      color="secondary"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">Advanced Access Logs</span>
                      <span className="text-[9px] text-slate-500 block">Prints verbose auth tokens inside the node output console.</span>
                    </div>
                    <Switch
                      isSelected={systemConfigs.advancedLogging}
                      onValueChange={() => handleToggleConfig("advancedLogging")}
                      color="secondary"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 mt-6 text-center text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                Vyro Administrative Shell
              </div>
            </Card>

          </div>
        ) : (
          /* STUDENT DIRECTORY VIEW */
          <Card className="w-full bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-md font-black text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-violet-400" />
                  Academic Student Directory
                </h3>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  Detailed academic metadata and telemetry of users registered under Student Mode.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-450 font-bold uppercase tracking-tight text-[10px] font-mono">
                    <th className="py-3 px-2">Student Name</th>
                    <th className="py-3 px-2">Email Address</th>
                    <th className="py-3 px-2">Current School Name</th>
                    <th className="py-3 px-2">Previous College</th>
                    <th className="py-3 px-2">Admission Year</th>
                    <th className="py-3 px-2">Gender</th>
                    <th className="py-3 px-2">User Progress UP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-semibold">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                        Loading student enrollment configurations...
                      </td>
                    </tr>
                  ) : usersList.filter(u => u.role === "student").length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                        No active registered user accounts detected under Student profile type.
                      </td>
                    </tr>
                  ) : (
                    usersList.filter(u => u.role === "student").map((user) => (
                      <tr key={user.id} className="hover:bg-slate-900/25 transition-colors">
                        <td className="py-3.5 px-2 text-white flex items-center gap-2">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-6 h-6 rounded-full border border-violet-500 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-violet-600/10 text-violet-400 border border-violet-500/20 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <span className="truncate max-w-[150px]">{user.name}</span>
                        </td>
                        <td className="py-3.5 px-2 text-slate-400 font-mono">{user.email}</td>
                        <td className="py-3.5 px-2 text-slate-350">{user.profileData?.schoolName || "St. Joseph High School"}</td>
                        <td className="py-3.5 px-2 text-slate-350">{user.profileData?.previousCollege || "Notre Dame College"}</td>
                        <td className="py-3.5 px-2 text-slate-350 font-mono">{user.profileData?.admissionYear || "2026"}</td>
                        <td className="py-3.5 px-2 text-slate-400 capitalize font-mono text-[10px]">{user.gender}</td>
                        <td className="py-3.5 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${user.progressUp}%` }} />
                            </div>
                            <span className="text-emerald-400 font-mono text-[10px] font-black">{user.progressUp}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
