/* eslint-disable no-unused-vars */
import { useState } from "react";
import { toast } from "react-toastify";
import { AlertCircle, Loader2, Pencil, Trash2, X, Check, Plus } from "lucide-react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import AdminMenu from "./AdminMenu";

function CategoryList() {
  const { data: categories, isLoading } = useFetchCategoriesQuery({
    refetchOnMountOrArgChange: true
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, categoryId: null });

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name: newCategoryName }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setNewCategoryName("");
        toast.success(`${result.name} is created`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleStartEdit = (category) => {
    setEditingCategory(category._id);
    setEditName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditName("");
  };

  const handleUpdate = async (categoryId) => {
    if (!editName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId,
        updatedCategory: { name: editName },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setEditingCategory(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Update failed. Please try again.");
    }
  };

  const openDeleteConfirmation = (categoryId) => {
    setDeleteConfirmation({ show: true, categoryId });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ show: false, categoryId: null });
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.categoryId) return;

    try {
      const result = await deleteCategory(deleteConfirmation.categoryId).unwrap();
      toast.success(`Category deleted successfully`);
      closeDeleteConfirmation();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Category deletion failed. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminMenu />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
            <p className="text-gray-600">Manage your product categories</p>
          </div>

          {/* Create New Category Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Category</h2>
            <form onSubmit={handleCreateCategory} className="flex gap-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Category
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                Existing Categories
                {isLoading && <Loader2 className="ml-2 w-4 h-4 animate-spin" />}
              </h2>
            </div>

            {categories?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No categories yet. Create your first category above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {categories?.map((category) => (
                  <div 
                    key={category._id} 
                    className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200 border border-gray-200"
                  >
                    {editingCategory === category._id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdate(category._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex flex-col h-full">
                        <span className="text-lg font-medium text-gray-700 mb-3">{category.name}</span>
                        <div className="flex justify-end gap-2 mt-auto">
                          <button
                            onClick={() => handleStartEdit(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                            title="Edit category"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteConfirmation(category._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                            title="Delete category"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteConfirmation}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryList;