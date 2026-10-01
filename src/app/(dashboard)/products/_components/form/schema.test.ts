import { productFormSchema } from "./schema";

describe("productFormSchema", () => {
  it("accepts a valid product without an uploaded image", () => {
    const result = productFormSchema.safeParse({
      name: "Test Product",
      description: "A valid product description",
      image: null,
      sku: "TESTSKU1",
      category: "6c7a6a50-9d0a-4a97-b4d2-8c50d18d1d74",
      costPrice: "20",
      salesPrice: "30",
      stock: "10",
      minStockThreshold: "2",
      slug: "test-product",
    });

    expect(result.success).toBe(true);
  });

  it("rejects the placeholder all-categories value as a real category", () => {
    const result = productFormSchema.safeParse({
      name: "Test Product",
      description: "A valid product description",
      image: null,
      sku: "TESTSKU2",
      category: "all",
      costPrice: "20",
      salesPrice: "30",
      stock: "10",
      minStockThreshold: "2",
      slug: "test-product-2",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.category).toContain(
        "Category is required"
      );
    }
  });

  it("accepts an external image URL or local asset path", () => {
    const external = productFormSchema.safeParse({
      name: "Test Product",
      description: "A valid product description",
      image: null,
      imageUrl: "https://example.com/images/attar.jpg",
      sku: "TESTSKU3",
      category: "6c7a6a50-9d0a-4a97-b4d2-8c50d18d1d74",
      costPrice: "20",
      salesPrice: "30",
      stock: "10",
      minStockThreshold: "2",
      slug: "test-product-3",
    });

    const local = productFormSchema.safeParse({
      name: "Local Product",
      description: "A valid product description",
      image: null,
      imageUrl: "/images/attar.jpg",
      sku: "TESTSKU4",
      category: "6c7a6a50-9d0a-4a97-b4d2-8c50d18d1d74",
      costPrice: "20",
      salesPrice: "30",
      stock: "10",
      minStockThreshold: "2",
      slug: "local-product",
    });

    expect(external.success).toBe(true);
    expect(local.success).toBe(true);
    if (external.success) {
      expect(external.data.imageUrl).toBe("https://example.com/images/attar.jpg");
    }
    if (local.success) {
      expect(local.data.imageUrl).toBe("/images/attar.jpg");
    }
  });
});
