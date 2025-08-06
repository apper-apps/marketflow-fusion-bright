import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      className="text-gray-600 hover:text-gray-900"
    >
      <ApperIcon name="LogOut" size={16} />
      <span className="hidden sm:inline ml-1">Logout</span>
    </Button>
  );
};

const Header = ({ onSearch, onCartToggle, cartItemCount }) => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="ShoppingBag" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-display font-bold gradient-text">
                MarketFlow
              </h1>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Right Side - Cart and Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ApperIcon name="Search" size={20} />
            </button>

            {/* Cart Button */}
            <button
              onClick={onCartToggle}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ApperIcon name="ShoppingCart" size={20} />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-secondary to-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in"
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </motion.span>
              )}
            </button>

            {/* User Menu */}
<button 
              onClick={() => navigate('/account')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
            >
              <ApperIcon name="User" size={20} />
              <span className="hidden sm:inline text-sm font-medium">My Account</span>
            </button>

            {/* Logout Button */}
            <LogoutButton />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </header>
  );
};

export default Header;