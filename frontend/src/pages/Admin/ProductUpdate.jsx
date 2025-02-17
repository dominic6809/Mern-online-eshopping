/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateProductMutation, useDeleteProductMutation, useGetProductByIdQuery, useUploadProductImageMutation } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import { Upload, Trash2, Save } from "lucide-react";
import AdminMenu from "./AdminMenu";

const FormSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InputField = ({ label, type = "text", value, onChange, className = "", ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${className}`}
      {...props}
    />
  </div>
);

const AdminProductUpdate = () => {
  // ... [Previous state and handlers remain the same]
  const params = useParams();
  const navigate = useNavigate();
  const { data: productData } = useGetProductByIdQuery(params._id);
  const { data: categories = [] } = useFetchCategoriesQuery();
  
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [formData, setFormData] = useState({
    image: "",
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    brand: "",
    stock: ""
  });

  // ... [All handlers and effects remain the same]
  useEffect(() => {
    if (productData && productData._id) {
      setFormData({
        image: productData.image,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category?._id,
        quantity: productData.quantity,
        brand: productData.brand,
        stock: productData.countInStock
      });
    }
  }, [productData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setFormData(prev => ({ ...prev, image: res.image }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitFormData = new FormData();
      Object.keys(formData).forEach(key => {
        submitFormData.append(key, formData[key]);
      });

      const data = await updateProduct({ 
        productId: params._id, 
        formData: submitFormData 
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Product updated successfully");
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      toast.error("Product update failed");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { data } = await deleteProduct(params._id);
        toast.success(`"${data.name}" has been deleted`);
        navigate("/admin/allproductslist");
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {/* Admin Menu */}
          <div className="lg:w-64">
            <AdminMenu />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 max-w-3xl w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">Update Product</h2>
                <p className="text-sm text-gray-500 mt-1">Edit product information and inventory</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Image Upload Section */}
                <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="product"
                      className="max-h-64 object-contain mb-4"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Upload Image</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={uploadFileHandler}
                      accept="image/*"
                    />
                  </label>
                </div>

                {/* Basic Information */}
                <FormSection title="Basic Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Product Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                    />
                    <InputField
                      label="Brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="Enter brand name"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField
                      label="Price"
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <InputField
                      label="Quantity"
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                    <InputField
                      label="Stock"
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </FormSection>

                {/* Category & Description */}
                <FormSection title="Additional Details">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        {categories?.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter product description"
                      />
                    </div>
                  </div>
                </FormSection>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Product
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;