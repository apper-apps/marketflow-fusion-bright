import { toast } from 'react-toastify';

const categoryService = {
  async getAll() {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Initialize ApperClient with Project ID and Public Key
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          },
          {
            field: {
              Name: "icon"
            }
          },
          {
            field: {
              Name: "productCount"
            }
          },
          {
            field: {
              Name: "description"
            }
          }
        ]
      };

      const response = await apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database records to match UI expectations
      return response.data.map(category => ({
        id: category.Id,
        name: category.Name || 'Unnamed Category',
        icon: category.icon || 'Package',
        productCount: category.productCount || 0,
        description: category.description || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "icon" } },
          { field: { Name: "productCount" } },
          { field: { Name: "description" } }
        ]
      };

      const response = await apperClient.getRecordById('category', parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || "Category not found");
      }

      const category = response.data;
      return {
        id: category.Id,
        name: category.Name || 'Unnamed Category',
        icon: category.icon || 'Package',
        productCount: category.productCount || 0,
        description: category.description || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async create(categoryData) {
    // This would require admin functionality - not typically used in e-commerce frontend
    throw new Error("Category creation not available in frontend");
  },

  async update(id, categoryData) {
    // This would require admin functionality - not typically used in e-commerce frontend  
    throw new Error("Category updates not available in frontend");
  },

  async delete(id) {
    // This would require admin functionality - not typically used in e-commerce frontend
    throw new Error("Category deletion not available in frontend");
  }
};

export default categoryService;