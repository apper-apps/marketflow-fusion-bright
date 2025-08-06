import { toast } from 'react-toastify';

const productService = {
  async getAll() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "image" } },
          { field: { Name: "rating" } },
          { field: { Name: "reviewCount" } },
          { field: { Name: "inStock" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } }
        ]
      };

      const response = await apperClient.fetchRecords('product', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(product => ({
        Id: product.Id,
        title: product.title || product.Name || 'Unnamed Product',
        price: parseFloat(product.price) || 0,
        image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        category: product.category?.Name || product.category || 'uncategorized',
        rating: parseFloat(product.rating) || 0,
        reviewCount: parseInt(product.reviewCount) || 0,
        inStock: product.inStock === true || product.inStock === 'true',
        description: product.description || 'No description available'
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "image" } },
          { field: { Name: "rating" } },
          { field: { Name: "reviewCount" } },
          { field: { Name: "inStock" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } }
        ]
      };

      const response = await apperClient.getRecordById('product', parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || "Product not found");
      }

      const product = response.data;
      const transformedProduct = {
        Id: product.Id,
        title: product.title || product.Name || 'Unnamed Product',
        price: parseFloat(product.price) || 0,
        image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        category: product.category?.Name || product.category || 'uncategorized',
        rating: parseFloat(product.rating) || 0,
        reviewCount: parseInt(product.reviewCount) || 0,
        inStock: product.inStock === true || product.inStock === 'true',
        description: product.description || 'No description available'
      };

      // Return enhanced product data for detail page
      return { 
        ...transformedProduct,
        detailedDescription: transformedProduct.description + " This premium product offers exceptional quality and performance, carefully crafted to meet the highest standards. Perfect for both everyday use and special occasions.",
        specifications: this.getSpecifications(transformedProduct.category),
        shippingInfo: {
          freeShipping: transformedProduct.price > 50,
          estimatedDays: transformedProduct.inStock ? "2-3 business days" : "Currently unavailable"
        }
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching product:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  getSpecifications(category) {
    const specs = {
      electronics: {
        warranty: "2 years manufacturer warranty",
        support: "24/7 technical support",
        compatibility: "Universal compatibility"
      },
      clothing: {
        material: "Premium quality fabric",
        care: "Machine washable",
        fit: "True to size"
      },
      "home-garden": {
        material: "Durable construction",
        maintenance: "Low maintenance required",
        installation: "Easy setup included"
      },
      books: {
        pages: "Comprehensive content",
        format: "Print and digital available",
        language: "English"
      },
      sports: {
        quality: "Professional grade",
        usage: "All skill levels",
        durability: "Built to last"
      }
    };
    
    return specs[category] || {
      quality: "Premium quality",
      support: "Customer support available",
      satisfaction: "100% satisfaction guarantee"
    };
  },

  async getByCategory(categoryId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "image" } },
          { field: { Name: "rating" } },
          { field: { Name: "reviewCount" } },
          { field: { Name: "inStock" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [categoryId]
          }
        ]
      };

      const response = await apperClient.fetchRecords('product', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(product => ({
        Id: product.Id,
        title: product.title || product.Name || 'Unnamed Product',
        price: parseFloat(product.price) || 0,
        image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        category: product.category?.Name || product.category || 'uncategorized',
        rating: parseFloat(product.rating) || 0,
        reviewCount: parseInt(product.reviewCount) || 0,
        inStock: product.inStock === true || product.inStock === 'true',
        description: product.description || 'No description available'
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products by category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async search(query) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "image" } },
          { field: { Name: "rating" } },
          { field: { Name: "reviewCount" } },
          { field: { Name: "inStock" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "description",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('product', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(product => ({
        Id: product.Id,
        title: product.title || product.Name || 'Unnamed Product',
        price: parseFloat(product.price) || 0,
        image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        category: product.category?.Name || product.category || 'uncategorized',
        rating: parseFloat(product.rating) || 0,
        reviewCount: parseInt(product.reviewCount) || 0,
        inStock: product.inStock === true || product.inStock === 'true',
        description: product.description || 'No description available'
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching products:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};

export default productService;