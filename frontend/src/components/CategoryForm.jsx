/* eslint-disable react/prop-types */
const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {handleDelete ? "Edit Category" : "Create Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="category" 
              className="block text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <div className="relative">
              <input
                id="category"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-400"
                placeholder="Enter category name..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button 
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              {buttonText}
            </button>

            {handleDelete && (
              <button
                onClick={handleDelete}
                type="button"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Optional Tips Section */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-600">
          💡 Tip: Categories help organize your products and make them easier to find.
        </p>
      </div>
    </div>
  );
};

export default CategoryForm;