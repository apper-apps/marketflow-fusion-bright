import React, { useState, useEffect } from "react";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import productService from "@/services/api/productService";
import { toast } from "react-toastify";

const ProductGrid = ({ 
  searchQuery, 
  activeCategory, 
  priceRange = { min: 0, max: 3000 },
  selectedBrands = [],
  minRating = 0,
  showInStock = false,
  showOnSale = false,
  onAddToCart 
}) => {
const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      await new Promise(resolve => setTimeout(resolve, 800)); // Realistic loading delay
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    onAddToCart(product);
    toast.success(`${product.title} added to cart!`);
  };
const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = !searchQuery || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = activeCategory === "all" || 
      product.category === activeCategory;
    
    // Price filter
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    
    // Brand filter (extract brand from title - first word or two)
    const productBrand = product.title.split(' ').slice(0, 2).join(' ');
    const matchesBrand = selectedBrands.length === 0 || 
      selectedBrands.some(brand => productBrand.toLowerCase().includes(brand.toLowerCase()));
    
    // Rating filter
    const matchesRating = minRating === 0 || product.rating >= minRating;
    
    // Availability filters
    const matchesInStock = !showInStock || product.inStock;
    const matchesOnSale = !showOnSale || product.price < 100; // Simple sale logic
    
    return matchesSearch && matchesCategory && matchesPrice && 
           matchesBrand && matchesRating && matchesInStock && matchesOnSale;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded mb-3"></div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadProducts} />;
  }

  if (filteredProducts.length === 0) {
    return (
      <Empty
        title={searchQuery ? "No products found" : "No products in this category"}
        description={
          searchQuery 
            ? `No products match your search for "${searchQuery}"`
            : "This category doesn't have any products yet"
        }
        actionText="Browse All Products"
        onAction={() => window.location.reload()}
        icon="Search"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.Id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;