import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { Plus, Edit, Trash2, ChevronRight } from 'lucide-react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Vegetables',
      slug: 'vegetables',
      description: 'Fresh vegetables',
      itemCount: 156,
      subcategories: [
        { id: 11, name: 'Leafy Greens', slug: 'leafy-greens', itemCount: 45 },
        { id: 12, name: 'Root Vegetables', slug: 'root-vegetables', itemCount: 38 },
        { id: 13, name: 'Tomatoes', slug: 'tomatoes', itemCount: 52 },
        { id: 14, name: 'Peppers', slug: 'peppers', itemCount: 21 },
      ],
    },
    {
      id: 2,
      name: 'Fruits',
      slug: 'fruits',
      description: 'Fresh fruits',
      itemCount: 134,
      subcategories: [
        { id: 21, name: 'Tropical Fruits', slug: 'tropical-fruits', itemCount: 67 },
        { id: 22, name: 'Citrus', slug: 'citrus', itemCount: 42 },
        { id: 23, name: 'Berries', slug: 'berries', itemCount: 25 },
      ],
    },
    {
      id: 3,
      name: 'Rice',
      slug: 'rice',
      description: 'Various rice varieties',
      itemCount: 89,
      subcategories: [
        { id: 31, name: 'White Rice', slug: 'white-rice', itemCount: 45 },
        { id: 32, name: 'Brown Rice', slug: 'brown-rice', itemCount: 28 },
        { id: 33, name: 'Specialty Rice', slug: 'specialty-rice', itemCount: 16 },
      ],
    },
    {
      id: 4,
      name: 'Equipment',
      slug: 'equipment',
      description: 'Farm equipment for rent',
      itemCount: 42,
      subcategories: [
        { id: 41, name: 'Tractors', slug: 'tractors', itemCount: 12 },
        { id: 42, name: 'Harvesters', slug: 'harvesters', itemCount: 18 },
        { id: 43, name: 'Tools', slug: 'tools', itemCount: 12 },
      ],
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [expandedCategories, setExpandedCategories] = useState([]);

  const openModal = (type, category = null, subcategory = null) => {
    setModalType(type);
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setModalType('');
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddCategory = (formData) => {
    const newCategory = {
      id: categories.length + 1,
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      itemCount: 0,
      subcategories: [],
    };
    setCategories([...categories, newCategory]);
    closeModal();
    alert(`Category "${formData.name}" added successfully!`);
  };

  const handleEditCategory = (formData) => {
    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id
          ? { ...cat, name: formData.name, slug: formData.slug, description: formData.description }
          : cat
      )
    );
    closeModal();
    alert(`Category "${formData.name}" updated successfully!`);
  };

  const handleDeleteCategory = () => {
    setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
    closeModal();
    alert(`Category "${selectedCategory.name}" deleted successfully!`);
  };

  const handleAddSubcategory = (formData) => {
    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id
          ? {
              ...cat,
              subcategories: [
                ...cat.subcategories,
                {
                  id: Date.now(),
                  name: formData.name,
                  slug: formData.slug,
                  itemCount: 0,
                },
              ],
            }
          : cat
      )
    );
    closeModal();
    alert(`Subcategory "${formData.name}" added successfully!`);
  };

  const handleEditSubcategory = (formData) => {
    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id
          ? {
              ...cat,
              subcategories: cat.subcategories.map((sub) =>
                sub.id === selectedSubcategory.id
                  ? { ...sub, name: formData.name, slug: formData.slug }
                  : sub
              ),
            }
          : cat
      )
    );
    closeModal();
    alert(`Subcategory "${formData.name}" updated successfully!`);
  };

  const handleDeleteSubcategory = () => {
    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id
          ? {
              ...cat,
              subcategories: cat.subcategories.filter((sub) => sub.id !== selectedSubcategory.id),
            }
          : cat
      )
    );
    closeModal();
    alert(`Subcategory deleted successfully!`);
  };

  const CategoryForm = ({ initialData = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
      name: initialData.name || '',
      slug: initialData.slug || '',
      description: initialData.description || '',
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      }));
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        {!initialData.isSubcategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              rows={3}
            />
          </div>
        )}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(formData)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {initialData.name ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
            <p className="text-gray-600">Manage product categories and subcategories</p>
          </div>
          <button
            onClick={() => openModal('addCategory')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Categories</p>
            <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Subcategories</p>
            <p className="text-2xl font-bold text-gray-800">
              {categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-2xl font-bold text-gray-800">
              {categories.reduce((acc, cat) => acc + cat.itemCount, 0)}
            </p>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
          </div>
          <div className="divide-y">
            {categories.map((category) => (
              <div key={category.id}>
                {/* Category Row */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <ChevronRight
                          size={20}
                          className={`transition-transform ${
                            expandedCategories.includes(category.id) ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {category.itemCount} items • {category.subcategories.length} subcategories
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('addSubcategory', category)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        <Plus size={14} className="inline mr-1" />
                        Add Sub
                      </button>
                      <button
                        onClick={() => openModal('editCategory', category)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openModal('deleteCategory', category)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                {expandedCategories.includes(category.id) && category.subcategories.length > 0 && (
                  <div className="bg-gray-50 px-4 py-2">
                    <div className="ml-8 space-y-2">
                      {category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-700">{subcategory.name}</p>
                            <p className="text-xs text-gray-500">{subcategory.itemCount} items</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openModal('editSubcategory', category, subcategory)}
                              className="p-1 text-gray-600 hover:text-blue-600"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => openModal('deleteSubcategory', category, subcategory)}
                              className="p-1 text-gray-600 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modals */}
        {showModal && (
          <>
            {modalType === 'addCategory' && (
              <Modal isOpen={showModal} onClose={closeModal} title="Add New Category">
                <CategoryForm onSubmit={handleAddCategory} />
              </Modal>
            )}

            {modalType === 'editCategory' && selectedCategory && (
              <Modal isOpen={showModal} onClose={closeModal} title="Edit Category">
                <CategoryForm initialData={selectedCategory} onSubmit={handleEditCategory} />
              </Modal>
            )}

            {modalType === 'deleteCategory' && selectedCategory && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Delete Category"
                size="sm"
                footer={
                  <>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteCategory}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                }
              >
                <p className="text-gray-700">
                  Are you sure you want to delete the category <strong>{selectedCategory.name}</strong>?
                  This will also delete all its subcategories and affect {selectedCategory.itemCount} items.
                </p>
              </Modal>
            )}

            {modalType === 'addSubcategory' && selectedCategory && (
              <Modal isOpen={showModal} onClose={closeModal} title={`Add Subcategory to ${selectedCategory.name}`}>
                <CategoryForm initialData={{ isSubcategory: true }} onSubmit={handleAddSubcategory} />
              </Modal>
            )}

            {modalType === 'editSubcategory' && selectedSubcategory && (
              <Modal isOpen={showModal} onClose={closeModal} title="Edit Subcategory">
                <CategoryForm
                  initialData={{ ...selectedSubcategory, isSubcategory: true }}
                  onSubmit={handleEditSubcategory}
                />
              </Modal>
            )}

            {modalType === 'deleteSubcategory' && selectedSubcategory && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Delete Subcategory"
                size="sm"
                footer={
                  <>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteSubcategory}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                }
              >
                <p className="text-gray-700">
                  Are you sure you want to delete the subcategory <strong>{selectedSubcategory.name}</strong>?
                </p>
              </Modal>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default CategoryManagement;
