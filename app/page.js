import ProductList from "@/components/product/ProductList";
import Pagination from "@/components/Pagination";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shine Tech",
  description: "Find the latest in fashion, electronics and more",
};

async function getProducts(searchParams) {
  const searchQuery = new URLSearchParams({
    page: searchParams?.page || 1,
  }).toString();

  try {
    const response = await fetch(`${process.env.API}/api/product?${searchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 1 },
      // next: { cache: "no-store" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.products)) {
      throw new Error("No products returned.");
    }

    return data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return { products: [], currentPage: 1, totalPages: 1 };
  }
}

export default async function Products({ searchParams }) {
  // console.log("searchParams in products page => ", searchParams);
  const data = await getProducts(searchParams);

  return (
    <main>
      <div className="container">
        <div className="row">
          <div className="col">
            <p className="text-center lead fw-bold">Latest Products</p>
            <ProductList products={data?.products} />
          </div>
        </div>

        <Pagination
          currentPage={data?.currentPage}
          totalPages={data?.totalPages}
          pathname="/shop"
          searchParams={searchParams}
        />
      </div>
    </main>
  );
}
