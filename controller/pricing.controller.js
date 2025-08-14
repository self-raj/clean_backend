import pricingModel from "../model/pricing.model.js";

export const savePricingData = async (req, res) => {
  try {
    const { categoryName, items } = req.body;

    // Validation - optional, lekin recommended
    if (!categoryName || categoryName.trim() === "") {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items array is required" });
    }

    // Check if category exists
    const existingCategory = await pricingModel.findOne({ categoryName: categoryName.trim() });

    if (existingCategory) {
      // Category exists, append the new items
      existingCategory.items.push(...items);
      await existingCategory.save();

      return res.status(200).json({
        success: true,
        message: "Items added to existing category successfully",
        data: existingCategory
      });
    } else {
      // Category does not exist, create new
      const newCategory = await pricingModel.create({
        categoryName: categoryName.trim(),
        items: items
      });

      return res.status(201).json({
        success: true,
        message: "Category and items saved successfully",
        data: newCategory
      });
    }
  } catch (error) {
    console.error("Error saving data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};



// =========================================

export const getAllPricingData = async (req, res) => {
  try {
    const categories = await pricingModel.find({}); // empty filter = sabhi laaye

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
// ===================================================
export const deleteSingleItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log(itemId, "item id");
    

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required"
      });
    }

    // Step 1: Find the category containing this item
    const category = await pricingModel.findOne({ "items._id": itemId });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    // Step 2: Remove the item from the category
    category.items = category.items.filter(item => item._id.toString() !== itemId);
    await category.save();

    // Step 3: If category has no items after deletion -> delete category
    if (category.items.length === 0) {
      await pricingModel.deleteOne({ _id: category._id });
      return res.status(200).json({
        success: true,
        message: `Item deleted successfully and empty category "${category.categoryName}" removed`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      data: category
    });

  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// =============================================
export const editSingleItem = async (req, res) => {
  try {
    const { itemId } = req.params; // item ka _id
    const { categoryName, item, price } = req.body; // naya categoryName, item name, price

    if (!itemId) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }
    if (!item || !price || !categoryName) {
      return res.status(400).json({
        success: false,
        message: "Item name, price and category name are required"
      });
    }

    // Step 1: Find the old category which currently contains the item
    const oldCategory = await pricingModel.findOne({ "items._id": itemId });
    if (!oldCategory) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // Step 2: Check if categoryName is same or different
    if (oldCategory.categoryName === categoryName) {
      // Same category → just update the item details
      const itemIndex = oldCategory.items.findIndex(itm => itm._id.toString() === itemId);
      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: "Item not found in category" });
      }
      oldCategory.items[itemIndex].item = item;
      oldCategory.items[itemIndex].price = price;
      await oldCategory.save();

      return res.status(200).json({
        success: true,
        message: "Item updated successfully",
        data: oldCategory
      });
    } else {
      // Category changed → move item

      // Remove item from old category
      const movingItem = oldCategory.items.find(itm => itm._id.toString() === itemId);
      oldCategory.items = oldCategory.items.filter(itm => itm._id.toString() !== itemId);
      await oldCategory.save();

      // If old category becomes empty → delete it
      if (oldCategory.items.length === 0) {
        await pricingModel.deleteOne({ _id: oldCategory._id });
      }

      // Add item to new category (if exists, else create)
      let newCategory = await pricingModel.findOne({ categoryName });
      if (!newCategory) {
        newCategory = new pricingModel({ categoryName, items: [] });
      }

      newCategory.items.push({
        item: item,
        price: price
      });

      await newCategory.save();

      return res.status(200).json({
        success: true,
        message: `Item updated and moved to category "${categoryName}"`,
        data: newCategory
      });
    }
  } catch (error) {
    console.error("Error editing item:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

