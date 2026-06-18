import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Settings,
  Users,
  BarChart3,
  Play,
  Square,
  RotateCw,
  Trash2,
  LogOut,
  Menu,
  X,
  Bell,
  Lock,
  Unlock,
  Send,
  Search,
  Eye,
  Download,
  CheckCircle,
  AlertCircle,
  Zap,
  Code,
  Database,
  Shield,
} from 'lucide-react';

const BotHostingPlatform = () => {
  const [user, setUser] = useState({
    id: '2119464081',
    name: 'Admin User',
    role: 'admin',
    isAuthenticated: false,
  });

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);

  // Mock Data
  const [stats, setStats] = useState({
    totalUsers: 156,
    activeFiles: 48,
    runningBots: 23,
    totalUptime: '99.8%',
    cpuUsage: 45,
    memoryUsage: 62,
  });

  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'telegram_bot.py',
      type: 'python',
      size: '245 KB',
      owner: 'user_001',
      status: 'running',
      createdAt: '2024-01-15',
      executions: 1240,
    },
    {
      id: 2,
      name: 'api_server.js',
      type: 'javascript',
      size: '156 KB',
      owner: 'user_002',
      status: 'stopped',
      createdAt: '2024-01-14',
      executions: 856,
    },
    {
      id: 3,
      name: 'data_processor.py',
      type: 'python',
      size: '389 KB',
      owner: 'user_003',
      status: 'running',
      createdAt: '2024-01-13',
      executions: 2103,
    },
  ]);

  const [admins, setAdmins] = useState([
    { id: '2119464081', username: 'Xricx0', role: 'Owner', joinedAt: '2023-06-01' },
    { id: '2119464082', username: 'Admin1', role: 'Admin', joinedAt: '2023-08-15' },
  ]);

  const [subscriptions, setSubscriptions] = useState([
    { userId: '12345', plan: 'Premium', expiresAt: '2025-02-15', status: 'active' },
    { userId: '67890', plan: 'Standard', expiresAt: '2025-01-20', status: 'active' },
  ]);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardHoverVariants = {
    rest: { y: 0, boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)' },
    hover: {
      y: -8,
      boxShadow: '0 30px 60px rgba(59, 130, 246, 0.3)',
      transition: { duration: 0.3 },
    },
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 1 },
    pulse: {
      scale: 1.2,
      opacity: 0,
      transition: { duration: 1.5, repeat: Infinity },
    },
  };

  // Functions
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        addNotification('File uploaded successfully!', 'success');
        setTimeout(() => setUploadProgress(0), 500);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 300);
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const newNotification = { id, message, type };
    setNotifications([...notifications, newNotification]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const toggleFileStatus = (fileId) => {
    setFiles(
      files.map((f) =>
        f.id === fileId ? { ...f, status: f.status === 'running' ? 'stopped' : 'running' } : f
      )
    );
  };

  const deleteFile = (fileId) => {
    setFiles(files.filter((f) => f.id !== fileId));
    addNotification('File deleted successfully', 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'from-green-500 to-emerald-600';
      case 'stopped':
        return 'from-red-500 to-rose-600';
      case 'active':
        return 'from-blue-500 to-cyan-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  const getFileTypeIcon = (type) => {
    return type === 'python' ? '🐍' : '📜';
  };

  // Pages
  const DashboardPage = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative px-8 py-12 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
          >
            Bot Hosting Dashboard
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-300 text-lg">
            Manage, monitor, and control all your hosted bots in one place
          </motion.p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
          { label: 'Active Files', value: stats.activeFiles, icon: FileText, color: 'from-purple-500 to-purple-600' },
          { label: 'Running Bots', value: stats.runningBots, icon: Zap, color: 'from-green-500 to-green-600' },
          { label: 'System Uptime', value: stats.totalUptime, icon: Shield, color: 'from-cyan-500 to-cyan-600' },
          { label: 'CPU Usage', value: `${stats.cpuUsage}%`, icon: Database, color: 'from-orange-500 to-orange-600' },
          { label: 'Memory Usage', value: `${stats.memoryUsage}%`, icon: Zap, color: 'from-rose-500 to-rose-600' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover="hover"
            initial="rest"
            animate="rest"
            custom={cardHoverVariants}
          >
            <div className="group relative h-40 rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer">
              {/* Animated background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-300 font-medium text-sm">{stat.label}</h3>
                  <motion.div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <stat.icon size={20} />
                  </motion.div>
                </div>

                <div>
                  <motion.p
                    className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-xs text-gray-400 mt-2">Last 24 hours</p>
                </div>
              </div>

              {/* Border animation on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-blue-500 to-purple-500 -z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap size={24} className="text-yellow-400" />
            System Activity
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Bot Executions', value: 85, color: 'from-blue-500 to-blue-600' },
              { label: 'File Uploads', value: 62, color: 'from-purple-500 to-purple-600' },
              { label: 'Admin Commands', value: 48, color: 'from-green-500 to-green-600' },
            ].map((item, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">{item.label}</span>
                  <span className={`text-sm font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.value}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${item.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Logs */}
        <div className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl p-6 max-h-80 overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell size={24} className="text-blue-400" />
            Recent Activity
          </h3>
          <motion.div className="space-y-3" variants={containerVariants}>
            {[
              { msg: 'Bot startup completed', time: '2 mins ago', type: 'success' },
              { msg: 'File malware scan passed', time: '5 mins ago', type: 'success' },
              { msg: 'Admin added new user', time: '12 mins ago', type: 'info' },
              { msg: 'Subscription extended for user', time: '25 mins ago', type: 'info' },
            ].map((log, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                {log.type === 'success' ? (
                  <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle size={18} className="text-blue-400 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm truncate">{log.msg}</p>
                  <p className="text-gray-500 text-xs">{log.time}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  const FilesPage = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white">
          File Management
        </motion.h2>
        <motion.label
          variants={itemVariants}
          className="relative flex items-center gap-2 px-6 py-3 rounded-xl backdrop-blur-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold cursor-pointer hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
        >
          <Upload size={20} />
          Upload File
          <input type="file" onChange={handleFileUpload} className="hidden" accept=".py,.js,.zip" />
        </motion.label>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold">Uploading {selectedFile?.name}</span>
              <span className="text-blue-300 text-sm">{Math.round(uploadProgress)}%</span>
            </div>
            <motion.div
              className="h-3 rounded-full bg-white/10 overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <motion.div variants={itemVariants} className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors"
        />
      </motion.div>

      {/* Files List */}
      <motion.div variants={containerVariants} className="space-y-4">
        {files.map((file, idx) => (
          <motion.div
            key={file.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="group rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-lg hover:shadow-xl overflow-hidden transition-all"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <motion.div
                  className="text-3xl flex-shrink-0"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getFileTypeIcon(file.type)}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{file.name}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.createdAt}</span>
                    <span>•</span>
                    <span>{file.executions} executions</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <motion.div
                className={`flex-shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r ${getStatusColor(file.status)} text-white text-sm font-semibold`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {file.status === 'running' && <span className="flex items-center gap-2">🟢 Running</span>}
                {file.status === 'stopped' && <span className="flex items-center gap-2">🔴 Stopped</span>}
              </motion.div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleFileStatus(file.id)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title={file.status === 'running' ? 'Stop' : 'Start'}
                >
                  {file.status === 'running' ? <Square size={18} /> : <Play size={18} />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Restart"
                >
                  <RotateCw size={18} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteFile(file.id)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-red-500/30 text-white hover:text-red-300 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );

  const AdminPage = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white">
        Admin Panel
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admins Management */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield size={24} className="text-purple-400" />
            Admin Management
          </h3>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mb-6 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            + Add New Admin
          </motion.button>

          <motion.div variants={containerVariants} className="space-y-3">
            {admins.map((admin, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">@{admin.username}</p>
                    <p className="text-gray-400 text-sm">{admin.role} • ID: {admin.id}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Subscription Management */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Database size={24} className="text-cyan-400" />
            Subscription Management
          </h3>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mb-6 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            + Add Subscription
          </motion.button>

          <motion.div variants={containerVariants} className="space-y-3">
            {subscriptions.map((sub, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">User {sub.userId}</p>
                    <p className="text-gray-400 text-sm">{sub.plan} • Expires: {sub.expiresAt}</p>
                  </div>
                  <motion.div
                    className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Active
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Broadcasting */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Send size={24} className="text-orange-400" />
          Broadcast Message
        </h3>

        <textarea
          placeholder="Enter message to broadcast to all users..."
          className="w-full h-32 px-4 py-3 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 resize-none transition-colors"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
        >
          Send to All Users
        </motion.button>
      </motion.div>
    </motion.div>
  );

  const SettingsPage = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white">
        Settings & Configuration
      </motion.h2>

      {/* Bot Control */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Settings size={24} className="text-blue-400" />
          Bot Control
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all"
          >
            <Play size={20} />
            Run All Scripts
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
          >
            <Lock size={20} />
            Lock Bot
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all"
          >
            <Unlock size={20} />
            Unlock Bot
          </motion.button>
        </div>
      </motion.div>

      {/* Configuration */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl p-6 space-y-6"
      >
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Code size={24} className="text-purple-400" />
          Configuration
        </h3>

        {[
          { label: 'API Token', value: '●●●●●●●●●●●●' },
          { label: 'Webhook URL', value: 'https://your-webhook.com' },
          { label: 'Database URL', value: 'postgresql://...' },
        ].map((config, idx) => (
          <motion.div key={idx} variants={itemVariants} className="space-y-2">
            <label className="text-gray-300 text-sm font-semibold">{config.label}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={config.value}
                readOnly
                className="flex-1 px-4 py-2 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 text-gray-300 focus:outline-none focus:border-blue-500/50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
              >
                Copy
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 50, 0], y: [0, 100, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <AnimatePresence>
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: sidebarOpen ? 0 : -280 }}
            transition={{ duration: 0.3 }}
            className="w-72 backdrop-blur-xl bg-black/30 border-r border-white/10 overflow-y-auto"
          >
            <div className="p-6 space-y-8">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <motion.div
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Code size={24} className="text-white" />
                </motion.div>
                <div>
                  <p className="font-bold text-lg">BotHost</p>
                  <p className="text-xs text-gray-400">v2.0 Pro</p>
                </div>
              </motion.div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'files', label: 'File Manager', icon: FileText },
                  { id: 'admin', label: 'Admin Panel', icon: Shield },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      currentPage === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </motion.button>
                ))}
              </nav>

              {/* User Info */}
              <motion.div
                className="border-t border-white/10 pt-6"
                variants={containerVariants}
              >
                <motion.div
                  className="p-4 rounded-lg bg-white/5 border border-white/10"
                  whileHover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <p className="text-sm text-gray-400">Logged in as</p>
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-purple-300 capitalize">{user.role}</p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 font-semibold transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Main Page */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="h-20 backdrop-blur-xl bg-black/30 border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-20">
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <motion.div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"
                    />
                  )}
                </motion.button>
              </motion.div>

              {/* User Avatar */}
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {user.name.charAt(0)}
              </motion.div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              {currentPage === 'dashboard' && <DashboardPage />}
              {currentPage === 'files' && <FilesPage />}
              {currentPage === 'admin' && <AdminPage />}
              {currentPage === 'settings' && <SettingsPage />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Notifications Toast */}
      <div className="fixed bottom-8 right-8 z-50 space-y-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`px-6 py-3 rounded-lg backdrop-blur-xl border flex items-center gap-3 ${
                notif.type === 'success'
                  ? 'bg-green-500/20 border-green-500/50 text-green-300'
                  : 'bg-blue-500/20 border-blue-500/50 text-blue-300'
              }`}
            >
              {notif.type === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              {notif.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BotHostingPlatform;
